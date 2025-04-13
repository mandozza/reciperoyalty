import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "follow"
  | "like"
  | "comment"
  | "mention"
  | "cookbook_add"
  | "recipe_save";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: NotificationType;
  read: boolean;
  recipe?: mongoose.Types.ObjectId;
  comment?: mongoose.Types.ObjectId;
  cookbook?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment", "mention", "cookbook_add", "recipe_save"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    cookbook: {
      type: Schema.Types.ObjectId,
      ref: "Cookbook",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
