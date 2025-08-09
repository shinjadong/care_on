"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useStepScroll } from "@/hooks/use-step-scroll"
import Image from "next/image"

// 🤔 Why Do This 섹션 - 사용자의 내재된 의구심을 끌어내는 구간
// failure-experience 이후 자연스럽게 문제 의식을 심화시키는 전환점

export function WhyDoThis() {
  const { sectionRef, step } = useStepScroll({ 
    maxSteps: 3, 
    animationMs: 800, 
    requireExtraScrollOnLastStep: true 
  })

  return (
    <section ref={sectionRef} className="relative h-screen bg-gray-50 flex items-center snap-start">
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
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2
                className="text-2xl md:text-3xl font-medium text-gray-600 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                혹시,
              </motion.h2>
              <motion.h3
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5, type: "spring", bounce: 0.2 }}
              >
                이런 생각
              </motion.h3>
              <motion.h4
                className="text-2xl md:text-3xl font-medium text-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                해본 적 없어요?
              </motion.h4>
            </motion.div>
          )}

          {/* Step 1: 매달 내야 하는 내 돈, 이게 가장 합리적인 금액일까? */}
          {step === 1 && (
            <motion.div
              key="why-step-2"
              className="text-center space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.p
                className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                매달 내야 하는 내 돈,
              </motion.p>
              <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", bounce: 0.1 }}
              >
                이게 가장 합리적인<br />
                금액일까?
              </motion.h3>
            </motion.div>
          )}

          {/* Step 2: 그것 아시나요? */}
          {step === 2 && (
            <motion.div
              key="why-step-3"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.7, type: "spring", bounce: 0.3 }}
              >
                그것 아시나요?
              </motion.h2>
              
            </motion.div>
          )}

          {/* Step 3: 이미지 + 텍스트 변화 효과 */}
          {step === 3 && (
            <motion.div
              key="why-step-4"
              className="flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* 텍스트: "그것 아시나요?" → "서비스에도 유통마진이 있다는 걸.." */}
              <motion.div
                className="text-center"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                <motion.h3
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-left leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  서비스에도 유통마진이 있다는 걸..
                </motion.h3>
              </motion.div>

              {/* 이미지 */}
              <motion.div
                className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden"
                animate={{ scale: [0.3, 1] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative h-64 md:h-80">
                  <Image src="/placeholder.jpg" alt="Cost layers" fill style={{ objectFit: "cover" }} priority />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}