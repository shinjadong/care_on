"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import type { Review } from "@/components/review/review-card"

const MotionDiv = dynamic(
  async () => {
    const fm = await import("framer-motion")
    return ({ children, className }: { children: React.ReactNode; className?: string }) => (
      <fm.motion.div className={className} layout>
        {children}
      </fm.motion.div>
    )
  },
  { ssr: false },
)

const ReviewHeader = dynamic(() => import("@/components/review/review-header").then((m) => m.ReviewHeader))
const CategoryFilter = dynamic(() => import("@/components/review/category-filter").then((m) => m.CategoryFilter))
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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const reviewsPerPage = 20

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching reviews:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [selectedCategory, searchTerm, currentPage])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewHeader totalCount={totalCount} onScrollClick={handleScrollDown} />

      <div ref={reviewsSectionRef} className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">고객 후기</h1>
            <p className="text-gray-600 mt-1">케어온과 함께한 창업자들의 생생한 경험담</p>
          </div>
          <Button
            asChild
            className="bg-[#148777] hover:bg-[#0f6b5c] text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <a href="/review/write" className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              후기 작성하기
            </a>
          </Button>
        </div>

        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#148777] mx-auto mb-4"></div>
            <p className="text-gray-600">후기를 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg mb-2">오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4">{error}</p>
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
            <MotionDiv className="grid gap-4 mb-12">
              {reviews.map((review, index) => (
                <WhenVisible key={review.id} minHeight={160}>
                  <ReviewCard review={review} />
                </WhenVisible>
              ))}
            </MotionDiv>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>

            {reviews.length === 0 && (
              <MotionDiv
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-gray-500 text-lg">
                  {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : "해당 카테고리에 후기가 없습니다."}
                </div>
                <p className="text-gray-400 mt-2">다른 검색어나 카테고리를 시도해보세요.</p>
              </MotionDiv>
            )}
          </>
        )}
      </div>
    </div>
  )
}
