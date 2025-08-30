"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, X, Leaf, Home, MapPin, Zap, LayoutDashboard, FileText, Info } from "lucide-react"
import { useState } from "react"


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

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" aria-label="OptiH2" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-white">OptiH2</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                  pathname === link.href && "bg-white/20 text-white shadow-lg"
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                <>
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">
          <ul className="px-4 py-4 space-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                    pathname === link.href && "bg-white/20 text-white shadow-lg"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <>
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
