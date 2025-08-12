"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface ScrollManagerOptions {
  maxSteps: number
  animationMs?: number
  onStepChange?: (step: number) => void
}

export function useScrollManager(options: ScrollManagerOptions) {
  const { maxSteps, animationMs = 600, onStepChange } = options
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)
  const lastScrollTime = useRef(0)
  const scrollThrottleRef = useRef<NodeJS.Timeout>()
  
  const changeStep = useCallback((direction: 'up' | 'down') => {
    if (isAnimating) return
    
    const now = Date.now()
    if (now - lastScrollTime.current < 100) return
    lastScrollTime.current = now
    
    const newStep = direction === 'down' ? currentStep + 1 : currentStep - 1
    if (newStep >= 0 && newStep <= maxSteps) {
      setIsAnimating(true)
      setCurrentStep(newStep)
      onStepChange?.(newStep)
      
      setTimeout(() => setIsAnimating(false), animationMs)
    }
  }, [currentStep, maxSteps, animationMs, isAnimating, onStepChange])
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleWheel = (e: WheelEvent) => {
      const threshold = 30
      if (Math.abs(e.deltaY) < threshold) return
      
      const direction = e.deltaY > 0 ? 'down' : 'up'
      
      if ((direction === 'down' && currentStep < maxSteps) || 
          (direction === 'up' && currentStep > 0)) {
        e.preventDefault()
        changeStep(direction)
      }
    }
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }
    
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const threshold = 50
      
      if (Math.abs(deltaY) > threshold) {
        const direction = deltaY > 0 ? 'down' : 'up'
        changeStep(direction)
      }
    }
    
    // Passive false for wheel events to allow preventDefault
    container.addEventListener('wheel', handleWheel, { passive: false })
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentStep, maxSteps, changeStep])
  
  return {
    containerRef,
    currentStep,
    isAnimating,
    changeStep
  }
}