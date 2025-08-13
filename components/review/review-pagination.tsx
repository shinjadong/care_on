"use client"

import { motion } from "framer-motion"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface ReviewPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ReviewPagination({ currentPage, totalPages, onPageChange }: ReviewPaginationProps) {
  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 7
    
    if (totalPages <= maxVisiblePages) {
      // 총 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 총 페이지가 많으면 현재 페이지 주변만 표시
      const startPage = Math.max(1, currentPage - 3)
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      
      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push("...")
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...")
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) return null

  return (
    <motion.div 
      className="flex items-center justify-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* 이전 페이지 버튼 */}
      <motion.button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-[#148777] hover:bg-gray-50'
          }
        `}
        whileHover={currentPage !== 1 ? { scale: 1.02 } : {}}
        whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span className="hidden sm:block">이전</span>
      </motion.button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <motion.div
            key={`${page}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.05,
              ease: "easeOut" 
            }}
          >
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <motion.button
                onClick={() => onPageChange(page as number)}
                className={`
                  relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentPage === page
                    ? 'bg-[#148777] text-white shadow-md'
                    : 'text-gray-600 hover:text-[#148777] hover:bg-gray-50'
                  }
                `}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* 현재 페이지 글로우 효과 */}
                {currentPage === page && (
                  <motion.div
                    className="absolute inset-0 bg-[#148777] rounded-lg opacity-20 blur-sm"
                    layoutId="pageGlow"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                )}
                <span className="relative z-10">{page}</span>
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      <motion.button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${currentPage === totalPages 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-[#148777] hover:bg-gray-50'
          }
        `}
        whileHover={currentPage !== totalPages ? { scale: 1.02 } : {}}
        whileTap={currentPage !== totalPages ? { scale: 0.98 } : {}}
      >
        <span className="hidden sm:block">다음</span>
        <ChevronRightIcon className="w-4 h-4" />
      </motion.button>

      {/* 페이지 정보 표시 */}
      <motion.div 
        className="ml-4 text-sm text-gray-500 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      >
        {currentPage} / {totalPages} 페이지
      </motion.div>
    </motion.div>
  )
}
