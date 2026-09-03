import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(), email: text('email').notNull(), name: text('name').notNull(),
  passwordHash: text('password_hash'), passwordSalt: text('password_salt'), googleSub: text('google_sub'),
  role: text('role', { enum: ['super_admin', 'admin', 'user'] }).notNull().default('user'),
  status: text('status', { enum: ['active', 'disabled'] }).notNull().default('active'),
  createdAt: integer('created_at').notNull(), updatedAt: integer('updated_at').notNull(),
}, (table) => [uniqueIndex('idx_users_email').on(table.email), uniqueIndex('idx_users_google_sub').on(table.googleSub), index('idx_users_role_status').on(table.role, table.status)]);

export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(), userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(), createdAt: integer('created_at').notNull(),
}, (table) => [index('idx_sessions_user_id').on(table.userId), index('idx_sessions_expires_at').on(table.expiresAt)]);

export const siteContent = sqliteTable('site_content', {
  key: text('key').primaryKey(), valueKa: text('value_ka').notNull().default(''), valueEn: text('value_en').notNull().default(''),
  updatedBy: text('updated_by').references(() => users.id), updatedAt: integer('updated_at').notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(), value: text('value').notNull(), updatedBy: text('updated_by').references(() => users.id), updatedAt: integer('updated_at').notNull(),
});

export const media = sqliteTable('media', {
  id: text('id').primaryKey(), objectKey: text('object_key').notNull(), filename: text('filename').notNull(), contentType: text('content_type').notNull(),
  size: integer('size').notNull(), altKa: text('alt_ka').notNull().default(''), altEn: text('alt_en').notNull().default(''),
  uploadedBy: text('uploaded_by').references(() => users.id), createdAt: integer('created_at').notNull(),
}, (table) => [uniqueIndex('idx_media_object_key').on(table.objectKey), index('idx_media_created_at').on(table.createdAt)]);

export const galleryItems = sqliteTable('gallery_items', {
  mediaId: text('media_id').primaryKey().references(() => media.id, { onDelete: 'cascade' }),
  gallery: text('gallery').notNull().default('welding'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at').notNull(),
}, (table) => [index('idx_gallery_items_gallery_order').on(table.gallery, table.sortOrder)]);

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(), actorId: text('actor_id').references(() => users.id), action: text('action').notNull(),
  targetType: text('target_type').notNull(), targetId: text('target_id'), detail: text('detail'), createdAt: integer('created_at').notNull(),
}, (table) => [index('idx_audit_created_at').on(table.createdAt), index('idx_audit_actor_id').on(table.actorId)]);
