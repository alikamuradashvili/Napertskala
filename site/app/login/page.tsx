import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/login-form';
import { canAccessAdmin, canSignIn } from '@/lib/access';
import { currentUser } from '@/lib/server';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'შესვლა | Napertskala', robots: { index: false, follow: false } };

export default async function LoginPage() {
  const incoming = await headers();
  const user = await currentUser(new Request('http://internal/login', { headers: { cookie: incoming.get('cookie') ?? '' } }));
  if (canAccessAdmin(user)) redirect('/admin');
  if (canSignIn(user)) redirect('/');
  return <LoginForm />;
}
