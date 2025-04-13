import { Schema, model, models, Types } from 'mongoose';

/**
 * Interface representing a comment document in MongoDB
 */
export interface IComment {
  content: string;
  author: Types.ObjectId;
  recipe: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for comments
 */
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot be longer than 1000 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment author is required'],
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: 'Recipe',
      required: [true, 'Recipe reference is required'],
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

/**
 * Like a comment
 * @param userId - The ID of the user liking the comment
 */
commentSchema.methods.like = async function(userId: Types.ObjectId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    await this.save();
  }
};

/**
 * Unlike a comment
 * @param userId - The ID of the user unliking the comment
 */
commentSchema.methods.unlike = async function(userId: Types.ObjectId) {
  if (this.likes.includes(userId)) {
    this.likes = this.likes.filter((id: Types.ObjectId) => !id.equals(userId));
    await this.save();
  }
};

/**
 * Get the number of likes on a comment
 * @returns The number of likes
 */
commentSchema.methods.getLikesCount = function(): number {
  return this.likes.length;
};

// Create or get the model
const Comment = models.Comment || model<IComment>('Comment', commentSchema);

export default Comment;
