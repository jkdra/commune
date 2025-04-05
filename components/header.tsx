"use client"

import Link from "next/link"
import { Bell, Calendar, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  // Check if we're on a detail page that needs a back button
  const isDetailPage = pathname.includes("/groups/") || pathname.includes("/events/")

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile view */}
        {isMobile ? (
          <>
            {isDetailPage ? (
              <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="mr-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                <span className="sr-only">Back</span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className="mr-auto">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center">
              <span className="font-bold text-xl">Commune</span>
            </Link>

            <Button variant="ghost" size="icon" className="ml-auto">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </>
        ) : (
          /* Desktop view */
          <>
            <div className="flex items-center gap-2 mr-4">
              {isDetailPage && (
                <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-left"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  <span className="sr-only">Back</span>
                </Button>
              )}
              <Link href="/" className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span className="font-bold text-xl">Commune</span>
              </Link>
            </div>

            <div
              className={cn(
                "flex items-center transition-all duration-300 ease-in-out",
                isSearchOpen ? "w-full" : "w-auto",
              )}
            >
              {isSearchOpen ? (
                <div className="w-full max-w-md relative">
                  <Input
                    placeholder="Search events..."
                    className="w-full pr-10"
                    autoFocus
                    onBlur={() => setIsSearchOpen(false)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
                  <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                    Home
                  </Link>
                  <Link
                    href="/explore"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Explore
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    Calendar
                  </Link>
                </nav>
              )}
            </div>

            <div className="ml-auto flex items-center space-x-2">
              {!isSearchOpen && (
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <ThemeToggle />
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Mobile search overlay */}
      {isMobile && isSearchOpen && (
        <div className="absolute inset-x-0 top-16 bg-background p-4 border-b z-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search events or groups..." className="pl-10 pr-10" autoFocus />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsSearchOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

