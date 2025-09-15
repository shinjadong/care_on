"use client"

import { useState, useEffect } from "react"
import { X, Users, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"

const CareonApplicationForm = dynamic(() => import("./what/CareonApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})

export function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentUsers, setCurrentUsers] = useState(0)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  useEffect(() => {
    // Use a fixed initial value to avoid hydration mismatch
    setCurrentUsers(18)

    const interval = setInterval(() => {
      setCurrentUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newValue = prev + change
        
        if (newValue < 12) return 12
        if (newValue > 28) return 28
        return newValue
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])



  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50">
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-4 h-4 glass-container glass-text-primary rounded-full flex items-center justify-center hover:glass-container-strong transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-2.5 h-2.5" />
          </button>

          {/* 신청 버튼 */}
          <button
            onClick={() => setShowApplicationModal(true)}
            className="group p-0 glass-container-strong glass-text-primary text-sm font-medium rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md min-w-0 overflow-hidden"
          >
            <div className="flex flex-col overflow-hidden">
              {/* 브라우저 탭 영역 - 현재 신청중 표시 */}
              <div className="flex items-center justify-center gap-1 text-[10px] glass-text-secondary px-3 py-1.5">
                <Users className="w-2 h-2" />
                <span>
                  <span className="font-medium">{currentUsers}명</span> 신청중
                </span>
              </div>
              
              {/* 브라우저 콘텐츠 영역 - 메인 텍스트 */}
              <div className="glass-container px-3 py-3 flex shadow-sm items-center gap-1">
                <div className="text-center leading-tight glass-text-primary">
                  <div className="text-xs font-semibold">셀프 다이렉트</div>
                  <div className="text-xs font-semibold">신청하러 가기</div>
                </div>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform flex-shrink-0 glass-text-secondary" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-h-[90vh] overflow-y-auto glass-container p-6 rounded-2xl w-full max-w-lg">
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full glass-container hover:glass-container-strong transition-colors"
            >
              <X className="w-5 h-5 glass-text-secondary" />
            </button>
            <div className="p-4 sm:p-6">
              <CareonApplicationForm 
                useGrid={true}
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