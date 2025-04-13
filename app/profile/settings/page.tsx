import { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { AccountSettings } from "@/components/settings/account-settings"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { PrivacySettings } from "@/components/settings/privacy-settings"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Settings | Recipe Royalty",
  description: "Manage your Recipe Royalty account settings",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings user={user} />
          </TabsContent>
          <TabsContent value="account" className="space-y-6">
            <AccountSettings user={user} />
          </TabsContent>
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings user={user} />
          </TabsContent>
          <TabsContent value="privacy" className="space-y-6">
            <PrivacySettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
