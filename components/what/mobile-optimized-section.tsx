"use client"

import { motion } from "framer-motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { ReactNode } from "react"

interface MobileOptimizedSectionProps {
  children: ReactNode
  className?: string
  mobileClassName?: string
  desktopClassName?: string
}

export function MobileOptimizedSection({ 
  children, 
  className = "",
  mobileClassName = "",
  desktopClassName = ""
}: MobileOptimizedSectionProps) {
  const isMobile = useIsMobile()
  
  return (
    <motion.section
      className={`
        ${className}
        ${isMobile ? mobileClassName : desktopClassName}
      `}
      initial={false}
      style={{
        willChange: isMobile ? 'transform' : 'auto',
        transform: isMobile ? 'translateZ(0)' : 'none'
      }}
    >
      {children}
    </motion.section>
  )
}