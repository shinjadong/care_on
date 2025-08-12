"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onSearchChange("")
  }

  const popularSearches = [
    "첫 1년 보장", "창업 지원", "폐업 보험", "재기 지원", "사업 컨설팅"
  ]

  return (
    <motion.div 
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 검색 입력창 */}
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center bg-white border-2 rounded-lg transition-all duration-300
            ${isFocused 
              ? 'border-[#148777] shadow-lg shadow-[#148777]/10' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
          animate={{
            scale: isFocused ? 1.02 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {/* 검색 아이콘 */}
          <motion.div 
            className={`
              absolute left-3 transition-colors duration-300
              ${isFocused ? 'text-[#148777]' : 'text-gray-400'}
            `}
            animate={{
              scale: isFocused ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </motion.div>

          {/* 입력 필드 */}
          <input
            type="text"
            placeholder="후기 내용이나 업종으로 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-10 py-3 text-sm bg-transparent outline-none placeholder-gray-400"
          />

          {/* 클리어 버튼 */}
          {searchTerm && (
            <motion.button
              onClick={handleClear}
              className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XMarkIcon className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>

        {/* 포커스 시 나타나는 인기 검색어 */}
        {isFocused && !searchTerm && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                🔥 인기 검색어
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <motion.button
                    key={search}
                    onClick={() => onSearchChange(search)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-[#148777] hover:text-white transition-all duration-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.2, 
                      delay: index * 0.05,
                      ease: "easeOut" 
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 검색 결과 표시 */}
      {searchTerm && (
        <motion.div 
          className="mt-2 text-sm text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          "<span className="text-[#148777] font-medium">{searchTerm}</span>" 검색 중...
        </motion.div>
      )}

      {/* 검색 팁 */}
      {!isFocused && !searchTerm && (
        <motion.div 
          className="mt-2 text-xs text-gray-400 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          💡 업종이나 키워드로 검색해보세요
        </motion.div>
      )}
    </motion.div>
  )
}