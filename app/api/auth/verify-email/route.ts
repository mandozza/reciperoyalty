import { NextResponse } from "next/server";
import { z } from "zod";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { createHash } from "crypto";

// Validation schema for email verification
const verifyEmailSchema = z.object({
  token: z.string(),
});

// Helper to create verification token
export function createVerificationToken(email: string) {
  const token = createHash("sha256")
    .update(email + process.env.NEXTAUTH_SECRET)
    .digest("hex");
  return token;
}

export async function POST(req: Request) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const result = verifyEmailSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { token } = result.data;

    // Get current user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to database
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify token
    const expectedToken = createVerificationToken(user.email);
    if (token !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Update user's email verification status
    user.emailVerified = new Date();
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
