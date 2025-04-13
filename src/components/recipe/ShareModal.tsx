import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Twitter,
  Facebook,
  Linkedin,
  Mail,
  Link2,
  Copy,
  Check,
} from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  recipeId: string;
}

/**
 * ShareModal component provides social media sharing options and link copying functionality
 */
export function ShareModal({ isOpen, onClose, title, recipeId }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // In a real app, this would be a dynamic URL based on your deployment
  const recipeUrl = `https://reciperoyalty.com/recipe/${recipeId}`;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=Check out this recipe: ${title}&url=${encodeURIComponent(recipeUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(recipeUrl)}`,
    email: `mailto:?subject=Check out this recipe: ${title}&body=I found this amazing recipe: ${recipeUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(recipeUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The recipe link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    window.open(shareUrls[platform], "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-5 w-5" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-5 w-5" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-5 w-5" />
              <span className="text-xs">LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 p-4"
              onClick={() => handleShare("email")}
            >
              <Mail className="h-5 w-5" />
              <span className="text-xs">Email</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={recipeUrl}
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="icon"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
