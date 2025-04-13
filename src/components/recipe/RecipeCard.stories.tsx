import type { Meta, StoryObj } from "@storybook/react";
import { RecipeCard } from "./RecipeCard";

const meta: Meta<typeof RecipeCard> = {
  title: "Components/Recipe/RecipeCard",
  component: RecipeCard,
  tags: ["autodocs"],
  args: {
    id: "1",
    title: "Homemade Margherita Pizza",
    description:
      "A classic Italian pizza with fresh mozzarella, tomatoes, and basil. Perfect for a casual dinner or entertaining guests.",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    cookTime: "45 min",
    difficulty: "medium",
    likes: 42,
    isLiked: false,
    isSaved: false,
  },
};

export default meta;
type Story = StoryObj<typeof RecipeCard>;

// Visual Variants
export const Default: Story = {};

export const Compact: Story = {
  args: {
    variant: "compact",
  },
};

export const Featured: Story = {
  args: {
    variant: "featured",
  },
};

export const Grid: Story = {
  args: {
    variant: "grid",
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
        <Story />
        <Story />
        <Story />
      </div>
    ),
  ],
};

export const List: Story = {
  args: {
    variant: "list",
  },
};

// Content Variants
export const MinimalContent: Story = {
  args: {
    contentStyle: "minimal",
  },
};

export const ImageOnly: Story = {
  args: {
    contentStyle: "imageOnly",
  },
};

// Interaction Variants
export const ReadOnly: Story = {
  args: {
    interaction: "readonly",
  },
};

export const Editable: Story = {
  args: {
    interaction: "editable",
    onEdit: (id) => alert(`Editing recipe ${id}`),
  },
};

// State Combinations
export const LikedAndSaved: Story = {
  args: {
    isLiked: true,
    isSaved: true,
  },
};

export const FeaturedWithMinimalContent: Story = {
  args: {
    variant: "featured",
    contentStyle: "minimal",
  },
};

export const CompactReadOnly: Story = {
  args: {
    variant: "compact",
    interaction: "readonly",
  },
};

export const ListWithEditMode: Story = {
  args: {
    variant: "list",
    interaction: "editable",
    onEdit: (id) => alert(`Editing recipe ${id}`),
  },
};

// Edge Cases
export const LongTitle: Story = {
  args: {
    title: "Ultimate Triple Chocolate Fudge Brownie Cake with Salted Caramel Drizzle",
  },
};

export const WithInteractions: Story = {
  args: {
    onLike: (id) => alert(`Liked recipe ${id}`),
    onSave: (id) => alert(`Saved recipe ${id}`),
    onShare: (id) => alert(`Sharing recipe ${id}`),
    onEdit: (id) => alert(`Editing recipe ${id}`),
  },
};
