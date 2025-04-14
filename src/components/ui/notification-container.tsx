"use client";

import { useNotificationStore } from "@/lib/stores/notification-store"
import { NotificationToast } from "./notification-toast"

/**
 * Container component that displays all active notifications
 * Should be placed at the root level of your app
 */
export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore()

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed right-4 top-4 z-50 flex flex-col gap-4 md:right-6 md:top-6"
    >
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
