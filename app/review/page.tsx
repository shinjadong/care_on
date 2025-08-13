"use client"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"
import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import { motion } from "framer-motion"
import type { Review } from "@/components/review/review-card"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <ReviewHeader totalCount={totalCount} onScrollClick={handleScrollDown} />

      <div ref={reviewsSectionRef} className="container mx-auto px-4 py-12 max-w-7xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-pink-500 bg-clip-text text-transparent mb-4">
            Share Your Experience
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Help Others Make Informed Choices
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <a href="/review/write" className="flex items-center gap-3">
                <PlusIcon className="w-6 h-6" />
                Write a Review
              </a>
            </Button>
          </motion.div>
        </motion.div>

        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />

        {isLoading && (
          <motion.div className="text-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-6"></div>
              <div
                className="absolute inset-0 rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto animate-spin"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
              ></div>
            </div>
            <p className="text-gray-600 text-lg">Loading amazing stories...</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-red-500 text-2xl mb-4">⚠️ Something went wrong</div>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={fetchReviews}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full transition-colors"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {!isLoading && !error && (
          <>
            <motion.div
              className="grid gap-8 mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    ease: "easeOut",
                  }}
                >
                  <WhenVisible minHeight={200}>
                    <ReviewCard review={review} />
                  </WhenVisible>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col lg:flex-row justify-between items-center gap-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ReviewPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </motion.div>

            {reviews.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 max-w-lg mx-auto">
                  <div className="text-6xl mb-6">🔍</div>
                  <div className="text-gray-600 text-xl mb-4">
                    {searchTerm ? `No results found for "${searchTerm}"` : "No reviews in this category yet"}
                  </div>
                  <p className="text-gray-500">Try a different search term or category</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
