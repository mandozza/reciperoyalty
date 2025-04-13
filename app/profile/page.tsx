"use client";

import { useSession } from "next-auth/react";
import { UserProfileHeader } from "@/components/profile/user-profile-header";

export default function ProfilePage() {
  const { data: session } = useSession();

  // Mock user data - replace with actual data from your API
  const mockUser = {
    id: session?.user?.id || "1",
    name: session?.user?.name || "Guest User",
    image: session?.user?.image,
    bio: "I love cooking and sharing recipes with the community! 🍳",
    stats: {
      recipes: 42,
      followers: 1337,
      following: 420,
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <UserProfileHeader user={mockUser} isOwnProfile={true} />
      {/* Add profile tabs and content here */}
    </main>
  );
}
