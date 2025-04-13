import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Container } from "@/components/ui/grid"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { UserAvatar } from "@/components/ui/user-avatar"

interface HeaderProps {
  user?: {
    name: string
    email: string
    image?: string
  }
}

/**
 * Main header component with responsive design and sticky behavior
 */
export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [isSticky, setIsSticky] = React.useState(false)

  // Handle sticky header on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isSticky && "shadow-sm"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="hidden sm:inline">Recipe Royalty</span>
              <span className="sm:hidden">RR</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/explore"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === "/explore" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Explore
              </Link>
              <Link
                href="/cookbooks"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === "/cookbooks" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Cookbooks
              </Link>
              <Link
                href="/meal-plan"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === "/meal-plan" ? "text-foreground" : "text-foreground/60"
                )}
              >
                Meal Plan
              </Link>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div
              className={cn(
                "hidden items-center lg:flex",
                isSearchOpen && "flex"
              )}
            >
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-[300px]"
              />
            </div>

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <UserAvatar
                      user={{ name: user.name, image: user.image }}
                      className="h-8 w-8"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signout">Sign Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}
