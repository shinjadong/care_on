"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import dynamic from "next/dynamic"

const CareonApplicationForm = dynamic(() => import("./what/CareonApplicationForm"), { 
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
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 max-w-sm md:max-w-md">
        <div className="relative">
          {/* 배너 본체 - 투명 배경에 테두리만 */}
          <button
            onClick={handleApply}
            className="
              relative w-full
              px-6 py-3 md:px-8 md:py-3.5
              bg-white/60 backdrop-blur-md
              border border-brand/30
              rounded-full
              transition-all duration-500
              hover:bg-white/80 hover:border-brand/50
              group
              overflow-hidden
            "
          >
            {/* 반짝이는 애니메이션 효과 */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
              <div className="h-full w-32 bg-gradient-to-r from-transparent via-brand/10 to-transparent skew-x-12" />
            </div>
            
            {/* 텍스트 */}
            <div className="relative flex items-center justify-center gap-2">
              <span className="text-sm md:text-base font-medium text-gray-900">
                무료 체험단 신청하기
              </span>
              <span className="hidden md:inline-block text-xs text-gray-500 ml-1">
                12개월 무료
              </span>
            </div>

            {/* 모바일용 짧은 텍스트 */}
            <div className="md:hidden absolute top-full left-0 right-0 text-center mt-1">
              <span className="text-[10px] text-gray-500">12개월 무료</span>
            </div>
          </button>
        </div>
      </div>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowApplicationModal(false)}
          />
          
          {/* 모달 컨텐츠 */}
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-white rounded-2xl shadow-xl">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* 폼 */}
            <CareonApplicationForm 
              useGrid={true}
              onSuccess={() => {
                setTimeout(() => setShowApplicationModal(false), 2000)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}