"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export const RoboAnimation = () => {
  return (
    <div className="relative w-full h-full">
      {/* 로봇 아이콘과 빛나는 효과 */}
      <motion.div 
        className="absolute bottom-20 right-20 flex flex-col items-center"
        animate={{ y: [0, -20, 0] }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* 빛나는 원 효과 */}
        <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
        {/* 로봇 아이콘 */}
        <div className="relative z-10 bg-purple-600 p-5 rounded-full shadow-lg shadow-purple-500/50">
          <Bot className="w-12 h-12 text-white" />
        </div>
        {/* 밑에 그림자 효과 */}
        <div className="mt-6 w-16 h-2 bg-black/10 rounded-full blur-sm" />
      </motion.div>

      {/* 주변에 떠다니는 작은 입자들 */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-purple-400"
          style={{
            top: `${40 + Math.random() * 40}%`,
            left: `${40 + Math.random() * 40}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* 데이터 처리 라인 효과 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-0.5 rounded-full bg-gradient-to-r from-purple-500/0 via-purple-500 to-purple-500/0"
          style={{
            top: `${50 + (i * 10)}%`,
            left: '10%',
            width: '80%',
          }}
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  )
} 