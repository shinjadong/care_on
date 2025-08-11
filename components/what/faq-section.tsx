"use client"

import { motion } from "framer-motion"

/**
 * WhatFAQSection
 * 목적: 자주 묻는 질문(FAQ) 3문항을 간단히 노출하는 섹션
 * 사용법: `app/what/page.tsx`에서 CTA 섹션 다음에 배치합니다.
 * 제약: 본문 애니메이션은 가벼운 페이드/슬라이드만 적용하여 성능 영향 최소화
 *
 * 비개발자 비유 설명:
 * - 섹션은 웹 페이지의 "한 장면"입니다. 장면 안에 질문과 답(카드)을 배열해둔다고 생각하면 됩니다.
 */
export function WhatFAQSection() {
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  }

  return (
    <section className="relative w-screen snap-start bg-white">
      <div className="mx-auto max-w-5xl px-6 md:px-8 py-16 md:py-24">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-10 md:mb-14"
        >
          자주 묻는 질문
        </motion.h3>

        <div className="space-y-6">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-2xl border border-gray-200 p-5 md:p-7 bg-white shadow-sm"
          >
            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">진짜 무료인가요?</h4>
            <p className="text-base md:text-lg text-gray-700">네 진짜 1년 비용 무료로 해드립니다</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-2xl border border-gray-200 p-5 md:p-7 bg-white shadow-sm"
          >
            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">싸구려 아님?</h4>
            <p className="text-base md:text-lg text-gray-700">아니요 믿을만한 국내 대기업 정품 제품만 취급합니다</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="rounded-2xl border border-gray-200 p-5 md:p-7 bg-white shadow-sm"
          >
            <h4 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">1년 지나면 비용이 많이 발생하는거 아닌가요?</h4>
            <p className="text-base md:text-lg text-gray-700">아닙니다. 국내 최저가 수준으로 마진을 최소화하였습니다</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhatFAQSection

