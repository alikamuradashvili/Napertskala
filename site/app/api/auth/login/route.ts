import { createSession, getDb, json, normalizeEmail, verifyOrigin, verifyPassword } from '@/lib/server';
import { canSignIn } from '@/lib/access';

export async function POST(request: Request) {
  if (!verifyOrigin(request)) return json({ error: 'Invalid request origin' }, 403);
  const body = await request.json().catch(() => ({})) as Record<string,unknown>; const email = normalizeEmail(body.email); const password = String(body.password ?? '');
  const db = await getDb();
  const row = await db.prepare(`SELECT id,password_hash,password_salt,status,role FROM users WHERE email=?`).bind(email).first<{ id:string; password_hash:string|null; password_salt:string|null; status:string; role:string }>();
  if (!row?.password_hash || !row.password_salt || !canSignIn(row) || !(await verifyPassword(password,row.password_hash,row.password_salt))) return json({ error: 'Incorrect email or password.' }, 401);
  const session = await createSession(row.id); return json({ ok: true }, 200, { 'Set-Cookie': session.cookie });
}
