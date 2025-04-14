"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Ban, UserX2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface BlockButtonProps {
  userId: string;
  isBlocked: boolean;
  userName: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BlockButton({
  userId,
  isBlocked: initialIsBlocked,
  userName,
  className,
  variant = "outline",
  size = "sm",
}: BlockButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [showDialog, setShowDialog] = useState(false);

  async function toggleBlock() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${userId}/block`, {
        method: isBlocked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update block status");
      }

      setIsBlocked(!isBlocked);
      toast.success(
        isBlocked
          ? `Unblocked ${userName}`
          : `Blocked ${userName}`
      );
      router.refresh();
      setShowDialog(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      // Revert optimistic update
      setIsBlocked(isBlocked);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "min-w-[100px]",
            isBlocked && variant === "outline" && "hover:bg-destructive hover:text-destructive-foreground",
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isBlocked ? (
            <>
              <UserX2 className="mr-2 h-4 w-4" />
              Unblock
            </>
          ) : (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Block
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBlocked ? "Unblock User" : "Block User"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBlocked
              ? `Are you sure you want to unblock ${userName}? They will be able to interact with your content again.`
              : `Are you sure you want to block ${userName}? They won't be able to follow you or interact with your content.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={toggleBlock}
            className={isBlocked ? "bg-primary" : "bg-destructive"}
          >
            {isBlocked ? "Unblock" : "Block"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
