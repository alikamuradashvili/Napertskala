export function canAccessAdmin(user: { role?: unknown; status?: unknown } | null | undefined): boolean {
  return user?.status === 'active' && (user.role === 'admin' || user.role === 'super_admin');
}

export function canSignIn(user: { role?: unknown; status?: unknown } | null | undefined): boolean {
  return user?.status === 'active' && (user.role === 'user' || user.role === 'admin' || user.role === 'super_admin');
}
