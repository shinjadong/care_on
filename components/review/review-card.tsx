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

function maskAuthorName(name: string): string {
  if (!name || name.length <= 2) return name

  const firstChar = name.charAt(0)
  const lastChar = name.charAt(name.length - 1)
  const middleStars = "*".repeat(name.length - 2)

  return `${firstChar}${middleStars}${lastChar}`
}

export function ReviewCard({ review }: ReviewCardProps) {
  const categoryStyle = categoryColors[review.category as keyof typeof categoryColors] || categoryColors["전체"]
  const hasMedia = (review.images && review.images.length > 0) || (review.videos && review.videos.length > 0)
  const hasYoutube = review.youtube_urls && review.youtube_urls.length > 0

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 group overflow-hidden relative"
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        initial={false}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-shrink-0">
            <motion.div
              className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${categoryStyle} shadow-sm`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
            >
              {review.category}
            </motion.div>

            <motion.div
              className="mt-3 text-lg font-bold text-gray-800"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
            >
              {review.business}
            </motion.div>

            {review.period && (
              <motion.div
                className="mt-2 text-sm text-gray-500 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                {review.period}
              </motion.div>
            )}
          </div>

          <motion.div
            className="hidden lg:block flex-shrink-0"
            initial={{ opacity: 0, rotate: -10 }}
            animate={{ opacity: 0.1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            whileHover={{ opacity: 0.2, scale: 1.1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✨</span>
            </div>
          </motion.div>
        </div>

        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-lg"
          >
            <MediaCarousel images={review.images} videos={review.videos} />
          </motion.div>
        )}

        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <blockquote className="text-gray-700 leading-relaxed text-lg">
            <span className="text-cyan-600 text-3xl font-serif">"</span>
            {review.highlight ? (
              <span>
                {review.content.split(review.highlight)[0]}
                <span className="bg-gradient-to-r from-yellow-200 to-yellow-300 px-2 py-1 rounded-lg font-semibold text-gray-800 shadow-sm">
                  {review.highlight}
                </span>
                {review.content.split(review.highlight)[1]}
              </span>
            ) : (
              review.content
            )}
            <span className="text-cyan-600 text-3xl font-serif">"</span>
          </blockquote>

          {review.rating && (
            <motion.div
              className="mt-4 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
            >
              <div className="flex text-yellow-500 text-xl">
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className={i < review.rating! ? "★" : "☆"}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.4 + i * 0.1 }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {review.rating}/5
              </span>
            </motion.div>
          )}

          {review.author_name && (
            <motion.div
              className="mt-4 text-sm text-gray-500 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {maskAuthorName(review.author_name).charAt(0)}
              </div>
              <span>by {maskAuthorName(review.author_name)}</span>
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
            <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs">▶</span>
              Related Videos
            </h4>
            <div className="grid gap-6">
              {review.youtube_urls!.map((url, index) => (
                <div key={index} className="rounded-2xl overflow-hidden shadow-lg">
                  <YouTubeEmbed url={url} />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex flex-wrap gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
        >
          {review.created_at && (
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              {new Date(review.created_at).toLocaleDateString("ko-KR")}
            </span>
          )}
          {review.is_approved !== undefined && (
            <span
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                review.is_approved ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${review.is_approved ? "bg-green-500" : "bg-orange-500"}`}></span>
              {review.is_approved ? "Verified" : "Under Review"}
            </span>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
