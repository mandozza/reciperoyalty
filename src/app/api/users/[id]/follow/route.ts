import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userToFollowId = params.id;

    // Prevent following yourself
    if (session.user.id === userToFollowId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get both users
    const currentUser = await User.findById(Types.ObjectId.createFromHexString(session.user.id as string));
    const userToFollow = await User.findById(Types.ObjectId.createFromHexString(userToFollowId));

    if (!currentUser || !userToFollow) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already following
    if (currentUser.isFollowing(userToFollow._id)) {
      return NextResponse.json(
        { error: "Already following this user" },
        { status: 400 }
      );
    }

    // Follow user
    await currentUser.follow(userToFollow._id);

    return NextResponse.json(
      { message: "Successfully followed user" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json(
      { error: "Failed to follow user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userToUnfollowId = params.id;

    // Prevent unfollowing yourself
    if (session.user.id === userToUnfollowId) {
      return NextResponse.json(
        { error: "Cannot unfollow yourself" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get both users
    const currentUser = await User.findById(Types.ObjectId.createFromHexString(session.user.id as string));
    const userToUnfollow = await User.findById(Types.ObjectId.createFromHexString(userToUnfollowId));

    if (!currentUser || !userToUnfollow) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if not following
    if (!currentUser.isFollowing(userToUnfollow._id)) {
      return NextResponse.json(
        { error: "Not following this user" },
        { status: 400 }
      );
    }

    // Unfollow user
    await currentUser.unfollow(userToUnfollow._id);

    return NextResponse.json(
      { message: "Successfully unfollowed user" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unfollow error:", error);
    return NextResponse.json(
      { error: "Failed to unfollow user" },
      { status: 500 }
    );
  }
}
