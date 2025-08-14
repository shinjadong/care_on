"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Users } from "lucide-react"
import dynamic from "next/dynamic"

const CareonApplicationForm = dynamic(() => import("./what/CareonApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})

export function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentUsers, setCurrentUsers] = useState(0)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // 초기값 설정 (15-22명 사이)
    const initialUsers = Math.floor(Math.random() * 8) + 15
    setCurrentUsers(initialUsers)

    // 3-8초마다 숫자 변경
    const interval = setInterval(() => {
      setCurrentUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2 // -2 ~ +2
        const newValue = prev + change
        
        // 12-28 사이로 제한
        if (newValue < 12) return 12
        if (newValue > 28) return 28
        return newValue
      })
    }, Math.random() * 5000 + 3000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <>
      <AnimatePresence>
      <motion.div
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-3 h-3" />
          </button>

          {/* 현재 작성중 표시 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUsers}
              className="absolute -top-7 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 text-[11px] text-gray-600 whitespace-nowrap"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Users className="w-3 h-3" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span>
                현재 <span className="font-semibold text-teal-600">{currentUsers}명</span> 작성중
              </span>
            </motion.div>
          </AnimatePresence>

          {/* 메인 버튼 - 투명 배경, 테두리만 */}
          <motion.button
            className="relative px-10 py-1.5 bg-white/70 backdrop-blur-sm border border-teal-500/80 text-teal-600 text-sm font-medium rounded-full transition-all duration-300 group"
            onClick={() => setShowApplicationModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 호버 시 배경 효과 */}
            <motion.div
              className="absolute inset-0 bg-teal-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            
            {/* 미세한 빛나는 효과 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 70%)"
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* 텍스트 */}
            <span className="relative z-10 flex items-center gap-2">
              예약 대기 신청
              <motion.svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </motion.svg>
            </span>
          </motion.button>
        </div>
      </motion.div>
      </AnimatePresence>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
        <div className="relative max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
          <button
            onClick={() => setShowApplicationModal(false)}
            className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <CareonApplicationForm 
            useGrid={true}
            onSuccess={() => {
              setTimeout(() => setShowApplicationModal(false), 2000)
            }}
          />
        </div>
      </div>
    )}
    </>
  )
}
