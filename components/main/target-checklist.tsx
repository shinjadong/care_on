"use client"

import { motion } from "framer-motion"

// 타겟팅 체크리스트 섹션 - 적합한 대상을 명확히 정의하는 구간
// 마치 의사가 환자를 선별하는 것처럼, 정확한 타겟을 설정

export function TargetChecklist() {
  const targetItems = [
    "'월 순수익 500만원 이하', 컨설팅 비용이 부담스러우신 분",
    "2025년 안전한 창업을 시작하고 싶은 분",
    "'실제 성과를 내본 실무자'의 노하우를 얻고 싶은 분", 
    "'1년 보장 시스템'으로 리스크를 줄이고 싶은 분",
    "이론이 아닌 '실전 중심의 창업 지원'을 받고 싶은 분",
    "'창업에 필수적인' 도구들을 마스터하고 싶은 분",
    "같은 고민을 하는 창업자들과의 모임/교류를 만들고 싶은 분"
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 체크리스트가 서서히 나타나는 것처럼
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            해당하신다면, <br />
            주저하지 마세요.
          </h2>
          
          <div className="space-y-4 mb-12">
            {targetItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }} // 각 항목이 좌측에서 순차적으로 등장 (체크리스트가 작성되는 것처럼)
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-teal-600 font-bold text-xl">✓</span>
                <span className="text-gray-700 text-lg">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}