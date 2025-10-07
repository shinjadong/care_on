"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn("glass-input", className)}
        ref={ref}
        {...props}
      />
    )
  }
)

GlassInput.displayName = "GlassInput"

interface GlassTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const GlassTextarea = forwardRef<HTMLTextAreaElement, GlassTextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "glass-input resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

GlassTextarea.displayName = "GlassTextarea"

export { GlassInput, GlassTextarea }
