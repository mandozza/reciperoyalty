import { NextResponse } from "next/server"
import { z } from "zod"
import { hash, compare } from "bcryptjs"
import { getCurrentUser } from "@/lib/session"
import { User } from "@/models/User"

const passwordUpdateSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = passwordUpdateSchema.parse(body)

    // Verify current password
    const dbUser = await User.findById(user.id).select("+password")
    if (!dbUser?.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    const isPasswordValid = await compare(validatedData.currentPassword, dbUser.password)
    if (!isPasswordValid) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hash(validatedData.newPassword, 12)

    // Update password
    await User.findByIdAndUpdate(user.id, {
      password: hashedPassword,
    })

    return new NextResponse("Password updated successfully", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
