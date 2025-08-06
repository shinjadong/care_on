"use client"

import { motion } from "framer-motion"

// 🎯 실패를 축하하는 이유를 설명하는 섹션
// 이제 isVisible 프롭 대신, 사용자가 스크롤하여 컴포넌트가 화면에 보일 때 애니메이션이 실행됩니다.

export function WhyCheer() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4 py-20">
      {/*
        [애니메이션 로직 변경]
        - animate -> whileInView: 'isVisible' 상태에 의존하지 않고, 컴포넌트가 뷰포트에 들어올 때 애니메이션을 실행합니다.
        - viewport={{ once: true }}: 애니메이션이 딱 한 번만 실행되도록 설정합니다. 사용자가 스크롤을 올렸다 내려도 다시 실행되지 않습니다.
        - 마치 무대(viewport)에 배우(컴포넌트)가 처음 등장할 때만 스포트라이트를 받는 것과 같습니다.
      */}
      <motion.div 
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ 
          duration: 2.0, // 속도 저하 (1.5s -> 2.0s)
          ease: "easeOut",
          type: "spring",
          stiffness: 80,
          damping: 20
        }}
      >
        {/* 메인 헤드라인 */}
        <motion.h1 
          className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1.5, // 속도 저하 (1.0s -> 1.5s)
            delay: 0.5,    // 지연 증가 (0.4s -> 0.5s)
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
          whileInView={{ 
            opacity: 1, 
            scale: [0, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          viewport={{ once: true }}
          transition={{ 
            duration: 1.8, // 속도 저하 (1.2s -> 1.8s)
            delay: 1.2,    // 지연 증가 (1.0s -> 1.2s)
            ease: "easeOut" 
          }}
        >
          <div className="text-6xl">👏</div>
        </motion.div>
      </motion.div>
    </section>
  )
}
