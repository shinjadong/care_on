"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline"
import type { Review } from "@/components/review/review-card"

interface AdminReviewsResponse {
  reviews: Review[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: statusFilter,
      })

      const response = await fetch(`/api/reviews/admin?${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch reviews")
      }

      const data: AdminReviewsResponse = await response.json()

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

  const updateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_approved: isApproved }),
      })

      if (!response.ok) {
        throw new Error("Failed to update review")
      }

      // Refresh the reviews list
      fetchReviews()
    } catch (err) {
      console.error("Error updating review:", err)
      alert("후기 상태 업데이트에 실패했습니다.")
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (!confirm("정말로 이 후기를 삭제하시겠습니까?")) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete review")
      }

      // Refresh the reviews list
      fetchReviews()
    } catch (err) {
      console.error("Error deleting review:", err)
      alert("후기 삭제에 실패했습니다.")
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [currentPage, statusFilter])

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const getStatusBadge = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-100 text-green-800">승인됨</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">후기 관리</h1>
          <p className="text-gray-600">제출된 후기를 검토하고 승인/거부할 수 있습니다.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">전체 후기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">승인된 후기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.is_approved).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">대기중인 후기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{reviews.filter((r) => !r.is_approved).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="approved">승인됨</SelectItem>
                <SelectItem value="pending">대기중</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={fetchReviews} variant="outline">
            새로고침
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#148777] mx-auto mb-4"></div>
            <p className="text-gray-600">후기를 불러오는 중...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 text-lg mb-2">오류가 발생했습니다</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchReviews}>다시 시도</Button>
          </div>
        )}

        {/* Reviews List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Review Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{review.category}</Badge>
                          {getStatusBadge(review.is_approved || false)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.created_at && formatDate(review.created_at)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">{review.business}</h3>
                        <p className="text-sm text-gray-600">
                          작성자: {review.author_name} ({review.author_email})
                        </p>
                        {review.period && <p className="text-sm text-gray-600">기간: {review.period}</p>}
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700 leading-relaxed">
                          {review.highlight ? (
                            <>
                              {review.content.split(review.highlight)[0]}
                              <span className="bg-yellow-200 px-1 rounded font-medium">{review.highlight}</span>
                              {review.content.split(review.highlight)[1]}
                            </>
                          ) : (
                            review.content
                          )}
                        </p>
                      </div>

                      {review.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>{i < review.rating! ? "★" : "☆"}</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.rating}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:w-32">
                      {!review.is_approved && (
                        <Button
                          onClick={() => updateReviewStatus(review.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1 lg:flex-none"
                          size="sm"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          승인
                        </Button>
                      )}

                      {review.is_approved && (
                        <Button
                          onClick={() => updateReviewStatus(review.id, false)}
                          variant="outline"
                          className="flex-1 lg:flex-none"
                          size="sm"
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          승인취소
                        </Button>
                      )}

                      <Button
                        onClick={() => deleteReview(review.id)}
                        variant="destructive"
                        className="flex-1 lg:flex-none"
                        size="sm"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        삭제
                      </Button>

                      <Button
                        onClick={() => window.open(`/review?search=${review.business}`, "_blank")}
                        variant="outline"
                        className="flex-1 lg:flex-none"
                        size="sm"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {reviews.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-500 text-lg">
                  {statusFilter === "pending"
                    ? "대기중인 후기가 없습니다."
                    : statusFilter === "approved"
                      ? "승인된 후기가 없습니다."
                      : "후기가 없습니다."}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                이전
              </Button>

              <span className="px-4 py-2 text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                다음
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
