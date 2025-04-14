import * as React from "react"
import { cn } from "@/lib/utils"
import { SidebarNav } from "./sidebar-nav"
import { BottomNavBar } from "./bottom-nav"
import { Header } from "./header"

interface LayoutWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  showNav?: boolean
  showHeader?: boolean
  user?: {
    name: string
    email: string
    image?: string
  }
}

/**
 * Main layout wrapper component that handles responsive layouts
 * Includes sidebar navigation for desktop and bottom navigation for mobile
 */
export function LayoutWrapper({
  children,
  showNav = true,
  showHeader = true,
  user,
  className,
  ...props
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {showHeader && <Header user={user} />}

      {/* Desktop sidebar */}
      {showNav && <SidebarNav />}

      {/* Main content area */}
      <main
        className={cn(
          "flex min-h-screen flex-col",
          showNav && "md:pl-72", // Add padding for sidebar on desktop
          showHeader && "pt-16", // Add padding for header
          "pb-16 md:pb-0", // Add padding for bottom nav on mobile
          className
        )}
        {...props}
      >
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {showNav && <BottomNavBar />}
    </div>
  )
}
