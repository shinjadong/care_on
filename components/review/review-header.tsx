"use client"

import { motion } from "framer-motion"

interface ReviewHeaderProps {
  totalCount: number
  onScrollClick: () => void // 부모로부터 스크롤 함수를 받음
}

export function ReviewHeader({ totalCount, onScrollClick }: ReviewHeaderProps) {
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
            
            {/* 통계 숫자 강조 버튼 */}
            {/*
              [컴포넌트 변경 및 기능 추가]
              - div -> motion.button: 시각적으로는 동일하지만, 이제 클릭 가능한 '버튼' 역할을 합니다.
              - onClick={onScrollClick}: 버튼 클릭 시, 부모 컴포넌트(ReviewPage)로부터 전달받은 onScrollClick 함수를 실행합니다.
                이 함수는 미리 "깃발"을 꽂아둔 후기 목록 섹션으로 화면을 부드럽게 스크롤시킵니다.
              - whileTap: 사용자가 버튼을 클릭하는 순간, 버튼이 살짝 작아지는(scale: 0.98) 시각적 피드백을 주어 버튼임을 명확히 인지시킵니다.
            */}
            <motion.button
              onClick={onScrollClick}
              className="inline-block bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white px-6 py-3 rounded-full text-xl md:text-2xl font-bold shadow-lg cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-white">{totalCount.toLocaleString()}명</span> 사업자의 선택
            </motion.button>
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
