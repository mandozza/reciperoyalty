import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ReactionBar, type Reaction } from "./ReactionBar";

export interface GroupedActivity {
  id: string;
  type: string;
  users: Array<{
    id: string;
    name: string;
    avatarUrl?: string;
  }>;
  timestamp: Date;
  target?: {
    type: "recipe" | "cookbook" | "user" | "achievement";
    id: string;
    name: string;
    preview?: {
      type: "image" | "video" | "text";
      content: string;
      thumbnailUrl?: string;
    };
  };
  reactions?: Reaction[];
  userReactions?: string[];
}

export interface ActivityGroupProps {
  activities: GroupedActivity[];
  className?: string;
  onUserClick?: (userId: string) => void;
  onTargetClick?: (type: string, id: string) => void;
  onReact?: (activityId: string, emoji: string) => void;
  onRemoveReaction?: (activityId: string, emoji: string) => void;
}

/**
 * ActivityGroup component that displays grouped similar activities
 */
export function ActivityGroup({
  activities,
  className,
  onUserClick,
  onTargetClick,
  onReact,
  onRemoveReaction,
}: ActivityGroupProps) {
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [activities]);

  const latestActivity = sortedActivities[0];
  const userCount = sortedActivities.reduce((count, activity) => count + activity.users.length, 0);

  const getGroupMessage = () => {
    const userText = userCount > 3
      ? `${sortedActivities[0].users[0].name} and ${userCount - 1} others`
      : sortedActivities.map(a => a.users.map(u => u.name)).flat().join(", ");

    switch (latestActivity.type) {
      case "recipe_liked":
        return `${userText} liked ${latestActivity.target?.name || "a recipe"}`;
      case "recipe_commented":
        return `${userText} commented on ${latestActivity.target?.name || "a recipe"}`;
      case "recipe_shared":
        return `${userText} shared ${latestActivity.target?.name || "a recipe"}`;
      case "user_followed":
        return `${userText} followed ${latestActivity.target?.name || "someone"}`;
      case "cookbook_created":
        return `${userText} created cookbooks`;
      case "achievement_earned":
        return `${userText} earned ${latestActivity.target?.name || "an achievement"}`;
      default:
        return `${userText} performed similar actions`;
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        {/* User Avatars and Message */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex -space-x-2">
            {sortedActivities[0].users.slice(0, 3).map((user) => (
              <Avatar
                key={user.id}
                className="cursor-pointer border-2 border-background"
                onClick={() => onUserClick?.(user.id)}
              >
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {userCount > 3 && (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                <span className="text-xs font-medium">+{userCount - 3}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm">
              {getGroupMessage()}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(latestActivity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Preview Content */}
        {latestActivity.target?.preview && (
          <div
            className="mt-3 cursor-pointer"
            onClick={() => onTargetClick?.(latestActivity.target?.type || "", latestActivity.target?.id || "")}
          >
            {latestActivity.target.preview.type === "image" && (
              <img
                src={latestActivity.target.preview.thumbnailUrl || latestActivity.target.preview.content}
                alt="Activity preview"
                className="rounded-md w-full object-cover max-h-96"
              />
            )}
            {latestActivity.target.preview.type === "video" && (
              <video
                src={latestActivity.target.preview.content}
                poster={latestActivity.target.preview.thumbnailUrl}
                controls
                className="rounded-md w-full max-h-96"
              />
            )}
            {latestActivity.target.preview.type === "text" && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm line-clamp-3">
                  {latestActivity.target.preview.content}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reactions */}
        {latestActivity.reactions && latestActivity.reactions.length > 0 && (
          <div className="mt-4">
            <ReactionBar
              reactions={latestActivity.reactions}
              userReactions={latestActivity.userReactions}
              onReact={(emoji) => onReact?.(latestActivity.id, emoji)}
              onRemoveReaction={(emoji) => onRemoveReaction?.(latestActivity.id, emoji)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
