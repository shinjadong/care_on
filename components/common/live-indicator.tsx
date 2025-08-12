"use client"

import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function LiveIndicator() {
  const [currentUsers, setCurrentUsers] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 초기값 설정 (12-18명 사이)
    const initialUsers = Math.floor(Math.random() * 7) + 12
    setCurrentUsers(initialUsers)
    
    // 0.5초 후 표시
    setTimeout(() => setIsVisible(true), 500)

    // 5-10초마다 숫자 변경
    const interval = setInterval(() => {
      setCurrentUsers(prev => {
        // 랜덤하게 증가/감소 (-2 ~ +3)
        const change = Math.floor(Math.random() * 6) - 2
        const newValue = prev + change
        
        // 8-25 사이로 제한
        if (newValue < 8) return 8
        if (newValue > 25) return 25
        return newValue
      })
    }, Math.random() * 5000 + 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div 
      className="fixed bottom-32 left-4 sm:left-6 z-40 pointer-events-none"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-full shadow-lg border border-gray-200 px-3 sm:px-4 py-2 flex items-center gap-2">
        <div className="relative">
          <Users className="w-4 h-4 text-teal-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
        <AnimatePresence mode="wait">
          <motion.span 
            key={currentUsers}
            className="text-sm font-medium text-gray-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            현재 <span className="font-bold text-teal-600">{currentUsers}명</span> 작성중
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}