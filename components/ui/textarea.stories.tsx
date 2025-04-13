import type { Meta, StoryObj } from "@storybook/react"
import { Textarea } from "./textarea"

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    error: {
      control: "text",
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    autoResize: {
      control: "boolean",
    },
    maxHeight: {
      control: "number",
    },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
}

export const WithLabel: Story = {
  args: {
    label: "Message",
    placeholder: "Type your message here...",
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Bio",
    helperText: "Write a short bio about yourself",
    placeholder: "I am a...",
  },
}

export const WithError: Story = {
  args: {
    label: "Description",
    error: "Description is required",
    placeholder: "Enter a description",
  },
}

export const AutoResize: Story = {
  args: {
    label: "Auto-resizing Textarea",
    autoResize: true,
    placeholder: "This textarea will grow as you type...",
    helperText: "The textarea will automatically resize based on content",
  },
}

export const WithMaxHeight: Story = {
  args: {
    label: "Limited Height Textarea",
    autoResize: true,
    maxHeight: 200,
    placeholder: "This textarea has a maximum height...",
    helperText: "This textarea will stop growing at 200px",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Disabled Textarea",
    value: "This textarea is disabled",
  },
}

export const LongContent: Story = {
  args: {
    label: "Long Content",
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    autoResize: true,
  },
}
