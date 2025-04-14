import mongoose, { Document, Model, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for runtime validation
export const UserValidation = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  emailVerified: z.date().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  followers: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
  blockedUsers: z.array(z.string()).optional(),
});

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  password?: string;
  accounts: any[];
  sessions: any[];
  avatar?: string;
  bio?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  favoriteRecipes: mongoose.Types.ObjectId[];
  recipes: mongoose.Types.ObjectId[];
  cookbooks: mongoose.Types.ObjectId[];
  dietaryPreferences: string[];
  cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  follow(userId: mongoose.Types.ObjectId): Promise<void>;
  unfollow(userId: mongoose.Types.ObjectId): Promise<void>;
  isFollowing(userId: mongoose.Types.ObjectId): boolean;
  getFollowersCount(): number;
  getFollowingCount(): number;
  block(userId: mongoose.Types.ObjectId): Promise<void>;
  unblock(userId: mongoose.Types.ObjectId): Promise<void>;
  isBlocked(userId: mongoose.Types.ObjectId): boolean;
  isBlockedBy(userId: mongoose.Types.ObjectId): Promise<boolean>;
  addFavoriteRecipe(recipeId: mongoose.Types.ObjectId): Promise<void>;
  removeFavoriteRecipe(recipeId: mongoose.Types.ObjectId): Promise<void>;
  hasFavoriteRecipe(recipeId: mongoose.Types.ObjectId): boolean;
}

// Mongoose schema definition
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Please enter a valid email address',
      },
    },
    image: String,
    emailVerified: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false, // Don't include password in query results by default
    },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
    sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
    avatar: {
      type: String,
      validate: {
        validator: (value: string) => {
          if (!value) return true; // Optional field
          try {
            new URL(value);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Please enter a valid URL for avatar',
      },
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot be more than 500 characters'],
    },
    recipes: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
    }],
    cookbooks: [{
      type: Schema.Types.ObjectId,
      ref: 'Cookbook',
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    blockedUsers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    favoriteRecipes: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
    }],
    dietaryPreferences: [{
      type: String,
      enum: ['vegan', 'vegetarian', 'pescatarian', 'gluten-free', 'dairy-free', 'keto', 'paleo'],
      default: [],
    }],
    cookingSkillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        delete ret.password; // Never expose password in JSON
        return ret;
      },
    },
  }
);

// Instance methods
UserSchema.methods.follow = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (this.following.includes(userId)) {
    throw new Error('Already following this user');
  }
  if (userId.equals(this._id)) {
    throw new Error('Cannot follow yourself');
  }

  // Add to following
  this.following.push(userId);
  await this.save();

  // Add to other user's followers
  await this.model('User').findByIdAndUpdate(userId, {
    $push: { followers: this._id }
  });
};

UserSchema.methods.unfollow = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (!this.following.includes(userId)) {
    throw new Error('Not following this user');
  }

  // Remove from following
  this.following = this.following.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  await this.save();

  // Remove from other user's followers
  await this.model('User').findByIdAndUpdate(userId, {
    $pull: { followers: this._id }
  });
};

UserSchema.methods.isFollowing = function(userId: mongoose.Types.ObjectId): boolean {
  return this.following.some((id: mongoose.Types.ObjectId) => id.equals(userId));
};

UserSchema.methods.getFollowersCount = function(): number {
  return this.followers.length;
};

UserSchema.methods.getFollowingCount = function(): number {
  return this.following.length;
};

// Block/Unblock methods
UserSchema.methods.block = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (userId.equals(this._id)) {
    throw new Error('Cannot block yourself');
  }

  if (this.blockedUsers.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
    throw new Error('User is already blocked');
  }

  // Add to blocked users
  this.blockedUsers.push(userId);

  // Remove from following/followers if exists
  this.following = this.following.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  this.followers = this.followers.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));

  await this.save();

  // Remove from other user's following/followers
  await this.model('User').findByIdAndUpdate(userId, {
    $pull: {
      followers: this._id,
      following: this._id
    }
  });
};

UserSchema.methods.unblock = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (!this.blockedUsers.some((id: mongoose.Types.ObjectId) => id.equals(userId))) {
    throw new Error('User is not blocked');
  }

  this.blockedUsers = this.blockedUsers.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  await this.save();
};

UserSchema.methods.isBlocked = function(userId: mongoose.Types.ObjectId): boolean {
  return this.blockedUsers.some((id: mongoose.Types.ObjectId) => id.equals(userId));
};

UserSchema.methods.isBlockedBy = async function(userId: mongoose.Types.ObjectId): Promise<boolean> {
  const otherUser = await this.model('User').findById(userId);
  if (!otherUser) return false;
  return otherUser.blockedUsers.some((id: mongoose.Types.ObjectId) => id.equals(this._id));
};

// Add methods for recipe interactions
UserSchema.methods.addFavoriteRecipe = async function(recipeId: mongoose.Types.ObjectId): Promise<void> {
  if (!this.favoriteRecipes.some((id: mongoose.Types.ObjectId) => id.equals(recipeId))) {
    this.favoriteRecipes.push(recipeId);
    await this.save();
  }
};

UserSchema.methods.removeFavoriteRecipe = async function(recipeId: mongoose.Types.ObjectId): Promise<void> {
  if (this.favoriteRecipes.some((id: mongoose.Types.ObjectId) => id.equals(recipeId))) {
    this.favoriteRecipes = this.favoriteRecipes.filter((id: mongoose.Types.ObjectId) => !id.equals(recipeId));
    await this.save();
  }
};

UserSchema.methods.hasFavoriteRecipe = function(recipeId: mongoose.Types.ObjectId): boolean {
  return this.favoriteRecipes.some((id: mongoose.Types.ObjectId) => id.equals(recipeId));
};

// Indexes for better query performance
UserSchema.index({ name: 'text' });

// Create and export the model
let User: Model<IUser>;

try {
  // Check if the model is already registered
  User = mongoose.model<IUser>('User');
} catch {
  // If not, register the model
  User = mongoose.model<IUser>('User', UserSchema);
}

export default User;
