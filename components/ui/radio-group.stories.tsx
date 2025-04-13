import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Whether the radio group is disabled",
    },
    error: {
      control: "text",
      description: "Error message to display",
    },
    label: {
      control: "text",
      description: "Label for the radio group",
    },
    helperText: {
      control: "text",
      description: "Helper text to display",
    },
  },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" {...args}>
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
}

export const WithLabel: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="comfortable"
      label="Select your preferred view"
      {...args}
    >
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
}

export const WithHelperText: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="comfortable"
      label="Select your preferred view"
      helperText="This setting can be changed later"
      {...args}
    >
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
}

export const WithError: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="comfortable"
      label="Select your preferred view"
      error="Please select a valid option"
      {...args}
    >
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="comfortable"
      label="Select your preferred view"
      disabled
      {...args}
    >
      <RadioGroupItem value="default" label="Default" />
      <RadioGroupItem value="comfortable" label="Comfortable" />
      <RadioGroupItem value="compact" label="Compact" />
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="comfortable"
      label="Select your preferred view"
      {...args}
    >
      <RadioGroupItem
        value="default"
        label="Default"
        description="Standard spacing between items"
      />
      <RadioGroupItem
        value="comfortable"
        label="Comfortable"
        description="Increased spacing for better readability"
      />
      <RadioGroupItem
        value="compact"
        label="Compact"
        description="Reduced spacing to show more content"
      />
    </RadioGroup>
  ),
}

export const WithCustomContent: Story = {
  render: (args) => (
    <RadioGroup
      defaultValue="card1"
      label="Select a payment method"
      className="grid grid-cols-3 gap-4"
      {...args}
    >
      <RadioGroupItem value="card1">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Credit Card</h3>
          <p className="text-sm text-gray-500">**** **** **** 4242</p>
        </div>
      </RadioGroupItem>
      <RadioGroupItem value="card2">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">Debit Card</h3>
          <p className="text-sm text-gray-500">**** **** **** 5555</p>
        </div>
      </RadioGroupItem>
      <RadioGroupItem value="paypal">
        <div className="rounded-lg border p-4">
          <h3 className="font-medium">PayPal</h3>
          <p className="text-sm text-gray-500">user@example.com</p>
        </div>
      </RadioGroupItem>
    </RadioGroup>
  ),
}
