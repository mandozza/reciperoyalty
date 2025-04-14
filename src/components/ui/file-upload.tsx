import * as React from "react"
import { cn } from "@/lib/utils"
import { Upload, X, Image as ImageIcon, File } from "lucide-react"

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Error message to display */
  error?: string
  /** Label for the upload area */
  label?: string
  /** Helper text to display below upload area */
  helperText?: string
  /** Maximum file size in bytes */
  maxSize?: number
  /** Allowed file types */
  accept?: string
  /** Whether to allow multiple files */
  multiple?: boolean
  /** Whether to show preview for images */
  showPreview?: boolean
  /** Current value - array of files */
  value?: File[]
  /** Change handler */
  onChange?: (files: File[]) => void
  /** Maximum number of files allowed */
  maxFiles?: number
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({
    className,
    error,
    label,
    helperText,
    maxSize = 5 * 1024 * 1024, // 5MB default
    accept,
    multiple = false,
    showPreview = true,
    value = [],
    onChange,
    maxFiles = 5,
    ...props
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [previewUrls, setPreviewUrls] = React.useState<string[]>([])
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Clean up preview URLs on unmount
    React.useEffect(() => {
      return () => {
        previewUrls.forEach(url => URL.revokeObjectURL(url))
      }
    }, [previewUrls])

    // Update preview URLs when value changes
    React.useEffect(() => {
      setPreviewUrls(prev => {
        // Revoke old URLs
        prev.forEach(url => URL.revokeObjectURL(url))

        // Create new URLs only for image files
        return value
          .filter(file => file.type.startsWith('image/'))
          .map(file => URL.createObjectURL(file))
      })
    }, [value])

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }, [])

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }, [])

    const validateFiles = (files: File[]): { valid: File[], errors: string[] } => {
      const valid: File[] = []
      const errors: string[] = []

      files.forEach(file => {
        if (maxSize && file.size > maxSize) {
          errors.push(`${file.name} exceeds maximum size of ${maxSize / 1024 / 1024}MB`)
          return
        }

        if (accept) {
          const acceptedTypes = accept.split(',').map(type => type.trim())
          const fileType = file.type
          const fileExtension = `.${file.name.split('.').pop()}`

          if (!acceptedTypes.some(type =>
            fileType.startsWith(type.replace('/*', '/')) ||
            type === fileExtension
          )) {
            errors.push(`${file.name} has an invalid file type`)
            return
          }
        }

        valid.push(file)
      })

      return { valid, errors }
    }

    const handleDrop = React.useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (!multiple && droppedFiles.length > 1) {
        return
      }

      if (multiple && value.length + droppedFiles.length > maxFiles) {
        return
      }

      const { valid, errors } = validateFiles(droppedFiles)
      if (errors.length > 0) {
        // Handle errors (could emit them via a prop)
        console.error(errors)
        return
      }

      onChange?.(multiple ? [...value, ...valid] : valid)
    }, [multiple, maxFiles, value, onChange, accept, maxSize])

    const handleFileSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])
      if (!multiple && selectedFiles.length > 1) return
      if (multiple && value.length + selectedFiles.length > maxFiles) return

      const { valid, errors } = validateFiles(selectedFiles)
      if (errors.length > 0) {
        console.error(errors)
        return
      }

      onChange?.(multiple ? [...value, ...valid] : valid)

      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }, [multiple, maxFiles, value, onChange, accept, maxSize])

    const removeFile = React.useCallback((index: number) => {
      onChange?.(value.filter((_, i) => i !== index))
    }, [value, onChange])

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex min-h-[150px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
            isDragging && "border-primary bg-primary/5",
            error && "border-red-500",
            className
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Upload className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept ? `Accepted files: ${accept}` : 'All files are allowed'}
              {maxSize && ` (Max size: ${maxSize / 1024 / 1024}MB)`}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            {...props}
          />
        </div>

        {/* File previews */}
        {value.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {value.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="group relative rounded-lg border border-gray-200 p-2 dark:border-gray-700"
              >
                {showPreview && file.type.startsWith('image/') ? (
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="h-24 w-full rounded object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-full items-center justify-center rounded bg-gray-100 dark:bg-gray-800">
                    <File className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <p className="max-w-[calc(100%-24px)] truncate text-xs text-gray-500 dark:text-gray-400">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(error || helperText) && (
          <p className={cn("mt-2 text-sm", error ? "text-red-500" : "text-gray-500")}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
FileUpload.displayName = "FileUpload"

export { FileUpload }
