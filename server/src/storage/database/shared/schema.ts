import { pgTable, serial, timestamp, foreignKey, unique, integer, varchar, jsonb, text, numeric, index, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const userEquipment = pgTable("user_equipment", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	equipmentId: integer("equipment_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_equipment_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.equipmentId],
			foreignColumns: [equipment.id],
			name: "user_equipment_equipment_id_fkey"
		}).onDelete("cascade"),
	unique("user_equipment_user_id_equipment_id_key").on(table.userId, table.equipmentId),
]);

export const equipment = pgTable("equipment", {
	id: serial().primaryKey().notNull(),
	brand: varchar({ length: 50 }).notNull(),
	model: varchar({ length: 100 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	specs: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
});

export const photos = pgTable("photos", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	imageUrl: text("image_url").notNull(),
	title: varchar({ length: 200 }),
	description: text(),
	cameraBrand: varchar("camera_brand", { length: 50 }),
	cameraModel: varchar("camera_model", { length: 100 }),
	lensModel: varchar("lens_model", { length: 100 }),
	focalLength: varchar("focal_length", { length: 20 }),
	aperture: varchar({ length: 20 }),
	shutterSpeed: varchar("shutter_speed", { length: 50 }),
	iso: integer(),
	whiteBalance: varchar("white_balance", { length: 50 }),
	latitude: numeric({ precision: 10, scale:  8 }),
	longitude: numeric({ precision: 11, scale:  8 }),
	locationName: varchar("location_name", { length: 200 }),
	shootingTips: text("shooting_tips"),
	likesCount: integer("likes_count").default(0),
	commentsCount: integer("comments_count").default(0),
	favoritesCount: integer("favorites_count").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "photos_user_id_fkey"
		}).onDelete("cascade"),
]);

export const photoTags = pgTable("photo_tags", {
	id: serial().primaryKey().notNull(),
	photoId: integer("photo_id"),
	tagName: varchar("tag_name", { length: 50 }).notNull(),
	tagType: varchar("tag_type", { length: 20 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.photoId],
			foreignColumns: [photos.id],
			name: "photo_tags_photo_id_fkey"
		}).onDelete("cascade"),
]);

export const photoLikes = pgTable("photo_likes", {
	id: serial().primaryKey().notNull(),
	photoId: integer("photo_id"),
	userId: integer("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.photoId],
			foreignColumns: [photos.id],
			name: "photo_likes_photo_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "photo_likes_user_id_fkey"
		}).onDelete("cascade"),
	unique("photo_likes_photo_id_user_id_key").on(table.photoId, table.userId),
]);

export const photoFavorites = pgTable("photo_favorites", {
	id: serial().primaryKey().notNull(),
	photoId: integer("photo_id"),
	userId: integer("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.photoId],
			foreignColumns: [photos.id],
			name: "photo_favorites_photo_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "photo_favorites_user_id_fkey"
		}).onDelete("cascade"),
	unique("photo_favorites_photo_id_user_id_key").on(table.photoId, table.userId),
]);

export const photoComments = pgTable("photo_comments", {
	id: serial().primaryKey().notNull(),
	photoId: integer("photo_id"),
	userId: integer("user_id"),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.photoId],
			foreignColumns: [photos.id],
			name: "photo_comments_photo_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "photo_comments_user_id_fkey"
		}).onDelete("cascade"),
]);

export const userFollows = pgTable("user_follows", {
	id: serial().primaryKey().notNull(),
	followerId: integer("follower_id"),
	followingId: integer("following_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [users.id],
			name: "user_follows_follower_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [users.id],
			name: "user_follows_following_id_fkey"
		}).onDelete("cascade"),
	unique("user_follows_follower_id_following_id_key").on(table.followerId, table.followingId),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: varchar({ length: 50 }).notNull(),
	avatarUrl: text("avatar_url"),
	bio: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
	phone: varchar({ length: 20 }),
	passwordHash: varchar("password_hash", { length: 255 }),
}, (table) => [
	index("idx_users_phone").using("btree", table.phone.asc().nullsLast().op("text_ops")),
	unique("users_username_key").on(table.username),
	unique("users_phone_key").on(table.phone),
]);

export const userOauthProviders = pgTable("user_oauth_providers", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	provider: varchar({ length: 20 }).notNull(),
	providerUserId: varchar("provider_user_id", { length: 100 }).notNull(),
	providerData: jsonb("provider_data"),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_oauth_providers_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_oauth_providers_provider_provider_user_id_key").on(table.provider, table.providerUserId),
]);

export const verificationCodes = pgTable("verification_codes", {
	id: serial().primaryKey().notNull(),
	phone: varchar({ length: 20 }).notNull(),
	code: varchar({ length: 6 }).notNull(),
	type: varchar({ length: 20 }).notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	used: boolean().default(false),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_verification_codes_phone_type").using("btree", table.phone.asc().nullsLast().op("text_ops"), table.type.asc().nullsLast().op("text_ops")),
]);

export const userSessions = pgTable("user_sessions", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	token: varchar({ length: 255 }).notNull(),
	deviceInfo: jsonb("device_info"),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
	index("idx_user_sessions_token").using("btree", table.token.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_sessions_user_id_fkey"
		}).onDelete("cascade"),
	unique("user_sessions_token_key").on(table.token),
]);
