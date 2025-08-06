"use client"

import { motion } from "framer-motion"

// 히어로 섹션 - 강력한 문제 제기로 시선을 끌어당기는 구간
// 마치 영화의 첫 장면처럼, 관객의 관심을 단숨에 사로잡는 역할

export function HeroSection() {
  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
      <div className="w-full max-w-none px-4 text-center">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight"
          style={{ fontFamily: 'Noto Serif KR, serif' }}
          initial={{ opacity: 0, y: 30 }} // 아래에서 위로 서서히 등장 (진실이 드러나는 것처럼)
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          수백만원을 투자했지만 <br />
          그 어떤 컨설팅도, <br />
          <br />
          <span className="text-red-600">내 사업의 위험</span>을 <br />
          막아주지 못했습니다.
        </motion.h1>
      </div>
    </section>
  )
}