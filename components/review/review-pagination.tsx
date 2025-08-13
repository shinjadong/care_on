"use client"

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
    <div className="flex items-center justify-center gap-2">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 rounded-lg text-sm transition-all duration-200
          ${currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-600 hover:text-[#148777]'
          }
        `}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      {/* 페이지 번호들 */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <div key={`${page}-${index}`}>
            {page === "..." ? (
              <span className="px-2 py-1 text-gray-400">…</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  px-3 py-1 rounded-lg text-sm transition-all duration-200
                  ${currentPage === page
                    ? 'bg-[#148777] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 rounded-lg text-sm transition-all duration-200
          ${currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-600 hover:text-[#148777]'
          }
        `}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  )
}
