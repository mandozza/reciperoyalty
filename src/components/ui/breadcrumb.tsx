import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  href: string
  label: string
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
}

/**
 * A breadcrumb navigation component
 * @param props - Component props
 * @param props.items - Array of breadcrumb items
 * @param props.separator - Custom separator element
 */
export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-2 text-sm", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            <span
              className="text-muted-foreground"
              aria-hidden="true"
            >
              {separator}
            </span>
            <Link
              href={item.href}
              className={cn(
                "hover:text-foreground",
                index === items.length - 1
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
