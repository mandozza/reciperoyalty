"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User } from "@/types/user"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PrivacySettingsProps {
  user: User
}

interface PrivacyPreference {
  id: string
  title: string
  description: string
  defaultEnabled: boolean
}

const privacySettings: PrivacyPreference[] = [
  {
    id: "profile_visibility",
    title: "Public Profile",
    description: "Make your profile visible to everyone",
    defaultEnabled: true,
  },
  {
    id: "recipe_visibility",
    title: "Public Recipes",
    description: "Make your recipes visible to everyone by default",
    defaultEnabled: true,
  },
  {
    id: "show_email",
    title: "Show Email",
    description: "Show your email address on your public profile",
    defaultEnabled: false,
  },
  {
    id: "allow_mentions",
    title: "Allow Mentions",
    description: "Allow other users to mention you in comments and posts",
    defaultEnabled: true,
  },
  {
    id: "show_activity",
    title: "Activity Visibility",
    description: "Show your activity (likes, comments, etc.) to other users",
    defaultEnabled: true,
  },
]

const dataSettings: PrivacyPreference[] = [
  {
    id: "personalized_content",
    title: "Personalized Content",
    description: "Allow us to personalize your content based on your activity",
    defaultEnabled: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Allow us to collect analytics data to improve our service",
    defaultEnabled: true,
  },
  {
    id: "third_party_sharing",
    title: "Third-Party Sharing",
    description: "Allow sharing of non-personal data with trusted partners",
    defaultEnabled: false,
  },
]

export function PrivacySettings({ user }: PrivacySettingsProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function updatePrivacyPreference(id: string, enabled: boolean) {
    setUpdatingId(id)
    try {
      const response = await fetch("/api/user/privacy-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferenceId: id,
          enabled,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update privacy preference")
      }

      toast.success("Privacy preference updated")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update privacy preference")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control who can see your content and how it's shared
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {privacySettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <Label htmlFor={setting.id}>{setting.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                defaultChecked={setting.defaultEnabled}
                disabled={updatingId === setting.id}
                onCheckedChange={(checked) =>
                  updatePrivacyPreference(setting.id, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Personalization</CardTitle>
          <CardDescription>
            Manage how your data is collected and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dataSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <Label htmlFor={setting.id}>{setting.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {setting.description}
                </p>
              </div>
              <Switch
                id={setting.id}
                defaultChecked={setting.defaultEnabled}
                disabled={updatingId === setting.id}
                onCheckedChange={(checked) =>
                  updatePrivacyPreference(setting.id, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>
            Download a copy of your personal data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You can request a copy of your personal data at any time. The export will include your profile information,
            recipes, comments, and other data associated with your account.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              try {
                const response = await fetch("/api/user/data-export", {
                  method: "POST",
                })

                if (!response.ok) {
                  throw new Error("Failed to export data")
                }

                const data = await response.json()

                // Create a downloadable file
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `recipe-royalty-data-${new Date().toISOString().split("T")[0]}.json`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)

                toast.success("Data exported successfully")
              } catch (error) {
                toast.error("Failed to export data")
              }
            }}
          >
            Export Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
