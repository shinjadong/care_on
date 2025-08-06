"use client"

import { motion } from "framer-motion"

// 🎯 CTA 섹션 - 강력한 행동 유도
// "첫 투자자"라는 독특한 포지셔닝으로 차별화된 가치 제안

interface WhatCTASectionProps {
  onInvestorClick: () => void // 부모 컴포넌트에서 전달받는 콜백 함수
}

export function WhatCTASection({ onInvestorClick }: WhatCTASectionProps) {
  return (
    <section className="py-20 md:py-24 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            케어온 스타트케어
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
            Start-up이 아닌 Start-care<br />
            올라가는 게 아니라 돌봄이 필요한 당신을 위해
          </p>
          <motion.button
            className="inline-flex items-center px-12 py-4 bg-white text-teal-600 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
            onClick={onInvestorClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            첫 투자자 되어드립니다
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}