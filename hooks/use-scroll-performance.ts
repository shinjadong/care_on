"use client"

import { useCallback, useRef } from "react"

export function useScrollPerformance() {
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  
  const handleScrollStart = useCallback(() => {
    if (!isScrollingRef.current) {
      isScrollingRef.current = true
      document.body.style.pointerEvents = 'none'
    }
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false
      document.body.style.pointerEvents = 'auto'
    }, 150)
  }, [])
  
  return { handleScrollStart, isScrolling: isScrollingRef.current }
}
