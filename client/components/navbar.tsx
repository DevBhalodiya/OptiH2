"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Leaf } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "./theme-provider"

const links = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/optimize", label: "Optimize" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/reports", label: "Reports" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-glass-border shadow-lg shadow-glass-shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" aria-label="OptiH2 India" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Leaf className="w-6 h-6 text-primary" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-foreground">OptiH2</span>
            <span className="text-xl font-bold gradient-text ml-2">India</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 relative overflow-hidden",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-foreground/80 hover:text-foreground hover:bg-primary/10 hover:scale-105"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
                {pathname === link.href && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl" />
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
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-glass-border">
          <ul className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-primary/10"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
