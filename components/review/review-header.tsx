"use client"

import { motion } from "framer-motion"

interface ReviewHeaderProps {
  totalCount: number
}

export function ReviewHeader({ totalCount }: ReviewHeaderProps) {
  return (
    <section className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center md:pt-44 md:pb-20">
      <div className="w-full max-w-4xl px-4">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* 메인 타이틀과 숫자 */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              케어온과 함께한 
              <br />
              <span className="text-[#148777] font-extrabold">창업자들의 성공 스토리</span>
            </h1>
            
            {/* 통계 숫자 강조 */}
            <motion.div 
              className="inline-block bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white px-6 py-3 rounded-full text-xl md:text-2xl font-bold shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <span className="text-white">{totalCount.toLocaleString()}명</span> 사업자의 선택
            </motion.div>
          </motion.div>

          {/* 서브 타이틀 */}
          <motion.div 
            className="text-gray-300 text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          >
            <p className="mb-2">
              실제 경험과 성과를 직접 확인해보세요.
            </p>
            <p className="text-gray-400">
              여러분과 같은 고민을 하던 <span className="text-white font-semibold">창업자들의 이야기</span>입니다.
            </p>
          </motion.div>

          {/* 장식 요소 */}
          <motion.div 
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#148777] rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.8 + (i * 0.1),
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}