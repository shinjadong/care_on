import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 glass-container",
  {
    variants: {
      variant: {
        default: "glass-container hover:glass-container-strong glass-text-primary hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        primary: "glass-container-strong glass-bg-primary glass-text-primary hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
        secondary: "glass-container glass-bg-secondary glass-text-primary hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        accent: "glass-container glass-bg-accent glass-text-primary hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]",
        destructive: "glass-container bg-red-500/20 glass-border-medium border-red-400/30 text-red-100 hover:bg-red-500/30 hover:scale-[1.02] active:scale-[0.98]",
        outline: "glass-container glass-border-strong bg-transparent glass-text-primary hover:glass-container-strong hover:scale-[1.02] active:scale-[0.98]",
        ghost: "bg-transparent border-none glass-text-secondary hover:glass-container hover:glass-text-primary hover:scale-[1.02] active:scale-[0.98]",
        link: "bg-transparent border-none text-white/80 underline-offset-4 hover:underline hover:text-white",
      },
      size: {
        default: "h-auto text-base font-normal py-3 px-6",
        sm: "h-9 px-3 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }