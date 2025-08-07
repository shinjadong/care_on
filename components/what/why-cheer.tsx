"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

// 🎯 실패를 축하하는 이유를 설명하는 섹션
// 이제 isVisible 프롭 대신, 사용자가 스크롤하여 컴포넌트가 화면에 보일 때 애니메이션이 실행됩니다.

export function WhyCheer() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScroll(true)
    }, 3000) // 3초 후에 스크롤 아이콘을 보여줌

    return () => clearTimeout(timer)
  }, [])

  return (
    // 부모 요소를 relative로 설정하여 자식의 absolute 위치 기준점으로 삼음
    <section className="relative h-screen w-screen snap-start bg-gradient-to-b from-black to-gray-800 flex items-center justify-center px-4 py-20">
      {/*
        [개발자 노트]
        - h-screen, w-screen, snap-start: 풀페이지 스크롤 섹션의 표준 스타일입니다.
      */}
      <motion.div
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 2.0,
          ease: "easeOut",
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
            delay: 0.5, // 지연 증가 (0.4s -> 0.5s)
            ease: "easeOut",
          }}
        >
          실패가 <br />
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            두렵지 않은 세상,
          </span>
        </motion.h1>

        {/* 등장 효과를 위한 추가 애니메이션 요소 */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.8,
            delay: 1.2,
            ease: "easeOut",
          }}
        >
          <div className="bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent text-xl md:text-2xl font-bold">
            케어온이 <br />
            사장님의 성공에 투자하겠습니다.
          </div>
        </motion.div>
      </motion.div>

      {/* 스크롤 다운 유도 애니메이션 */}
      {showScroll && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: [0, 1, 1, 0], // 나타났다 -> 유지 -> 사라짐
            y: [-20, 0, 10, -20], // 위에서 내려와서 아래로 살짝 더 갔다가 위로 사라짐
          }}
          transition={{
            duration: 3, // 전체 애니메이션 지속 시간
            times: [0, 0.2, 0.8, 1], // 각 키프레임의 시간 위치
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2,
          }}
          onAnimationComplete={() => setShowScroll(false)} // 애니메이션이 끝나면 컴포넌트 숨김
        >
          <ChevronDown className="w-10 h-10 text-white" />
        </motion.div>
      )}
    </section>
  )
}
