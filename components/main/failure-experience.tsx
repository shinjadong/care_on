"use client"

import { motion } from "framer-motion"

// 실패 경험 섹션 - 현실적인 어려움을 구체적으로 제시하는 구간
// 마치 의사가 환자의 증상을 정확히 진단하는 것처럼, 문제를 명확히 정의

export function FailureExperience() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 문제가 서서히 드러나는 것처럼
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            수많은 실패도 겪었습니다.
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <p>첫 사업은 6개월 만에 실패했습니다.</p>
            <p>새벽까지 사업계획서를 쓰고, 투자자를 만나고, <br />
            각종 세미나를 다녔지만 결과는 참담했습니다.</p>
            <p>월 200만 원의 컨설팅 비용은 실질적인 도움이 되지 않았고, <br />
            이론만 가득한 창업 교육은 현실에서 무용지물이었습니다.</p>
            
            <motion.p 
              className="text-2xl md:text-3xl font-bold text-gray-900 py-4"
              initial={{ opacity: 0, scale: 0.95 }} // 충격적인 사실이 강조되며 등장
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              1년 동안 투자자 미팅은 단 3번…
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}