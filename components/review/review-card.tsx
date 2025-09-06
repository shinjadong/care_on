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
  const hasMedia = (review.images && review.images.length > 0 && review.images.some(img => img)) || 
                   (review.videos && review.videos.length > 0 && review.videos.some(vid => vid))
  const hasYoutube = review.youtube_urls && review.youtube_urls.length > 0 && review.youtube_urls.some(url => url)
  
  // 패키지명 (리뷰 데이터에 없으면 랜덤 선택)
  const packageName = review.package_name || getRandomPackage()
  
  // 사업 경험 레벨 (리뷰 데이터에 없으면 랜덤 선택)
  const experienceOptions = ['신규창업', '1년 이상', '3년 이상']
  const experienceLevel = review.business_experience || experienceOptions[Math.floor(Math.random() * experienceOptions.length)]

  // 사용자 이름 마스킹 함수
  const maskName = (name: string) => {
    if (name.length > 2) {
      return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`
    } else if (name.length === 2) {
      return `${name[0]}*`
    }
    return name
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
    <div className="bg-white border-b border-gray-100 overflow-hidden">
      <div className="p-4 space-y-3">
        {/* 헤더: 프로필 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* 프로필 이미지 */}
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {review.author_name ? maskName(review.author_name)[0] : '익'}
              </span>
            </div>
            
            {/* 이름과 시간 */}
            <div>
              <div className="text-sm font-bold text-gray-900">
                {review.author_name ? maskName(review.author_name) : '익명'}
              </div>
              <div className="text-xs text-gray-400">
                {review.created_at ? formatTime(review.created_at) : '최근'}
              </div>
            </div>
          </div>
          
          {/* 우상단 버튼들 */}
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-xs font-medium text-cyan-600 bg-cyan-50 border border-cyan-200 rounded-full">
              + 승인됨
            </span>
            <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 태그들과 별점 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {review.highlight && (
              <span className="inline-flex px-3 py-1 text-xs font-medium text-white bg-orange-400 rounded-full">
                {review.highlight}
              </span>
            )}
            <span className="inline-flex px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
              {experienceLevel}
            </span>
          </div>
          
          {/* 별점 */}
          {review.rating && review.rating > 0 && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-900">{Number(review.rating).toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* 업체 정보 */}
        <div className="text-sm text-gray-500">
          [{packageName}] {review.business}
        </div>

        {/* 메인 콘텐츠 */}
        <div className="text-sm text-gray-900 leading-relaxed">
          {review.content}
        </div>

        {hasMedia && (
          <div className="-mx-4">
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

        {/* 좋아요와 댓글 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {/* 좋아요 */}
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">0</span>
            </button>
            
            {/* 댓글 */}
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">0</span>
              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
