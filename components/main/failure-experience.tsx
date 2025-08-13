"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 실패 경험 섹션 - 현실적인 어려움을 구체적으로 제시하는 구간
// 마치 의사가 환자의 증상을 정확히 진단하는 것처럼, 문제를 명확히 정의

export function FailureExperience() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 2, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="h-screen bg-white flex items-center snap-start">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="f-step-0"
              className="text-xl md:text-2xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              수많은 실패도 겪었습니다.
            </motion.h2>
          )}

          {step === 1 && (
            <motion.div
              key="f-step-1"
              className="space-y-4 text-lg md:text-xl text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p>첫 사업은 6개월 만에 실패했습니다.</p>
              <p>새벽까지 준비했지만 결과는 참담했습니다.</p>
              <p>비싼 컨설팅, 현실과 먼 교육뿐이었습니다.</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.p
              key="f-step-2"
              className="text-2xl md:text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              1년 동안 투자자 미팅은 단 3번…
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
