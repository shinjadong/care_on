"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ReviewHeader } from "@/components/review/review-header"
import { CategoryFilter } from "@/components/review/category-filter"
import { ReviewCard } from "@/components/review/review-card"
import { ReviewPagination } from "@/components/review/review-pagination"
import { SearchBar } from "@/components/review/search-bar"
import { reviewsData } from "@/lib/reviews-data"

export default function ReviewPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 20

  // 스크롤 목표 지점을 위한 ref 생성
  const reviewsSectionRef = useRef<HTMLDivElement>(null)

  // 스크롤 다운 핸들러
  const handleScrollDown = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // 필터링된 후기 데이터
  const filteredReviews = reviewsData.filter(review => {
    const matchesCategory = selectedCategory === "전체" || review.category === selectedCategory
    const matchesSearch = review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.business.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)
  const startIndex = (currentPage - 1) * reviewsPerPage
  const currentReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage)

  // 카테고리 변경 시 페이지 리셋
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // 검색어 변경 시 페이지 리셋
  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더에 스크롤 핸들러 전달 */}
      <ReviewHeader 
        totalCount={reviewsData.length} 
        onScrollClick={handleScrollDown}
      />
      
      {/* 메인 컨텐츠에 ref 연결 */}
      <div ref={reviewsSectionRef} className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* 카테고리 필터 */}
        <CategoryFilter 
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* 후기 리스트 */}
        <motion.div 
          className="grid gap-4 mb-12"
          layout
        >
          {currentReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              layout
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </motion.div>

        {/* 페이지네이션과 검색 */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <ReviewPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        {/* 검색 결과 없음 */}
        {filteredReviews.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-500 text-lg">
              {searchTerm ? 
                `"${searchTerm}"에 대한 검색 결과가 없습니다.` : 
                "해당 카테고리에 후기가 없습니다."
              }
            </div>
            <p className="text-gray-400 mt-2">
              다른 검색어나 카테고리를 시도해보세요.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
