"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Play, Trophy, LogOut, Music, LogIn, Home } from "lucide-react"
import { MusicVisualizer } from "@/components/music-visualizer"
import { useAuth } from "@/hooks/useAuth"
import { useAdmin } from "@/hooks/useAdmin"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { isAdmin } = useAdmin()

  const navItems = [
    ...(user ? [{ href: "/dashboard", label: "Panel główny", icon: Home }] : []),
    { href: "/play", label: "Graj", icon: Play },
    { href: "/ranking", label: "Ranking", icon: Trophy },
    ...(isAdmin ? [{ href: "/songs", label: "Zarządzaj piosenkami", icon: Music }] : []),
  ]

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Błąd wylogowania:', error)
    }
  }

  return (
    <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <span className="text-2xl font-bold text-beatquest-purple-light glow-text flex items-center">
              <MusicVisualizer className="mr-2" />
              BeatQuest
            </span>
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Button
                key={item.href}
                asChild
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={cn("relative", isActive && "bg-beatquest-purple hover:bg-beatquest-purple-dark")}
              >
                <Link href={item.href}>
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-beatquest-purple"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Wyloguj</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild>
              <Link href="/login">
                <LogIn className="w-5 h-5" />
                <span className="sr-only">Zaloguj</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

