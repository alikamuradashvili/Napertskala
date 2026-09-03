import { audit, createSession, getDb, hashPassword, json, normalizeEmail, validEmail, verifyOrigin } from '@/lib/server';
import { env } from 'cloudflare:workers';

export async function POST(request: Request) {
  if (!verifyOrigin(request)) return json({ error: 'Invalid request origin' }, 403);
  const body = await request.json().catch(() => ({})) as Record<string,unknown>;
  const setupKey = String(body.setupKey ?? '');
  const configuredKey = env.ADMIN_SETUP_TOKEN ?? '';
  if (configuredKey.length < 32 || setupKey.length !== configuredKey.length) return json({ error: 'A valid private setup key is required. The site owner must run setup-admin.cmd first.' }, 403);
  let difference = 0;
  for (let index = 0; index < configuredKey.length; index++) difference |= setupKey.charCodeAt(index) ^ configuredKey.charCodeAt(index);
  if (difference !== 0) return json({ error: 'A valid private setup key is required.' }, 403);
  const email = normalizeEmail(body.email); const name = String(body.name ?? '').trim(); const password = String(body.password ?? '');
  if (!validEmail(email) || name.length < 2 || password.length < 10) return json({ error: 'Use a valid email, name, and password of at least 10 characters.' }, 400);
  const db = await getDb(); const count = await db.prepare('SELECT COUNT(*) AS count FROM users').first<{ count: number }>();
  if (Number(count?.count ?? 0) > 0) return json({ error: 'The owner account already exists. A Super Admin must invite additional admins.' }, 403);
  const { hash, salt } = await hashPassword(password); const id = crypto.randomUUID(); const now = Date.now();
  try {
    const result = await db.prepare(`INSERT INTO users(id,email,name,password_hash,password_salt,role,status,created_at,updated_at) SELECT ?,?,?,?,?,'super_admin','active',?,? WHERE NOT EXISTS (SELECT 1 FROM users)`).bind(id,email,name,hash,salt,now,now).run();
    if (Number(result.meta?.changes ?? 0) !== 1) return json({ error: 'The owner account already exists. Sign in instead.' }, 403);
  }
  catch { return json({ error: 'Could not create the owner account.' }, 409); }
  await audit(id, 'bootstrap_super_admin', 'user', id); const session = await createSession(id);
  return json({ ok: true }, 201, { 'Set-Cookie': session.cookie });
}
