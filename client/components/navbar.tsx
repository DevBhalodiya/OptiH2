"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Leaf, Home, MapPin, Zap, LayoutDashboard, FileText, Info } from "lucide-react"

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
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation - Simple */}
        <div className="md:hidden">
          <ul className="flex items-center gap-2">
            {links.slice(0, 3).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors",
                    pathname === link.href && "bg-white/20 text-white"
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  <link.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
