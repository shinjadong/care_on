"use client"

import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

interface GlassModalContentProps {
  children: ReactNode
  className?: string
}

export function GlassModal({ isOpen, onClose, children, className }: GlassModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className={cn("glass-modal animate-glass-fade-in", className)}
      onClick={onClose}
    >
      <div
        className="glass-modal-content animate-glass-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export function GlassModalContent({ children, className }: GlassModalContentProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

// Convenience compound component
GlassModal.Content = GlassModalContent