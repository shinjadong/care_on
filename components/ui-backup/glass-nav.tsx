"use client"

import { LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MenuItem {
  icon: LucideIcon
  label: string
  isActive?: boolean
  onClick?: () => void
}

interface Toast {
  id: number
  message: string
  visible: boolean
  showIcon: boolean
}

interface GlassNavProps {
  menuItems: MenuItem[]
  className?: string
  showToast?: (message: string) => void
}

export function GlassNav({ menuItems, className, showToast }: GlassNavProps) {
  const [toast, setToast] = useState<Toast | null>(null)

  const handleToast = (message: string) => {
    if (showToast) {
      showToast(message)
      return
    }

    const newToast = {
      id: Date.now(),
      message,
      visible: true,
      showIcon: false,
    }
    setToast(newToast)

    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, showIcon: true } : null))
    }, 200)
  }

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, visible: false, showIcon: false } : null))
        setTimeout(() => setToast(null), 500)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [toast])

  return (
    <div className={cn("relative", className)}>
      <nav className="glass-nav">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className={cn(
                  "glass-nav-item",
                  item.isActive && "active"
                )}
                onClick={() => {
                  item.onClick?.()
                  handleToast(`${item.label} clicked!`)
                }}
              >
                <Icon className="glass-nav-icon" />
                <span className="glass-nav-label">{item.label}</span>
              </div>
            )
          })}
        </div>
      </nav>

      {toast && (
        <div
          className={cn(
            "glass-toast absolute top-full mt-4 left-0 right-0 z-20",
            toast.visible ? "visible animate-glass-slide-in" : "hidden animate-glass-slide-out"
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "glass-toast-icon",
                toast.showIcon ? "animate" : "hide"
              )}
            >
              <svg
                className={cn(
                  "w-4 h-4 text-white transition-all duration-200 delay-100",
                  toast.showIcon ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span
              className={cn(
                "glass-toast-text",
                toast.visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              )}
            >
              {toast.message}
            </span>
          </div>

          <div className="glass-toast-progress">
            <div
              className={cn(
                "glass-toast-progress-bar",
                toast.visible ? "w-0 animate-glass-progress" : "w-full"
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
