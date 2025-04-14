import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "./input"
import { Search, Mail, Lock } from "lucide-react"

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "search"],
    },
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
    isLoading: {
      control: "boolean",
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
}

export const WithLabel: Story = {
  args: {
    label: "Email",
    placeholder: "Enter your email",
    type: "email",
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Password",
    helperText: "Password must be at least 8 characters",
    type: "password",
    placeholder: "Enter your password",
  },
}

export const WithError: Story = {
  args: {
    label: "Email",
    error: "Please enter a valid email address",
    type: "email",
    placeholder: "Enter your email",
    value: "invalid-email",
  },
}

export const WithStartIcon: Story = {
  args: {
    startIcon: <Search className="h-4 w-4 text-gray-500" />,
    placeholder: "Search...",
    type: "search",
  },
}

export const WithEndIcon: Story = {
  args: {
    endIcon: <Mail className="h-4 w-4 text-gray-500" />,
    placeholder: "Enter your email",
    type: "email",
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
    placeholder: "Loading...",
    value: "Loading content",
    disabled: true,
  },
}

export const Password: Story = {
  args: {
    type: "password",
    label: "Password",
    startIcon: <Lock className="h-4 w-4 text-gray-500" />,
    placeholder: "Enter your password",
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    value: "Cannot edit this",
  },
}

export const Number: Story = {
  args: {
    type: "number",
    label: "Amount",
    placeholder: "Enter amount",
    helperText: "Enter a number between 0 and 100",
  },
}
