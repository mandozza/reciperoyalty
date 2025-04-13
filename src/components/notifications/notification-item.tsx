import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NotificationType } from "@/models/Notification";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: {
    id: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
    };
    recipe?: {
      title: string;
      slug: string;
    };
    comment?: {
      content: string;
    };
    cookbook?: {
      title: string;
    };
  };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const getNotificationContent = () => {
    const senderName = notification.sender.name;

    switch (notification.type) {
      case "follow":
        return {
          text: `${senderName} started following you`,
          link: `/profile/${notification.sender.id}`,
        };
      case "like":
        return {
          text: `${senderName} liked your recipe "${notification.recipe?.title}"`,
          link: `/recipes/${notification.recipe?.slug}`,
        };
      case "comment":
        return {
          text: `${senderName} commented on your recipe "${notification.recipe?.title}": "${notification.comment?.content}"`,
          link: `/recipes/${notification.recipe?.slug}`,
        };
      case "mention":
        return {
          text: `${senderName} mentioned you in a comment: "${notification.comment?.content}"`,
          link: `/recipes/${notification.recipe?.slug}`,
        };
      case "cookbook_add":
        return {
          text: `${senderName} added your recipe to their cookbook "${notification.cookbook?.title}"`,
          link: `/profile/${notification.sender.id}`,
        };
      case "recipe_save":
        return {
          text: `${senderName} saved your recipe "${notification.recipe?.title}"`,
          link: `/recipes/${notification.recipe?.slug}`,
        };
      default:
        return {
          text: "New notification",
          link: "#",
        };
    }
  };

  const { text, link } = getNotificationContent();
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <Link
      href={link}
      className={cn(
        "flex items-start gap-4 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50",
        !notification.read && "bg-muted/30"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={notification.sender.avatar} />
        <AvatarFallback>
          {notification.sender.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </Link>
  );
}
