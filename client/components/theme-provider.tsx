'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center relative"
      aria-label="Toggle theme"
    >
      <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}

function useTheme() {
  const [theme, setTheme] = React.useState<"light" | "dark" | "system">("system")
  
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "system"
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      document.documentElement.classList.toggle("dark", systemTheme === "dark")
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    }
  }

  return { theme, setTheme: updateTheme }
}
