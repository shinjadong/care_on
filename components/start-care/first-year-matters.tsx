"use client"

// 마케팅의 '보장과 신뢰' 단계 = 최종적으로 안전망을 제시하여 결정을 돕는 기법
// 마치 보험이 위험을 보장해주는 것과 같음

import { motion } from "framer-motion"
import Image from "next/image"

export function FirstYearMatters() {
  return (
    <section className="bg-black">
      {/* 메인 제목 - 이미지 위에 배치 */}
      <motion.div 
        className="py-16 md:py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <motion.h2 
              className="text-3xl md:text-5xl font-bold text-white leading-tight" 
              style={{fontFamily: 'Noto Serif KR, serif'}}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              가장 큰 고비는,
              <span className="text-red-800"> 첫 1년</span>
            </motion.h2>
          </div>
        </div>
      </motion.div>

      {/* 이미지 영역 - 모바일: 와이드, 데스크탑: 중앙 정렬 */}
      <motion.div 
        className="w-full md:flex md:justify-center px-4 md:px-0"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div 
          className="relative w-full md:max-w-4xl aspect-square max-w-[calc(100vw-2rem)] mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* 국세청 자료 이미지 */}
          <Image
            src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EA%B5%AD%EC%84%B8%EC%B2%AD%EC%9E%90%EB%A3%8C"
            alt="국세청 첫 1년 창업 통계 자료"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          
          {/* 아래로 갈수록 희미해지는 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black"></div>
        </motion.div>
      </motion.div>

      {/* 통계 문구 - 이미지 아래 */}
      <motion.div 
        className="py-8 md:py-12"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 font-semibold"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              4명 중 한명은, 1년을 못 버팁니다.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* 나머지 카피라이팅 섹션 */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* 결심 섹션 */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p 
              className="text-lg md:text-xl text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              그래서, 결심했습니다
            </motion.p>
            <motion.h3 
              className="text-2xl md:text-3xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              가장 위험한 그 1년을
              <br />
              <span className="text-[#148777] font-extrabold">함께 걷겠습니다.</span>
            </motion.h3>
          </motion.div>


          {/* 케어온의 약속 */}
          <motion.div 
            className="text-center mb-12 md:mb-16 p-8 md:p-12 bg-gray-800/50 rounded-lg border border-gray-700"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h4 
              className="text-xl md:text-2xl font-bold text-[#e5ce9f] mb-4" 
              style={{fontFamily: 'Noto Serif KR, serif'}}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              케어온의 약속
            </motion.h4>
            <motion.p 
              className="text-2xl md:text-3xl font-bold text-white mb-6" 
              style={{fontFamily: 'Garamond, serif'}}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              "1년 내 폐업 시, 100% 환급"
            </motion.p>
            <motion.p 
              className="text-lg text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              이것은 단순한 환급 정책이 아닙니다.
              <br />
              <br />
              <span className="text-white font-semibold">당신의 도전을 지켜주는 안전망입니다.</span>
            </motion.p>
          </motion.div>

          {/* 비전 메시지 */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p 
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
              실패가 두렵지 않은 세상.
              <br />

            </motion.p>
            <motion.p 
              className="text-xl md:text-2xl font-bold text-white"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.3 }}
            >
               <span className="text-[#148777] font-extrabold">케어온이 만들어갑니다.</span>
            </motion.p>
          </motion.div>


        </div>
      </div>
    </section>
  )
}
