"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "react-intersection-observer"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export type FeedItem = {
  id: string
  type: "recipe" | "video" | "activity"
  createdAt: Date
  author: {
    id: string
    name: string
    image?: string
  }
  content: {
    title?: string
    description?: string
    image?: string
    video?: string
    action?: string
  }
  stats: {
    likes: number
    comments: number
    saves: number
  }
  isLiked?: boolean
  isSaved?: boolean
}

interface FeedProps {
  className?: string
  initialItems?: FeedItem[]
  onLoadMore?: (lastId: string, filter: string) => Promise<FeedItem[]>
  onRefresh?: () => Promise<FeedItem[]>
  onLike?: (itemId: string) => Promise<void>
  onSave?: (itemId: string) => Promise<void>
}

export function Feed({
  className,
  initialItems = [],
  onLoadMore,
  onRefresh,
  onLike,
  onSave,
}: FeedProps) {
  const { data: session } = useSession()
  const [items, setItems] = useState<FeedItem[]>(initialItems)
  const [filter, setFilter] = useState<"following" | "popular" | "recent">("following")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref: loadMoreRef, inView } = useInView()
  const lastRefreshRef = useRef<Date>(new Date())

  // Load more items when scrolling to the bottom
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMore()
    }
  }, [inView])

  const loadMore = async () => {
    if (!onLoadMore || isLoading) return

    setIsLoading(true)
    try {
      const lastItem = items[items.length - 1]
      const newItems = await onLoadMore(lastItem?.id || "", filter)

      if (newItems.length === 0) {
        setHasMore(false)
      } else {
        setItems((prev) => [...prev, ...newItems])
      }
    } catch (error) {
      console.error("Failed to load more items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const refresh = async () => {
    if (!onRefresh || isRefreshing) return

    setIsRefreshing(true)
    try {
      const newItems = await onRefresh()
      setItems(newItems)
      lastRefreshRef.current = new Date()
      setHasMore(true)
    } catch (error) {
      console.error("Failed to refresh feed:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleLike = async (itemId: string) => {
    if (!session?.user || !onLike) return

    try {
      await onLike(itemId)
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                stats: {
                  ...item.stats,
                  likes: item.isLiked ? item.stats.likes - 1 : item.stats.likes + 1,
                },
                isLiked: !item.isLiked,
              }
            : item
        )
      )
    } catch (error) {
      console.error("Failed to like item:", error)
    }
  }

  const handleSave = async (itemId: string) => {
    if (!session?.user || !onSave) return

    try {
      await onSave(itemId)
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId
            ? {
                ...item,
                stats: {
                  ...item.stats,
                  saves: item.isSaved ? item.stats.saves - 1 : item.stats.saves + 1,
                },
                isSaved: !item.isSaved,
              }
            : item
        )
      )
    } catch (error) {
      console.error("Failed to save item:", error)
    }
  }

  const FeedItemSkeleton = () => (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16 mt-1" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          variant="ghost"
          size="icon"
          onClick={refresh}
          disabled={isRefreshing}
          className={cn("transition-transform", isRefreshing && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="flex flex-col gap-4 pb-4">
          {items.map((item) => (
            <div key={item.id} className="p-4 border rounded-lg">
              {/* Render different item types */}
              {item.type === "recipe" && (
                <div>Recipe Card Component</div>
              )}
              {item.type === "video" && (
                <div>Video Card Component</div>
              )}
              {item.type === "activity" && (
                <div>Activity Card Component</div>
              )}
            </div>
          ))}

          {/* Loading more indicator */}
          {isLoading && (
            <div className="grid gap-4">
              <FeedItemSkeleton />
              <FeedItemSkeleton />
            </div>
          )}

          {/* Load more trigger */}
          {hasMore && <div ref={loadMoreRef} className="h-1" />}

          {/* No more items indicator */}
          {!hasMore && (
            <div className="text-center text-muted-foreground py-8">
              No more items to load
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
