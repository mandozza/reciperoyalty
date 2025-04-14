import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { CookbookCard } from "@/components/cookbooks/cookbook-card";
import { FollowerList } from "@/components/social/follower-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { User } from "@/types/user";

interface UserProfileTabsProps {
  user: User;
  className?: string;
  defaultTab?: "recipes" | "cookbooks" | "followers" | "following";
}

function TabSkeleton() {
  return (
    <div className="space-y-3">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserProfileTabs({
  user,
  className,
  defaultTab = "recipes"
}: UserProfileTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className={cn("w-full", className)}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="recipes" className="flex items-center gap-2">
          Recipes
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {user.recipes.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="cookbooks" className="flex items-center gap-2">
          Cookbooks
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {user.cookbooks.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="followers" className="flex items-center gap-2">
          Followers
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {user.followers.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="following" className="flex items-center gap-2">
          Following
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
            {user.following.length}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="recipes" className="mt-6 min-h-[400px]">
        {user.recipes.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="transition-transform hover:scale-[1.02]"
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No recipes yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="cookbooks" className="mt-6 min-h-[400px]">
        {user.cookbooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {user.cookbooks.map((cookbook) => (
              <CookbookCard
                key={cookbook.id}
                cookbook={cookbook}
                className="transition-transform hover:scale-[1.02]"
              />
            ))}
          </div>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <p className="text-sm text-muted-foreground">No cookbooks yet</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="followers" className="mt-6 min-h-[400px]">
        <FollowerList
          users={user.followers.map(follower => ({
            id: follower.id,
            name: follower.name,
            image: follower.image,
            recipesCount: follower.recipesCount,
            followersCount: follower.followersCount,
          }))}
          emptyMessage="No followers yet"
        />
      </TabsContent>

      <TabsContent value="following" className="mt-6 min-h-[400px]">
        <FollowerList
          users={user.following.map(following => ({
            id: following.id,
            name: following.name,
            image: following.image,
            recipesCount: following.recipesCount,
            followersCount: following.followersCount,
          }))}
          emptyMessage="Not following anyone yet"
        />
      </TabsContent>
    </Tabs>
  );
}
