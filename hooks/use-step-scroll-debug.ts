"use client"

import { useEffect, useRef, useState } from "react"

export interface UseStepScrollOptions {
  maxSteps: number
  animationMs?: number
  initialStep?: number
  requireExtraScrollOnLastStep?: boolean
  extraScrollCountOnLastStep?: number
  debugMode?: boolean
}

interface UseStepScrollReturn {
  sectionRef: React.RefObject<HTMLElement>
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  isAnimating: boolean
}

// 디버그 모드가 추가된 스크롤 훅
export function useStepScrollDebug(options: UseStepScrollOptions): UseStepScrollReturn {
  const { maxSteps, animationMs = 800, initialStep = 0, debugMode = false } = options
  const [step, setStep] = useState<number>(initialStep)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef<number>(0)
  const lastStepScrollCount = useRef<number>(0)

  const log = (message: string) => {
    if (debugMode) {
      console.log(`[StepScroll] ${message}`)
    }
  }

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const changeStep = (direction: "up" | "down") => {
      if (isAnimating) {
        log(`Animation in progress, ignoring ${direction} step`)
        return
      }
      const nextStep = direction === "down" ? step + 1 : step - 1
      log(`Attempting to change step ${direction}: ${step} -> ${nextStep}`)
      
      if (nextStep >= 0 && nextStep <= maxSteps) {
        setIsAnimating(true)
        setStep(nextStep)
        window.setTimeout(() => setIsAnimating(false), animationMs)

        // 마지막 스텝 진입 시 카운터 초기화
        if (nextStep === maxSteps) {
          lastStepScrollCount.current = 0
          log(`Entered last step, reset scroll count`)
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const goingDown = e.deltaY > 0
      const goingUp = e.deltaY < 0

      log(`Wheel event: deltaY=${e.deltaY}, step=${step}, goingDown=${goingDown}`)

      // 마지막 스텝에서 아래로 스크롤 시 추가 스크롤 요구 처리
      if (
        goingDown &&
        step === maxSteps &&
        options.requireExtraScrollOnLastStep
      ) {
        const required = Math.max(1, options.extraScrollCountOnLastStep ?? 1)
        if (lastStepScrollCount.current < required) {
          e.preventDefault()
          lastStepScrollCount.current += 1
          log(`Last step extra scroll: ${lastStepScrollCount.current}/${required}`)
          return
        }
        log(`Last step scroll requirement met, allowing natural scroll`)
        // 요구 횟수 충족 후에는 기본 스크롤 허용하여 다음 섹션으로 이동
        return
      }

      if (goingDown) {
        if (step < maxSteps) {
          e.preventDefault()
          changeStep("down")
        }
      } else if (goingUp) {
        if (step > 0) {
          e.preventDefault()
          // 위로 갈 때는 카운터 초기화
          lastStepScrollCount.current = 0
          changeStep("up")
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      log(`Touch start at Y=${touchStartY.current}`)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY
      const goingDown = deltaY > 0
      const goingUp = deltaY < 0

      // 마지막 스텝에서 아래로 스와이프 시 추가 스크롤 요구 처리
      if (
        goingDown &&
        step === maxSteps &&
        options.requireExtraScrollOnLastStep
      ) {
        const required = Math.max(1, options.extraScrollCountOnLastStep ?? 1)
        if (lastStepScrollCount.current < required) {
          e.preventDefault()
          log(`Preventing touch move at last step: ${lastStepScrollCount.current}/${required}`)
          return
        }
      }

      if ((goingDown && step < maxSteps) || (goingUp && step > 0)) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const goingDown = deltaY > 0
      const goingUp = deltaY < 0
      const SWIPE_THRESHOLD = 40

      log(`Touch end: deltaY=${deltaY}, threshold=${SWIPE_THRESHOLD}, step=${step}`)

      if (Math.abs(deltaY) <= SWIPE_THRESHOLD) {
        log(`Touch delta below threshold, ignoring`)
        return
      }

      // 마지막 스텝에서 아래로 스와이프 시 추가 스크롤 요구 처리
      if (
        goingDown &&
        step === maxSteps &&
        options.requireExtraScrollOnLastStep
      ) {
        const required = Math.max(1, options.extraScrollCountOnLastStep ?? 1)
        if (lastStepScrollCount.current < required) {
          lastStepScrollCount.current += 1
          log(`Last step touch: ${lastStepScrollCount.current}/${required}`)
          return
        }
        log(`Last step touch requirement met, allowing natural scroll`)
        return
      }

      if (goingDown && step < maxSteps) changeStep("down")
      else if (goingUp && step > 0) {
        lastStepScrollCount.current = 0
        changeStep("up")
      }
    }

    element.addEventListener("wheel", handleWheel, { passive: false })
    element.addEventListener("touchstart", handleTouchStart, { passive: false })
    element.addEventListener("touchmove", handleTouchMove, { passive: false })
    element.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener("wheel", handleWheel)
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [step, isAnimating, maxSteps, animationMs, options, debugMode])

  return { sectionRef, step, setStep, isAnimating }
}