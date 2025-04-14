import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db/connect";
import User from "@/models/User";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow users to update their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "avatar" | "cover";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!type || !["avatar", "cover"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Upload to blob storage
    const filename = `${type}-${nanoid()}-${file.name}`;
    const blob = await put(filename, file, {
      access: "public",
    });

    // Update user in database
    await dbConnect();
    const updateField = type === "avatar" ? "image" : "coverImage";
    await User.findByIdAndUpdate(params.id, {
      [updateField]: blob.url,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Error uploading file" },
      { status: 500 }
    );
  }
}
