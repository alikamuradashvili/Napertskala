import { currentUser, getDb, json, publicUser } from '@/lib/server';

export async function GET(request: Request) {
  const user = await currentUser(request); const db = await getDb();
  const count = await db.prepare('SELECT COUNT(*) AS count FROM users').first<{count:number}>();
  return json({ user: user ? publicUser(user) : null, needsSetup: Number(count?.count ?? 0) === 0 });
}
