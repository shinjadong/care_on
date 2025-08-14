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
  const [isScrollLocked, setIsScrollLocked] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartY = useRef(0)

  useEffect(() => {
    if (step === 3) {
      setIsScrollLocked(true)
      const timer = setTimeout(() => {
        setIsScrollLocked(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [step])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const changeStep = (direction: "up" | "down") => {
      if (isAnimating || (direction === "down" && isScrollLocked)) return
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
  }, [step, isAnimating, isScrollLocked])

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
          : { top: "15%", left: "50%", x: "-50%", y: "0%", opacity: 1 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        케어온의<br /> 스타트케어란?
      </motion.h2>
      <AnimatePresence mode="wait">

        {step === 1 && (
          <motion.div key="s1" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[80vw] max-w-lg aspect-square rounded-[5rem] bg-[#f8f8fc] p-4 md:p-6">
              <div className="absolute inset-0 flex items-start justify-start">
                <div className="max-w-sm text-left pl-12 md:pl-16 pt-12 md:pt-16">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 whitespace-pre-line">
                    <span style={{color: '#148777'}}>폐업 걱정</span> 없는<br /> 안정적인<br />사업의 시작
                  </h3>
                  <p className="text-base md:text-xl font-medium text-gray-600 leading-snug whitespace-pre-line">
                    {`1년 안에 폐업 시,\n이용요금을\n전액 환급\n보장해드려요`}
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 md:-right-10 md:-bottom-10 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 pointer-events-none">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B81.png"
                  alt="StartCare 보장 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 192px, 256px"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="s2" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[80vw] max-w-lg aspect-square rounded-[5rem] bg-[#f8f8fc] p-4 md:p-6">
              <div className="absolute inset-0 flex items-start justify-start">
                <div className="max-w-sm text-left pl-12 md:pl-16 pt-14 md:pt-16">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3 whitespace-pre-line">
                    <span style={{color: '#148777'}}>비용 부담</span> 없는<br />합리적인<br /> 가격의 구성
                  </h3>
                  <p className="text-base md:text-xl font-medium text-gray-600 leading-snug whitespace-pre-line">
                    {`1년 지나도\n국내 최저가 수준의\n정직한 이용요금`}
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 md:-right-10 md:-bottom-10 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 pointer-events-none">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B82.png"
                  alt="합리적 가격 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 192px, 256px"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="s3" className="w-full flex items-center justify-center"
            variants={slideVariants} initial="hidden" animate="visible" exit="exit">
            <div className="relative w-[80vw] max-w-lg aspect-square rounded-[5rem] bg-[#f8f8fc] p-4 md:p-6">
              <div className="absolute inset-0 flex items-start justify-start">
                <div className="max-w-sm text-left pl-12 md:pl-16 pt-12 md:pt-16">
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight whitespace-pre-line mb-3">
                    <span style={{color: '#148777'}}>A/S 걱정 </span>없는<br /> 전문적인<br /> 대기업 협력사
                  </h3>
                  <p className="text-base md:text-xl font-medium text-gray-600 leading-snug whitespace-pre-line">
                    {`고장, 수리? 걱정마세요!\n 신뢰할 수 있는\n국내 최고의\n 파트너사와\n 함께합니다`}
                  </p>
                </div>
              </div>
              <div className="absolute -right-6 -bottom-6 sm:-right-8 sm:-bottom-8 md:-right-10 md:-bottom-10 w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 pointer-events-none">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%A7%88%EC%8A%A4%EC%BD%94%ED%8A%B8-3"
                  alt="대기업 협력사 이미지"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 192px, 256px"
                  loading="lazy"
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
