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
  { value: "CCTV", label: "CCTV", description: "방범/보안 시설" },
  { value: "인터넷", label: "인터넷", description: "인터넷 회선 설치" },
  { value: "TV", label: "TV", description: "TV 및 방송 서비스" },
  { value: "보험", label: "보험", description: "사업자 보험" },
  { value: "POS", label: "POS", description: "POS 시스템" },
  { value: "기타", label: "기타", description: "기타 서비스" },
]

// 업종 분류
const businessTypes = [
  { value: "카페/음식점", label: "카페/음식점" },
  { value: "IT/스타트업", label: "IT/스타트업" },
  { value: "온라인 쇼핑몰", label: "온라인 쇼핑몰" },
  { value: "헬스/뷰티", label: "헬스/뷰티" },
  { value: "교육/학원", label: "교육/학원" },
  { value: "제조/배달", label: "제조/배달" },
  { value: "숙박/펜션", label: "숙박/펜션" },
  { value: "프랜차이즈", label: "프랜차이즈" },
  { value: "기타", label: "기타" },
]

// 사업 경험 레벨
const businessExperienceLevels = [
  { value: "신규창업", label: "신규창업", description: "창업 준비 또는 시작 단계" },
  { value: "1년 이상", label: "1년 이상", description: "사업 운영 경험 1년 이상" },
  { value: "3년 이상", label: "3년 이상", description: "사업 운영 경험 3년 이상" },
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
    business_experience: "" as "" | "신규창업" | "1년 이상" | "3년 이상",
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
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-6">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 인스타그램 스타일 프로필 섹션 */}
            <div className="glass-container-soft p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="story-ring">
                  <div className="story-inner">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold glass-text-primary">새 스토리 작성</h3>
                  <p className="text-sm glass-text-secondary">경험을 공유해주세요</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Input
                    value={formData.author_name}
                    onChange={(e) => handleInputChange("author_name", e.target.value)}
                    placeholder="이름"
                    className="glass-input"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => handleInputChange("author_email", e.target.value)}
                    placeholder="이메일"
                    className="glass-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 인스타그램 스타일 태그 선택 */}
            <div className="glass-container-soft p-6 space-y-6">
              <div>
                <h4 className="font-bold glass-text-primary mb-4"># 서비스 태그</h4>
                <div className="flex flex-wrap gap-3">
                  {serviceCategories.map((service) => (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => handleInputChange("category", service.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.category === service.value
                          ? 'glass-bg-primary glass-text-primary'
                          : 'glass-container glass-text-secondary hover:glass-container-strong'
                      }`}
                    >
                      #{service.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold glass-text-primary mb-4"># 업종 태그</h4>
                <div className="flex flex-wrap gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("business", type.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.business === type.value
                          ? 'glass-bg-secondary glass-text-primary'
                          : 'glass-container glass-text-secondary hover:glass-container-strong'
                      }`}
                    >
                      #{type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold glass-text-primary mb-4"># 경험 레벨</h4>
                <div className="flex flex-wrap gap-3">
                  {businessExperienceLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleInputChange("business_experience", level.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.business_experience === level.value
                          ? 'glass-bg-story glass-text-primary'
                          : 'glass-container glass-text-secondary hover:glass-container-strong'
                      }`}
                    >
                      #{level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 인스타그램 스타일 콘텐츠 작성 */}
            <div className="glass-container-soft p-6 space-y-6">
              <div>
                <h4 className="font-bold glass-text-primary mb-4">스토리 제목</h4>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="어떤 이야기를 들려주시겠어요?"
                  className="glass-input text-lg"
                  required
                />
              </div>

              <div>
                <h4 className="font-bold glass-text-primary mb-4">이야기</h4>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="경험을 자세히 들려주세요..."
                  className="glass-input min-h-[150px] resize-none text-base leading-relaxed"
                  required
                />
              </div>

              <div>
                <h4 className="font-bold glass-text-primary mb-4"># 하이라이트</h4>
                <div className="flex flex-wrap gap-3">
                  {highlightKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      type="button"
                      onClick={() => handleInputChange("highlight", keyword)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        formData.highlight === keyword
                          ? 'glass-bg-accent glass-text-primary'
                          : 'glass-container glass-text-secondary hover:glass-container-strong'
                      }`}
                    >
                      #{keyword}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 인스타그램 스타일 평점 */}
            <div className="glass-container-soft p-6">
              <h4 className="font-bold glass-text-primary mb-4">만족도</h4>
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => handleRatingHover(star)}
                    onMouseLeave={handleRatingLeave}
                    className="p-2 transition-all duration-200 hover:scale-125"
                  >
                    {star <= (hoveredRating || formData.rating) ? (
                      <StarIcon className="w-10 h-10 text-teal-500" />
                    ) : (
                      <StarOutlineIcon className="w-10 h-10 text-gray-300" />
                    )}
                  </button>
                ))}
              </div>
              {(hoveredRating || formData.rating) > 0 && (
                <div className="text-center mt-4">
                  <span className="glass-bg-accent px-4 py-2 rounded-full text-sm font-medium glass-text-primary">
                    {getRatingLabel(hoveredRating || formData.rating)}
                  </span>
                </div>
              )}
            </div>

            {/* 인스타그램 스타일 미디어 업로드 */}
            <div className="glass-container-soft p-6">
              <h4 className="font-bold glass-text-primary mb-4">사진 및 동영상</h4>
              <div className="glass-container p-4 rounded-2xl">
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
              <div className="glass-container p-4">
                <p className={`text-sm ${
                  submitMessage.includes("성공")
                    ? "glass-text-primary"
                    : "text-red-600"
                }`}>
                  {submitMessage}
                </p>
              </div>
            )}

            {/* 인스타그램 스타일 제출 버튼 */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className={`flex-1 rounded-full h-12 font-bold transition-all duration-200 ${
                  isFormValid()
                    ? 'social-button glass-bg-primary glass-text-primary hover:scale-105 active:scale-95'
                    : 'glass-container glass-text-muted opacity-50 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? "업로드 중..." : "스토리 공유하기"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  onClick={onCancel}
                  className="px-6 social-button glass-text-secondary rounded-full h-12"
                >
                  취소
                </Button>
              )}
            </div>

            {/* 안내 메시지 */}
            <p className="text-xs glass-text-muted text-center pt-4">
              스토리는 검토 후 게시됩니다
            </p>
          </form>
        </div>
    </motion.div>
  )
}
