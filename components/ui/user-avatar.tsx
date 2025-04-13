"use client";

import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";

export interface UserAvatarProps extends AvatarProps {
  user: {
    name?: string | null;
    image?: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className, ...props }: UserAvatarProps) {
  return (
    <Avatar className={className} {...props}>
      {user.image ? (
        <AvatarImage
          alt={`${user.name || 'User'}'s avatar`}
          src={user.image}
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
