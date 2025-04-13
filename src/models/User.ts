import mongoose, { Document, Model, Schema } from 'mongoose';
import { z } from 'zod';

// Zod schema for runtime validation
export const UserValidation = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  followers: z.array(z.string()).optional(),
  following: z.array(z.string()).optional(),
});

// TypeScript interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  follow(userId: mongoose.Types.ObjectId): Promise<void>;
  unfollow(userId: mongoose.Types.ObjectId): Promise<void>;
  isFollowing(userId: mongoose.Types.ObjectId): boolean;
  getFollowersCount(): number;
  getFollowingCount(): number;
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
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
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

// Indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ name: 'text' });

// Create and export the model
const User = (mongoose.models.User || mongoose.model<IUser>('User', UserSchema)) as Model<IUser>;

export default User;
