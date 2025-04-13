"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Facebook,
  Twitter,
  Instagram,
  Link2,
  Copy,
  Share2,
  MessageCircle,
  Mail,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  url: string
  image?: string
  onShare?: (platform: string) => void
}

interface ShareOption {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  shareUrl: (params: { url: string; title: string; description?: string }) => string
}

const shareOptions: ShareOption[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-[#1877F2] hover:bg-[#0C63D4]",
    shareUrl: ({ url }) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "bg-[#1DA1F2] hover:bg-[#0C85D0]",
    shareUrl: ({ url, title }) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title
      )}`,
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366] hover:bg-[#128C7E]",
    shareUrl: ({ url, title }) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    color: "bg-gray-600 hover:bg-gray-700",
    shareUrl: ({ url, title, description }) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
        `${description}\n\n${url}`
      )}`,
  },
]

export function ShareDialog({
  open,
  onOpenChange,
  title,
  description,
  url,
  image,
  onShare,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async (platform: string) => {
    // Try native share API first
    if (platform === "native" && typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        })
        onShare?.("native")
        onOpenChange(false)
        return
      } catch (error) {
        // Fall back to regular share options
        console.error("Failed to use native share:", error)
      }
    }

    // Platform-specific sharing
    const option = shareOptions.find((opt) => opt.id === platform)
    if (option) {
      window.open(
        option.shareUrl({ url, title, description }),
        "_blank",
        "noopener,noreferrer"
      )
      onShare?.(platform)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy link")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* Link sharing */}
          <div className="flex gap-2">
            <Input
              value={url}
              readOnly
              className="flex-1"
              onClick={(e: React.MouseEvent<HTMLInputElement>) => e.currentTarget.select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className={cn(
                "transition-colors",
                copied && "bg-green-500 text-white hover:bg-green-600"
              )}
            >
              {copied ? <Copy className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Native share button */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              onClick={() => handleShare("native")}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}

          {/* Social sharing options */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {shareOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={cn("w-full text-white", option.color)}
                onClick={() => handleShare(option.id)}
              >
                <option.icon className="mr-2 h-4 w-4" />
                {option.name}
              </Button>
            ))}
          </div>

          {/* Preview */}
          {image && (
            <div className="mt-4 rounded-lg overflow-hidden">
              <img src={image} alt={title} className="w-full h-32 object-cover" />
              <div className="p-2 bg-muted">
                <h3 className="font-semibold truncate">{title}</h3>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
