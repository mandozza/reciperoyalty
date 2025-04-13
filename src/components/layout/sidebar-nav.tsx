import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Book,
  Calendar,
  User,
  ChevronDown,
  Star,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  children?: Omit<NavItem, "children">[]
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: <Home className="h-5 w-5" />,
    shortcut: "⌘H",
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <Search className="h-5 w-5" />,
    shortcut: "⌘E",
  },
  {
    href: "/cookbooks",
    label: "Cookbooks",
    icon: <Book className="h-5 w-5" />,
    shortcut: "⌘C",
    children: [
      {
        href: "/cookbooks/favorites",
        label: "Favorites",
        icon: <Star className="h-4 w-4" />,
        shortcut: "⌘F",
      },
      {
        href: "/cookbooks/my-cookbooks",
        label: "My Cookbooks",
        icon: <Book className="h-4 w-4" />,
        shortcut: "⌘M",
      },
    ],
  },
  {
    href: "/meal-plan",
    label: "Meal Plan",
    icon: <Calendar className="h-5 w-5" />,
    shortcut: "⌘P",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User className="h-5 w-5" />,
    shortcut: "⌘U",
    children: [
      {
        href: "/profile/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        shortcut: "⌘S",
      },
      {
        href: "/auth/signout",
        label: "Sign Out",
        icon: <LogOut className="h-4 w-4" />,
        shortcut: "⌘Q",
      },
    ],
  },
]

/**
 * Desktop sidebar navigation with collapsible sections and keyboard shortcuts
 * Only visible on desktop devices
 */
export function SidebarNav() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = React.useState<string[]>([])

  // Handle keyboard shortcuts
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey) {
        const item = navItems.find(
          (item) =>
            item.shortcut?.toLowerCase().includes(e.key.toLowerCase()) ||
            item.children?.some((child) =>
              child.shortcut?.toLowerCase().includes(e.key.toLowerCase())
            )
        )
        if (item) {
          e.preventDefault()
          window.location.href = item.href
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggleSection = (href: string) => {
    setOpenSections((prev) =>
      prev.includes(href)
        ? prev.filter((h) => h !== href)
        : [...prev, href]
    )
  }

  const NavLink = ({ item }: { item: Omit<NavItem, "children"> }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
        pathname === item.href ? "bg-accent" : "transparent"
      )}
    >
      {item.icon}
      <span className="flex-1">{item.label}</span>
      {item.shortcut && (
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          {item.shortcut}
        </kbd>
      )}
    </Link>
  )

  return (
    <nav className="hidden border-r bg-background md:block">
      <div className="flex h-screen w-72 flex-col gap-4 p-4">
        <div className="flex h-14 items-center border-b px-4 font-semibold">
          Recipe Royalty
        </div>
        <div className="flex-1 space-y-2">
          {navItems.map((item) =>
            item.children ? (
              <Collapsible
                key={item.href}
                open={openSections.includes(item.href)}
                onOpenChange={() => toggleSection(item.href)}
              >
                <CollapsibleTrigger className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent">
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openSections.includes(item.href) && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <NavLink key={child.href} item={child} />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <NavLink key={item.href} item={item} />
            )
          )}
        </div>
      </div>
    </nav>
  )
}
