import mongoose, { Schema, Document } from "mongoose"
import { Recipe } from "./Recipe"
import { Cookbook } from "./Cookbook"

interface NotificationPreferences {
  new_follower: boolean
  new_comment: boolean
  recipe_likes: boolean
  newsletter: boolean
  push_new_follower: boolean
  push_new_comment: boolean
  push_recipe_likes: boolean
  push_mentions: boolean
}

interface PrivacyPreferences {
  profile_visibility: boolean
  recipe_visibility: boolean
  show_email: boolean
  allow_mentions: boolean
  show_activity: boolean
  personalized_content: boolean
  analytics: boolean
  third_party_sharing: boolean
}

export interface IUser extends Document {
  name: string
  email: string
  emailVerified?: Date
  image?: string
  coverImage?: string
  bio?: string
  password?: string
  recipes: mongoose.Types.ObjectId[]
  cookbooks: mongoose.Types.ObjectId[]
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  blockedUsers: mongoose.Types.ObjectId[]
  notificationPreferences: NotificationPreferences
  privacyPreferences: PrivacyPreferences
  stats: {
    recipes: number
    followers: number
    following: number
  }
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: Date,
    image: String,
    coverImage: String,
    bio: String,
    password: {
      type: String,
      select: false,
    },
    recipes: [{
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    }],
    cookbooks: [{
      type: Schema.Types.ObjectId,
      ref: "Cookbook",
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    blockedUsers: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    notificationPreferences: {
      new_follower: { type: Boolean, default: true },
      new_comment: { type: Boolean, default: true },
      recipe_likes: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true },
      push_new_follower: { type: Boolean, default: true },
      push_new_comment: { type: Boolean, default: true },
      push_recipe_likes: { type: Boolean, default: true },
      push_mentions: { type: Boolean, default: true },
    },
    privacyPreferences: {
      profile_visibility: { type: Boolean, default: true },
      recipe_visibility: { type: Boolean, default: true },
      show_email: { type: Boolean, default: false },
      allow_mentions: { type: Boolean, default: true },
      show_activity: { type: Boolean, default: true },
      personalized_content: { type: Boolean, default: true },
      analytics: { type: Boolean, default: true },
      third_party_sharing: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual for user stats
userSchema.virtual("stats").get(function (this: IUser) {
  return {
    recipes: this.recipes.length,
    followers: this.followers.length,
    following: this.following.length,
  }
})

// Create indexes
userSchema.index({ name: "text", email: "text" })

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
