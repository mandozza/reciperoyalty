import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, ChefHat, Share2, Bookmark, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShareModal } from "./ShareModal";

export type RecipeCardVariant = "default" | "compact" | "featured" | "grid" | "list";
export type RecipeCardContent = "full" | "minimal" | "imageOnly";
export type RecipeCardInteraction = "interactive" | "readonly" | "editable";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookTime: string;
  difficulty: "easy" | "medium" | "hard";
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  variant?: RecipeCardVariant;
  contentStyle?: RecipeCardContent;
  interaction?: RecipeCardInteraction;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

/**
 * RecipeCard component displays a recipe preview with image, title, description, and actions
 * Supports multiple visual variants, content styles, and interaction modes
 * @param props RecipeCardProps containing recipe information and display options
 * @returns A recipe card component
 */
export function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  cookTime,
  difficulty,
  likes,
  isLiked = false,
  isSaved = false,
  variant = "default",
  contentStyle = "full",
  interaction = "interactive",
  onLike,
  onSave,
  onShare,
  onEdit,
  className,
}: RecipeCardProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const difficultyColor = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  const handleShare = (recipeId: string) => {
    setIsShareModalOpen(true);
    onShare?.(recipeId);
  };

  // Variant-specific styles
  const variantStyles = {
    default: "w-full max-w-sm",
    compact: "w-full max-w-xs",
    featured: "w-full max-w-2xl",
    grid: "w-full",
    list: "w-full flex flex-row items-start",
  };

  // Content-specific layouts
  const contentStyles = {
    full: "",
    minimal: "space-y-1",
    imageOnly: "relative group",
  };

  // Determine if actions should be shown based on interaction mode
  const showActions = interaction !== "readonly";
  const showEditButton = interaction === "editable";

  // List variant specific image size
  const imageContainerClass = variant === "list"
    ? "w-32 h-32 shrink-0"
    : "aspect-video w-full";

  return (
    <>
      <Card
        className={cn(
          "overflow-hidden",
          variantStyles[variant],
          contentStyles[contentStyle],
          className
        )}
      >
        <CardHeader className={cn(
          "p-0",
          variant === "list" && "flex-row gap-4"
        )}>
          <div className={cn("relative overflow-hidden", imageContainerClass)}>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={cn(
                "object-cover transition-transform",
                contentStyle !== "imageOnly" && "hover:scale-105"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {contentStyle === "imageOnly" && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <h3 className="text-white text-lg font-semibold px-4 text-center">{title}</h3>
              </div>
            )}
          </div>
        </CardHeader>
        {contentStyle !== "imageOnly" && (
          <CardContent className={cn(
            "space-y-2",
            variant === "compact" ? "p-2" : "p-4",
            variant === "featured" && "md:text-lg"
          )}>
            <div className="flex items-center justify-between">
              <h3 className={cn(
                "line-clamp-1 font-semibold",
                variant === "featured" ? "text-xl" : "text-lg"
              )}>{title}</h3>
              {contentStyle === "full" && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{cookTime}</span>
                </div>
              )}
            </div>
            {(contentStyle === "full" || variant === "featured") && (
              <p className={cn(
                "text-sm text-muted-foreground",
                variant === "featured" ? "line-clamp-3" : "line-clamp-2"
              )}>{description}</p>
            )}
            {contentStyle === "full" && (
              <div className="flex items-center gap-2">
                <ChefHat className={cn("h-4 w-4", difficultyColor[difficulty])} />
                <span className={cn("text-sm capitalize", difficultyColor[difficulty])}>
                  {difficulty}
                </span>
              </div>
            )}
          </CardContent>
        )}
        {showActions && contentStyle !== "imageOnly" && (
          <CardFooter className={cn(
            "flex justify-between gap-2 border-t",
            variant === "compact" ? "p-2" : "p-4"
          )}>
            <div className="flex gap-2">
              {interaction === "interactive" && (
                <>
                  <Button
                    variant="ghost"
                    size={variant === "compact" ? "sm" : "default"}
                    className={cn(
                      "gap-2",
                      isLiked && "text-red-500 hover:text-red-600"
                    )}
                    onClick={() => onLike?.(id)}
                  >
                    <Heart className="h-4 w-4" fill={isLiked ? "currentColor" : "none"} />
                    <span>{likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size={variant === "compact" ? "sm" : "default"}
                    className={cn(
                      "gap-2",
                      isSaved && "text-blue-500 hover:text-blue-600"
                    )}
                    onClick={() => onSave?.(id)}
                  >
                    <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                    <span>Save</span>
                  </Button>
                </>
              )}
              {showEditButton && (
                <Button
                  variant="ghost"
                  size={variant === "compact" ? "sm" : "default"}
                  className="gap-2"
                  onClick={() => onEdit?.(id)}
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </Button>
              )}
            </div>
            {interaction === "interactive" && (
              <Button
                variant="ghost"
                size={variant === "compact" ? "sm" : "default"}
                className="gap-2"
                onClick={() => handleShare(id)}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title={title}
        recipeId={id}
      />
    </>
  );
}
