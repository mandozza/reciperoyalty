import type { Meta, StoryObj } from "@storybook/react"
import { FileUpload } from "./file-upload"

const meta: Meta<typeof FileUpload> = {
  title: "UI/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  argTypes: {
    accept: {
      control: "text",
      description: "Comma-separated list of allowed file types",
    },
    multiple: {
      control: "boolean",
      description: "Allow multiple file uploads",
    },
    maxSize: {
      control: "number",
      description: "Maximum file size in bytes",
    },
    maxFiles: {
      control: "number",
      description: "Maximum number of files allowed",
    },
    showPreview: {
      control: "boolean",
      description: "Show image previews",
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
type Story = StoryObj<typeof FileUpload>

export const Default: Story = {
  args: {
    label: "Upload File",
    helperText: "Choose a file to upload",
  },
}

export const ImageUpload: Story = {
  args: {
    label: "Upload Images",
    accept: "image/*",
    helperText: "Upload your images here",
    multiple: true,
    maxFiles: 4,
  },
}

export const PDFUpload: Story = {
  args: {
    label: "Upload PDF",
    accept: ".pdf",
    helperText: "Only PDF files are allowed",
    multiple: false,
  },
}

export const WithError: Story = {
  args: {
    label: "Upload Files",
    error: "Please upload a valid file",
    accept: "image/*,.pdf",
  },
}

export const WithSizeLimit: Story = {
  args: {
    label: "Upload Files",
    maxSize: 1024 * 1024, // 1MB
    helperText: "Maximum file size: 1MB",
  },
}

export const MultipleFiles: Story = {
  args: {
    label: "Upload Multiple Files",
    multiple: true,
    maxFiles: 3,
    helperText: "You can upload up to 3 files",
  },
}

export const VideoUpload: Story = {
  args: {
    label: "Upload Video",
    accept: "video/*",
    helperText: "Upload your video file here",
    maxSize: 50 * 1024 * 1024, // 50MB
  },
}

export const CustomPreview: Story = {
  args: {
    label: "Upload Files",
    multiple: true,
    showPreview: true,
    helperText: "Images will show previews, other files will show icons",
  },
}
