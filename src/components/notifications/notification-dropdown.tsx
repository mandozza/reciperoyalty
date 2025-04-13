import * as React from "react";
import { Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationItem } from "./notification-item";
import { Badge } from "@/components/ui/badge";
import { NotificationType } from "@/models/Notification";

interface Notification {
  id: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  recipe?: {
    title: string;
    slug: string;
  };
  comment?: {
    content: string;
  };
  cookbook?: {
    title: string;
  };
}

async function fetchNotifications(page = 1) {
  const res = await fetch(`/api/notifications?page=${page}&limit=20`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

async function markAsRead(notificationIds: string[]) {
  const res = await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationIds }),
  });
  if (!res.ok) throw new Error("Failed to mark notifications as read");
  return res.json();
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Mark notifications as read when opening the dropdown
  React.useEffect(() => {
    if (isOpen && data?.notifications?.some((n: Notification) => !n.read)) {
      const unreadIds = data.notifications
        .filter((n: Notification) => !n.read)
        .map((n: Notification) => n.id);
      markAsReadMutation.mutate(unreadIds);
    }
  }, [isOpen, data?.notifications, markAsReadMutation]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5" />
          {data?.unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {data.unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h4 className="font-medium">Notifications</h4>
          {data?.unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAsReadMutation.mutate([])}
              disabled={markAsReadMutation.isPending}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-20rem)] p-2">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="mb-2 flex items-center gap-4 px-2 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))
          ) : data?.notifications?.length > 0 ? (
            data.notifications.map((notification: Notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
