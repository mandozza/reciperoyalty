import { Metadata } from "next";
import { notFound } from "next/navigation";
import { UserProfileHeader } from "@/components/profile/user-profile-header";
import { UserProfileTabs } from "@/components/profile/user-profile-tabs";
import { getCurrentUser } from "@/lib/session";
import { getUserProfile } from "@/lib/api/user";
import { User } from "@/types/user";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const profile = await getUserProfile(params.id);

  if (!profile) {
    return {
      title: "User Not Found",
    };
  }

  return {
    title: `${profile.name} - Recipe Royalty`,
    description: profile.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const [currentUser, profile] = await Promise.all([
    getCurrentUser(),
    getUserProfile(params.id),
  ]);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <main className="min-h-screen pb-8">
      <UserProfileHeader
        user={{
          id: profile.id,
          name: profile.name,
          image: profile.image,
          coverImage: profile.coverImage,
          bio: profile.bio,
          stats: {
            recipes: profile.stats.recipes,
            followers: profile.stats.followers,
            following: profile.stats.following,
          },
        }}
        isOwnProfile={isOwnProfile}
      />
      <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="space-y-3">
            <div className="h-10 w-full rounded-lg bg-muted" />
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
        }>
          <UserProfileTabs user={profile} />
        </Suspense>
      </div>
    </main>
  );
}
