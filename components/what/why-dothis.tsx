"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 🤔 Why Do This 섹션 - 사용자의 내재된 의구심을 끌어내는 구간
// failure-experience 이후 자연스럽게 문제 의식을 심화시키는 전환점

export function WhyDoThis() {
  const { sectionRef, step } = useStepScroll({ 
    // 교육자 모드: 0(인트로) → 1(메인 카피) → 2(사장님의 1년을) → 3(케어온이 보장해드리겠습니다.)
    maxSteps: 3, 
    animationMs: 600, 
    requireExtraScrollOnLastStep: true,
    extraScrollCountOnLastStep: 1
  })
  const isMobile = useIsMobile()

  return (
    <section ref={sectionRef} className="relative h-screen w-screen snap-start bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Step 0: 혹시, 이런 생각 해본 적 없어요? */}
          {step === 0 && (
            <motion.div
              key="why-step-1"
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <motion.h2
                className="text-2xl md:text-3xl font-medium text-gray-700 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                혹시,
              </motion.h2>
              <motion.h3
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3, type: "spring", bounce: 0.15 }}
              >
                사장님
              </motion.h3>
              <motion.h4
                className="text-2xl md:text-3xl font-medium text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                이신가요?
              </motion.h4>
            </motion.div>
          )}

          {/* Step 1: 메인 카피 중앙 정렬 (모바일/PC 공통) */}
          {step === 1 && (
            <motion.div
              key="why-step-1-main"
              className="relative w-full h-[60vh] md:h-[64vh] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center">
                <motion.p
                  className="text-xl md:text-2xl font-medium text-gray-700 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.45 }}
                >
                  충격적인 제안
                </motion.p>
                <motion.h3
                  className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  드릴게요
                </motion.h3>
              </div>
            </motion.div>
          )}

          {/* Step 2: 사장님의 1년을 */}
          {step === 2 && (
            <motion.div
              key="why-step-2-promise-1"
              className="relative w-full h-[60vh] md:h-[64vh] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 text-center leading-tight"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                사장님의 1년을
              </motion.h3>
            </motion.div>
          )}

          {/* Step 3: 케어온이 보장해드리겠습니다. */}
          {step === 3 && (
            <motion.div
              key="why-step-3-promise-2"
              className="relative w-full h-[60vh] md:h-[64vh] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3
                className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 text-center leading-tight"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                케어온이<br />
                지원해드리겠습니다.
              </motion.h3>
            </motion.div>
          )}

          {/* Step 2+ 영역은 전면 재구축 예정으로 제거됨 */}
        </AnimatePresence>
      </div>
    </section>
  )
}
