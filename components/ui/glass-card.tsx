"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  variant?: "default" | "strong"
}

interface GlassCardHeaderProps {
  children: ReactNode
  className?: string
}

interface GlassCardBodyProps {
  children: ReactNode
  className?: string
}

interface GlassCardFooterProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className, variant = "default" }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        variant === "strong" && "glass-container-strong",
        className
      )}
    >
      {children}
    </div>
  )
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <div className={cn("glass-card-header", className)}>
      {children}
    </div>
  )
}

export function GlassCardBody({ children, className }: GlassCardBodyProps) {
  return (
    <div className={cn("glass-card-body", className)}>
      {children}
    </div>
  )
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn("glass-card-footer", className)}>
      {children}
    </div>
  )
}

// Convenience compound component
GlassCard.Header = GlassCardHeader
GlassCard.Body = GlassCardBody
GlassCard.Footer = GlassCardFooter