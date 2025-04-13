import mongoose, { Schema, Document } from 'mongoose';

export type ActivityType =
  | 'recipe_create'
  | 'recipe_like'
  | 'recipe_comment'
  | 'cookbook_create'
  | 'cookbook_add_recipe'
  | 'user_follow'
  | 'user_mention';

export interface IActivity extends Document {
  actor: mongoose.Types.ObjectId;
  type: ActivityType;
  recipe?: mongoose.Types.ObjectId;
  cookbook?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  targetUser?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Activity must have an actor'],
      index: true,
    },
    type: {
      type: String,
      enum: [
        'recipe_create',
        'recipe_like',
        'recipe_comment',
        'cookbook_create',
        'cookbook_add_recipe',
        'user_follow',
        'user_mention',
      ],
      required: [true, 'Activity type is required'],
      index: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      index: true,
    },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: 'Cookbook',
      index: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      index: true,
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
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

// Create compound indexes for efficient querying
ActivitySchema.index({ actor: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });
ActivitySchema.index({ targetUser: 1, createdAt: -1 });

export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
