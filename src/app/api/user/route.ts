import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session"
import { updateProfile } from "@/lib/api/user"

const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .refine(
      (bio) => {
        const words = bio.trim().split(/\s+/);
        return words.length <= 100;
      },
      { message: "Bio cannot exceed 100 words" }
    )
    .refine(
      (bio) => !bio.includes("http") && !bio.includes("www."),
      { message: "Bio cannot contain URLs" }
    )
    .refine(
      (bio) => !/[<>{}]/.test(bio),
      { message: "Bio cannot contain HTML or special characters" }
    )
    .transform((bio) => bio.trim())
    .optional(),
})

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileUpdateSchema.parse(body)

    const updatedUser = await updateProfile(user.id, validatedData)

    if (!updatedUser) {
      return new NextResponse("Failed to update profile", { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
