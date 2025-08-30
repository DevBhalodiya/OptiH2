"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" aria-label="Green Hydrogen InfraMap" className="font-semibold">
          <span className="text-foreground">Green Hydrogen</span> <span className="text-emerald-500">InfraMap</span>
        </Link>
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  pathname === l.href
                    ? "bg-emerald-500 text-white"
                    : "text-foreground/80 hover:bg-sky-500 hover:text-white",
                )}
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
