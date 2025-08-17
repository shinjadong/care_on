"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from "@heroicons/react/24/outline"

export interface Review {
  id: string
  category: string
  business: string
  title?: string
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
  "창업 준비": "bg-blue-50 text-blue-700 border border-blue-200",
  "첫 1년": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "성장기": "bg-green-50 text-green-700 border border-green-200",
  "안정기": "bg-purple-50 text-purple-700 border border-purple-200",
  "전체": "bg-gray-50 text-gray-700 border border-gray-200",
}

function MediaCarousel({ images = [], videos = [], title }: { images?: string[]; videos?: string[]; title?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  
  // null/undefined 체크 추가
  const safeImages = images || []
  const safeVideos = videos || []
  
  const allMedia = [
    ...safeImages.filter(url => url).map((url) => ({ type: "image" as const, url })), 
    ...safeVideos.filter(url => url).map((url) => ({ type: "video" as const, url }))
  ]

  if (allMedia.length === 0) return null

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)
  }

  const hasMultipleImages = allMedia.length > 1

  // 터치 스와이프 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && hasMultipleImages) {
      nextSlide()
    }
    if (isRightSwipe && hasMultipleImages) {
      prevSlide()
    }
  }

  return (
    <div 
      className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden shadow-inner group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

      {/* Title 오버레이 */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg drop-shadow-lg">{title}</h3>
        </div>
      )}

      {hasMultipleImages && (
        <>
          {/* 이미지 카운터 - 항상 표시 (브랜드 컬러 테두리) */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium border border-[#148777]/30">
            {currentIndex + 1} / {allMedia.length}
          </div>

          {/* 네비게이션 버튼 - 개선된 디자인 (브랜드 컬러 테두리) */}
          <button
            onClick={prevSlide}
            className={`
              absolute left-2 top-1/2 transform -translate-y-1/2 
              bg-black/30 backdrop-blur-sm text-white 
              p-1.5 md:p-2 rounded-full
              border border-[#148777]/25
              transition-all duration-300
              ${isHovered ? "opacity-100 scale-100 border-[#148777]/40" : "opacity-70 scale-90 md:opacity-0 md:scale-75"}
              hover:bg-black/50 hover:scale-110 hover:opacity-100 hover:border-[#148777]/50
              active:scale-95
            `}
            aria-label="이전 이미지"
          >
            <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          <button
            onClick={nextSlide}
            className={`
              absolute right-2 top-1/2 transform -translate-y-1/2 
              bg-black/30 backdrop-blur-sm text-white 
              p-1.5 md:p-2 rounded-full
              border border-[#148777]/25
              transition-all duration-300
              ${isHovered ? "opacity-100 scale-100 border-[#148777]/40" : "opacity-70 scale-90 md:opacity-0 md:scale-75"}
              hover:bg-black/50 hover:scale-110 hover:opacity-100 hover:border-[#148777]/50
              active:scale-95
            `}
            aria-label="다음 이미지"
          >
            <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* 스와이프 가능 인디케이터 - 모바일에서만 표시 */}
          {currentIndex === 0 && !isHovered && (
            <div className="md:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="flex items-center gap-4 animate-pulse">
                <ChevronLeftIcon className="w-6 h-6 text-white/50" />
                <span className="text-white/70 text-xs font-medium">스와이프</span>
                <ChevronRightIcon className="w-6 h-6 text-white/50" />
              </div>
            </div>
          )}


          {/* 페이지 인디케이터 - 더 미니멀하게 */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
            {allMedia.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  transition-all duration-300 rounded-full
                  ${index === currentIndex 
                    ? "w-6 h-1.5 bg-white" 
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/75"
                  }
                `}
                aria-label={`이미지 ${index + 1}`}
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
  const hasMedia = (review.images && review.images.length > 0 && review.images.some(img => img)) || 
                   (review.videos && review.videos.length > 0 && review.videos.some(vid => vid))
  const hasYoutube = review.youtube_urls && review.youtube_urls.length > 0 && review.youtube_urls.some(url => url)

  return (
    <motion.div
      className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col gap-3 p-5">
        {/* 헤더: 카테고리 배지와 업종 정보 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-shrink-0">
            <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-medium ${categoryStyle}`}>
              {review.category}
            </span>

            <div className="mt-2 text-sm font-semibold text-gray-900">
              {review.business}
            </div>
          </div>
        </div>

        {/* Title 표시 (이미지가 없을 때) */}
        {review.title && !hasMedia && (
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{review.title}</h3>
          </div>
        )}

        {/* Highlight 섹션 - 은은하게 별도 표시 */}
        {review.highlight && (
          <motion.div
            className="bg-gray-50 border-l-4 border-gray-300 py-2 px-3 rounded-r-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">이런게 좋았어요</p>
                <p className="text-sm font-medium text-gray-800">{review.highlight}</p>
              </div>
            </div>
          </motion.div>
        )}

        {hasMedia && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <MediaCarousel images={review.images} videos={review.videos} title={review.title} />
          </motion.div>
        )}

        {/* 후기 내용 */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <div className="text-gray-700 text-sm leading-relaxed">
            {review.content}
          </div>

          {/* 평점 (있는 경우) */}
          {review.rating && (
            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < review.rating! ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}

          {/* 작성자 정보 (있는 경우) */}
          {review.author_name && (
            <div className="mt-3 text-xs text-gray-500">
              작성자: {review.author_name.length > 2 
                ? `${review.author_name[0]}${'*'.repeat(review.author_name.length - 2)}${review.author_name[review.author_name.length - 1]}`
                : review.author_name.length === 2
                ? `${review.author_name[0]}*`
                : review.author_name
              }
            </div>
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
        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 mt-3 border-t border-gray-50">
          {review.created_at && (
            <span>{new Date(review.created_at).toLocaleDateString("ko-KR")}</span>
          )}
          {review.is_approved !== undefined && review.is_approved && (
            <span className="text-green-600">✓ 인증됨</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
