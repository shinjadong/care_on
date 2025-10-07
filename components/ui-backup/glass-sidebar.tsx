"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlassSidebarProps {
  children: ReactNode
  className?: string
}

interface GlassSidebarNavProps {
  children: ReactNode
  className?: string
}

interface GlassSidebarItemProps {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function GlassSidebar({ children, className }: GlassSidebarProps) {
  return (
    <aside className={cn("glass-sidebar", className)}>
      {children}
    </aside>
  )
}

export function GlassSidebarNav({ children, className }: GlassSidebarNavProps) {
  return (
    <nav className={cn("glass-sidebar-nav", className)}>
      {children}
    </nav>
  )
}

export function GlassSidebarItem({
  icon: Icon,
  label,
  isActive = false,
  onClick,
  className
}: GlassSidebarItemProps) {
  return (
    <button
      className={cn(
        "glass-sidebar-item w-full text-left",
        isActive && "active",
        className
      )}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

// Convenience compound components
GlassSidebar.Nav = GlassSidebarNav
GlassSidebar.Item = GlassSidebarItem
