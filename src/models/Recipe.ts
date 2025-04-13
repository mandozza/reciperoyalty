import mongoose, { Document, Model, Schema } from 'mongoose';
import { z } from 'zod';
import { IUser } from './User';

// Zod schema for runtime validation
export const RecipeValidation = z.object({
  title: z.string().min(3).max(100),
  slug: z.string(),
  ingredients: z.array(z.object({
    item: z.string(),
    amount: z.string(),
    unit: z.string().optional(),
  })),
  steps: z.array(z.object({
    description: z.string(),
    imageUrl: z.string().url().optional(),
  })),
  media: z.array(z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video']),
    caption: z.string().optional(),
  })),
  tags: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  prepTime: z.number().min(1),
  cookTime: z.number().min(1),
  servings: z.number().min(1),
});

// TypeScript interfaces
interface IIngredient {
  item: string;
  amount: string;
  unit?: string;
}

interface IStep {
  description: string;
  imageUrl?: string;
}

interface IMedia {
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

export interface IRecipe extends Document {
  title: string;
  slug: string;
  ingredients: IIngredient[];
  steps: IStep[];
  media: IMedia[];
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  createdBy: mongoose.Types.ObjectId | IUser;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  like(userId: mongoose.Types.ObjectId): Promise<void>;
  unlike(userId: mongoose.Types.ObjectId): Promise<void>;
  isLikedBy(userId: mongoose.Types.ObjectId): boolean;
  getLikesCount(): number;
  getCommentsCount(): number;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    ingredients: [{
      item: {
        type: String,
        required: [true, 'Ingredient name is required'],
        trim: true,
      },
      amount: {
        type: String,
        required: [true, 'Amount is required'],
        trim: true,
      },
      unit: {
        type: String,
        trim: true,
      },
    }],
    steps: [{
      description: {
        type: String,
        required: [true, 'Step description is required'],
        trim: true,
      },
      imageUrl: {
        type: String,
        validate: {
          validator: (value: string) => {
            if (!value) return true;
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          },
          message: 'Please enter a valid URL for step image',
        },
      },
    }],
    media: [{
      url: {
        type: String,
        required: [true, 'Media URL is required'],
        validate: {
          validator: (value: string) => {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          },
          message: 'Please enter a valid URL for media',
        },
      },
      type: {
        type: String,
        enum: ['image', 'video'],
        required: [true, 'Media type is required'],
      },
      caption: {
        type: String,
        trim: true,
      },
    }],
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: [true, 'Difficulty level is required'],
    },
    prepTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [1, 'Preparation time must be at least 1 minute'],
    },
    cookTime: {
      type: Number,
      required: [true, 'Cooking time is required'],
      min: [1, 'Cooking time must be at least 1 minute'],
    },
    servings: {
      type: Number,
      required: [true, 'Number of servings is required'],
      min: [1, 'Must serve at least 1 person'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipe must have an author'],
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Instance methods
RecipeSchema.methods.like = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (this.likes.includes(userId)) {
    throw new Error('Recipe already liked by user');
  }
  this.likes.push(userId);
  await this.save();
};

RecipeSchema.methods.unlike = async function(userId: mongoose.Types.ObjectId): Promise<void> {
  if (!this.likes.includes(userId)) {
    throw new Error('Recipe not liked by user');
  }
  this.likes = this.likes.filter((id: mongoose.Types.ObjectId) => !id.equals(userId));
  await this.save();
};

RecipeSchema.methods.isLikedBy = function(userId: mongoose.Types.ObjectId): boolean {
  return this.likes.some((id: mongoose.Types.ObjectId) => id.equals(userId));
};

RecipeSchema.methods.getLikesCount = function(): number {
  return this.likes.length;
};

RecipeSchema.methods.getCommentsCount = function(): number {
  return this.comments.length;
};

// Middleware to generate slug from title
RecipeSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Indexes for better query performance
RecipeSchema.index({ title: 'text', tags: 'text' });
RecipeSchema.index({ slug: 1 }, { unique: true });
RecipeSchema.index({ createdBy: 1 });
RecipeSchema.index({ difficulty: 1 });
RecipeSchema.index({ createdAt: -1 });

// Create and export the model
const Recipe = (mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', RecipeSchema)) as Model<IRecipe>;

export default Recipe;
