
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LucideIcon, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"
import { MinimalToggle } from "./toggle"

interface NavItem {
  name: string
  onClick: () => void
  icon: LucideIcon
  isActive?: boolean
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items.find(item => item.isActive)?.name || items[0].name)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const activeItem = items.find(item => item.isActive)
    if (activeItem) {
      setActiveTab(activeItem.name)
    }
  }, [items])

  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure we're not rendering theme-dependent content on the server
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-white/10 dark:bg-white/5 border border-white/20 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name)
                item.onClick()
              }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-white/80 hover:text-white",
                isActive && "bg-white/10 text-white",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/60 rounded-t-full">
                    <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
        
        {/* Theme Toggle */}
        <div className="flex items-center gap-2 px-2">
          <Sun className="h-4 w-4 text-yellow-300" />
          <MinimalToggle 
            checked={theme === 'dark'}
            onChange={toggleTheme}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4 text-blue-300" />
        </div>
      </div>
    </div>
  )
}
