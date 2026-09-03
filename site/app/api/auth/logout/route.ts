import { getDb, json, sessionCookieAttributes, sha256, verifyOrigin } from '@/lib/server';

export async function POST(request: Request) {
  if (!verifyOrigin(request)) return json({ error: 'Invalid request origin' }, 403);
  const token = request.headers.get('cookie')?.match(/(?:^|;\s*)napertskala_session=([^;]+)/)?.[1];
  if (token) { const db = await getDb(); await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(decodeURIComponent(token))).run(); }
  return json({ ok:true }, 200, { 'Set-Cookie':`napertskala_session=; ${sessionCookieAttributes}; Max-Age=0` });
}
