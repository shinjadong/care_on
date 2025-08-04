"use client"

import { motion } from "framer-motion"

// 성과 증명 섹션 - 구체적인 수치로 신뢰도를 구축하는 구간
// 마치 과학자가 실험 결과를 데이터로 증명하는 것처럼, 객관적 근거를 제시

export function SuccessProof() {
  return (
    <section className="py-16 md:py-24 bg-teal-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 성과가 점진적으로 드러나는 것처럼
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-8"
        >
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            이론서에 없는 실전 노하우를 하나씩 쌓아갔습니다. <br />
            <strong>모든 가설을 직접 테스트하고, 실패와 성공을 반복하며</strong> <br />
            <strong>검증된 보호 시스템을 정립했습니다.</strong>
          </p>
          
          <motion.h2 
            className="text-2xl md:text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }} // 핵심 성과가 강조되며 등장
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            그렇게 3년간 <br />
            <span className="text-teal-700">500명의 창업자</span>와 함께하며 <br />
            <span className="text-red-600">95%의 1년 생존율</span>을 달성했습니다.
          </motion.h2>
          
          <p className="text-lg md:text-xl text-gray-700 font-medium">
            이제 그 방법을 나눕니다
          </p>
        </motion.div>
      </div>
    </section>
  )
}