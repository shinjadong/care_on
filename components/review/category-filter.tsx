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
  { id: "안정기", label: "안정기", description: "사업 안정화" }
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      {/* 카테고리 탭 목록 */}
      <motion.div 
        className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              relative px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium
              transition-all duration-300 ease-out
              ${selectedCategory === category.id
                ? 'bg-[#148777] text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#148777] border border-gray-200'
              }
            `}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
            whileHover={{ 
              scale: selectedCategory === category.id ? 1.05 : 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* 활성 카테고리 배경 글로우 효과 */}
            {selectedCategory === category.id && (
              <motion.div
                className="absolute inset-0 bg-[#148777] rounded-full opacity-20 blur-sm"
                layoutId="categoryGlow"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
            
            {/* 카테고리 라벨 */}
            <span className="relative z-10">
              {category.label}
            </span>
            
            {/* 활성 카테고리 인디케이터 도트 */}
            {selectedCategory === category.id && (
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* 선택된 카테고리 설명 */}
      <motion.div 
        className="mt-4 text-center md:text-left"
        layout
      >
        {categories.map(category => (
          selectedCategory === category.id && (
            <motion.p
              key={category.id}
              className="text-gray-600 text-sm md:text-base"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              📊 {category.description} 관련 후기를 확인하세요
            </motion.p>
          )
        ))}
      </motion.div>
    </div>
  )
}
