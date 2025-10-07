import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full glass-container glass-border-medium px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "glass-bg-primary glass-text-primary hover:glass-container-strong",
        secondary: "glass-bg-secondary glass-text-primary hover:glass-container-strong",
        success: "bg-green-500/20 glass-border-medium border-green-400/30 text-green-100 hover:bg-green-500/30",
        destructive: "bg-red-500/20 glass-border-medium border-red-400/30 text-red-100 hover:bg-red-500/30",
        warning: "bg-yellow-500/20 glass-border-medium border-yellow-400/30 text-yellow-100 hover:bg-yellow-500/30",
        outline: "glass-container glass-border-strong bg-transparent glass-text-primary hover:glass-container-strong",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
