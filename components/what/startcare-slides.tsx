"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

/**
 * StartCareSlidesSection
 * 목적: 스크롤 반응형 4개 페이지(풀스크린) 시퀀스 구성
 * - 1) 케어온 스타트케어란? + 소개 문구
 * - 2) 폐업 걱정 없는 안정적인 시작 + 환급 보장
 * - 3) 비용 부담 없는 합리적 구성 + 최저가 수준 요금
 * - 4) A/S 걱정 없는 대기업 협력사 + 신뢰 메시지
 */
export function StartCareSlidesSection() {
  const MAX_STEPS = 3
  const [step, setStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const changeStep = (direction: "up" | "down") => {
      if (isAnimating) return
      const next = direction === "down" ? step + 1 : step - 1
      if (next >= 0 && next <= MAX_STEPS) {
        setIsAnimating(true)
        setStep(next)
        setTimeout(() => setIsAnimating(false), 650)
      }
    }

    const onWheel = (e: WheelEvent) => {
      const down = e.deltaY > 0
      const up = e.deltaY < 0
      if (down && step < MAX_STEPS) { e.preventDefault(); changeStep("down") }
      else if (up && step > 0) { e.preventDefault(); changeStep("up") }
    }

    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY }
    const onTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY
      if ((deltaY > 0 && step < MAX_STEPS) || (deltaY < 0 && step > 0)) e.preventDefault()
    }
    const onTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(deltaY) <= 50) return
      if (deltaY > 0 && step < MAX_STEPS) changeStep("down")
      else if (deltaY < 0 && step > 0) changeStep("up")
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

  const slideVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.5, ease: "easeIn" } },
  }

  return (
    <section
      ref={sectionRef as any}
      className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex items-center justify-center p-4"
    >
      <motion.h2
        className="absolute z-20 text-[#222222] font-black text-3xl md:text-4xl text-center"
        initial={false}
        animate={step === 0
          ? { top: "40%", left: "50%", x: "-50%", y: "-50%", opacity: 1 }
          : { top: "13%", left: "50%", x: "-50%", y: "0%", opacity: 1 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        케어온<br /> 스타트케어란?
      </motion.h2>
      <AnimatePresence mode="wait">

        {step === 0 && (
          <motion.div key="s0" className="text-center max-w-3xl"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <p className="text-lg md:text-2xl text-[#222222] leading-relaxed whitespace-pre-line mt-24 md:mt-28">
              {`Start-up이 아닌 Start-care\n올라가는 게 아니라 돌봄이 필요한,\n당신을 위해`}
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="s1" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[88vw] max-w-xl aspect-square rounded-3xl bg-white/90 ring-1 ring-gray-200 p-5 md:p-7">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 whitespace-pre-line">
                    폐업 걱정 없는<br />안정적인 사업의 시작
                  </h3>
                  <p className="text-base md:text-xl font-semibold text-gray-800 leading-snug whitespace-pre-line">
                    {`1년 안에 폐업 시,\n이용요금을\n전액 환급 보장해드려요`}
                  </p>
                </div>
              </div>
              <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B81.png"
                  alt="StartCare 보장 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 128px"
                  priority={false}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[88vw] max-w-xl aspect-square rounded-3xl bg-white/90 ring-1 ring-gray-200 p-5 md:p-7">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 whitespace-pre-line">
                    비용 부담 없는\n합리적인 가격의 구성
                  </h3>
                  <p className="text-base md:text-xl font-semibold text-gray-800 leading-snug whitespace-pre-line">
                    {`1년 지나도\n국내 최저가 수준의\n정직한 이용요금`}
                  </p>
                </div>
              </div>
              <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B82.png"
                  alt="합리적 가격 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 128px"
                  priority={false}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[88vw] max-w-xl aspect-square rounded-3xl bg-white/90 ring-1 ring-gray-200 p-5 md:p-7">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-sm">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight whitespace-pre-line mb-3">
                    {`A/S 걱정 없는\n전문적인 대기업 협력사`}
                  </h3>
                  <p className="text-base md:text-xl font-semibold text-gray-800 leading-snug whitespace-pre-line">
                    {`고장, 수리? 걱정마세요!\n사업에만 집중하세요\n신뢰할 수 있는 \n국내 최고수준의 파트너사`}
                  </p>
                </div>
              </div>
              <div className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B83-M126FV1aucxE9omrzoi97Yni3EthOu"
                  alt="대기업 협력사 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 30vw, 128px"
                  priority={false}
                />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}

export default StartCareSlidesSection

