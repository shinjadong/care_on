"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"
import { MediaUpload } from "./media-upload"

interface ReviewFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

// 케어온에서 제공하는 서비스 카테고리
const serviceCategories = [
  { value: "CCTV", label: "CCTV", icon: "📹", description: "방범/보안 시설" },
  { value: "인터넷", label: "인터넷", icon: "🌐", description: "인터넷 회선 설치" },
  { value: "TV", label: "TV", icon: "📺", description: "TV 및 방송 서비스" },
  { value: "보험", label: "보험", icon: "🛡️", description: "사업자 보험" },
  { value: "POS", label: "POS", icon: "💳", description: "POS 시스템" },
  { value: "기타", label: "기타", icon: "⭐", description: "기타 서비스" },
]

// 업종 분류
const businessTypes = [
  { value: "카페/음식점", label: "카페/음식점", icon: "☕" },
  { value: "IT/스타트업", label: "IT/스타트업", icon: "💻" },
  { value: "온라인 쇼핑몰", label: "온라인 쇼핑몰", icon: "🛒" },
  { value: "헬스/뷰티", label: "헬스/뷰티", icon: "💅" },
  { value: "교육/학원", label: "교육/학원", icon: "🎓" },
  { value: "제조/배달", label: "제조/배달", icon: "🚚" },
  { value: "숙박/펜션", label: "숙박/펜션", icon: "🏨" },
  { value: "프랜차이즈", label: "프랜차이즈", icon: "🏪" },
  { value: "기타", label: "기타", icon: "📦" },
]

const highlightKeywords = [
  "합리적인 가격",
  "친절한 상담원",
  "상세한 견적",
  "빠른 업무 처리",
  "체계적인 관리",
  "실질적인 도움",
  "전문적인 컨설팅",
  "만족스러운 결과",
]

export function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    business: "",
    title: "",
    content: "",
    highlight: "",
    rating: 0,
    author_name: "",
    author_email: "",
    images: [] as string[],
    videos: [] as string[],
    youtube_urls: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const router = useRouter()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const handleRatingHover = (rating: number) => {
    setHoveredRating(rating)
  }

  const handleRatingLeave = () => {
    setHoveredRating(0)
  }

  const getRatingLabel = (rating: number) => {
    const labels = ["", "별로예요", "그저 그래요", "보통이에요", "만족해요", "매우 만족해요"]
    return labels[rating] || ""
  }

  const isFormValid = () => {
    return formData.author_name && 
           formData.author_email && 
           formData.category && 
           formData.business && 
           formData.title && 
           formData.content
  }

  const handleMediaChange = (images: string[], videos: string[], youtubeUrls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
      videos,
      youtube_urls: youtubeUrls,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          highlight: formData.highlight ? [formData.highlight] : [], // Convert highlight to array
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitMessage("후기가 성공적으로 제출되었습니다. 검토 후 게시됩니다.")
        setFormData({
          category: "",
          business: "",
          title: "",
          content: "",
          highlight: "",
          rating: 0,
          author_name: "",
          author_email: "",
          images: [],
          videos: [],
          youtube_urls: [],
        })
        onSuccess?.()

        setTimeout(() => {
          router.push("/review")
        }, 2000)
      } else {
        setSubmitMessage(result.error || "후기 제출에 실패했습니다.")
      }
    } catch (error) {
      setSubmitMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 미니멀 헤더 */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-light text-gray-900 mb-2">
          후기 작성
        </h2>
        <p className="text-gray-500 text-sm font-light">
          케어온과 함께한 경험을 공유해주세요
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">이름</label>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => handleInputChange("author_name", e.target.value)}
                    placeholder="홍길동"
                    className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">이메일</label>
                  <Input
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => handleInputChange("author_email", e.target.value)}
                    placeholder="example@email.com"
                    className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1 rounded-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 서비스 선택 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">이용하신 서비스</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                  required
                >
                  <option value="">서비스를 선택하세요</option>
                  {serviceCategories.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.icon} {service.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">사업 업종</label>
                <select
                  value={formData.business}
                  onChange={(e) => handleInputChange("business", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                  required
                >
                  <option value="">업종을 선택하세요</option>
                  {businessTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 후기 내용 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">제목</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="케어온 덕분에 카페 창업이 성공적이었어요!"
                  className="border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">후기 내용</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="케어온과 함께한 경험을 자세히 작성해주세요..."
                  className="min-h-[150px] border-gray-200 focus:border-[#148777] focus:ring-[#148777] focus:ring-1 rounded-lg resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">강조 문구 (선택)</label>
                <select
                  value={formData.highlight}
                  onChange={(e) => handleInputChange("highlight", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:border-[#148777] focus:ring-[#148777] focus:ring-1"
                >
                  <option value="">강조할 문구를 선택하세요</option>
                  {highlightKeywords.map((keyword) => (
                    <option key={keyword} value={keyword}>
                      {keyword}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 평점 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">만족도</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                    className="p-1 transition-all duration-200 hover:scale-110"
                  >
                    {star <= (hoveredRating || formData.rating) ? (
                      <StarIcon className="w-8 h-8 text-[#148777]" />
                    ) : (
                      <StarOutlineIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                ))}
                {(hoveredRating || formData.rating) > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {getRatingLabel(hoveredRating || formData.rating)}
                  </span>
                )}
              </div>
            </div>

            {/* 미디어 업로드 */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-900">사진 및 동영상 (선택)</label>
              <div className="border border-gray-200 rounded-lg p-4">
                <MediaUpload
                  onMediaChange={handleMediaChange}
                  initialImages={formData.images}
                  initialVideos={formData.videos}
                  initialYoutubeUrls={formData.youtube_urls}
                />
              </div>
            </div>

            {/* 제출 메시지 */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg text-sm ${
                  submitMessage.includes("성공")
                    ? "bg-gray-50 text-gray-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="flex-1 bg-[#148777] hover:bg-[#0f6b5c] text-white border-0 rounded-lg h-12 font-medium transition-colors duration-200"
              >
                {isSubmitting ? "제출 중..." : "후기 제출하기"}
              </Button>
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel} 
                  className="px-6 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg h-12"
                >
                  취소
                </Button>
              )}
            </div>

            {/* 간단한 안내 */}
            <p className="text-xs text-gray-500 text-center pt-4">
              제출된 후기는 검토 후 게시됩니다
            </p>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
