import { getDb, hashPassword, json, normalizeEmail, publicUser, requireAdmin, validEmail, verifyOrigin, type AdminUser } from '@/lib/server';

const roles = new Set(['user', 'admin', 'super_admin']);
const statuses = new Set(['active', 'disabled']);
const actorAllowed = "EXISTS (SELECT 1 FROM users actor WHERE actor.id=? AND actor.role='super_admin' AND actor.status='active')";

export async function listUsers(request: Request) {
  const auth = await requireAdmin(request, true);
  if ('error' in auth) return auth.error;
  const db = await getDb();
  const users = await db.prepare('SELECT id,email,name,role,status,google_sub,created_at FROM users ORDER BY created_at DESC,id').all<AdminUser>();
  return json({ user: publicUser(auth.user), users: (users.results ?? []).map(publicUser) });
}

export async function manageUsers(request: Request, suppliedBody?: Record<string, unknown>) {
  if (!verifyOrigin(request)) return json({ error: 'Invalid request origin' }, 403);
  const auth = await requireAdmin(request, true);
  if ('error' in auth) return auth.error;
  const parsed = suppliedBody ?? await request.json().catch(() => null);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ error: 'Invalid request.' }, 400);
  const body = parsed as Record<string, unknown>;
  const db = await getDb();
  const action = body.action;
  if (!['create_user', 'update_user', 'delete_user'].includes(String(action))) return json({ error: 'Unknown action.' }, 400);
  const now = Date.now();
  const auditStatement = (targetId: string, detail: unknown) => db.prepare(
    `INSERT INTO audit_log(id,actor_id,action,target_type,target_id,detail,created_at)
     SELECT ?,?,?,'user',?,?,? WHERE changes()=1`,
  ).bind(crypto.randomUUID(), auth.user.id, String(action), targetId, JSON.stringify(detail), now);

  try {
    if (action === 'create_user') {
      const email = normalizeEmail(body.email);
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const role = body.role === undefined ? 'user' : body.role;
      const status = body.status === undefined ? 'active' : body.status;
      const useGoogle = body.useGoogle === true;
      const password = typeof body.password === 'string' ? body.password : '';
      if (!roles.has(String(role)) || !statuses.has(String(status)) || (body.useGoogle !== undefined && typeof body.useGoogle !== 'boolean')) return json({ error: 'Choose a valid role, status and sign-in method.' }, 400);
      if (!validEmail(email) || email.length > 254 || name.length < 2 || name.length > 120 || (!useGoogle && (password.length < 10 || password.length > 1024))) return json({ error: 'Enter a name, valid email and a password of 10–1024 characters.' }, 400);
      const credentials = useGoogle ? null : await hashPassword(password);
      const id = crypto.randomUUID();
      const results = await db.batch([
        db.prepare(`INSERT INTO users(id,email,name,password_hash,password_salt,role,status,created_at,updated_at)
          SELECT ?,?,?,?,?,?,?,?,? WHERE ${actorAllowed}`)
          .bind(id, email, name, credentials?.hash ?? null, credentials?.salt ?? null, role, status, now, now, auth.user.id),
        auditStatement(id, { role, status, useGoogle }),
      ]);
      if (Number(results[0].meta.changes) < 1) return json({ error: 'Your management access has changed. Sign in again.' }, 403);
      return json({ ok: true, userId: id }, 201);
    }

    const targetId = typeof body.userId === 'string' ? body.userId : '';
    const target = await db.prepare('SELECT id,role,status FROM users WHERE id=?').bind(targetId).first<{id:string;role:string;status:string}>();
    if (!target) return json({ error: 'User not found.' }, 404);
    if (action === 'update_user') {
      const role = body.role === undefined ? target.role : body.role;
      const status = body.status === undefined ? target.status : body.status;
      if (!roles.has(String(role)) || !statuses.has(String(status))) return json({ error: 'Choose a valid role and status.' }, 400);
      if (target.id === auth.user.id && (role !== target.role || status !== target.status)) return json({ error: 'You cannot change your own role or disable your own account.' }, 400);
      const results = await db.batch([
        db.prepare(`UPDATE users SET role=?,status=?,updated_at=? WHERE id=? AND role=? AND status=? AND ${actorAllowed}`)
          .bind(role, status, now, target.id, target.role, target.status, auth.user.id),
        auditStatement(target.id, { before: { role: target.role, status: target.status }, role, status }),
      ]);
      // D1 includes rows deleted by the session-revocation trigger in changes.
      if (Number(results[0].meta.changes) < 1) return json({ error: 'Account access changed during this request. Refresh and try again.' }, 409);
      return json({ ok: true });
    }

    if (target.id === auth.user.id) return json({ error: 'You cannot delete your own account.' }, 400);
    // Preserve authored content and photos when deleting an account. The batch
    // rolls back all changes if the last-owner trigger blocks deletion.
    const permittedTarget = `EXISTS (SELECT 1 FROM users target WHERE target.id=? AND ${actorAllowed})`;
    const results = await db.batch([
      ...[['site_content','updated_by'],['settings','updated_by'],['media','uploaded_by'],['audit_log','actor_id']].map(([table, column]) =>
        db.prepare(`UPDATE ${table} SET ${column}=NULL WHERE ${column}=? AND ${permittedTarget}`).bind(target.id, target.id, auth.user.id)),
      db.prepare(`DELETE FROM sessions WHERE user_id=? AND ${actorAllowed}`).bind(target.id, auth.user.id),
      db.prepare(`DELETE FROM users WHERE id=? AND ${actorAllowed}`).bind(target.id, auth.user.id),
      auditStatement(target.id, { role: target.role, status: target.status }),
    ]);
    if (Number(results[5].meta.changes) < 1) return json({ error: 'Account access changed. Refresh and try again.' }, 409);
    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('LAST_SUPER_ADMIN')) return json({ error: 'The last active Super Admin cannot be demoted, disabled or deleted.' }, 409);
    if (message.includes('UNIQUE constraint failed: users.email')) return json({ error: 'A user with this email already exists.' }, 409);
    return json({ error: 'Could not save the user. Please try again.' }, 500);
  }
}
