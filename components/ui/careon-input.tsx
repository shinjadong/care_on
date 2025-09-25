"use client"

import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CareonInputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: "text" | "tel" | "password" | "number"
  maxLength?: number
  className?: string
  inputMode?: "text" | "numeric" | "tel" | "email" | "url" | "search"
  readOnly?: boolean
  disabled?: boolean
  error?: string
}

export const CareonInput = forwardRef<HTMLInputElement, CareonInputProps>(
  ({ label, placeholder, value, onChange, type = "text", maxLength, className, inputMode, readOnly, disabled, error }, ref) => {
    return (
      <div className={cn("w-full", className)}>
        {label && <label className="block text-base font-medium text-black mb-3">{label}</label>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          inputMode={inputMode}
          readOnly={readOnly}
          disabled={disabled}
          className={cn(
            "w-full py-4 px-0 border-0 border-b border-gray-200 bg-transparent text-base text-black placeholder-gray-400 focus:border-[#009da2] focus:outline-none transition-colors duration-200",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-red-500 focus:border-red-500"
          )}
        />
      </div>
    )
  },
)

CareonInput.displayName = "CareonInput"
