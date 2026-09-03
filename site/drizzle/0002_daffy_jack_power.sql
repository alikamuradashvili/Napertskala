-- Upgrade in place to preserve sessions, photos, content and foreign keys.
DROP TRIGGER IF EXISTS protect_last_super_admin_update;
--> statement-breakpoint
DROP TRIGGER IF EXISTS protect_last_super_admin_delete;
--> statement-breakpoint
DROP TRIGGER IF EXISTS revoke_sessions_on_access_change;
--> statement-breakpoint
DROP INDEX IF EXISTS idx_users_role_status;
--> statement-breakpoint
ALTER TABLE users RENAME COLUMN role TO legacy_role;
--> statement-breakpoint
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','admin','super_admin'));
--> statement-breakpoint
UPDATE users SET role=legacy_role;
--> statement-breakpoint
ALTER TABLE users DROP COLUMN legacy_role;
--> statement-breakpoint
CREATE INDEX idx_users_role_status ON users(role,status);
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS protect_last_super_admin_update
   BEFORE UPDATE OF role,status ON users
   WHEN OLD.role='super_admin' AND OLD.status='active'
     AND (NEW.role!='super_admin' OR NEW.status!='active')
     AND NOT EXISTS (SELECT 1 FROM users WHERE id!=OLD.id AND role='super_admin' AND status='active')
   BEGIN SELECT RAISE(ABORT, 'LAST_SUPER_ADMIN'); END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS protect_last_super_admin_delete
   BEFORE DELETE ON users
   WHEN OLD.role='super_admin' AND OLD.status='active'
     AND NOT EXISTS (SELECT 1 FROM users WHERE id!=OLD.id AND role='super_admin' AND status='active')
   BEGIN SELECT RAISE(ABORT, 'LAST_SUPER_ADMIN'); END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS revoke_sessions_on_access_change
   AFTER UPDATE OF role,status ON users
   WHEN NEW.role!=OLD.role OR NEW.status!=OLD.status
   BEGIN DELETE FROM sessions WHERE user_id=NEW.id; END;
--> statement-breakpoint
PRAGMA optimize;
--> statement-breakpoint
