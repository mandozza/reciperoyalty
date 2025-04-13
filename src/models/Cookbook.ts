import { Schema, model, models, Types } from 'mongoose';

/**
 * Interface representing a cookbook document in MongoDB
 */
export interface ICookbook {
  title: string;
  description?: string;
  owner: Types.ObjectId;
  collaborators: Types.ObjectId[];
  recipes: Types.ObjectId[];
  coverImage?: string;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for cookbooks
 */
const cookbookSchema = new Schema<ICookbook>(
  {
    title: {
      type: String,
      required: [true, 'Cookbook title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be longer than 500 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cookbook owner is required'],
    },
    collaborators: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    recipes: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
    }],
    coverImage: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Cover image must be a valid URL',
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [30, 'Tag cannot be longer than 30 characters'],
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
cookbookSchema.index({ owner: 1 });
cookbookSchema.index({ title: 'text', description: 'text' });
cookbookSchema.index({ tags: 1 });
cookbookSchema.index({ isPublic: 1 });

/**
 * Add a recipe to the cookbook
 * @param recipeId - The ID of the recipe to add
 */
cookbookSchema.methods.addRecipe = async function(recipeId: Types.ObjectId) {
  if (!this.recipes.includes(recipeId)) {
    this.recipes.push(recipeId);
    await this.save();
  }
};

/**
 * Remove a recipe from the cookbook
 * @param recipeId - The ID of the recipe to remove
 */
cookbookSchema.methods.removeRecipe = async function(recipeId: Types.ObjectId) {
  if (this.recipes.includes(recipeId)) {
    this.recipes = this.recipes.filter((id: Types.ObjectId) => !id.equals(recipeId));
    await this.save();
  }
};

/**
 * Add a collaborator to the cookbook
 * @param userId - The ID of the user to add as collaborator
 */
cookbookSchema.methods.addCollaborator = async function(userId: Types.ObjectId) {
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
    await this.save();
  }
};

/**
 * Remove a collaborator from the cookbook
 * @param userId - The ID of the user to remove from collaborators
 */
cookbookSchema.methods.removeCollaborator = async function(userId: Types.ObjectId) {
  if (this.collaborators.includes(userId)) {
    this.collaborators = this.collaborators.filter((id: Types.ObjectId) => !id.equals(userId));
    await this.save();
  }
};

/**
 * Check if a user has access to this cookbook
 * @param userId - The ID of the user to check
 * @returns boolean indicating if the user has access
 */
cookbookSchema.methods.hasAccess = function(userId: Types.ObjectId): boolean {
  return this.isPublic ||
         this.owner.equals(userId) ||
         this.collaborators.some((id: Types.ObjectId) => id.equals(userId));
};

// Create or get the model
const Cookbook = models.Cookbook || model<ICookbook>('Cookbook', cookbookSchema);

export default Cookbook;
