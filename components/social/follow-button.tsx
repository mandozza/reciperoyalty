import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  followersCount: number;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  followersCount: initialFollowersCount,
  className,
  variant = "default",
  size = "default",
}: FollowButtonProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(initialFollowersCount);

  async function toggleFollow() {
    if (!session?.user) {
      router.push("/auth/signin");
      return;
    }

    if (session.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }

    setIsLoading(true);

    // Optimistically update UI
    const willFollow = !isFollowing;
    setIsFollowing(willFollow);
    setFollowersCount(prev => willFollow ? prev + 1 : prev - 1);

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error();
      }

      toast.success(willFollow ? "Followed successfully" : "Unfollowed successfully");
      router.refresh();
    } catch (error) {
      // Revert optimistic update on error
      setIsFollowing(!willFollow);
      setFollowersCount(prev => willFollow ? prev - 1 : prev + 1);
      toast.error("Failed to update follow status");
    } finally {
      setIsLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("min-w-[100px]", className)}
        disabled
      >
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        Loading
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleFollow}
      variant={isFollowing ? "outline" : variant}
      size={size}
      className={cn(
        "min-w-[100px]",
        isFollowing && "hover:bg-destructive hover:text-destructive-foreground",
        className
      )}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <Icons.userMinus className="mr-2 h-4 w-4" />
      ) : (
        <Icons.userPlus className="mr-2 h-4 w-4" />
      )}
      <span>{isFollowing ? "Unfollow" : "Follow"}</span>
      {followersCount > 0 && (
        <>
          <div className="mx-2 h-4 w-px bg-current opacity-20" />
          <span>{followersCount}</span>
        </>
      )}
    </Button>
  );
}
