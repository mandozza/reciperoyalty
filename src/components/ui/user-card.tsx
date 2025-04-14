import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { cn } from "@/lib/utils";

export interface UserCardProps {
  user: {
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  };
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  return (
    <Link href={`/users/${user.id}`}>
      <Card className={cn("overflow-hidden hover:shadow-lg", className)}>
        <CardContent className="flex items-center gap-4 p-4">
          <UserAvatar
            user={{ name: user.name, image: user.image }}
            className="h-12 w-12"
          />
          <div className="flex-1 space-y-1">
            <h3 className="font-medium">{user.name}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{user.recipesCount} recipes</span>
              <span>•</span>
              <span>{user.followersCount} followers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
