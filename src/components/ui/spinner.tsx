import { cn } from "@/lib/utils"

/**
 * A loading spinner component with different sizes and variants
 * @param props - Component props
 * @param props.size - Size of the spinner (sm, md, lg)
 * @param props.variant - Visual variant (default, primary, secondary)
 * @param props.className - Additional CSS classes to apply
 */
export function Spinner({
  size = "md",
  variant = "default",
  className = "",
}: {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "primary" | "secondary"
  className?: string
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  }

  const variantClasses = {
    default: "border-muted-foreground/20 border-t-muted-foreground",
    primary: "border-primary/20 border-t-primary",
    secondary: "border-secondary/20 border-t-secondary",
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  )
}

/**
 * A progress bar component for showing loading progress
 * @param props - Component props
 * @param props.progress - Progress value (0-100)
 * @param props.variant - Visual variant (default, primary, secondary)
 * @param props.className - Additional CSS classes to apply
 */
export function ProgressBar({
  progress = 0,
  variant = "default",
  className = "",
}: {
  progress?: number
  variant?: "default" | "primary" | "secondary"
  className?: string
}) {
  const variantClasses = {
    default: "bg-muted-foreground",
    primary: "bg-primary",
    secondary: "bg-secondary",
  }

  return (
    <div className={cn("h-2 w-full rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-300 ease-in-out",
          variantClasses[variant]
        )}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  )
}
