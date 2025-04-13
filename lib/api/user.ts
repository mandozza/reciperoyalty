import User, { IUser } from "@/models/User";
import connectDB from "@/lib/db";
import { getServerSession } from "next-auth";
import { Types } from "mongoose";

interface Recipe {
  _id: Types.ObjectId;
  title: string;
  image?: string;
  likes: number;
  cookTime: string;
  difficulty: string;
}

interface Cookbook {
  _id: Types.ObjectId;
  title: string;
  description: string;
  recipes: Types.ObjectId[];
  image?: string;
}

type LeanUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  blockedUsers: Types.ObjectId[];
};

interface PopulatedUser extends Omit<LeanUser, 'followers' | 'following' | 'blockedUsers'> {
  recipes: Recipe[];
  cookbooks: Cookbook[];
  followers: LeanUser[];
  following: LeanUser[];
  blockedUsers: LeanUser[];
}

interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
  stats: {
    recipes: number;
    followers: number;
    following: number;
  };
  recipes: {
    id: string;
    title: string;
    image?: string;
    likes: number;
    cookTime: string;
    difficulty: string;
  }[];
  cookbooks: {
    id: string;
    title: string;
    description: string;
    recipeCount: number;
    image?: string;
  }[];
  followers: {
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }[];
  following: {
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }[];
  blockedUsers?: {
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }[];
}

interface UpdateProfileData {
  bio?: string;
}

export async function getUserProfile(userId: string): Promise<UserProfileResponse | null> {
  try {
    await connectDB();

    const session = await getServerSession();
    const currentUserId = session?.user?.id;

    const user = await User.findById(userId)
      .populate<{ recipes: Recipe[] }>('recipes')
      .populate<{ cookbooks: Cookbook[] }>('cookbooks')
      .populate<{ followers: LeanUser[] }>('followers')
      .populate<{ following: LeanUser[] }>('following')
      .populate<{ blockedUsers: LeanUser[] }>('blockedUsers')
      .lean<PopulatedUser>();

    if (!user) return null;

    const isFollowing = currentUserId ? user.followers.some(
      (follower) => follower._id.toString() === currentUserId
    ) : false;

    const isBlocked = currentUserId ? user.blockedUsers.some(
      (blocked) => blocked._id.toString() === currentUserId
    ) : false;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.avatar,
      bio: user.bio,
      isFollowing,
      isBlocked,
      stats: {
        recipes: user.recipes?.length || 0,
        followers: user.followers?.length || 0,
        following: user.following?.length || 0,
      },
      recipes: user.recipes?.map((recipe) => ({
        id: recipe._id.toString(),
        title: recipe.title,
        image: recipe.image,
        likes: recipe.likes,
        cookTime: recipe.cookTime,
        difficulty: recipe.difficulty,
      })) || [],
      cookbooks: user.cookbooks?.map((cookbook) => ({
        id: cookbook._id.toString(),
        title: cookbook.title,
        description: cookbook.description,
        recipeCount: cookbook.recipes.length,
        image: cookbook.image,
      })) || [],
      followers: user.followers?.map((follower) => ({
        id: follower._id.toString(),
        name: follower.name,
        image: follower.avatar,
        recipesCount: follower.followers.length,
        followersCount: follower.followers.length,
      })) || [],
      following: user.following?.map((following) => ({
        id: following._id.toString(),
        name: following.name,
        image: following.avatar,
        recipesCount: following.followers.length,
        followersCount: following.followers.length,
      })) || [],
      blockedUsers: user.blockedUsers?.map((blocked) => ({
        id: blocked._id.toString(),
        name: blocked.name,
        image: blocked.avatar,
        recipesCount: blocked.followers.length,
        followersCount: blocked.followers.length,
      })) || [],
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, data: UpdateProfileData): Promise<UserProfileResponse | null> {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    )
    .populate<{ recipes: Recipe[] }>('recipes')
    .populate<{ cookbooks: Cookbook[] }>('cookbooks')
    .populate<{ followers: LeanUser[] }>('followers')
    .populate<{ following: LeanUser[] }>('following')
    .populate<{ blockedUsers: LeanUser[] }>('blockedUsers')
    .lean<PopulatedUser>();

    if (!updatedUser) return null;

    return getUserProfile(userId);
  } catch (error) {
    console.error('Error updating profile:', error);
    return null;
  }
}
