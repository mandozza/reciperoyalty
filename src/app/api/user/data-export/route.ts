import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/models/User"
import Recipe from "@/models/Recipe"
import Comment from "@/models/Comment"
import Cookbook from "@/models/Cookbook"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user
    const user = await User.findOne({ email: session.user.email })
      .select("-password")
      .lean()

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Gather user's data
    const [recipes, comments, cookbooks] = await Promise.all([
      Recipe.find({ author: user._id }).lean(),
      Comment.find({ author: user._id }).lean(),
      Cookbook.find({ author: user._id }).lean(),
    ])

    // Compile user data
    const userData = {
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio,
        image: user.image,
        coverImage: user.coverImage,
        createdAt: user.createdAt,
        stats: {
          recipes: recipes.length,
          followers: user.followers?.length || 0,
          following: user.following?.length || 0,
        },
      },
      preferences: {
        notifications: user.notificationPreferences,
        privacy: user.privacyPreferences,
      },
      content: {
        recipes: recipes.map(recipe => ({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookTime: recipe.cookTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          createdAt: recipe.createdAt,
        })),
        comments: comments.map(comment => ({
          content: comment.content,
          createdAt: comment.createdAt,
          recipe: comment.recipe,
        })),
        cookbooks: cookbooks.map(cookbook => ({
          title: cookbook.title,
          description: cookbook.description,
          recipes: cookbook.recipes,
          createdAt: cookbook.createdAt,
        })),
      },
    }

    return NextResponse.json({
      message: "Data export successful",
      data: userData,
    })
  } catch (error) {
    console.error("Error exporting user data:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
