import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { uploadImage } from "@/lib/uploadImage";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.id !== params.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "avatar" | "cover";

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    if (!type || !["avatar", "cover"].includes(type)) {
      return new NextResponse("Invalid type", { status: 400 });
    }

    const imageUrl = await uploadImage(file);

    const updateData = type === "avatar"
      ? { image: imageUrl }
      : { coverImage: imageUrl };

    const user = await db.user.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      [type === "avatar" ? "image" : "coverImage"]: imageUrl,
    });
  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
