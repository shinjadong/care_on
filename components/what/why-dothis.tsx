"use client"

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useStepScroll } from "@/hooks/use-step-scroll"
import Image from "next/image"

// 🤔 Why Do This 섹션 - 사용자의 내재된 의구심을 끌어내는 구간
// failure-experience 이후 자연스럽게 문제 의식을 심화시키는 전환점

export function WhyDoThis() {
  const { sectionRef, step } = useStepScroll({ 
    // 교육자 모드: 만화 컷을 넘기듯 스크롤 단계(step)를 0→4까지 확장합니다.
    // 사용자가 한 번 더 스크롤하면 다음 장면이 등장하도록 maxSteps를 4로 설정합니다.
    maxSteps: 5, 
    animationMs: 800, 
    requireExtraScrollOnLastStep: true 
  })

  // Step 5 스크롤 연동을 위한 타깃 영역 참조
  const scrollSectionRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    // 교육자 모드 비유: 구간(progress bar)을 만들어 눈금(스크롤 정도)에 맞춰 값이 0→1로 변화합니다.
    target: scrollSectionRef,
    offset: ["start end", "end start"],
  })
  // 스크롤 정도에 맞춰 서서히 나타나는 투명도
  const imgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.4, 1], [0, 0.25, 0.8, 1])
  // 스크롤과 함께 화면 하단에서 등장하며 확대되는 효과
  const imgTranslateY = useTransform(scrollYProgress, [0, 1], [200, -150]) // 아래에서 위로
  const imgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]) // 작게에서 크게

  return (
    <section ref={sectionRef} className="relative h-screen w-screen snap-start overflow-hidden overscroll-contain bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex flex-col items-center justify-center p-4">
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

          {/* Step 3: 이미지 + 텍스트 변화 효과 → 다음 장면으로 넘어갈 때 '역동적 퇴장' */}
          {step === 3 && (
            <motion.div
              key="why-step-4"
              className="flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              // 교육자 모드 비유: 무대 전환. 배우(이미지)가 다음 장면 직전 살짝 위로 튀며 사라져 시선 전환을 돕습니다.
              exit={{ opacity: 0, y: -80, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* 텍스트: "그것 아시나요?" → "서비스에도 유통마진이 있다는 걸.." */}
              <motion.div
                className="text-center"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              >
                <motion.h3
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-left leading-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  서비스에도 유통마진이 있다는 걸..
                </motion.h3>
              </motion.div>

              {/* 이미지 */}
              <motion.div
                className="relative w-full max-w-3xl rounded-xl shadow-xl overflow-hidden"
                animate={{ scale: [0.3, 1] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="relative h-64 md:h-80">
                  <Image 
                    src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/what-domae-omgvaFEkjRFcSXd4tZB8hVIBy8YIUu" 
                    alt="서비스에도 유통마진이 있다는 걸"
                    fill 
                    className="object-contain md:object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority 
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: 이전 이미지가 사라진 뒤, 새 이미지와 카피 등장 */}
          {step === 4 && (
            <motion.div
              key="why-step-5"
              className="flex flex-col items-center justify-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* 카피: 그 '비효율'만 제거하면 정당한 금액으로 누릴 수 있단 걸 */}
              <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 text-center leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                그 '비효율'만 제거하면, <br />
                <br className="hidden md:block" />
                정당한 금액으로 누릴 수 있단 걸
              </motion.h3>

              {/* 새 이미지: 등장 시 약간의 확대-디블러 효과로 집중도 상승 */}
              <motion.div
                className="relative w-full max-w-3xl rounded-xl shadow-xl overflow-hidden"
                initial={{ opacity: 0, scale: 1.05, filter: "blur(6px)" as any }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" as any }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {/* 교육자 모드: '이미지 교체'는 가격표를 새로 붙이는 것과 같습니다. 보이는 정보가 바뀌면 인식도 자연스레 전환됩니다. */}
                <div className="relative h-64 md:h-80">
                  <Image
                    src="/placeholder-optimized.jpg"
                    alt="Fair price after removing inefficiencies"
                    fill
                    className="object-contain md:object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                    priority={false}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 5: 세로 1:2 비율(세로로 긴) 풀폭 이미지 - 스크롤 정도에 맞춰 서서히 등장하고, 스크롤과 함께 내려옴 */}
          {step === 5 && (
            <section
              key="why-step-6"
              ref={scrollSectionRef}
              className="w-screen max-w-none"
            >
              <div className="relative w-full" style={{ height: "200vh" }}>
                {/* 고정 헤더/여백 고려: 상단 패딩으로 첫 노출 타이밍 조절 */}
                <div className="sticky top-0 w-full h-screen overflow-hidden">
                  <motion.div
                    className="relative w-full h-full"
                    style={{ 
                      opacity: imgOpacity, 
                      y: imgTranslateY, 
                      scale: imgScale 
                    }}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src="/placeholder-vertical.jpg"
                        alt="Vertical immersive visual"
                        fill
                        priority={false}
                        className="object-contain md:object-cover"
                        sizes="100vw"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}