import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { cn } from "@/lib/utils"

interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  name?: string | null
  image?: string | null
  className?: string
}

export function UserAvatar({ name, image, className, ...props }: UserAvatarProps) {
  return (
    <Avatar className={cn("", className)} {...props}>
      {image ? (
        <AvatarImage alt={name ?? ""} src={image} />
      ) : (
        <AvatarFallback>
          {name
            ? name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
            : null}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
