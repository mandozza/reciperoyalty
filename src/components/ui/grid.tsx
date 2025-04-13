import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  cols?: {
    default: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

/**
 * A responsive grid component that supports different column counts at different breakpoints
 * @param props - Component props
 * @param props.cols - Number of columns at different breakpoints
 * @param props.gap - Gap between grid items (in multiples of 4px)
 */
export function Grid({
  children,
  cols = { default: 1 },
  gap = 4,
  className,
  ...props
}: GridProps) {
  const { default: defaultCols, sm, md, lg, xl } = cols

  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${defaultCols}`,
        sm && `sm:grid-cols-${sm}`,
        md && `md:grid-cols-${md}`,
        lg && `lg:grid-cols-${lg}`,
        xl && `xl:grid-cols-${xl}`,
        `gap-${gap}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * A container component that provides consistent max-width and padding
 */
export function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * A section component that provides consistent vertical spacing
 */
export function Section({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-12 sm:py-16 lg:py-20", className)}
      {...props}
    >
      {children}
    </section>
  )
}
