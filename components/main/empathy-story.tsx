"use client"

import { motion } from "framer-motion"

// 공감 스토리 섹션 - 독자와 동질감을 형성하는 구간
// 마치 친구가 자신의 이야기를 털어놓는 것처럼, 신뢰 관계를 구축

export function EmpathyStory() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 스크롤하면서 자연스럽게 등장
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">
            3년 전, 저도 여러분과 같은 <span className="text-teal-700">예비 창업자</span>였습니다.
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }} // 각 문단이 순차적으로 등장 (이야기가 펼쳐지는 것처럼)
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="font-semibold text-xl md:text-2xl text-gray-900"
            >
              불안했습니다.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p>실패할까봐, 가족을 실망시킬까봐 매일 밤 잠을 이루지 못했습니다.</p>
              <p>창업 컨설팅은 비싸고, 혼자 준비하기엔 한계가 있었습니다.</p>
              <p>그래서 스스로 해결책을 찾아야만 했죠.</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}