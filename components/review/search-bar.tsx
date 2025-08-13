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

  const popularSearches = ["첫 1년 보장", "창업 지원", "폐업 보험", "재기 지원", "사업 컨설팅"]

  return (
    <motion.div
      className="w-full max-w-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center bg-white border-2 rounded-2xl transition-all duration-300 shadow-lg
            ${
              isFocused
                ? "border-transparent bg-gradient-to-r from-cyan-50 to-pink-50 shadow-2xl"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {isFocused && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-pink-500 rounded-2xl p-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl h-full w-full" />
            </motion.div>
          )}

          <motion.div
            className={`
              absolute left-4 z-10 transition-colors duration-300
              ${isFocused ? "text-cyan-600" : "text-gray-400"}
            `}
            animate={{
              scale: isFocused ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </motion.div>

          <input
            type="text"
            placeholder="Search reviews by content or business type..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative z-10 w-full pl-12 pr-12 py-4 text-sm bg-transparent outline-none placeholder-gray-400 rounded-2xl"
          />

          {searchTerm && (
            <motion.button
              onClick={handleClear}
              className="absolute right-4 z-10 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <XMarkIcon className="w-5 h-5" />
            </motion.button>
          )}
        </motion.div>

        {isFocused && !searchTerm && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl z-20 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="text-lg">🔥</span>
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <motion.button
                    key={search}
                    onClick={() => onSearchChange(search)}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full hover:from-cyan-500 hover:to-pink-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
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

      {searchTerm && (
        <motion.div
          className="mt-3 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          Searching for "
          <span className="bg-gradient-to-r from-cyan-600 to-pink-500 bg-clip-text text-transparent font-semibold">
            {searchTerm}
          </span>
          "...
        </motion.div>
      )}

      {!isFocused && !searchTerm && (
        <motion.div
          className="mt-3 text-xs text-gray-400 text-center flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <span className="text-base">💡</span>
          Try searching by business type or keywords
        </motion.div>
      )}
    </motion.div>
  )
}
