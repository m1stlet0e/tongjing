import { relations } from "drizzle-orm/relations";
import { users, userEquipment, equipment, photos, photoTags, photoLikes, photoFavorites, photoComments, userFollows } from "./schema";

export const userEquipmentRelations = relations(userEquipment, ({one}) => ({
	user: one(users, {
		fields: [userEquipment.userId],
		references: [users.id]
	}),
	equipment: one(equipment, {
		fields: [userEquipment.equipmentId],
		references: [equipment.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userEquipments: many(userEquipment),
	photos: many(photos),
	photoLikes: many(photoLikes),
	photoFavorites: many(photoFavorites),
	photoComments: many(photoComments),
	userFollows_followerId: many(userFollows, {
		relationName: "userFollows_followerId_users_id"
	}),
	userFollows_followingId: many(userFollows, {
		relationName: "userFollows_followingId_users_id"
	}),
}));

export const equipmentRelations = relations(equipment, ({many}) => ({
	userEquipments: many(userEquipment),
}));

export const photosRelations = relations(photos, ({one, many}) => ({
	user: one(users, {
		fields: [photos.userId],
		references: [users.id]
	}),
	photoTags: many(photoTags),
	photoLikes: many(photoLikes),
	photoFavorites: many(photoFavorites),
	photoComments: many(photoComments),
}));

export const photoTagsRelations = relations(photoTags, ({one}) => ({
	photo: one(photos, {
		fields: [photoTags.photoId],
		references: [photos.id]
	}),
}));

export const photoLikesRelations = relations(photoLikes, ({one}) => ({
	photo: one(photos, {
		fields: [photoLikes.photoId],
		references: [photos.id]
	}),
	user: one(users, {
		fields: [photoLikes.userId],
		references: [users.id]
	}),
}));

export const photoFavoritesRelations = relations(photoFavorites, ({one}) => ({
	photo: one(photos, {
		fields: [photoFavorites.photoId],
		references: [photos.id]
	}),
	user: one(users, {
		fields: [photoFavorites.userId],
		references: [users.id]
	}),
}));

export const photoCommentsRelations = relations(photoComments, ({one}) => ({
	photo: one(photos, {
		fields: [photoComments.photoId],
		references: [photos.id]
	}),
	user: one(users, {
		fields: [photoComments.userId],
		references: [users.id]
	}),
}));

export const userFollowsRelations = relations(userFollows, ({one}) => ({
	user_followerId: one(users, {
		fields: [userFollows.followerId],
		references: [users.id],
		relationName: "userFollows_followerId_users_id"
	}),
	user_followingId: one(users, {
		fields: [userFollows.followingId],
		references: [users.id],
		relationName: "userFollows_followingId_users_id"
	}),
}));