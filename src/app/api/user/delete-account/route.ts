import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/models/User"
import Recipe from "@/models/Recipe"
import Comment from "@/models/Comment"
import Cookbook from "@/models/Cookbook"
import type { IUser } from "@/models/User"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Find the user
    const user = await User.findOne({ email: session.user.email })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Delete all user's recipes
    await Recipe.deleteMany({ author: user._id })

    // Delete all user's cookbooks
    await Cookbook.deleteMany({ author: user._id })

    // Delete all comments by the user
    await Comment.deleteMany({ author: user._id })

    // Remove user from other users' followers/following lists
    await User.updateMany(
      { $or: [{ followers: user._id }, { following: user._id }] },
      {
        $pull: {
          followers: user._id,
          following: user._id
        }
      }
    )

    // Finally delete the user
    await User.findByIdAndDelete(user._id)

    return new NextResponse("Account deleted successfully", { status: 200 })
  } catch (error) {
    console.error("Error deleting account:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
