import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationType } from "@/lib/stores/notification-store"

const toastVariants = cva(
  "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-900/50 dark:text-green-100",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/50 dark:text-red-100",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-100",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const iconMap: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
}

interface NotificationToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title: string
  message: string
  onClose?: () => void
  type: NotificationType
}

export function NotificationToast({
  className,
  title,
  message,
  onClose,
  type,
  ...props
}: NotificationToastProps) {
  return (
    <div
      className={cn(
        toastVariants({ variant: type }),
        "animate-in slide-in-from-right",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">{iconMap[type]}</div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm opacity-90">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
