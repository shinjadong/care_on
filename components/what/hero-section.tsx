"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// 🎬 실패를 축하하는 SpaceX 스타일의 히어로 섹션
// 마치 영화의 첫 장면처럼 강렬한 임팩트로 시선을 사로잡는 구간

export function WhatHeroSection() {
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showExplosion, setShowExplosion] = useState(false)
  const [showApplause, setShowApplause] = useState(false)

  // 🚀 SpaceX 로켓 발사 애니메이션 - 실패해도 박수받는 문화를 시각적으로 표현
  // 이는 React의 상태관리를 활용한 순차적 애니메이션 구현 예시입니다
  const playRocketAnimation = () => {
    setShowCountdown(true)
    setCountdown(3)
    
    // setInterval을 사용해 카운트다운을 구현 (마치 타이머처럼 작동)
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer) // 타이머 정리 (메모리 누수 방지)
          setShowCountdown(false)
          
          // setTimeout을 중첩 사용해 순차적 애니메이션 연출
          // 폭발 후 박수 - 실패가 축하받는 순간을 연출
          setTimeout(() => {
            setShowExplosion(true)
            setTimeout(() => {
              setShowExplosion(false)
              setShowApplause(true)
            }, 1000)
          }, 500)
          
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <section className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
      <motion.div 
        className="w-full max-w-4xl mb-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 🎥 인터랙티브 비디오 플레이스홀더 */}
        <div 
          className="relative bg-gray-800 rounded-3xl overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
          onClick={playRocketAnimation}
        >
          <div className="aspect-video flex flex-col justify-center items-center relative">
            <AnimatePresence>
              {showCountdown && (
                <motion.div 
                  className="text-6xl md:text-8xl font-bold text-white mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {countdown}...
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="text-6xl md:text-8xl"
              animate={showCountdown ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5, repeat: showCountdown ? Infinity : 0 }}
            >
              🚀
            </motion.div>
            
            <AnimatePresence>
              {showExplosion && (
                <motion.div 
                  className="absolute text-8xl md:text-9xl"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  💥
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {showApplause && (
                <motion.div 
                  className="absolute text-4xl md:text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  👏👏👏
                </motion.div>
              )}
            </AnimatePresence>
            
            {!showCountdown && !showExplosion && !showApplause && (
              <motion.p 
                className="mt-6 text-gray-400 text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                [SpaceX 로켓 실패 영상 재생 - 클릭]
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
          실패했는데 <br className="md:hidden" />
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
            왜 박수칠까요?
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300">
          SpaceX 로켓 폭발 후 직원들이 환호하는 이유
        </p>
      </motion.div>
    </section>
  )
}