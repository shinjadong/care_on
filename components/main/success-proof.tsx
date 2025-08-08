"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 성과 증명 섹션 - 구체적인 수치로 신뢰도를 구축하는 구간
// 마치 과학자가 실험 결과를 데이터로 증명하는 것처럼, 객관적 근거를 제시

export function SuccessProof() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 3, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="h-screen bg-teal-50 flex items-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.p
              key="sp-step-0"
              className="text-lg md:text-xl text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              이론서에 없는 실전 노하우를 쌓았습니다.
            </motion.p>
          )}

          {step === 1 && (
            <motion.h2
              key="sp-step-1"
              className="text-2xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              3년간 <span className="text-teal-700">500명</span>과 함께하며
            </motion.h2>
          )}

          {step === 2 && (
            <motion.h2
              key="sp-step-2"
              className="text-2xl md:text-4xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-red-600">95%</span>의 1년 생존율을 만들었습니다
            </motion.h2>
          )}

          {/* 마지막 안내 문구 제거 */}
        </AnimatePresence>
      </div>
    </section>
  )
}