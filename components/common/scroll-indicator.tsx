"use client"

import { motion } from "framer-motion"

interface ScrollIndicatorProps {
  currentStep: number
  maxSteps: number
  className?: string
}

export function ScrollIndicator({ currentStep, maxSteps, className = "" }: ScrollIndicatorProps) {
  // 마지막 스텝에서는 인디케이터를 숨김
  if (currentStep >= maxSteps) return null

  return (
    <motion.div 
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      {/* 메인 컨테이너 */}
      <div className="flex flex-col items-center gap-2">
        {/* 텍스트 */}
        <motion.span 
          className="text-xs text-gray-500 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
        >
          스크롤
        </motion.span>
        
        {/* 화살표 애니메이션 */}
        <div className="relative w-6 h-10">
          {/* 첫 번째 화살표 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-gray-400"
            >
              <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          
          {/* 두 번째 화살표 (더 빠른 애니메이션) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              y: [0, 8, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="text-gray-300"
            >
              <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>

        {/* 진행 상태 점들 */}
        <div className="flex gap-1.5 mt-1">
          {Array.from({ length: maxSteps + 1 }, (_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'bg-teal-500 w-4' 
                  : i < currentStep 
                  ? 'bg-teal-300' 
                  : 'bg-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}