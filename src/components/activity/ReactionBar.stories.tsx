import type { Meta, StoryObj } from "@storybook/react";
import { ReactionBar } from "./ReactionBar";

const meta: Meta<typeof ReactionBar> = {
  title: "Components/Activity/ReactionBar",
  component: ReactionBar,
  tags: ["autodocs"],
  args: {
    reactions: [
      { emoji: "👍", label: "Like", count: 5 },
      { emoji: "❤️", label: "Love", count: 3 },
      { emoji: "😋", label: "Yummy", count: 2 },
    ],
    onReact: (emoji) => console.log("Added reaction:", emoji),
    onRemoveReaction: (emoji) => console.log("Removed reaction:", emoji),
  },
};

export default meta;
type Story = StoryObj<typeof ReactionBar>;

export const Default: Story = {};

export const WithUserReactions: Story = {
  args: {
    userReactions: ["👍", "❤️"],
  },
};

export const ManyReactions: Story = {
  args: {
    reactions: [
      { emoji: "👍", label: "Like", count: 15 },
      { emoji: "❤️", label: "Love", count: 8 },
      { emoji: "😋", label: "Yummy", count: 6 },
      { emoji: "👨‍🍳", label: "Chef's Kiss", count: 4 },
      { emoji: "🔥", label: "Fire", count: 3 },
      { emoji: "⭐", label: "Star", count: 2 },
    ],
  },
};

export const SingleReaction: Story = {
  args: {
    reactions: [
      { emoji: "👍", label: "Like", count: 1 },
    ],
  },
};

export const NoReactions: Story = {
  args: {
    reactions: [],
  },
};

export const CustomReactions: Story = {
  args: {
    reactions: [
      { emoji: "🍕", label: "Pizza", count: 7 },
      { emoji: "🍝", label: "Pasta", count: 4 },
      { emoji: "🥗", label: "Salad", count: 2 },
    ],
  },
};
