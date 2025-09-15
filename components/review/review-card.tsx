"use client"

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
  business_experience?: '신규창업' | '1년 이상' | '3년 이상'
  package_name?: string
  likes_count?: number
}

interface ReviewCardProps {
  review: Review
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

// 서비스별 고유 컬러 정의
const serviceColors = {
  'CCTV': 'bg-orange-400 text-white',
  'POS': 'bg-cyan-500 text-white', 
  'TV': 'bg-purple-500 text-white',
  '인터넷': 'bg-blue-500 text-white',
  '보험': 'bg-green-500 text-white',
  'AI-CCTV': 'bg-red-500 text-white',
  '기타': 'bg-gray-500 text-white',
  '전체': 'bg-gray-400 text-white'
}

// 패키지명 랜덤 선택 함수 
const getRandomPackage = () => {
  const packages = ['스타트케어', '스타트케어 미니', '스타트케어 프로']
  return packages[Math.floor(Math.random() * packages.length)]
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(review.likes_count || 0)
  const [isLiking, setIsLiking] = useState(false)

  const hasMedia = (review.images && review.images.length > 0 && review.images.some(img => img)) ||
                   (review.videos && review.videos.length > 0 && review.videos.some(vid => vid))
  const hasYoutube = review.youtube_urls && review.youtube_urls.length > 0 && review.youtube_urls.some(url => url)

  // 좋아요 토글 함수
  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const response = await fetch('/api/reviews/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review.id })
      })

      const data = await response.json()
      setIsLiked(data.liked)
      setLikesCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }
  
  // 패키지명 (리뷰 데이터에 없으면 랜덤 선택)
  const packageName = review.package_name || getRandomPackage()
  
  // 사업 경험 레벨 (리뷰 데이터에 없으면 랜덤 선택)
  const experienceOptions = ['신규창업', '1년 이상', '3년 이상']
  const experienceLevel = review.business_experience || experienceOptions[Math.floor(Math.random() * experienceOptions.length)]

  // 사용자 이름 표시 (마스킹 제거)
  const displayName = (name: string) => {
    return name || '익명'
  }

  // 시간 표시 함수
  const formatTime = (dateString: string) => {
    const now = new Date()
    const reviewDate = new Date(dateString)
    const diffInMs = now.getTime() - reviewDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
      return `${diffInMinutes}분 전`
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`
    } else {
      return `${diffInDays}일 전`
    }
  }

  return (
    <div className="social-card bg-transparent border-none overflow-hidden">
      <div className="space-y-0">
        {/* 인스타그램 스타일 헤더 */}
        <div className="p-4 pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* 인스타그램 스타일 프로필 */}
            <div className="story-ring">
              <div className="story-inner">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 이름과 시간 + 인증 마크 */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold glass-text-primary">
                  {review.author_name ? displayName(review.author_name) : '익명'}
                </span>
                {/* CareOn 인증 체크마크 */}
                <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs glass-text-secondary">
                {review.created_at ? formatTime(review.created_at) : '최근'} • {review.business}
              </div>
            </div>
          </div>

          {/* 인스타그램 스타일 메뉴 */}
          <button className="social-profile w-8 h-8">
            <svg className="w-5 h-5 glass-text-secondary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        {/* 이미지/미디어 - 인스타그램처럼 맨 위에 */}
        {hasMedia && (
          <div className="w-full">
            <MediaCarousel images={review.images} videos={review.videos} title={review.title} />
          </div>
        )}

        {hasYoutube && (
          <div className="space-y-3">
            <div className="grid gap-3">
              {review.youtube_urls!.map((url, index) => (
                <YouTubeEmbed key={index} url={url} />
              ))}
            </div>
          </div>
        )}

        {/* 인스타그램 스타일 태그 및 평점 */}
        <div className="flex flex-wrap gap-2 pt-2">
          {review.highlight && (
            <span className="px-3 py-1 text-xs font-medium glass-container-soft glass-text-secondary rounded-full">
              #{review.highlight}
            </span>
          )}
          <span className="px-3 py-1 text-xs font-medium glass-container-soft glass-text-secondary rounded-full">
            #{experienceLevel}
          </span>
          <span className="px-3 py-1 text-xs font-medium glass-container-soft glass-text-secondary rounded-full">
            #{review.category}
          </span>
          {review.rating && review.rating > 0 && (
            <span className="px-3 py-1 text-xs font-medium glass-bg-secondary glass-text-primary rounded-full">
              ★ {Number(review.rating).toFixed(1)}
            </span>
          )}
        </div>

        {/* 인스타그램 스타일 인터랙션 영역 */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              {/* 실제 좋아요 기능 */}
              <button
                onClick={handleLike}
                disabled={isLiking}
                className="flex items-center space-x-1 hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-7 h-7 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              <button className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 glass-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>

              <button className="hover:scale-110 transition-transform">
                <svg className="w-7 h-7 glass-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
            </div>

            <button className="hover:scale-110 transition-transform">
              <svg className="w-7 h-7 glass-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* 좋아요 수 표시 */}
          {likesCount > 0 && (
            <div className="mb-2">
              <span className="text-sm font-bold glass-text-primary">
                좋아요 {likesCount.toLocaleString()}개
              </span>
            </div>
          )}

          {/* 메인 콘텐츠 */}
          <div className="glass-text-primary leading-relaxed mb-2">
            <span className="font-bold glass-text-primary mr-2">
              {review.author_name ? displayName(review.author_name) : '익명'}
            </span>
            <span className="text-sm">
              {review.content}
            </span>
          </div>

          {/* 인스타그램 스타일 해시태그 */}
          <div className="flex flex-wrap gap-1">
            {review.highlight && (
              <span className="text-sm text-teal-600 font-medium">
                #{review.highlight}
              </span>
            )}
            <span className="text-sm text-teal-600 font-medium">
              #{experienceLevel}
            </span>
            <span className="text-sm text-teal-600 font-medium">
              #{review.category}
            </span>
            <span className="text-sm text-teal-600 font-medium">
              #{packageName}
            </span>
          </div>

          {/* 시간 정보 */}
          <div className="text-xs glass-text-muted mt-2">
            {review.created_at ? formatTime(review.created_at) : '최근'}
          </div>
        </div>
      </div>
    </div>
  )
}
