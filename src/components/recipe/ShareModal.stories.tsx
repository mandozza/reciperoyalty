import type { Meta, StoryObj } from "@storybook/react";
import { ShareModal } from "./ShareModal";

const meta: Meta<typeof ShareModal> = {
  title: "Components/Recipe/ShareModal",
  component: ShareModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    title: "Homemade Margherita Pizza",
    recipeId: "123",
    onClose: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ShareModal>;

export const Default: Story = {};

export const LongTitle: Story = {
  args: {
    title: "Ultimate Triple Chocolate Fudge Brownie Cake with Salted Caramel Drizzle",
  },
};

export const WithCustomId: Story = {
  args: {
    recipeId: "custom-recipe-slug",
  },
};
