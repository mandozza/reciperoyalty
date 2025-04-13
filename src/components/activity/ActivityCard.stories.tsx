import type { Meta, StoryObj } from "@storybook/react";
import { ActivityCard } from "./ActivityCard";

const meta: Meta<typeof ActivityCard> = {
  title: "Components/Activity/ActivityCard",
  component: ActivityCard,
  tags: ["autodocs"],
  args: {
    id: "1",
    user: {
      id: "user1",
      name: "John Doe",
      avatarUrl: "https://github.com/shadcn.png",
    },
    timestamp: new Date(),
    onLike: () => console.log("Liked"),
    onComment: () => console.log("Comment clicked"),
    onShare: () => console.log("Share clicked"),
    onUserClick: (userId) => console.log("User clicked:", userId),
    onReact: (emoji) => console.log("Added reaction:", emoji),
    onRemoveReaction: (emoji) => console.log("Removed reaction:", emoji),
  },
};

export default meta;
type Story = StoryObj<typeof ActivityCard>;

export const RecipeCreated: Story = {
  args: {
    type: "recipe_created",
    context: {
      recipeName: "Homemade Pizza Margherita",
    },
    preview: {
      type: "image",
      content: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
      thumbnailUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 12 },
      { emoji: "❤️", label: "Love", count: 5 },
      { emoji: "😋", label: "Yummy", count: 8 },
    ],
    userReactions: ["👍", "😋"],
  },
};

export const RecipeLiked: Story = {
  args: {
    type: "recipe_liked",
    context: {
      recipeName: "Classic Tiramisu",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 3 },
    ],
  },
};

export const RecipeCommented: Story = {
  args: {
    type: "recipe_commented",
    context: {
      recipeName: "Chocolate Chip Cookies",
    },
    preview: {
      type: "text",
      content: "These cookies look amazing! I love how you've explained each step in detail. I'll definitely try making these over the weekend. One question though - can I substitute the butter with olive oil?",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 4 },
      { emoji: "❤️", label: "Love", count: 2 },
    ],
  },
};

export const RecipeShared: Story = {
  args: {
    type: "recipe_shared",
    context: {
      recipeName: "Beef Wellington",
    },
    reactions: [
      { emoji: "🔥", label: "Fire", count: 7 },
      { emoji: "👨‍🍳", label: "Chef's Kiss", count: 3 },
    ],
  },
};

export const UserFollowed: Story = {
  args: {
    type: "user_followed",
    context: {
      targetUser: {
        id: "user2",
        name: "Jane Smith",
      },
    },
  },
};

export const CookbookCreated: Story = {
  args: {
    type: "cookbook_created",
    context: {
      cookbookName: "Italian Classics",
    },
    preview: {
      type: "image",
      content: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b",
      thumbnailUrl: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 15 },
      { emoji: "❤️", label: "Love", count: 8 },
      { emoji: "🍝", label: "Pasta", count: 6 },
      { emoji: "🔥", label: "Fire", count: 4 },
    ],
    userReactions: ["❤️", "🍝"],
  },
};

export const CookbookUpdated: Story = {
  args: {
    type: "cookbook_updated",
    context: {
      cookbookName: "Summer Grilling Favorites",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 2 },
    ],
  },
};

export const AchievementEarned: Story = {
  args: {
    type: "achievement_earned",
    context: {
      achievementName: "Master Chef",
    },
    reactions: [
      { emoji: "👏", label: "Clap", count: 10 },
      { emoji: "🏆", label: "Trophy", count: 5 },
      { emoji: "⭐", label: "Star", count: 3 },
    ],
  },
};

export const WithVideoPreview: Story = {
  args: {
    type: "recipe_created",
    context: {
      recipeName: "Quick Pasta Carbonara",
    },
    preview: {
      type: "video",
      content: "https://example.com/videos/carbonara.mp4",
      thumbnailUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 20 },
      { emoji: "😋", label: "Yummy", count: 12 },
      { emoji: "👨‍🍳", label: "Chef's Kiss", count: 8 },
    ],
  },
};

export const WithLongText: Story = {
  args: {
    type: "recipe_commented",
    context: {
      recipeName: "Sourdough Bread",
    },
    preview: {
      type: "text",
      content: "I've been baking sourdough for years, and this recipe is one of the best I've come across. The detailed explanation of the fermentation process and the importance of temperature control is spot-on. I particularly appreciate how you've broken down the folding technique - it's often a stumbling block for beginners. I've found that using a Dutch oven really helps with creating that perfect crust, and your temperature recommendations are exactly what I've found works best. One tip I might add is to try cold proofing in the fridge overnight - it develops even more complex flavors. Keep up the great work!",
    },
    reactions: [
      { emoji: "👍", label: "Like", count: 8 },
      { emoji: "🍞", label: "Bread", count: 5 },
      { emoji: "👨‍🍳", label: "Chef's Kiss", count: 3 },
    ],
  },
};

export const NoPreview: Story = {
  args: {
    type: "user_followed",
    context: {
      targetUser: {
        id: "user3",
        name: "Mike Johnson",
      },
    },
  },
};
