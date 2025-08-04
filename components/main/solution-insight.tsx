"use client"

import { motion } from "framer-motion"

// 솔루션 깨달음 섹션 - 핵심 해결책을 제시하는 구간
// 마치 등대가 어둠 속 배에게 방향을 제시하는 것처럼, 명확한 해답을 제공

export function SolutionInsight() {
  return (
    <section className="py-20 md:py-32 bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 깨달음이 서서히 떠오르는 것처럼
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            실패를 거듭하며 깨달은 것은 단 하나였습니다.
          </p>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
              style={{ fontFamily: 'Noto Serif KR, serif' }}>
            창업자를 진짜로 보호하는 <br />
            <span className="text-teal-400">안전망</span>만이 <br />
            성공을 만든다.
          </h2>
        </motion.div>
      </div>
    </section>
  )
}