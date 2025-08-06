"use client"

import { motion } from "framer-motion"

// 📖 스토리 섹션 - 감정적 여정을 통한 공감대 형성
// 투자자가 있는 세상과 없는 세상의 극명한 대비를 통해 문제의식 각인

export function WhatStorySection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* 1️⃣ 투자자가 있는 세상의 차이 */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            그들에겐 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">투자자</span>가 있으니까
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              일론 머스크의 SpaceX는 로켓 3번 실패했습니다.<br />
              실패 원인: "알 수 없음"<br />
              손실액: 1,000억원<br />
              <strong className="text-gray-900">하지만 아무도 빚쟁이가 되지 않았습니다.</strong>
            </p>
            <p>
              왜? 투자자가 있으니까.<br />
              실패는 데이터고, 데이터는 다음 성공의 발판이니까.
            </p>
          </div>
        </motion.div>

        {/* 2️⃣ 현실의 벽 - 투자자 없는 창업자의 현실 */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            당신에겐 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">투자자</span>가 없나요?
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              서울대 출신 창업자가 스타트업 3개 말아먹어도<br />
              또 투자받는 이유를 아시나요?
            </p>
            <p>
              <strong className="text-gray-900">"실패 경험이 있는 창업자"</strong>라는 스펙이 되거든요.
            </p>
          </div>
        </motion.div>

        {/* 📊 현실적 비교 차트 - 데이터로 보는 격차 */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 my-16 p-8 bg-gray-50 rounded-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* 좌측: 서울대 창업자 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">🎓 서울대 창업자</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-black text-teal-600">2.7회</div>
                <div className="text-sm text-gray-500">평균 실패 횟수</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-600">15억원</div>
                <div className="text-sm text-gray-500">누적 투자액</div>
              </div>
              <div>
                <div className="text-3xl font-black text-teal-600">0원</div>
                <div className="text-sm text-gray-500">개인 부채</div>
              </div>
            </div>
          </div>

          {/* 우측: 동네 사장님 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">🍗 동네 사장님</h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-black text-red-600">1.2회</div>
                <div className="text-sm text-gray-500">평균 실패 횟수</div>
              </div>
              <div>
                <div className="text-3xl font-black text-red-600">5천만원</div>
                <div className="text-sm text-gray-500">투자액(대출)</div>
              </div>
              <div>
                <div className="text-3xl font-black text-red-600">3천만원</div>
                <div className="text-sm text-gray-500">남은 빚</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3️⃣ 솔루션 제시 - 케어온의 독특한 가치 제안 */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
            이제 당신에게도 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">투자자</span>가 생겼습니다
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-gray-700 max-w-3xl mx-auto">
            <p>
              <strong className="text-2xl text-gray-900">케어온이 당신의 첫 투자자가 되겠습니다.</strong>
            </p>
            <p>
              Y Combinator가 실리콘밸리 스타트업을 키우듯<br />
              케어온이 대한민국 자영업자를 키웁니다.
            </p>
            <p>
              실패해도 괜찮습니다.<br />
              아니, <strong className="text-xl text-gray-900">실패가 축하받는 세상</strong>을 만들겠습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}