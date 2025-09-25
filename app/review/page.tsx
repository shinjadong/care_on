"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline"
import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import type { Review } from "@/components/review/review-card"

const MotionDiv = dynamic(
  async () => {
    const fm = await import("framer-motion")
    return ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
      <fm.motion.div className={className} layout {...props}>
        {children}
      </fm.motion.div>
    )
  },
  { ssr: false },
)

const ReviewHeader = dynamic(() => import("@/components/review/review-header").then((m) => m.ReviewHeader))
const ReviewFilters = dynamic(() => import("@/components/review/category-filter").then((m) => m.ReviewFilters))
const ReviewCard = dynamic(() => import("@/components/review/review-card").then((m) => m.ReviewCard))
const ReviewPagination = dynamic(() => import("@/components/review/review-pagination").then((m) => m.ReviewPagination))
const SearchBar = dynamic(() => import("@/components/review/search-bar").then((m) => m.SearchBar))

interface ReviewsResponse {
  reviews: Review[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export default function ReviewPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedBusiness, setSelectedBusiness] = useState("전체")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [falseReviewCount, setFalseReviewCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reviewsPerPage = 12

  const reviewsSectionRef = useRef<HTMLDivElement>(null)

  const handleScrollDown = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: reviewsPerPage.toString(),
      })

      if (selectedCategory !== "전체") {
        params.append("category", selectedCategory)
      }

      if (selectedBusiness !== "전체") {
        params.append("business", selectedBusiness)
      }

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await fetch(`/api/reviews?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data: ReviewsResponse = await response.json()

      setReviews(data.reviews)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
      
      // Fetch false review count
      const falseResponse = await fetch('/api/reviews/false-count')
      if (falseResponse.ok) {
        const falseData = await falseResponse.json()
        setFalseReviewCount(falseData.count || 0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching reviews:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [selectedCategory, selectedBusiness, searchTerm, currentPage])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleBusinessChange = (business: string) => {
    setSelectedBusiness(business)
    setCurrentPage(1)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen relative">
      {/* 통합된 헤더 - 카운트 기능 + 스토리 디자인 */}
      <section className="w-full py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              케어온 멤버십, <span className="text-teal-600">리얼 후기</span>
            </h1>

            {/* 카운트 버튼 */}
            <button
              onClick={handleScrollDown}
              className="inline-flex items-center bg-teal-600 text-white px-6 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-200 mb-6"
            >
              <span className="text-xl md:text-2xl font-extrabold">
                {Math.floor(totalCount * 3).toLocaleString()}명
              </span>
              <span className="ml-2 text-sm">사장님들의 선택</span>
            </button>

            <div className="mt-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">스토리</h2>
              <p className="text-gray-600">진짜 사장님들의 이야기</p>
            </div>
          </div>
        </div>
      </section>

      <div ref={reviewsSectionRef} className="container mx-auto px-4 py-8 max-w-4xl">

        <ReviewFilters 
          selectedCategory={selectedCategory} 
          selectedBusiness={selectedBusiness}
          onCategoryChange={handleCategoryChange} 
          onBusinessChange={handleBusinessChange}
        />

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-gray-200 border-t-[#148777]"></div>
            <p className="text-gray-600 mt-4">후기를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-semibold mb-2">오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <button
              onClick={fetchReviews}
              className="px-4 py-2 bg-[#148777] text-white rounded-lg hover:bg-[#0f6b5c] transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <MotionDiv className="space-y-6 mb-12">
              {reviews.map((review, index) => (
                <WhenVisible key={review.id} minHeight={200}>
                  <div className="thread-card">
                    <ReviewCard review={review} />
                  </div>
                </WhenVisible>
              ))}
            </MotionDiv>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>

            {reviews.length === 0 && (
              <MotionDiv
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-gray-500">
                  {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "해당 업종의 후기가 없습니다."}
                </div>
                <p className="text-gray-400 text-sm mt-2">다른 검색어나 카테고리를 시도해보세요.</p>
              </MotionDiv>
            )}
          </>
        )}
      </div>

      {/* 인스타그램 스타일 스토리 작성 버튼 */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="story-ring">
          <div className="story-inner">
            <Button
              asChild
              className="w-16 h-16 rounded-full social-button bg-white text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
            >
              <a href="/review/write">
                <PlusIcon className="w-8 h-8" />
              </a>
            </Button>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-600 font-medium">스토리 작성</span>
        </div>
      </div>
    </div>
  )
}
