export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  coverImage?: string;
  bio?: string;
  isFollowing?: boolean;
  isBlocked?: boolean;
  stats: {
    recipes: number;
    followers: number;
    following: number;
  };
  recipes: Array<{
    id: string;
    title: string;
    image?: string;
    likes: number;
    cookTime: string;
    difficulty: string;
  }>;
  cookbooks: Array<{
    id: string;
    title: string;
    description: string;
    recipeCount: number;
    image?: string;
  }>;
  followers: Array<{
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }>;
  following: Array<{
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }>;
  blockedUsers?: Array<{
    id: string;
    name: string;
    image?: string;
    recipesCount: number;
    followersCount: number;
  }>;
}
