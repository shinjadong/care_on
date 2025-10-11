"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface CareonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "teal" | "blue"
  disabled?: boolean
  className?: string
}

export function CareonButton({ children, onClick, variant = "teal", disabled = false, className }: CareonButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-4 px-6 rounded-xl font-semibold text-base text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
        "bg-[#009da2] hover:bg-[#008a8f]",
        className,
      )}
    >
      {children}
    </button>
  )
}
