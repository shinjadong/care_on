"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, ExclamationCircleIcon, UserIcon, EnvelopeIcon, BuildingOfficeIcon, PencilSquareIcon, SparklesIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { MediaUpload } from "./media-upload"

interface ReviewFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const categories = [
  { value: "창업 준비", label: "창업 준비", icon: "🚀", description: "사업 시작 전 준비 단계" },
  { value: "첫 1년", label: "첫 1년", icon: "🌱", description: "창업 후 첫 해" },
  { value: "성장기", label: "성장기", icon: "📈", description: "사업 확장 단계" },
  { value: "안정기", label: "안정기", icon: "🏆", description: "안정적 운영 단계" },
]

const businessTypes = [
  { value: "카페/베이커리", label: "카페/베이커리", icon: "☕" },
  { value: "음식점", label: "음식점", icon: "🍴" },
  { value: "온라인 쇼핑몰", label: "온라인 쇼핑몰", icon: "🛒" },
  { value: "미용/네일", label: "미용/네일", icon: "💅" },
  { value: "헬스/피트니스", label: "헬스/피트니스", icon: "🏋️" },
  { value: "교육/학원", label: "교육/학원", icon: "🎓" },
  { value: "IT/소프트웨어", label: "IT/소프트웨어", icon: "💻" },
  { value: "패션/의류", label: "패션/의류", icon: "👗" },
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
  const [currentStep, setCurrentStep] = useState(1)
  const router = useRouter()

  const steps = [
    { number: 1, title: "기본 정보 및 사업 정보", icon: UserIcon },
    { number: 2, title: "후기 작성 및 평가", icon: PencilSquareIcon },
  ]

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

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.author_name && formData.author_email && formData.category && formData.business
      case 2:
        return formData.content
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (isStepValid(currentStep) && currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
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
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-[#148777] to-[#0f6b5c] rounded-t-2xl p-8 text-white">
        <motion.h2 
          className="text-3xl font-bold mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          후기 작성하기
        </motion.h2>
        <motion.p 
          className="text-white/90 text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          케어온과 함께한 경험을 공유해주세요. 다른 창업자들에게 큰 도움이 됩니다.
        </motion.p>
      </div>

      <div className="bg-white rounded-b-2xl shadow-xl">
        <div className="border-b border-gray-100 px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <button
                  type="button"
                  onClick={() => isStepValid(step.number - 1) || step.number <= currentStep ? setCurrentStep(step.number) : null}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                    currentStep === step.number
                      ? "bg-[#148777] text-white shadow-lg scale-110"
                      : currentStep > step.number
                      ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200 hover:scale-110 active:scale-95"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </button>
                <div className="ml-3 mr-8">
                  <p className={`text-sm font-medium ${
                    currentStep === step.number ? "text-[#148777]" : "text-gray-500"
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-20 rounded-full transition-all duration-500 ${
                    currentStep > step.number ? "bg-green-400" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <UserIcon className="w-5 h-5 mr-2 text-[#148777]" />
                        기본 정보
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="author_name" className="text-sm font-medium text-gray-700 flex items-center">
                            <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                            이름 혹은 닉네임을 알려주세요 *
                          </label>
                          <div className="relative">
                            <Input
                              id="author_name"
                              value={formData.author_name}
                              onChange={(e) => handleInputChange("author_name", e.target.value)}
                              placeholder="예: 홍길동 또는 창업자123"
                              className="pl-10 h-12 border-gray-200 focus:border-[#148777] focus:ring-[#148777] transition-all duration-200"
                              required
                            />
                            <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="author_email" className="text-sm font-medium text-gray-700 flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-1 text-gray-400" />
                            리뷰 이벤트 당첨 시, 알림받을 이메일을 알려주세요 *
                          </label>
                          <div className="relative">
                            <Input
                              id="author_email"
                              type="email"
                              value={formData.author_email}
                              onChange={(e) => handleInputChange("author_email", e.target.value)}
                              placeholder="example@email.com"
                              className="pl-10 h-12 border-gray-200 focus:border-[#148777] focus:ring-[#148777] transition-all duration-200"
                              required
                            />
                            <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BuildingOfficeIcon className="w-5 h-5 mr-2 text-[#148777]" />
                        사업 정보
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium text-gray-700">카테고리 *</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map((category) => (
                              <button
                                key={category.value}
                                type="button"
                                onClick={() => handleInputChange("category", category.value)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 active:scale-95 ${
                                  formData.category === category.value
                                    ? "border-[#148777] bg-[#148777]/10 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <div className="text-2xl mb-2">{category.icon}</div>
                                <div className="text-sm font-medium text-gray-900">{category.label}</div>
                                <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="business" className="text-sm font-medium text-gray-700 flex items-center">
                            <BuildingOfficeIcon className="w-4 h-4 mr-1 text-gray-400" />
                            업종 *
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {businessTypes.map((type) => (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => handleInputChange("business", type.value)}
                                className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-center hover:scale-105 active:scale-95 ${
                                  formData.business === type.value
                                    ? "border-[#148777] bg-[#148777]/10 shadow-md"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-xl mr-2">{type.icon}</span>
                                <span className="text-sm font-medium text-gray-900">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <PencilSquareIcon className="w-5 h-5 mr-2 text-[#148777]" />
                      후기 내용
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-medium text-gray-700">후기 내용 *</label>
                        <div className="relative">
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            placeholder="케어온과 함께한 경험을 자세히 작성해주세요. 구체적인 도움을 받은 내용, 성과, 추천 이유 등을 포함해주시면 좋습니다."
                            className="min-h-[200px] pt-4 border-gray-200 focus:border-[#148777] focus:ring-[#148777] transition-all duration-200 resize-none"
                            required
                          />
                          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                            {formData.content.length} / 1000자
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="highlight" className="text-sm font-medium text-gray-700 flex items-center">
                          <SparklesIcon className="w-4 h-4 mr-1 text-gray-400" />
                          강조하고 싶은 문구
                        </label>
                        <div className="relative">
                          <Input
                            id="highlight"
                            value={formData.highlight}
                            onChange={(e) => handleInputChange("highlight", e.target.value)}
                            placeholder="후기에서 하이라이트로 표시할 핵심 문구 (선택사항)"
                            className="pl-10 h-12 border-gray-200 focus:border-[#148777] focus:ring-[#148777] transition-all duration-200"
                          />
                          <SparklesIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-xs text-gray-500">추천 키워드:</span>
                          {highlightKeywords.map((keyword) => (
                            <button
                              key={keyword}
                              type="button"
                              onClick={() => handleInputChange("highlight", keyword)}
                              className={`px-3 py-1 text-xs rounded-full transition-all duration-200 hover:scale-105 active:scale-95 ${
                                formData.highlight === keyword
                                  ? "bg-[#148777] text-white"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {keyword}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 flex items-center">
                          <SparklesIcon className="w-3 h-3 mr-1" />
                          입력하신 문구는 후기에서 특별히 강조 표시됩니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <PhotoIcon className="w-5 h-5 mr-2 text-[#148777]" />
                      미디어 및 평가
                    </h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <PhotoIcon className="w-4 h-4 mr-1 text-gray-400" />
                          사진 및 동영상 첨부
                        </label>
                        <div className="bg-white p-5 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors duration-200">
                          <MediaUpload
                            onMediaChange={handleMediaChange}
                            initialImages={formData.images}
                            initialVideos={formData.videos}
                            initialYoutubeUrls={formData.youtube_urls}
                          />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center">
                          <PhotoIcon className="w-3 h-3 mr-1" />
                          사업장 사진, 제품 이미지, 성과를 보여주는 자료 등을 첨부하시면 더욱 생생한 후기가 됩니다.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">만족도 평가</label>
                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => handleRatingClick(star)}
                                  onMouseEnter={() => handleRatingHover(star)}
                                  onMouseLeave={handleRatingLeave}
                                  className="p-1 transition-all duration-200 hover:scale-110 active:scale-90"
                                >
                                  {star <= (hoveredRating || formData.rating) ? (
                                    <StarIcon className="w-10 h-10 text-yellow-500 drop-shadow-md" />
                                  ) : (
                                    <StarOutlineIcon className="w-10 h-10 text-gray-300" />
                                  )}
                                </button>
                              ))}
                            </div>
                            <AnimatePresence mode="wait">
                              {(hoveredRating || formData.rating) > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  className="text-center"
                                >
                                  <span className="text-2xl font-bold text-gray-800">
                                    {hoveredRating || formData.rating}/5
                                  </span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {getRatingLabel(hoveredRating || formData.rating)}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 제출 메시지 */}
            <AnimatePresence>
              {submitMessage && (
                <motion.div
                  className={`p-4 rounded-lg flex items-center ${
                    submitMessage.includes("성공")
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                >
                  {submitMessage.includes("성공") ? (
                    <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  {submitMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  이전 단계
                </Button>
              )}
              {currentStep < 2 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex-1 bg-[#148777] hover:bg-[#0f6b5c] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  다음 단계
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.category ||
                    !formData.business ||
                    !formData.content ||
                    !formData.author_name ||
                    !formData.author_email
                  }
                  className="flex-1 bg-gradient-to-r from-[#148777] to-[#0f6b5c] hover:from-[#0f6b5c] hover:to-[#0a5448] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      제출 중...
                    </div>
                  ) : (
                    "후기 제출하기"
                  )}
                </Button>
              )}
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-gray-300 hover:bg-gray-50">
                  취소
                </Button>
              )}
            </div>

            {/* 안내 문구 */}
            <motion.div 
              className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-medium mb-3 text-gray-800 flex items-center">
                <PencilSquareIcon className="w-4 h-4 mr-2 text-[#148777]" />
                후기 작성 안내
              </p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  제출된 후기는 검토 후 게시됩니다.
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  허위 정보나 부적절한 내용은 게시되지 않을 수 있습니다.
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  업로드된 이미지와 동영상은 Supabase Storage에 안전하게 저장됩니다.
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  개인정보는 후기 관리 목적으로만 사용됩니다.
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  문의사항이 있으시면 고객센터로 연락해주세요.
                </li>
              </ul>
            </motion.div>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
