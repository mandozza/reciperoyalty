import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactionBar, type Reaction } from "./ReactionBar";

export type ActivityType =
  | "recipe_created"
  | "recipe_liked"
  | "recipe_commented"
  | "recipe_shared"
  | "user_followed"
  | "cookbook_created"
  | "cookbook_updated"
  | "achievement_earned";

interface ActivityPreview {
  type: "image" | "video" | "text";
  content: string;
  thumbnailUrl?: string;
}

export interface ActivityCardProps {
  id: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  type: ActivityType;
  timestamp: Date;
  preview?: ActivityPreview;
  context?: {
    recipeName?: string;
    cookbookName?: string;
    achievementName?: string;
    targetUser?: {
      id: string;
      name: string;
    };
  };
  reactions?: Reaction[];
  userReactions?: string[];
  className?: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onUserClick?: (userId: string) => void;
  onReact?: (emoji: string) => void;
  onRemoveReaction?: (emoji: string) => void;
}

/**
 * ActivityCard component displays user activities with context and interaction options
 */
export function ActivityCard({
  id,
  user,
  type,
  timestamp,
  preview,
  context,
  reactions = [],
  userReactions = [],
  className,
  onLike,
  onComment,
  onShare,
  onUserClick,
  onReact,
  onRemoveReaction,
}: ActivityCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  // Generate activity message based on type and context
  const getActivityMessage = () => {
    switch (type) {
      case "recipe_created":
        return `created a new recipe${context?.recipeName ? `: "${context.recipeName}"` : ""}`;
      case "recipe_liked":
        return `liked${context?.recipeName ? ` "${context.recipeName}"` : " a recipe"}`;
      case "recipe_commented":
        return `commented on${context?.recipeName ? ` "${context.recipeName}"` : " a recipe"}`;
      case "recipe_shared":
        return `shared${context?.recipeName ? ` "${context.recipeName}"` : " a recipe"}`;
      case "user_followed":
        return `followed ${context?.targetUser?.name || "someone"}`;
      case "cookbook_created":
        return `created a new cookbook${context?.cookbookName ? `: "${context.cookbookName}"` : ""}`;
      case "cookbook_updated":
        return `updated their cookbook${context?.cookbookName ? `: "${context.cookbookName}"` : ""}`;
      case "achievement_earned":
        return `earned an achievement${context?.achievementName ? `: "${context.achievementName}"` : ""}`;
      default:
        return "performed an action";
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* User Info and Timestamp */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar
            className="cursor-pointer"
            onClick={() => onUserClick?.(user.id)}
          >
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="font-semibold cursor-pointer hover:underline"
                  onClick={() => onUserClick?.(user.id)}
                >
                  {user.name}
                </span>
                <span className="text-muted-foreground"> {getActivityMessage()}</span>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Preview Content */}
        {preview && (
          <div className="mt-3">
            {preview.type === "image" && (
              <img
                src={preview.thumbnailUrl || preview.content}
                alt="Activity preview"
                className="rounded-md w-full object-cover max-h-96"
              />
            )}
            {preview.type === "video" && (
              <video
                src={preview.content}
                poster={preview.thumbnailUrl}
                controls
                className="rounded-md w-full max-h-96"
              />
            )}
            {preview.type === "text" && (
              <div className="bg-muted p-3 rounded-md">
                <p className={cn(
                  "text-sm",
                  !showFullContent && "line-clamp-3"
                )}>
                  {preview.content}
                </p>
                {preview.content.length > 150 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={() => setShowFullContent(!showFullContent)}
                  >
                    {showFullContent ? "Show less" : "Show more"}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="mt-4">
            <ReactionBar
              reactions={reactions}
              userReactions={userReactions}
              onReact={onReact}
              onRemoveReaction={onRemoveReaction}
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onLike}
          >
            <MessageCircle className="h-5 w-5" />
            Comment
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onShare}
          >
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
