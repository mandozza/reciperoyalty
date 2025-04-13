import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, Book, Calendar, User } from "lucide-react"
import { useSpring, animated } from "@react-spring/web"
import { useDrag } from "@use-gesture/react"
import type { DragGestureState } from "@use-gesture/react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <Home className="h-6 w-6" />,
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <Search className="h-6 w-6" />,
  },
  {
    href: "/cookbooks",
    label: "Cookbooks",
    icon: <Book className="h-6 w-6" />,
  },
  {
    href: "/meal-plan",
    label: "Meal Plan",
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="h-6 w-6" />,
  },
]

/**
 * Mobile bottom navigation bar with tabs, badges, and swipe gestures
 * Only visible on mobile devices
 */
export function BottomNavBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [{ x }, api] = useSpring(() => ({ x: 0 }))

  // Find current index
  const currentIndex = navItems.findIndex((item) => item.href === pathname)

  // Handle swipe gestures
  const bind = useDrag(
    ({ movement: [mx], direction: [xDir], distance, cancel }: DragGestureState) => {
      // If swipe distance is greater than 50px, navigate
      if (distance > 50) {
        // Prevent overscrolling past first/last items
        if (
          (currentIndex === 0 && xDir > 0) ||
          (currentIndex === navItems.length - 1 && xDir < 0)
        ) {
          cancel()
          return
        }

        // Navigate based on swipe direction
        const nextIndex = xDir > 0 ? currentIndex - 1 : currentIndex + 1
        if (nextIndex >= 0 && nextIndex < navItems.length) {
          router.push(navItems[nextIndex].href)
        }
      }

      // Animate the swipe
      api.start({ x: mx, immediate: true })
    },
    {
      bounds: { left: -100, right: 100 },
      rubberband: true,
    }
  )

  return (
    <animated.nav
      {...bind()}
      style={{ x }}
      className="fixed bottom-0 left-0 right-0 z-50 touch-pan-x border-t bg-background md:hidden"
    >
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground",
              pathname === item.href && "text-foreground"
            )}
          >
            <div className="relative">
              {item.icon}
              {item.badge && (
                <span className="absolute -right-2 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </animated.nav>
  )
}
