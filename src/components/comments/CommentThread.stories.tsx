import type { Meta, StoryObj } from "@storybook/react"
import { CommentThread } from "./CommentThread"

const meta: Meta<typeof CommentThread> = {
  title: "Components/Comments/CommentThread",
  component: CommentThread,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CommentThread>

const mockComments = [
  {
    id: "1",
    content: "This is a great recipe! I love how easy it is to follow.",
    createdAt: new Date("2024-03-10T10:00:00"),
    author: {
      id: "user1",
      name: "John Doe",
      image: "https://github.com/shadcn.png",
    },
    likes: 5,
    isLiked: true,
    replies: [
      {
        id: "2",
        content: "Thanks! I'm glad you found it helpful.",
        createdAt: new Date("2024-03-10T10:30:00"),
        author: {
          id: "user2",
          name: "Jane Smith",
          image: "https://github.com/shadcn.png",
        },
        likes: 2,
        isLiked: false,
      },
    ],
  },
  {
    id: "3",
    content: "Could you clarify the cooking time for step 3?",
    createdAt: new Date("2024-03-09T15:00:00"),
    author: {
      id: "user3",
      name: "Mike Johnson",
      image: "https://github.com/shadcn.png",
    },
    likes: 1,
    isLiked: false,
  },
]

export const Default: Story = {
  args: {
    comments: mockComments,
    postId: "recipe123",
    onAddComment: async (comment) => {
      console.log("Adding comment:", comment)
    },
    onAddReply: async (comment) => {
      console.log("Adding reply:", comment)
    },
    onLike: async (commentId) => {
      console.log("Liking comment:", commentId)
    },
    onDelete: async (commentId) => {
      console.log("Deleting comment:", commentId)
    },
    onEdit: async (commentId, content) => {
      console.log("Editing comment:", commentId, content)
    },
  },
}

export const Empty: Story = {
  args: {
    comments: [],
    postId: "recipe123",
  },
}

export const LongThread: Story = {
  args: {
    comments: Array.from({ length: 20 }, (_, i) => ({
      id: `comment${i}`,
      content: `This is comment ${i + 1} with some longer content to show how the component handles longer text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      createdAt: new Date(Date.now() - i * 1000 * 60 * 60), // Each comment 1 hour apart
      author: {
        id: `user${i % 3}`,
        name: ["John Doe", "Jane Smith", "Mike Johnson"][i % 3],
        image: "https://github.com/shadcn.png",
      },
      likes: Math.floor(Math.random() * 10),
      isLiked: Math.random() > 0.5,
    })),
    postId: "recipe123",
  },
}

export const NestedReplies: Story = {
  args: {
    comments: [
      {
        id: "1",
        content: "Parent comment",
        createdAt: new Date("2024-03-10T10:00:00"),
        author: {
          id: "user1",
          name: "John Doe",
          image: "https://github.com/shadcn.png",
        },
        likes: 5,
        isLiked: true,
        replies: [
          {
            id: "2",
            content: "First level reply",
            createdAt: new Date("2024-03-10T10:30:00"),
            author: {
              id: "user2",
              name: "Jane Smith",
              image: "https://github.com/shadcn.png",
            },
            likes: 2,
            isLiked: false,
            replies: [
              {
                id: "3",
                content: "Second level reply",
                createdAt: new Date("2024-03-10T11:00:00"),
                author: {
                  id: "user3",
                  name: "Mike Johnson",
                  image: "https://github.com/shadcn.png",
                },
                likes: 1,
                isLiked: false,
              },
            ],
          },
        ],
      },
    ],
    postId: "recipe123",
  },
}
