import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/login-form';
import { getDb } from '@/lib/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Owner setup | Napertskala', robots: { index: false, follow: false } };

export default async function SetupPage() {
  const db = await getDb();
  const count = await db.prepare('SELECT COUNT(*) AS count FROM users').first<{count: number}>();
  if (Number(count?.count ?? 0) > 0) redirect('/login');
  return <LoginForm setup />;
}
