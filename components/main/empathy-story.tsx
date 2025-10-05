"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 공감 스토리 섹션 - 독자와 동질감을 형성하는 구간
// 마치 친구가 자신의 이야기를 털어놓는 것처럼, 신뢰 관계를 구축

export function EmpathyStory() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 2, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="e-step-0"
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              3년 전, 저도 여러분과 같은 <span className="text-teal-700">예비 창업자</span>였습니다.
            </motion.h2>
          )}

          {step === 1 && (
            <motion.p
              key="e-step-1"
              className="font-semibold text-xl md:text-2xl text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              불안했습니다.
            </motion.p>
          )}

          {step === 2 && (
            <motion.div
              key="e-step-2"
              className="space-y-4 text-lg md:text-xl text-gray-700 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p>실패할까봐, 가족을 실망시킬까봐 밤을 설쳤습니다.</p>
              <p>컨설팅은 비쌌고, 혼자 준비에는 한계가 있었습니다.</p>
              <p>그래서 스스로 길을 찾아야만 했죠.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
