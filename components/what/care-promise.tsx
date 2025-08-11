"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

/**
 * CarePromise
 * 목적: 브랜드의 핵심 약속을 스텝 기반 스크롤 인터랙션으로 한 줄씩 쌓아 전달
 * 사용법: <CarePromise /> – WhyDoThis 뒤에 배치하여 정서적 메시지의 여운을 강화합니다.
 * 제한사항: 모바일 스와이프/휠 제스처를 제어하므로, 상위 섹션과 중복 제어되지 않도록 주의
 *
 * 교육자 모드 비유: 인트로의 자막이 한 줄씩 쌓이듯, 관객의 스크롤에 맞춰 엔딩 메시지가 누적됩니다.
 */
export function CarePromise() {
  const LINES: string[] = [
    "나의 안정, 나의 행복",
    "나의 생존,",
    "케어해드립니다.",
    "그래야,",
    "다 같이 살 수 있으니까.",
  ]

  const MAX_STEPS = LINES.length
  const [step, setStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const changeStep = (direction: "up" | "down") => {
      if (isAnimating) return
      const next = direction === "down" ? step + 1 : step - 1
      if (next >= 1 && next <= MAX_STEPS) {
        setIsAnimating(true)
        setStep(next)
        setTimeout(() => setIsAnimating(false), 450)
      }
    }

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0
      const up = e.deltaY < 0
      if (down && step < MAX_STEPS) { e.preventDefault(); changeStep("down") }
      else if (up && step > 1) { e.preventDefault(); changeStep("up") }
    }

    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY
      if ((deltaY > 0 && step < MAX_STEPS) || (deltaY < 0 && step > 1)) e.preventDefault()
    }
    const onTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const SWIPE = 50
      if (Math.abs(deltaY) <= SWIPE) return
      if (deltaY > 0 && step < MAX_STEPS) changeStep("down")
      else if (deltaY < 0 && step > 1) changeStep("up")
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd, { passive: false })
    return () => {
      el.removeEventListener("wheel", onWheel)
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
    }
  }, [step, isAnimating])

  return (
    <section
      ref={sectionRef as any}
      className="h-screen w-screen snap-start overflow-hidden overscroll-contain bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex flex-col items-center justify-center px-6"
    >
      <div className="text-center max-w-5xl mx-auto">
        {LINES.slice(0, step).map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={
              index === 2
                ? "text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900"
                : "text-2xl md:text-4xl lg:text-5xl font-semibold text-gray-800"
            }
          >
            {text}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default CarePromise

