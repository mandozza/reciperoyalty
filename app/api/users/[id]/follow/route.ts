import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/user";

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
    const currentUserId = session.user.id;

    // Prevent self-following
    if (targetUserId === currentUserId) {
      return new NextResponse("Cannot follow yourself", { status: 400 });
    }

    await connectToDatabase();

    // Get both users
    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(currentUserId),
    ]);

    if (!targetUser || !currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, {
          $pull: { following: targetUserId },
        }),
        User.findByIdAndUpdate(targetUserId, {
          $pull: { followers: currentUserId },
        }),
      ]);
    } else {
      // Follow
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, {
          $addToSet: { following: targetUserId },
        }),
        User.findByIdAndUpdate(targetUserId, {
          $addToSet: { followers: currentUserId },
        }),
      ]);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        isFollowing: !isFollowing,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[FOLLOW_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
