"use client"

import { motion } from "framer-motion"

export function WhatIsItSection() {
  return (
    <section className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex items-center justify-center p-4">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.64, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#222222] mb-6">
          케어온 스타트케어란?
        </h2>
        <p className="text-lg md:text-2xl text-[#222222] leading-relaxed whitespace-pre-line">
          {`Start-up이 아닌 Start-care\n올라가는 게 아니라 돌봄이 필요한,\n당신을 위해`}
        </p>
      </motion.div>
    </section>
  )
}

export default WhatIsItSection

