"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { UserAvatar } from "../ui/user-avatar";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { updateProfile } from "../../lib/api/user";
import { User } from "../../types/user";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Separator } from "../ui/separator";
import { FollowButton } from "@/components/social/follow-button";

const profileSchema = z.object({
  bio: z
    .string()
    .min(3, "Bio must be at least 3 characters")
    .max(500, "Bio must be less than 500 characters")
    .refine(
      (bio) => {
        const words = bio.trim().split(/\s+/);
        return words.length <= 100;
      },
      { message: "Bio cannot exceed 100 words" }
    )
    .refine(
      (bio) => !bio.includes("http") && !bio.includes("www."),
      { message: "Bio cannot contain URLs" }
    )
    .refine(
      (bio) => !/[<>{}]/.test(bio),
      { message: "Bio cannot contain HTML or special characters" }
    )
    .transform((bio) => bio.trim()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
    isFollowing: boolean;
  };
  isOwnProfile?: boolean;
}

interface UserAvatarProps {
  user: {
    name: string;
    image?: string;
  };
  className?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function validateAndOptimizeImage(file: File): { isValid: boolean; error?: string; file?: File } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "Image size must be less than 5MB",
    };
  }

  // Create a new optimized file with a unique name to prevent caching
  const timestamp = Date.now();
  const optimizedFileName = `${file.name.split(".")[0]}_${timestamp}.${file.name.split(".").pop()}`;

  const optimizedFile = new File([file], optimizedFileName, {
    type: file.type,
    lastModified: Date.now(),
  });

  return {
    isValid: true,
    file: optimizedFile,
  };
}

export function UserProfileHeader({ user, isOwnProfile = false }: UserProfileHeaderProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user.bio || "",
    },
  });

  async function handleCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAndOptimizeImage(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", validation.file!);
      formData.append("type", "cover");

      const response = await fetch(`/api/users/${user.id}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      toast.success("Cover image updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload cover image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAndOptimizeImage(file);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", validation.file!);
      formData.append("type", "avatar");

      const response = await fetch(`/api/users/${user.id}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      toast.success("Avatar updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    try {
      await updateProfile(user.id, data);
      setIsEditing(false);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
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
          <div className="flex items-end justify-between">
            <div className="flex items-end space-x-5">
              <div className="relative">
                <UserAvatar
                  user={{ name: user.name, image: user.image }}
                  className="h-20 w-20"
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
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
              </div>
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
            {!isOwnProfile && (
              <FollowButton
                userId={user.id}
                isFollowing={user.isFollowing}
                followersCount={user.stats.followers}
                size="lg"
              />
            )}
          </div>

          {/* Name and Bio */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 min-w-0 flex-1 sm:mt-8">
            <div className="flex items-center justify-between">
              <h1 className="truncate text-2xl font-bold">{user.name}</h1>
              {isOwnProfile && (
                <Button
                  type={isEditing ? "submit" : "button"}
                  variant="outline"
                  size="sm"
                  onClick={() => !isEditing && setIsEditing(true)}
                >
                  {isEditing ? "Save Profile" : "Edit Profile"}
                </Button>
              )}
            </div>
            <div className="mt-4">
              {isEditing ? (
                <div>
                  <textarea
                    {...form.register("bio")}
                    className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
                    rows={3}
                    placeholder="Write a bio..."
                  />
                  {form.formState.errors.bio && (
                    <p className="mt-1 text-sm text-destructive">
                      {form.formState.errors.bio.message}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {user.bio || (isOwnProfile && "Add a bio to your profile")}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
