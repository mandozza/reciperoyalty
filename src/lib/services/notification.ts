import { Types } from 'mongoose';
import Notification, { NotificationType } from '@/models/Notification';
import { useNotificationStore } from '@/lib/stores/notification-store';

interface CreateNotificationParams {
  recipientId: string | Types.ObjectId;
  senderId: string | Types.ObjectId;
  type: NotificationType;
  recipeId?: string | Types.ObjectId;
  commentId?: string | Types.ObjectId;
  cookbookId?: string | Types.ObjectId;
}

/**
 * Creates a new notification and shows a toast notification
 */
export async function createNotification({
  recipientId,
  senderId,
  type,
  recipeId,
  commentId,
  cookbookId,
}: CreateNotificationParams) {
  try {
    // Don't create notification if recipient is the same as sender
    if (recipientId.toString() === senderId.toString()) {
      return;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      recipe: recipeId,
      comment: commentId,
      cookbook: cookbookId,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

/**
 * Creates a follow notification
 */
export async function createFollowNotification(recipientId: string, senderId: string) {
  return createNotification({
    recipientId,
    senderId,
    type: 'follow',
  });
}

/**
 * Creates a like notification
 */
export async function createLikeNotification(recipientId: string, senderId: string, recipeId: string) {
  return createNotification({
    recipientId,
    senderId,
    type: 'like',
    recipeId,
  });
}

/**
 * Creates a comment notification
 */
export async function createCommentNotification(
  recipientId: string,
  senderId: string,
  recipeId: string,
  commentId: string
) {
  return createNotification({
    recipientId,
    senderId,
    type: 'comment',
    recipeId,
    commentId,
  });
}

/**
 * Creates a mention notification
 */
export async function createMentionNotification(
  recipientId: string,
  senderId: string,
  commentId: string
) {
  return createNotification({
    recipientId,
    senderId,
    type: 'mention',
    commentId,
  });
}

/**
 * Creates a cookbook add notification
 */
export async function createCookbookAddNotification(
  recipientId: string,
  senderId: string,
  cookbookId: string
) {
  return createNotification({
    recipientId,
    senderId,
    type: 'cookbook_add',
    cookbookId,
  });
}

/**
 * Creates a recipe save notification
 */
export async function createRecipeSaveNotification(
  recipientId: string,
  senderId: string,
  recipeId: string
) {
  return createNotification({
    recipientId,
    senderId,
    type: 'recipe_save',
    recipeId,
  });
}

/**
 * Shows a toast notification for a new notification
 */
export function showNotificationToast(type: NotificationType, senderName: string) {
  const { addNotification } = useNotificationStore.getState();

  const messages = {
    follow: `${senderName} started following you`,
    like: `${senderName} liked your recipe`,
    comment: `${senderName} commented on your recipe`,
    mention: `${senderName} mentioned you in a comment`,
    cookbook_add: `${senderName} added your recipe to their cookbook`,
    recipe_save: `${senderName} saved your recipe`,
  };

  addNotification({
    type: 'info',
    title: 'New Notification',
    message: messages[type],
    duration: 5000,
    hasSound: true,
  });
}
