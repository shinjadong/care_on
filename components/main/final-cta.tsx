"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useStepScroll } from "@/hooks/use-step-scroll"

// 최종 CTA 섹션 - 행동을 유도하는 마지막 구간
// 마치 영화의 클라이맥스처럼, 결정적인 순간을 제시하여 행동을 이끌어냄

export function FinalCTA() {
  const { sectionRef, step } = useStepScroll({ maxSteps: 1, animationMs: 700, requireExtraScrollOnLastStep: true })

  return (
    <section ref={sectionRef} className="h-screen bg-gray-900 flex items-center">
      <div className="container mx-auto px-4 text-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.h2
              key="c-step-0"
              className="text-3xl md:text-5xl font-bold text-white mb-8"
              style={{ fontFamily: 'Noto Serif KR, serif' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              도전하세요
            </motion.h2>
          )}

          {step === 1 && (
            <motion.div
              key="c-step-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-lg md:text-xl text-gray-300 mb-4">케어온 서비스 신청은 선착순이 아닙니다.</p>
              <p className="text-lg md:text-xl text-gray-300 mb-12">저희 서비스가 도움이 된다고 확신이 되는 분에 한해 진행해드립니다.</p>
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg">
                  <Link href="/start-care">스타트케어 살펴보기</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-gray-900 hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
                  <Link href="/review">성공 사례 확인하기</Link>
                </Button>
              </div>
            </motion.div>
          )}

          {/* 마지막 안내 문구 제거 */}
        </AnimatePresence>
      </div>
    </section>
  )
}
