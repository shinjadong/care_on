"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface FloatingPaperProps {
  count?: number
}

export const FloatingPaper = ({ count = 5 }: FloatingPaperProps) => {
  const [papers, setPapers] = useState<{ id: number; x: number; y: number; rotate: number; scale: number; delay: number }[]>([])

  useEffect(() => {
    const newPapers = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      rotate: Math.random() * 30 - 15,
      scale: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 5,
    }))
    setPapers(newPapers)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {papers.map((paper) => (
        <motion.div
          key={paper.id}
          className="floating-paper w-[300px] h-[400px] rounded-lg bg-white"
          initial={{
            left: `${paper.x}%`,
            top: `${paper.y}%`,
            rotate: paper.rotate,
            scale: paper.scale,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [paper.rotate - 5, paper.rotate + 5, paper.rotate - 5],
          }}
          transition={{
            duration: 10 + paper.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: paper.delay,
          }}
        />
      ))}
    </div>
  )
}

