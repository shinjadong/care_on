"use client"

import { motion } from "framer-motion"

export function AnxietyCheck() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-8"
          initial={{ opacity: 0, y: 30 }} // 첫 번째 문장이 아래에서 올라옴 (진실이 드러나는 것처럼)
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          겪어본 사람만 아는 <span className="text-red-800">불안</span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 font-medium"
          initial={{ opacity: 0, y: 30 }} // 두 번째 문장이 조금 늦게 아래에서 올라옴 (의문이 떠오르는 것처럼)
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
        >
          왜 이렇게 <span className="text-white">불안</span>할까요?
        </motion.p>
      </div>
    </section>
  )
}
