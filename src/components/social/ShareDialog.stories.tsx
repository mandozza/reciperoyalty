import type { Meta, StoryObj } from "@storybook/react"
import { ShareDialog } from "./ShareDialog"

const meta: Meta<typeof ShareDialog> = {
  title: "Components/Social/ShareDialog",
  component: ShareDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ShareDialog>

export const Default: Story = {
  args: {
    open: true,
    title: "Delicious Chocolate Cake Recipe",
    description:
      "A rich and moist chocolate cake recipe that's perfect for any occasion. Easy to make and absolutely delicious!",
    url: "https://reciperoyalty.com/recipes/chocolate-cake",
    onShare: (platform) => {
      console.log("Sharing on:", platform)
    },
  },
}

export const WithImage: Story = {
  args: {
    ...Default.args,
    image: "https://picsum.photos/800/600",
  },
}

export const VideoShare: Story = {
  args: {
    open: true,
    title: "Quick Pasta Cooking Tips",
    description: "Learn the secrets to cooking perfect pasta every time with these essential tips!",
    url: "https://reciperoyalty.com/videos/pasta-tips",
    image: "https://picsum.photos/800/600",
    onShare: (platform) => {
      console.log("Sharing video on:", platform)
    },
  },
}

export const LongContent: Story = {
  args: {
    open: true,
    title: "The Ultimate Guide to Baking Sourdough Bread at Home: A Comprehensive Step-by-Step Tutorial",
    description:
      "Master the art of sourdough baking with this detailed guide. Learn everything from creating your own starter to achieving the perfect crust and crumb structure. Includes tips for troubleshooting common issues and advanced techniques for experienced bakers.",
    url: "https://reciperoyalty.com/guides/ultimate-sourdough-bread",
    image: "https://picsum.photos/800/600",
    onShare: (platform) => {
      console.log("Sharing guide on:", platform)
    },
  },
}
