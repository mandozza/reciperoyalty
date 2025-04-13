import { Skeleton } from "@/components/ui/skeleton"

/**
 * A skeleton loader for text content
 * @param props - Component props
 * @param props.lines - Number of lines to show
 * @param props.className - Additional CSS classes to apply
 */
export function TextSkeleton({
  lines = 1,
  className = "",
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4 w-full last:w-4/5"
        />
      ))}
    </div>
  )
}

/**
 * A skeleton loader for avatar images
 * @param props - Component props
 * @param props.size - Size of the avatar in pixels
 * @param props.className - Additional CSS classes to apply
 */
export function AvatarSkeleton({
  size = 40,
  className = "",
}: {
  size?: number
  className?: string
}) {
  return (
    <Skeleton
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

/**
 * A skeleton loader for card content
 * @param props - Component props
 * @param props.className - Additional CSS classes to apply
 */
export function CardSkeleton({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={`space-y-5 rounded-lg border p-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <AvatarSkeleton />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <TextSkeleton lines={3} />
      <Skeleton className="h-[200px] w-full rounded-md" />
    </div>
  )
}
