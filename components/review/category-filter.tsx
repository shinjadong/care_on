"use client"

import { motion } from "framer-motion"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { id: "전체", label: "전체", description: "모든 후기" },
  { id: "창업 준비", label: "창업 준비", description: "창업 전 준비 단계" },
  { id: "첫 1년", label: "첫 1년", description: "케어온 핵심 서비스" },
  { id: "성장기", label: "성장기", description: "사업 성장 단계" },
  { id: "안정기", label: "안정기", description: "사업 안정화" },
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-12">
      <motion.div
        className="flex flex-wrap gap-3 justify-center lg:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative px-6 py-3 rounded-2xl text-sm font-semibold
              transition-all duration-300 ease-out border-2
              ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-cyan-600 to-pink-500 text-white border-transparent shadow-xl scale-105"
                  : "bg-white text-gray-600 hover:text-cyan-600 border-gray-200 hover:border-cyan-300 hover:shadow-lg"
              }
            `}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              scale: selectedCategory === category.id ? 1.05 : 1.03,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedCategory === category.id && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-pink-500/20 rounded-2xl blur-lg"
                layoutId="categoryGlow"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}

            <span className="relative z-10">{category.label}</span>

            {selectedCategory === category.id && (
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      <motion.div className="mt-6 text-center lg:text-left" layout>
        {categories.map(
          (category) =>
            selectedCategory === category.id && (
              <motion.div
                key={category.id}
                className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <p className="text-gray-600 text-base flex items-center justify-center lg:justify-start gap-3">
                  <span className="text-2xl">📊</span>
                  <span className="font-medium">{category.description}</span> 관련 후기를 확인하세요
                </p>
              </motion.div>
            ),
        )}
      </motion.div>
    </div>
  )
}
