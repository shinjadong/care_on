"use client"

import { useEffect, useRef, useState } from "react"

export interface UseStepScrollOptions {
  maxSteps: number
  animationMs?: number
  initialStep?: number
  requireExtraScrollOnLastStep?: boolean
  extraScrollCountOnLastStep?: number
}

interface UseStepScrollReturn {
  sectionRef: React.RefObject<HTMLElement>
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  isAnimating: boolean
}

// 공통 스크롤/터치 기반 스텝 제어 훅
export function useStepScroll(options: UseStepScrollOptions): UseStepScrollReturn {
  const { maxSteps, animationMs = 800, initialStep = 0 } = options
  const [step, setStep] = useState<number>(initialStep)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef<number>(0)
  const lastStepScrollCount = useRef<number>(0)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const changeStep = (direction: "up" | "down") => {
      if (isAnimating) return
      const nextStep = direction === "down" ? step + 1 : step - 1
      if (nextStep >= 0 && nextStep <= maxSteps) {
        setIsAnimating(true)
        setStep(nextStep)
        window.setTimeout(() => setIsAnimating(false), animationMs)

        // 마지막 스텝 진입 시 카운터 초기화
        if (nextStep === maxSteps) {
          lastStepScrollCount.current = 0
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      const goingDown = e.deltaY > 0
      const goingUp = e.deltaY < 0

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
          return
        }
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
        e.preventDefault()
        return
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

      if (Math.abs(deltaY) <= SWIPE_THRESHOLD) return

      // 마지막 스텝에서 아래로 스와이프 시 추가 스크롤 요구 처리
      if (
        goingDown &&
        step === maxSteps &&
        options.requireExtraScrollOnLastStep
      ) {
        const required = Math.max(1, options.extraScrollCountOnLastStep ?? 1)
        if (lastStepScrollCount.current < required) {
          lastStepScrollCount.current += 1
          return
        }
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
  }, [step, isAnimating, maxSteps, animationMs])

  return { sectionRef, step, setStep, isAnimating }
}


