import { NextResponse } from "next/server"
import { z } from "zod"
import { getCurrentUser } from "@/lib/session"
import { User } from "@/models/User"

const privacyPreferenceSchema = z.object({
  preferenceId: z.string(),
  enabled: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = privacyPreferenceSchema.parse(body)

    // Update privacy preference
    await User.findByIdAndUpdate(user.id, {
      $set: {
        [`privacyPreferences.${validatedData.preferenceId}`]: validatedData.enabled,
      },
    })

    return new NextResponse("Privacy preference updated successfully", { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
