"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Loader2, UserPlus, UserMinus } from "lucide-react";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  className?: string;
}

export function FollowButton({ userId, isFollowing: initialIsFollowing, className }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const router = useRouter();

  async function toggleFollow() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update follow status");
      }

      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed successfully" : "Following!");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      // Revert optimistic update
      setIsFollowing(isFollowing);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={toggleFollow}
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={cn(
        "min-w-[100px] transition-all",
        isFollowing && "hover:bg-destructive hover:text-destructive-foreground",
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="mr-2 h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}
