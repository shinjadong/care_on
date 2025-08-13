"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "@heroicons/react/24/outline"

export interface Review {
  id: string
  category: string
  business: string
  content: string
  highlight?: string
  rating?: number
  period?: string
  author_name?: string
  author_email?: string
  is_approved?: boolean
  created_at?: string
  updated_at?: string
  images?: string[]
  videos?: string[]
  youtube_urls?: string[]
}

interface ReviewCardProps {
  review: Review
}

// 카테고리별 색상 테마
const categoryColors = {
  "창업 준비": "bg-blue-100 text-blue-700 border-blue-200",
  "첫 1년": "bg-[#148777]/10 text-[#148777] border-[#148777]/20",
  성장기: "bg-green-100 text-green-700 border-green-200",
  안정기: "bg-purple-100 text-purple-700 border-purple-200",
  전체: "bg-gray-100 text-gray-700 border-gray-200",
}

function MediaCarousel({ images = [], videos = [] }: { images?: string[]; videos?: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const allMedia = [...images.map((url) => ({ type: "image", url })), ...videos.map((url) => ({ type: "video", url }))]

  if (allMedia.length === 0) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }

  return (
    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
      {allMedia[currentIndex].type === "image" ? (
        <img
          src={allMedia[currentIndex].url || "/placeholder.svg"}
          alt="후기 이미지"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full">
          <video src={allMedia[currentIndex].url} className="w-full h-full object-cover" controls />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <PlayIcon className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
      )}

      {allMedia.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function YouTubeEmbed({ url }: { url: string }) {
  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return videoId ? `https://www.youtube.com/embed/${videoId[1]}` : url
  }

  return (
    <div className="aspect-video w-full">
      <iframe
        src={getYoutubeEmbedUrl(url)}
        className="w-full h-full rounded-lg"
        allowFullScreen
        title="YouTube 동영상"
      />
    </div>
  )
}

export function ReviewCard({ review }: ReviewCardProps) {
  const categoryStyle = categoryColors[review.category as keyof typeof categoryColors] || categoryColors["전체"]
  const hasMedia = (review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)
  const hasYoutube = review.youtube_urls && review.youtube_urls.length > 0

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
      whileHover={{
        y: -2,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex flex-col gap-4">
        {/* 헤더: 카테고리 배지와 업종 정보 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-shrink-0">
            <motion.div
              className={`inline-block px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${categoryStyle}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {review.category}
            </motion.div>

            <motion.div
              className="mt-2 text-sm font-semibold text-gray-800"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            >
              {review.business}
            </motion.div>

            {/* 기간 정보 (있는 경우) */}
            {review.period && (
              <motion.div
                className="mt-1 text-xs text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                📅 {review.period}
              </motion.div>
            )}
          </div>

          {/* 케어온 로고 워터마크 */}
          <motion.div
            className="hidden md:block flex-shrink-0 opacity-10"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          >
            <div className="w-12 h-12 bg-[#148777] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
          </motion.div>
        </div>

        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <MediaCarousel images={review.images} videos={review.videos} />
          </motion.div>
        )}

        {/* 후기 내용 */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <blockquote className="text-gray-700 leading-relaxed">
            <span className="text-[#148777] text-lg">"</span>
            {review.highlight ? (
              <span>
                {review.content.split(review.highlight)[0]}
                <span className="bg-yellow-200 px-1 rounded font-medium">{review.highlight}</span>
                {review.content.split(review.highlight)[1]}
              </span>
            ) : (
              review.content
            )}
            <span className="text-[#148777] text-lg">"</span>
          </blockquote>

          {/* 평점 (있는 경우) */}
          {review.rating && (
            <motion.div
              className="mt-3 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            >
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.rating! ? "★" : "☆"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-500">{review.rating}/5</span>
            </motion.div>
          )}

          {/* 작성자 정보 (있는 경우) */}
          {review.author_name && (
            <motion.div
              className="mt-3 text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            >
              작성자: {review.author_name}
            </motion.div>
          )}
        </motion.div>

        {hasYoutube && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h4 className="text-sm font-medium text-gray-700">관련 동영상</h4>
            <div className="grid gap-4">
              {review.youtube_urls!.map((url, index) => (
                <YouTubeEmbed key={index} url={url} />
              ))}
            </div>
          </motion.div>
        )}

        {/* 메타 정보 */}
        <motion.div
          className="flex flex-wrap gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
        >
          {review.created_at && <span>작성일: {new Date(review.created_at).toLocaleDateString("ko-KR")}</span>}
          {review.is_approved !== undefined && (
            <span className={review.is_approved ? "text-green-600" : "text-orange-600"}>
              {review.is_approved ? "승인됨" : "검토중"}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
