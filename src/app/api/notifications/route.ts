import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schema for marking notifications as read
const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()),
});

/**
 * GET /api/notifications
 * Get user's notifications
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const notifications = await Notification.find({ recipient: session.user.id })
      .sort({ createdAt: -1 })
      .populate("sender", "name image")
      .populate("recipe", "title slug")
      .populate("cookbook", "title slug")
      .populate("comment", "content")
      .lean();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark notifications as read
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await request.json();

    await dbConnect();

    if (action === "markAllRead") {
      await Notification.updateMany(
        { recipient: session.user.id, read: false },
        { read: true }
      );
    }

    revalidatePath("/notifications");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete notifications
 */
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const notificationId = searchParams.get("id");

    await dbConnect();

    if (all) {
      // Delete all notifications for the user
      await Notification.deleteMany({ recipient: session.user.id });
    } else if (notificationId) {
      // Delete a specific notification
      await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: session.user.id,
      });
    } else {
      return NextResponse.json(
        { error: "Missing notification ID or 'all' parameter" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete notifications" },
      { status: 500 }
    );
  }
}
