"use client"

import { motion } from "framer-motion"

// 🎯 실패를 축하하는 이유를 설명하는 섹션
// 영상 종료 후 자동으로 등장하는 애니메이션 컴포넌트

interface WhyCheerProps {
  isVisible: boolean // 영상 종료 후 표시 여부
}

export function WhyCheer({ isVisible }: WhyCheerProps) {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-20">
      <motion.div 
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={isVisible ? { 
          opacity: 1, 
          y: 0, 
          scale: 1 
        } : { 
          opacity: 0, 
          y: 50, 
          scale: 0.9 
        }}
        transition={{ 
          duration: 1.2, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
      >
        {/* 메인 헤드라인 */}
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ 
            duration: 0.8, 
            delay: isVisible ? 0.3 : 0,
            ease: "easeOut" 
          }}
        >
          실패했는데 <br className="md:hidden" />
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            왜 박수칠까요?
          </span>
        </motion.h1>

        {/* 등장 효과를 위한 추가 애니메이션 요소 */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={isVisible ? { 
            opacity: 1, 
            scale: [0, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : { 
            opacity: 0, 
            scale: 0 
          }}
          transition={{ 
            duration: 1, 
            delay: isVisible ? 0.8 : 0,
            ease: "easeOut" 
          }}
        >
          <div className="text-6xl">👏</div>
        </motion.div>
      </motion.div>
    </section>
  )
}