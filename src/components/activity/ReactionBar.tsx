"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export type Reaction = {
  type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'
  count: number
  reacted?: boolean
}

interface ReactionBarProps {
  reactions: Reaction[]
  onReact: (type: Reaction['type']) => void
  className?: string
}

const reactionEmojis = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
}

const reactionLabels = {
  like: 'Like',
  love: 'Love',
  haha: 'Haha',
  wow: 'Wow',
  sad: 'Sad',
  angry: 'Angry'
}

export function ReactionBar({ reactions, onReact, className = '' }: ReactionBarProps) {
  const [showPicker, setShowPicker] = useState(false)

  const formatReactionSummary = (reactions: Reaction[]) => {
    const activeReactions = reactions.filter(r => r.count > 0)
    if (activeReactions.length === 0) return ''

    if (activeReactions.length === 1) {
      const reaction = activeReactions[0]
      return `${reaction.count} ${reactionLabels[reaction.type]}${reaction.count > 1 ? 's' : ''}`
    }

    if (activeReactions.length === 2) {
      return `${activeReactions[0].count} ${reactionLabels[activeReactions[0].type]}${activeReactions[0].count > 1 ? 's' : ''} and ${activeReactions[1].count} ${reactionLabels[activeReactions[1].type]}${activeReactions[1].count > 1 ? 's' : ''}`
    }

    const first = activeReactions[0]
    const second = activeReactions[1]
    const remaining = activeReactions.length - 2
    return `${first.count} ${reactionLabels[first.type]}${first.count > 1 ? 's' : ''}, ${second.count} ${reactionLabels[second.type]}${second.count > 1 ? 's' : ''} and ${remaining} other${remaining > 1 ? 's' : ''}`
  }

  const getDetailedReactionSummary = () => {
    return reactions
      .filter(r => r.count > 0)
      .map(r => `${r.count} ${reactionLabels[r.type]}${r.count > 1 ? 's' : ''}`)
      .join('\n')
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {reactionEmojis.like}
              </button>
            </TooltipTrigger>
            <TooltipContent>Add reaction</TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute bottom-full left-0 mb-2 flex gap-1 p-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700"
              >
                {Object.entries(reactionEmojis).map(([type, emoji]) => (
                  <Tooltip key={type}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          onReact(type as Reaction['type'])
                          setShowPicker(false)
                        }}
                        className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        {emoji}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{reactionLabels[type as keyof typeof reactionLabels]}</TooltipContent>
                  </Tooltip>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {reactions.some(r => r.count > 0) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatReactionSummary(reactions)}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <pre className="text-sm">{getDetailedReactionSummary()}</pre>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
