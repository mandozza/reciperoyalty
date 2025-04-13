import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface Reaction {
  emoji: string;
  label: string;
  count: number;
}

export interface ReactionBarProps {
  reactions: Reaction[];
  onReact?: (emoji: string) => void;
  onRemoveReaction?: (emoji: string) => void;
  userReactions?: string[];
  className?: string;
}

const DEFAULT_REACTIONS = [
  { emoji: "👍", label: "Like" },
  { emoji: "❤️", label: "Love" },
  { emoji: "😋", label: "Yummy" },
  { emoji: "👨‍🍳", label: "Chef's Kiss" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "⭐", label: "Star" },
];

/**
 * ReactionBar component for displaying and managing emoji reactions
 */
export function ReactionBar({
  reactions,
  onReact,
  onRemoveReaction,
  userReactions = [],
  className,
}: ReactionBarProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = (emoji: string) => {
    if (userReactions.includes(emoji)) {
      onRemoveReaction?.(emoji);
    } else {
      onReact?.(emoji);
    }
    setShowPicker(false);
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      <AnimatePresence>
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex items-center gap-1 px-3 py-1 h-8 transition-colors",
                userReactions.includes(reaction.emoji) &&
                "bg-primary/10 border-primary/20"
              )}
              onClick={() => handleReaction(reaction.emoji)}
            >
              <span className="text-base leading-none">{reaction.emoji}</span>
              <span className="text-xs font-medium leading-none">
                {reaction.count}
              </span>
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      <Popover open={showPicker} onOpenChange={setShowPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
          >
            <span className="text-base">😀</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-2" align="start">
          <div className="grid grid-cols-3 gap-1">
            {DEFAULT_REACTIONS.map((reaction) => (
              <Button
                key={reaction.emoji}
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-auto py-2"
                onClick={() => handleReaction(reaction.emoji)}
              >
                <span className="text-2xl">{reaction.emoji}</span>
                <span className="text-xs">{reaction.label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {reactions.length > 0 && (
        <div className="text-xs text-muted-foreground ml-1">
          {reactions.reduce((sum, r) => sum + r.count, 0)} reactions
        </div>
      )}
    </div>
  );
}
