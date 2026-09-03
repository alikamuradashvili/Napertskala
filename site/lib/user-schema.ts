// Upgrade the old two-role column in place. Never rebuild users: foreign keys
// from sessions, uploaded photos and content must keep their existing records.
export const userRoleMigration = [
  'DROP INDEX IF EXISTS idx_users_role_status',
  'ALTER TABLE users RENAME COLUMN role TO legacy_role',
  "ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin','super_admin'))",
  'UPDATE users SET role=legacy_role',
  'ALTER TABLE users DROP COLUMN legacy_role',
  'CREATE INDEX idx_users_role_status ON users(role,status)',
];

// Database-level guards also cover concurrent requests and legacy API callers.
export const userGuardStatements = [
  `CREATE TRIGGER IF NOT EXISTS protect_last_super_admin_update
   BEFORE UPDATE OF role,status ON users
   WHEN OLD.role='super_admin' AND OLD.status='active'
     AND (NEW.role!='super_admin' OR NEW.status!='active')
     AND NOT EXISTS (SELECT 1 FROM users WHERE id!=OLD.id AND role='super_admin' AND status='active')
   BEGIN SELECT RAISE(ABORT, 'LAST_SUPER_ADMIN'); END`,
  `CREATE TRIGGER IF NOT EXISTS protect_last_super_admin_delete
   BEFORE DELETE ON users
   WHEN OLD.role='super_admin' AND OLD.status='active'
     AND NOT EXISTS (SELECT 1 FROM users WHERE id!=OLD.id AND role='super_admin' AND status='active')
   BEGIN SELECT RAISE(ABORT, 'LAST_SUPER_ADMIN'); END`,
  `CREATE TRIGGER IF NOT EXISTS revoke_sessions_on_access_change
   AFTER UPDATE OF role,status ON users
   WHEN NEW.role!=OLD.role OR NEW.status!=OLD.status
   BEGIN DELETE FROM sessions WHERE user_id=NEW.id; END`,
];
