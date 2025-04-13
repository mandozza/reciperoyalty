"use client";

import { useState } from "react";
import Image from "next/image";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface UserProfileHeaderProps {
  user: {
    id: string;
    name: string;
    image?: string;
    coverImage?: string;
    bio?: string;
    stats: {
      recipes: number;
      followers: number;
      following: number;
    };
  };
  isOwnProfile?: boolean;
}

export function UserProfileHeader({ user, isOwnProfile = false }: UserProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  async function handleCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    setIsUploading(true);
    // TODO: Implement actual image upload to storage
    try {
      // Simulated upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Cover image updated",
        description: "Your profile cover image has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload cover image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden sm:h-64">
        {user.coverImage ? (
          <Image
            src={user.coverImage}
            alt={`${user.name}'s cover`}
            className="object-cover"
            fill
            priority
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
        {isOwnProfile && (
          <div className="absolute bottom-4 right-4">
            <label
              htmlFor="cover-upload"
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md bg-background/80 px-3 py-2 text-sm font-medium shadow backdrop-blur-sm hover:bg-background/90",
                isUploading && "pointer-events-none opacity-50"
              )}
            >
              {isUploading ? (
                <Icons.spinner className="h-4 w-4 animate-spin" />
              ) : (
                <Icons.camera className="h-4 w-4" />
              )}
              Change Cover
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageUpload}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 pb-8">
          {/* Avatar */}
          <div className="flex items-end space-x-5">
            <div className="relative">
              <UserAvatar
                user={{ name: user.name, image: user.image }}
                className="h-32 w-32 rounded-full border-4 border-background"
              />
              {isOwnProfile && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90"
                >
                  <Icons.camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.recipes}</div>
                  <div className="text-sm text-muted-foreground">Recipes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mt-6 min-w-0 flex-1 sm:mt-8">
            <div className="flex items-center justify-between">
              <h1 className="truncate text-2xl font-bold">{user.name}</h1>
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </Button>
              )}
            </div>
            <div className="mt-4">
              {isEditing ? (
                <textarea
                  className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Write a bio..."
                  defaultValue={user.bio}
                />
              ) : (
                <p className="text-muted-foreground">
                  {user.bio || (isOwnProfile && "Add a bio to your profile")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
