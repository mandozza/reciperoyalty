import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const targetUserId = params.id;
    const currentUserId = session.user.id as string;

    // Prevent self-blocking
    if (targetUserId === currentUserId) {
      return new NextResponse("Cannot block yourself", { status: 400 });
    }

    await connectDB();

    // Convert string IDs to ObjectIds
    const targetObjectId = new Types.ObjectId(targetUserId);
    const currentObjectId = new Types.ObjectId(currentUserId);

    // Get both users
    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetObjectId),
      User.findById(currentObjectId),
    ]);

    if (!targetUser || !currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if already blocked
    if (currentUser.isBlocked(targetUser._id)) {
      return new NextResponse("User is already blocked", { status: 400 });
    }

    // Block user
    await currentUser.block(targetUser._id);

    return NextResponse.json(
      { message: "User blocked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOCK_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const targetUserId = params.id;
    const currentUserId = session.user.id as string;

    await connectDB();

    // Convert string IDs to ObjectIds
    const targetObjectId = new Types.ObjectId(targetUserId);
    const currentObjectId = new Types.ObjectId(currentUserId);

    // Get both users
    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetObjectId),
      User.findById(currentObjectId),
    ]);

    if (!targetUser || !currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if not blocked
    if (!currentUser.isBlocked(targetUser._id)) {
      return new NextResponse("User is not blocked", { status: 400 });
    }

    // Unblock user
    await currentUser.unblock(targetUser._id);

    return NextResponse.json(
      { message: "User unblocked successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[UNBLOCK_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
