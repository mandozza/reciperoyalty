import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User, { IUser } from "@/models/User";
import dbConnect from "@/lib/db/connect";
import { Types } from "mongoose";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(params.id).select("-password").lean<IUser & { _id: Types.ObjectId }>();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user stats
    const stats = {
      recipes: await User.countDocuments({ author: user._id }),
      followers: user.followers?.length || 0,
      following: user.following?.length || 0,
    };

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      image: user.image || user.avatar,
      bio: user.bio || "",
      stats,
      isFollowing: false, // Not applicable for own profile
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
