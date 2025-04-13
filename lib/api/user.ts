import { User } from "@/types/user";
import { db } from "@/lib/db";

export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        recipes: {
          select: {
            id: true,
            title: true,
            image: true,
            likes: true,
            cookTime: true,
            difficulty: true,
          },
        },
        cookbooks: {
          select: {
            id: true,
            title: true,
            description: true,
            recipeCount: true,
            image: true,
          },
        },
        followers: {
          select: {
            id: true,
            name: true,
            image: true,
            recipesCount: true,
            followersCount: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            recipesCount: true,
            followersCount: true,
          },
        },
        _count: {
          select: {
            recipes: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      coverImage: user.coverImage,
      bio: user.bio,
      stats: {
        recipes: user._count.recipes,
        followers: user._count.followers,
        following: user._count.following,
      },
      recipes: user.recipes,
      cookbooks: user.cookbooks,
      followers: user.followers,
      following: user.following,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

interface UpdateProfileData {
  bio?: string;
}

export async function updateProfile(userId: string, data: UpdateProfileData): Promise<User | null> {
  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        bio: data.bio,
      },
      include: {
        recipes: {
          select: {
            id: true,
            title: true,
            image: true,
            likes: true,
            cookTime: true,
            difficulty: true,
          },
        },
        cookbooks: {
          select: {
            id: true,
            title: true,
            description: true,
            recipeCount: true,
            image: true,
          },
        },
        followers: {
          select: {
            id: true,
            name: true,
            image: true,
            recipesCount: true,
            followersCount: true,
          },
        },
        following: {
          select: {
            id: true,
            name: true,
            image: true,
            recipesCount: true,
            followersCount: true,
          },
        },
        _count: {
          select: {
            recipes: true,
            followers: true,
            following: true,
          },
        },
      },
    });

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image,
      coverImage: updatedUser.coverImage,
      bio: updatedUser.bio,
      stats: {
        recipes: updatedUser._count.recipes,
        followers: updatedUser._count.followers,
        following: updatedUser._count.following,
      },
      recipes: updatedUser.recipes,
      cookbooks: updatedUser.cookbooks,
      followers: updatedUser.followers,
      following: updatedUser.following,
    };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}
