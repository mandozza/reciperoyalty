"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User } from "@/types/user"
import { useRouter } from "next/navigation"

interface NotificationSettingsProps {
  user: User
}

interface NotificationPreference {
  id: string
  title: string
  description: string
  defaultEnabled: boolean
}

const emailNotifications: NotificationPreference[] = [
  {
    id: "new_follower",
    title: "New Followers",
    description: "Email me when someone follows me",
    defaultEnabled: true,
  },
  {
    id: "new_comment",
    title: "New Comments",
    description: "Email me when someone comments on my recipes",
    defaultEnabled: true,
  },
  {
    id: "recipe_likes",
    title: "Recipe Likes",
    description: "Email me when someone likes my recipes",
    defaultEnabled: false,
  },
  {
    id: "newsletter",
    title: "Newsletter",
    description: "Receive our weekly newsletter with cooking tips and featured recipes",
    defaultEnabled: true,
  },
]

const pushNotifications: NotificationPreference[] = [
  {
    id: "push_new_follower",
    title: "New Followers",
    description: "Send push notifications when someone follows me",
    defaultEnabled: true,
  },
  {
    id: "push_new_comment",
    title: "New Comments",
    description: "Send push notifications for new comments on my recipes",
    defaultEnabled: true,
  },
  {
    id: "push_recipe_likes",
    title: "Recipe Likes",
    description: "Send push notifications when someone likes my recipes",
    defaultEnabled: true,
  },
  {
    id: "push_mentions",
    title: "Mentions",
    description: "Send push notifications when someone mentions me",
    defaultEnabled: true,
  },
]

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function updateNotificationPreference(id: string, enabled: boolean) {
    setUpdatingId(id)
    try {
      const response = await fetch("/api/user/notification-preferences", {
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
        throw new Error("Failed to update notification preference")
      }

      toast.success("Notification preference updated")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update notification preference")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what emails you'd like to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {emailNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <Label htmlFor={notification.id}>{notification.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <Switch
                id={notification.id}
                defaultChecked={notification.defaultEnabled}
                disabled={updatingId === notification.id}
                onCheckedChange={(checked) =>
                  updateNotificationPreference(notification.id, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Manage your push notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {pushNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="space-y-1">
                <Label htmlFor={notification.id}>{notification.title}</Label>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
              <Switch
                id={notification.id}
                defaultChecked={notification.defaultEnabled}
                disabled={updatingId === notification.id}
                onCheckedChange={(checked) =>
                  updateNotificationPreference(notification.id, checked)
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
