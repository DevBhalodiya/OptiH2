"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Leaf, Home, MapPin, Zap, LayoutDashboard, FileText, Info } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ThemeToggle } from "./theme-provider"

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/map", label: "Map", icon: MapPin },
  { href: "/optimize", label: "Optimize", icon: Zap },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/about", label: "About", icon: Info },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    // Add event listener when menu is open
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-glass-border shadow-lg shadow-glass-shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" aria-label="OptiH2" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold gradient-text">OptiH2</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium",
                  pathname === link.href && "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {pathname === link.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl pointer-events-none" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Mobile Menu Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors z-50 relative"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {/* Mobile Navigation */}
      <div 
        ref={menuRef} 
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        } fixed inset-x-0 top-16 z-40`}
      >
        <div className="bg-background/95 backdrop-blur-xl border-t border-glass-border">
          <ul className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
                    pathname === link.href && "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {pathname === link.href && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl pointer-events-none" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
