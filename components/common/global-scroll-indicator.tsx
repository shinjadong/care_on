"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export function GlobalScrollIndicator() {
  const [hide, setHide] = useState(false)
  const mainRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // main 요소 찾기
    const mainElement = document.querySelector('main')
    if (!mainElement) {
      console.log('Main element not found')
      return
    }
    
    mainRef.current = mainElement

    const handleScroll = () => {
      if (!mainRef.current) return
      
      const scrollTop = mainRef.current.scrollTop
      const scrollHeight = mainRef.current.scrollHeight
      const clientHeight = mainRef.current.clientHeight
      
      // 페이지 끝에 가까워지면 숨김
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        setHide(true)
      } else {
        setHide(false)
      }
    }

    // 초기 확인
    handleScroll()
    
    mainElement.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      mainElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (hide) return null

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-md border border-gray-200"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-600 font-medium"></span>
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-teal-600"
            animate={{ y: [0, 3, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  )
}
