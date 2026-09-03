import { env } from 'cloudflare:workers';
import { canAccessAdmin } from '@/lib/access';
import { userGuardStatements, userRoleMigration } from '@/lib/user-schema';

export type AdminRole = 'super_admin' | 'admin' | 'user';
export type AdminUser = { id: string; email: string; name: string; role: AdminRole; status: 'active' | 'disabled'; google_sub?: string | null; created_at: number };

const encoder = new TextEncoder();
const SESSION_DAYS = 14;
// Google returns via a cross-site top-level navigation. Strict cookies can be
// withheld on its redirect chain, sending a signed-in user back to /login.
// Lax permits that navigation; all mutations still enforce verifyOrigin.
export const sessionCookieAttributes = 'Path=/; HttpOnly; Secure; SameSite=Lax';

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL, name TEXT NOT NULL, password_hash TEXT, password_salt TEXT, google_sub TEXT, role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('super_admin','admin','user')), status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','disabled')), created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role,status)`,
  `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`,
  `CREATE TABLE IF NOT EXISTS site_content (key TEXT PRIMARY KEY, value_ka TEXT NOT NULL DEFAULT '', value_en TEXT NOT NULL DEFAULT '', updated_by TEXT REFERENCES users(id), updated_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_by TEXT REFERENCES users(id), updated_at INTEGER NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, object_key TEXT NOT NULL UNIQUE, filename TEXT NOT NULL, content_type TEXT NOT NULL, size INTEGER NOT NULL, alt_ka TEXT NOT NULL DEFAULT '', alt_en TEXT NOT NULL DEFAULT '', uploaded_by TEXT REFERENCES users(id), created_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at)`,
  `CREATE TABLE IF NOT EXISTS gallery_items (media_id TEXT PRIMARY KEY REFERENCES media(id) ON DELETE CASCADE, gallery TEXT NOT NULL DEFAULT 'welding', sort_order INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_gallery_items_gallery_order ON gallery_items(gallery,sort_order)`,
  `CREATE TABLE IF NOT EXISTS audit_log (id TEXT PRIMARY KEY, actor_id TEXT REFERENCES users(id), action TEXT NOT NULL, target_type TEXT NOT NULL, target_id TEXT, detail TEXT, created_at INTEGER NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_audit_actor_id ON audit_log(actor_id)`,
];

let schemaReady: Promise<void> | undefined;
export async function getDb() {
  if (!env.DB) throw new Error('Database binding unavailable');
  if (!schemaReady) {
    schemaReady = (async () => {
      await env.DB.batch(schemaStatements.map((sql) => env.DB.prepare(sql)));
      const needsMigration = async () => {
        const table = await env.DB.prepare("SELECT sql FROM sqlite_schema WHERE type='table' AND name='users'").first<{sql:string}>();
        return !table?.sql.includes("'user'");
      };
      if (await needsMigration()) {
        try { await env.DB.batch(userRoleMigration.map(sql => env.DB.prepare(sql))); }
        catch (error) { if (await needsMigration()) throw error; } // Another worker may have finished the same upgrade.
      }
      await env.DB.batch(userGuardStatements.map(sql => env.DB.prepare(sql)));
    })().catch(error => { schemaReady = undefined; throw error; });
  }
  await schemaReady;
  return env.DB;
}

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export function normalizeEmail(value: unknown) { return String(value ?? '').trim().toLowerCase(); }
export function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function bytesToHex(bytes: Uint8Array) { return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join(''); }
function hexToBytes(hex: string) { return new Uint8Array(hex.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? []); }
export function randomToken(size = 32) { const bytes = new Uint8Array(size); crypto.getRandomValues(bytes); return bytesToHex(bytes); }
export async function sha256(value: string) { return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)))); }

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 210_000 }, key, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password: string, expected: string, salt: string) {
  const calculated = (await hashPassword(password, salt)).hash;
  if (calculated.length !== expected.length) return false;
  let difference = 0;
  for (let i = 0; i < calculated.length; i++) difference |= calculated.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}

function cookieValue(request: Request, name: string) {
  const match = request.headers.get('cookie')?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  try { return match ? decodeURIComponent(match[1]) : null; } catch { return null; }
}

export async function createSession(userId: string) {
  const db = await getDb(); const token = randomToken(); const tokenHash = await sha256(token); const now = Date.now();
  await db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(tokenHash, userId, now + SESSION_DAYS * 86400000, now).run();
  return { token, cookie: `napertskala_session=${token}; ${sessionCookieAttributes}; Max-Age=${SESSION_DAYS * 86400}` };
}

export async function currentUser(request: Request): Promise<AdminUser | null> {
  const token = cookieValue(request, 'napertskala_session'); if (!token || !/^[a-f0-9]{64}$/i.test(token)) return null;
  const db = await getDb(); const tokenHash = await sha256(token); const now = Date.now();
  const user = await db.prepare(`SELECT u.id,u.email,u.name,u.role,u.status,u.google_sub,u.created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.status='active'`).bind(tokenHash, now).first<AdminUser>();
  if (!user) await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(tokenHash).run();
  return user ?? null;
}

export async function requireAdmin(request: Request, superOnly = false) {
  const user = await currentUser(request);
  if (!user) return { error: json({ error: 'Authentication required' }, 401) };
  if (!canAccessAdmin(user)) return { error: json({ error: 'Administrator access required' }, 403) };
  if (superOnly && user.role !== 'super_admin') return { error: json({ error: 'Super Admin access required' }, 403) };
  return { user };
}

export function verifyOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try { return new URL(origin).host === new URL(request.url).host; } catch { return false; }
}

export async function audit(actorId: string | null, action: string, targetType: string, targetId?: string | null, detail?: unknown) {
  const db = await getDb();
  await db.prepare('INSERT INTO audit_log(id,actor_id,action,target_type,target_id,detail,created_at) VALUES(?,?,?,?,?,?,?)')
    .bind(crypto.randomUUID(), actorId, action, targetType, targetId ?? null, detail ? JSON.stringify(detail) : null, Date.now()).run();
}

export async function superAdminCount(excludeUserId?: string) {
  const db = await getDb(); const result = await db.prepare(`SELECT COUNT(*) AS count FROM users WHERE role='super_admin' AND status='active'${excludeUserId ? ' AND id != ?' : ''}`).bind(...(excludeUserId ? [excludeUserId] : [])).first<{ count: number }>();
  return Number(result?.count ?? 0);
}

export function publicUser(user: AdminUser) { return { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status, googleConnected: Boolean(user.google_sub), createdAt: user.created_at }; }
