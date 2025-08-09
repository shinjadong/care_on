"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

// 🎭 What 페이지 인트로 섹션 
// 스크롤에 반응하여 순차적으로 텍스트가 나타나는 애니메이션

export function WhatIntroSection() {
  const containerRef = useRef<HTMLElement>(null)
  
  // 스크롤 진행도 감지
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // 스크롤 진행도에 따른 텍스트 애니메이션 값 변환
  const text1Progress = useTransform(scrollYProgress, [0, 0.3], [0, 1])
  const text2Progress = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
  const text3Progress = useTransform(scrollYProgress, [0.6, 1], [0, 1])

  // 텍스트 Y축 이동 애니메이션
  const text1Y = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const text2Y = useTransform(scrollYProgress, [0.3, 0.6], [100, 0])
  const text3Y = useTransform(scrollYProgress, [0.6, 1], [100, 0])

  return (
    <section 
      ref={containerRef}
      className="h-screen w-screen snap-start bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* 
        [개발자 노트]
        - h-screen, w-screen: 섹션이 화면 전체를 꽉 채우도록 합니다.
        - snap-start: 이 섹션의 시작 부분이 부모의 스냅 지점이 되도록 설정합니다.
        - overflow-hidden: 애니메이션 중 텍스트가 화면 밖으로 나가는 것을 방지합니다.
      */}
      
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-green-100/20"></div>
      
      {/* 메인 텍스트 컨테이너 */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl">
        
        {/* 첫 번째 텍스트: "사장님," */}
        <motion.div
          style={{ 
            opacity: text1Progress,
            y: text1Y
          }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            사장님,
          </motion.span>
        </motion.div>

        {/* 두 번째 텍스트: "케어온이 1년간" */}
        <motion.div
          style={{ 
            opacity: text2Progress,
            y: text2Y
          }}
          className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-800"
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            케어온이 1년간
          </motion.span>
        </motion.div>

        {/* 세 번째 텍스트: "모든걸 보장해 드립니다." */}
        <motion.div
          style={{ 
            opacity: text3Progress,
            y: text3Y
          }}
          className="text-2xl md:text-4xl lg:text-5xl font-medium text-gray-700"
        >
          <motion.span
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            모든걸 보장해 드립니다.
          </motion.span>
        </motion.div>

        {/* 강조 포인트 */}
        <motion.div
          style={{ opacity: text3Progress }}
          className="pt-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-lg font-semibold shadow-lg"
          >
            <span>💯</span>
            <span className="ml-2">100% 보장 서비스</span>
          </motion.div>
        </motion.div>
      </div>

      {/* 스크롤 인디케이터 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">스크롤하세요</p>
      </motion.div>
    </section>
  )
}