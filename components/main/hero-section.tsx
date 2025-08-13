"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 히어로 섹션 - 스크롤 스텝 기반으로 3줄 이하 카피가 순차 등장
export function HeroSection() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 3, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
      <div className="w-full max-w-none px-4 text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h1
              key="h-step-0"
              className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              수백만원을 투자했지만
            </motion.h1>
          )}

          {step === 1 && (
            <motion.h1
              key="h-step-1"
              className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              그 어떤 컨설팅도
            </motion.h1>
          )}

          {step === 2 && (
            <motion.h1
              key="h-step-2"
              className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="text-red-600">내 사업의 위험</span>을 막지 못했습니다
            </motion.h1>
          )}

          {step === 3 && (
            <motion.h1
              key="h-step-3"
              className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              그래서, 우리는 다른 방식으로 시작합니다
            </motion.h1>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
