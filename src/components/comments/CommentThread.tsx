"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, MoreVertical, Reply } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string
    image?: string
  }
  replies?: Comment[]
  parentId?: string
  likes: number
  isLiked?: boolean
}

interface CommentThreadProps {
  comments: Comment[]
  postId: string
  className?: string
  onAddComment?: (comment: Omit<Comment, "id" | "createdAt" | "likes">) => Promise<void>
  onAddReply?: (comment: Omit<Comment, "id" | "createdAt" | "likes">) => Promise<void>
  onLike?: (commentId: string) => Promise<void>
  onDelete?: (commentId: string) => Promise<void>
  onEdit?: (commentId: string, content: string) => Promise<void>
}

export function CommentThread({
  comments,
  postId,
  className,
  onAddComment,
  onAddReply,
  onLike,
  onDelete,
  onEdit,
}: CommentThreadProps) {
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "likes">("recent")
  const [page, setPage] = useState(1)
  const commentsPerPage = 10

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "recent") {
      return b.createdAt.getTime() - a.createdAt.getTime()
    }
    return b.likes - a.likes
  })

  const paginatedComments = sortedComments.slice(0, page * commentsPerPage)
  const hasMoreComments = paginatedComments.length < sortedComments.length

  const handleSubmitComment = async () => {
    if (!session?.user || !newComment.trim()) return

    await onAddComment?.({
      content: newComment.trim(),
      author: {
        id: session.user.id as string,
        name: session.user.name || "Anonymous",
        image: session.user.image || undefined,
      },
    })

    setNewComment("")
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session?.user || !replyContent.trim()) return

    await onAddReply?.({
      content: replyContent.trim(),
      author: {
        id: session.user.id as string,
        name: session.user.name || "Anonymous",
        image: session.user.image || undefined,
      },
      parentId,
    })

    setReplyContent("")
    setReplyingTo(null)
  }

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return
    await onEdit?.(commentId, editContent.trim())
    setEditingComment(null)
    setEditContent("")
  }

  const CommentComponent = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={cn("flex flex-col gap-2", depth > 0 && "ml-8 border-l pl-4")}>
      <div className="flex items-start gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.image} alt={comment.author.name} />
          <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.author.name}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </span>
          </div>
          {editingComment === comment.id ? (
            <div className="mt-2">
              <Textarea
                value={editContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => handleEdit(comment.id)}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingComment(null)
                    setEditContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm">{comment.content}</p>
          )}
          <div className="mt-2 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground"
              onClick={() => onLike?.(comment.id)}
            >
              {comment.isLiked ? <ChevronDown /> : <ChevronUp />}
              <span className="ml-1">{comment.likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground"
              onClick={() => setReplyingTo(comment.id)}
            >
              <Reply className="mr-1 h-4 w-4" />
              Reply
            </Button>
            {session?.user?.id === comment.author.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setEditingComment(comment.id)
                      setEditContent(comment.content)
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(comment.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          {replyingTo === comment.id && (
            <div className="mt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comments</h3>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as "recent" | "likes")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {session?.user && (
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
            <AvatarFallback>{(session.user.name?.[0] || "A").toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px]"
            />
            <Button className="mt-2" onClick={handleSubmitComment}>
              Comment
            </Button>
          </div>
        </div>
      )}
      <ScrollArea className="h-[500px]">
        <div className="flex flex-col gap-4">
          {paginatedComments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))}
        </div>
      </ScrollArea>
      {hasMoreComments && (
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Load More Comments
        </Button>
      )}
    </div>
  )
}
