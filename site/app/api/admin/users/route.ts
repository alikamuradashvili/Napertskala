import { listUsers, manageUsers } from '@/lib/user-management';

export const GET = listUsers;
export async function PATCH(request: Request) { return manageUsers(request); }
