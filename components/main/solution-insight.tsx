"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 솔루션 깨달음 섹션 - 핵심 해결책을 제시하는 구간
// 마치 등대가 어둠 속 배에게 방향을 제시하는 것처럼, 명확한 해답을 제공

export function SolutionInsight() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 2, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="h-screen bg-gray-900 flex items-center">
      <div className="container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p
              key="s-step-0"
              className="text-lg md:text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              실패를 거듭하며 깨달은 것은 단 하나였습니다.
            </motion.p>
          )}
          {step === 1 && (
            <motion.h2
              key="s-step-1"
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              창업자를 진짜로 보호하는 <br />
              <span className="text-teal-400">안전망</span>만이 <br />
              성공을 만든다.
            </motion.h2>
          )}
          {step === 2 && (
            <motion.h2
              key="s-step-2"
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              우리에겐 그 안전망이 있습니다
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}