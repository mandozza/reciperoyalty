import type { Meta, StoryObj } from "@storybook/react"
import { Feed, FeedItem } from "./Feed"

const meta: Meta<typeof Feed> = {
  title: "Components/Feed/Feed",
  component: Feed,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof Feed>

const generateMockItems = (count: number): FeedItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `item${i}`,
    type: ["recipe", "video", "activity"][i % 3] as FeedItem["type"],
    createdAt: new Date(Date.now() - i * 1000 * 60 * 60),
    author: {
      id: `user${i % 3}`,
      name: ["John Doe", "Jane Smith", "Mike Johnson"][i % 3],
      image: "https://github.com/shadcn.png",
    },
    content: {
      title: `Item ${i + 1}`,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: i % 3 === 0 ? "https://picsum.photos/400/300" : undefined,
      video: i % 3 === 1 ? "https://example.com/video.mp4" : undefined,
      action: i % 3 === 2 ? "liked a recipe" : undefined,
    },
    stats: {
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 20),
      saves: Math.floor(Math.random() * 50),
    },
    isLiked: Math.random() > 0.5,
    isSaved: Math.random() > 0.5,
  }))

export const Default: Story = {
  args: {
    initialItems: generateMockItems(5),
    onLoadMore: async (lastId, filter) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return generateMockItems(5)
    },
    onRefresh: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return generateMockItems(5)
    },
    onLike: async (itemId) => {
      console.log("Liking item:", itemId)
    },
    onSave: async (itemId) => {
      console.log("Saving item:", itemId)
    },
  },
}

export const Empty: Story = {
  args: {
    initialItems: [],
  },
}

export const Loading: Story = {
  args: {
    initialItems: [],
    onLoadMore: async () => {
      // Simulate infinite loading
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return []
    },
  },
}

export const Error: Story = {
  args: {
    initialItems: generateMockItems(3),
    onLoadMore: async () => {
      throw new Error("Failed to load more items")
    },
    onRefresh: async () => {
      throw new Error("Failed to refresh feed")
    },
  },
}

export const NoMoreItems: Story = {
  args: {
    initialItems: generateMockItems(3),
    onLoadMore: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return [] // Return empty array to indicate no more items
    },
  },
}
