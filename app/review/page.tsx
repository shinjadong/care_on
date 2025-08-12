"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import { reviewsData } from "@/lib/reviews-data"

// 교육자 모드 설명:
// - framer-motion은 비교적 무거운 의존성입니다. 페이지 초기 진입에서 필요하지 않다면 뒤로 미룹니다.
// - 리스트의 각 카드도 가시 영역에서만 마운트하면 렌더 비용을 절약할 수 있습니다.

const MotionDiv = dynamic(async () => {
  const fm = await import("framer-motion")
  return ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <fm.motion.div className={className} layout>
      {children}
    </fm.motion.div>
  )
}, { ssr: false })

const ReviewHeader = dynamic(() => import("@/components/review/review-header").then(m => m.ReviewHeader))
const CategoryFilter = dynamic(() => import("@/components/review/category-filter").then(m => m.CategoryFilter))
const ReviewCard = dynamic(() => import("@/components/review/review-card").then(m => m.ReviewCard))
const ReviewPagination = dynamic(() => import("@/components/review/review-pagination").then(m => m.ReviewPagination))
const SearchBar = dynamic(() => import("@/components/review/search-bar").then(m => m.SearchBar))

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
        <MotionDiv className="grid gap-4 mb-12">
          {currentReviews.map((review, index) => (
            <WhenVisible key={review.id} minHeight={160}>
              <ReviewCard review={review} />
            </WhenVisible>
          ))}
        </MotionDiv>

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
