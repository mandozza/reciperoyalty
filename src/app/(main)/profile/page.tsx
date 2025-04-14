"use client";

import { useSession } from "next-auth/react";
import { UserProfileHeader } from "@/components/profile/user-profile-header";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

interface UserProfile {
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
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/users/${session.user.id}/profile`);
          if (res.ok) {
            const data = await res.json();
            setProfile(data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      }
    }

    if (session?.user?.id) {
      fetchProfile();
    }
  }, [session?.user?.id]);

  // Handle loading state
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="relative w-full">
          <Skeleton className="h-48 w-full sm:h-64" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-16 pb-8">
              <div className="flex items-end space-x-5">
                <Skeleton className="h-32 w-32 rounded-full" />
                <div className="flex min-w-0 flex-1 items-center justify-end space-x-6">
                  <div className="flex space-x-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="mt-1 h-4 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="mt-4 h-16 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Handle unauthenticated state
  if (status === "unauthenticated") {
    redirect("/auth");
  }

  // Handle missing profile
  if (!profile) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">Unable to load profile data.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <UserProfileHeader user={profile} isOwnProfile={true} />
      {/* Add profile tabs and content here */}
    </main>
  );
}
