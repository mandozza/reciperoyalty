import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    indeterminate: {
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
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
}

export const WithHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "We'll send you updates about our product",
  },
}

export const WithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue",
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    label: "Disabled checked checkbox",
    disabled: true,
    checked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    label: "Select all items",
    indeterminate: true,
  },
}

export const WithoutLabel: Story = {
  args: {
    "aria-label": "Checkbox without visible label",
  },
}

export const WithChildren: Story = {
  args: {
    children: (
      <div className="ml-2">
        <div className="font-medium">Custom label</div>
        <div className="text-sm text-gray-500">With additional description</div>
      </div>
    ),
  },
}

export const CheckboxGroup: Story = {
  render: () => (
    <div className="space-y-2">
      <Checkbox label="Option 1" id="option1" />
      <Checkbox label="Option 2" id="option2" />
      <Checkbox label="Option 3" id="option3" disabled />
      <Checkbox label="Option 4" id="option4" />
    </div>
  ),
}
