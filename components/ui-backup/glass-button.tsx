"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "strong"
  size?: "sm" | "md" | "lg"
}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "glass-btn",
          {
            // Variants
            "glass-container": variant === "default",
            "glass-container-strong": variant === "strong",
            // Sizes
            "px-3 py-1.5 text-xs": size === "sm",
            "px-4 py-2 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        <span className="glass-btn-text">{children}</span>
      </button>
    )
  }
)

GlassButton.displayName = "GlassButton"

export { GlassButton }
