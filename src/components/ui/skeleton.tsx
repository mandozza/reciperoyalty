import { cn } from "@/lib/utils"

/**
 * A skeleton loader component that shows a placeholder while content is loading
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 * @param props.shimmer - Whether to show a shimmer effect
 */
function Skeleton({
  className,
  shimmer = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  shimmer?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        shimmer && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
