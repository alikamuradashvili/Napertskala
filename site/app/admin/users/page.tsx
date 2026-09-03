import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin-dashboard';

export const metadata: Metadata = { title: 'Users | Napertskala', robots: { index: false, follow: false } };
export default function UsersPage() { return <AdminDashboard initialTab="users" />; }
