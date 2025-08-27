"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import dynamic from "next/dynamic"

const QuickApplicationForm = dynamic(() => import("./what/QuickApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})

// 하단 고정 플로팅 배너 컴포넌트
export function FloatingBanner() {
  const [isScrollVisible, setIsScrollVisible] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  
  // 스크롤 기반 등장 애니메이션 및 푸터 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      // 푸터까지의 거리 계산 (푸터 높이를 대략 300px로 가정)
      const footerDistance = documentHeight - windowHeight - 300
      
      // 화면 높이의 50% 이상 스크롤하고, 푸터에 도달하지 않았을 때만 나타남
      if (scrollY > windowHeight * 0.5 && scrollY < footerDistance) {
        setIsScrollVisible(true)
      } else {
        setIsScrollVisible(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleApply = () => {
    setShowApplicationModal(true)
  }

  if (!isScrollVisible) return null

  return (
    <>
      {/* 플로팅 배너 - 미니멀 Apple 스타일 */}
      <div className="fixed bottom-4 left-16 right-16 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 max-w-xs md:max-w-md">
        <div className="relative">
          {/* 배너 본체 - 브랜드 컬러 그라데이션 배경 */}
          <button
            onClick={handleApply}
            className="
              relative w-full
              px-6 py-2 md:px-8 md:py-2.5
              bg-gradient-to-r from-[#148777] to-[#0f6b5c]
              rounded-full
              transition-all duration-300
              hover:shadow-lg hover:shadow-[#148777]/15
              hover:scale-[1.01]
              group
              overflow-hidden
            "
          >
            {/* 반짝이는 애니메이션 효과 */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
              <div className="h-full w-32 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            </div>
            
            {/* 텍스트 */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-sm md:text-[15px] font-semibold text-white">
                무료 체험단 대기 신청
              </span>
            </div>

            {/* 모바일용 짧은 텍스트 */}
            <div className="md:hidden absolute -bottom-5 left-1/2 -translate-x-1/2">
              <span className="text-[10px] text-gray-600 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full whitespace-nowrap">
                12개월 무료
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowApplicationModal(false)}
          />
          
          {/* 모달 컨텐츠 - 모바일 최적화 */}
          <div className="relative w-full max-w-[95vw] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-xl">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            
            {/* 폼 - 모바일에서 패딩 조정 */}
            <div className="p-4 sm:p-6">
              <QuickApplicationForm 
                onSuccess={() => {
                  setTimeout(() => setShowApplicationModal(false), 2000)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}