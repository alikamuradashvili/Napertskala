import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/server';
import { canAccessAdmin } from '@/lib/access';

export const dynamic = 'force-dynamic';

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const incoming = await headers();
  const user = await currentUser(new Request('http://internal/admin/users', { headers: { cookie: incoming.get('cookie') ?? '' } }));
  if (!canAccessAdmin(user)) redirect('/login');
  if (user?.role !== 'super_admin') redirect('/admin');
  return children;
}
