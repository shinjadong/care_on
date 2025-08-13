"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { StarIcon } from "@heroicons/react/24/solid"
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline"
import { MediaUpload } from "./media-upload"

interface ReviewFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

const categories = ["창업 준비", "첫 1년", "성장기", "안정기"]

export function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    business: "",
    content: "",
    highlight: "",
    rating: 0,
    period: "",
    author_name: "",
    author_email: "",
    images: [] as string[],
    videos: [] as string[],
    youtube_urls: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const router = useRouter()

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
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
        body: JSON.stringify(formData),
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
          period: "",
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
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">후기 작성하기</h2>
        <p className="text-gray-600">케어온과 함께한 경험을 공유해주세요. 다른 창업자들에게 큰 도움이 됩니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 개인 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="author_name">이름 *</Label>
            <Input
              id="author_name"
              value={formData.author_name}
              onChange={(e) => handleInputChange("author_name", e.target.value)}
              placeholder="실명을 입력해주세요"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author_email">이메일 *</Label>
            <Input
              id="author_email"
              type="email"
              value={formData.author_email}
              onChange={(e) => handleInputChange("author_email", e.target.value)}
              placeholder="연락 가능한 이메일"
              required
            />
          </div>
        </div>

        {/* 사업 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">카테고리 *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="business">업종 *</Label>
            <Input
              id="business"
              value={formData.business}
              onChange={(e) => handleInputChange("business", e.target.value)}
              placeholder="예: 카페, 음식점, 온라인 쇼핑몰"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">사업 기간</Label>
          <Input
            id="period"
            value={formData.period}
            onChange={(e) => handleInputChange("period", e.target.value)}
            placeholder="예: 2023년 3월 ~ 현재"
          />
        </div>

        {/* 후기 내용 */}
        <div className="space-y-2">
          <Label htmlFor="content">후기 내용 *</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder="케어온과 함께한 경험을 자세히 작성해주세요. 구체적인 도움을 받은 내용, 성과, 추천 이유 등을 포함해주시면 좋습니다."
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="highlight">강조하고 싶은 문구</Label>
          <Input
            id="highlight"
            value={formData.highlight}
            onChange={(e) => handleInputChange("highlight", e.target.value)}
            placeholder="후기에서 하이라이트로 표시할 핵심 문구 (선택사항)"
          />
          <p className="text-sm text-gray-500">입력하신 문구는 후기에서 노란색으로 강조 표시됩니다.</p>
        </div>

        {/* 사진 및 동영상 첨부 */}
        <div className="space-y-2">
          <Label>사진 및 동영상 첨부</Label>
          <div className="bg-gray-50 p-4 rounded-lg">
            <MediaUpload
              onMediaChange={handleMediaChange}
              initialImages={formData.images}
              initialVideos={formData.videos}
              initialYoutubeUrls={formData.youtube_urls}
            />
          </div>
          <p className="text-sm text-gray-500">
            사업장 사진, 제품 이미지, 성과를 보여주는 자료 등을 첨부하시면 더욱 생생한 후기가 됩니다.
          </p>
        </div>

        {/* 평점 */}
        <div className="space-y-2">
          <Label>만족도 평가</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleRatingClick(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                {star <= formData.rating ? (
                  <StarIcon className="w-8 h-8 text-yellow-500" />
                ) : (
                  <StarOutlineIcon className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                )}
              </button>
            ))}
            {formData.rating > 0 && <span className="ml-2 text-sm text-gray-600">{formData.rating}/5점</span>}
          </div>
        </div>

        {/* 제출 메시지 */}
        {submitMessage && (
          <motion.div
            className={`p-4 rounded-lg ${
              submitMessage.includes("성공")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitMessage}
          </motion.div>
        )}

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
            className="flex-1 bg-[#148777] hover:bg-[#0f6b5c] text-white"
          >
            {isSubmitting ? "제출 중..." : "후기 제출하기"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              취소
            </Button>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">📝 후기 작성 안내</p>
          <ul className="space-y-1 text-xs">
            <li>• 제출된 후기는 검토 후 게시됩니다.</li>
            <li>• 허위 정보나 부적절한 내용은 게시되지 않을 수 있습니다.</li>
            <li>• 업로드된 이미지와 동영상은 Supabase Storage에 안전하게 저장됩니다.</li>
            <li>• 개인정보는 후기 관리 목적으로만 사용됩니다.</li>
            <li>• 문의사항이 있으시면 고객센터로 연락해주세요.</li>
          </ul>
        </div>
      </form>
    </motion.div>
  )
}
