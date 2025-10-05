"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  position?: "right" | "bottom" | "left"
  className?: string
}

export function StepIndicator({
  currentStep,
  totalSteps,
  position = "right",
  className
}: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps + 1 }, (_, i) => i)

  const positionClasses = {
    right: "fixed top-1/2 right-4 -translate-y-1/2 flex-col space-y-2",
    bottom: "fixed bottom-8 left-1/2 -translate-x-1/2 flex-row space-x-2",
    left: "fixed top-1/2 left-4 -translate-y-1/2 flex-col space-y-2"
  }

  return (
    <div
      className={cn(
        "z-50 flex items-center",
        positionClasses[position],
        className
      )}
      aria-label={`Step ${currentStep + 1} of ${totalSteps + 1}`}
    >
      {steps.map((step) => (
        <motion.div
          key={step}
          className={cn(
            "transition-all duration-300",
            position === "bottom" ? "w-1 h-1" : "w-1.5 h-1.5",
            "rounded-full",
            step === currentStep
              ? "bg-gray-600/50"
              : "bg-gray-400/20",
            "hover:bg-gray-600/30"
          )}
          initial={{ scale: 0 }}
          animate={{
            scale: step === currentStep ? 1.2 : 1,
            opacity: step === currentStep ? 0.5 : 0.2
          }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.4 }}
        />
      ))}
    </div>
  )
}

// 더 미니멀한 라인 스타일 인디케이터
export function LineIndicator({
  currentStep,
  totalSteps,
  className
}: StepIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-[2px]",
        className
      )}
      aria-label={`Progress: ${Math.round(progress)}%`}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-gray-300/30 to-gray-400/40"
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  )
}