"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 타겟팅 체크리스트 섹션 - 적합한 대상을 명확히 정의하는 구간
// 마치 의사가 환자를 선별하는 것처럼, 정확한 타겟을 설정

export function TargetChecklist() {
  const targetItems = [
    "'월 순수익 500만원 이하', 컨설팅 비용이 부담스러우신 분",
    "2025년 안전한 창업을 시작하고 싶은 분",
    "'실제 성과를 내본 실무자'의 노하우를 얻고 싶은 분", 
    "'1년 보장 시스템'으로 리스크를 줄이고 싶은 분",
    "이론이 아닌 '실전 중심의 창업 지원'을 받고 싶은 분",
    "'창업에 필수적인' 도구들을 마스터하고 싶은 분",
    "같은 고민을 하는 창업자들과의 모임/교류를 만들고 싶은 분"
  ]

  const { sectionRef, step } = useStepScroll({ maxSteps: 1, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="h-screen bg-white flex items-center">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="t-step-0"
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              해당하신다면, <br />
              주저하지 마세요.
            </motion.h2>
          )}

          {step === 1 && (
            <motion.div
              key="t-step-1"
              className="space-y-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {targetItems.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-teal-600 font-bold text-xl">✓</span>
                  <span className="text-gray-700 text-lg">{item}</span>
                </div>
              ))}
            </motion.div>
          )}

          {/* 마지막 안내 문구 제거 */}
        </AnimatePresence>
      </div>
    </section>
  )
}
