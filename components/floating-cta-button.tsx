"use client"

import { useState, useEffect } from "react"
import { X, Users, Star, ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client-with-fallback"

const CareonApplicationForm = dynamic(() => import("./what/CareonApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})

export function FloatingCTAButton() {
  const [isVisible, setIsVisible] = useState(true)
  const [currentUsers, setCurrentUsers] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const router = useRouter()

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

  useEffect(() => {
    const fetchReviewCount = async () => {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', true)
      
      if (!error && count !== null) {
        const multiplier = 3
        setReviewCount(count * multiplier)
      }
    }
    
    fetchReviewCount()
  }, [])

  if (!isVisible) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* 닫기 버튼 */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute -top-2 -right-2 w-4 h-4 bg-gray-600 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
            aria-label="닫기"
          >
            <X className="w-2.5 h-2.5" />
          </button>

          {/* 현재 신청중 표시 */}
          <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap">
            <Users className="w-2.5 h-2.5" />
            <span>
              <span className="font-medium">{currentUsers}명</span> 신청중
            </span>
          </div>

          {/* 버튼 그룹 - 상하 배치 */}
          <div className="flex flex-col gap-2">
            
            {/* 예약대기 신청 버튼 (위, 메인) */}
            <button
              onClick={() => setShowApplicationModal(true)}
              className="group px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-md"
            >
              <span className="flex items-center justify-center gap-1.5">
                예약대기 신청
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>

            {/* 후기 보러가기 버튼 (아래, 서브) */}
            <button
              onClick={() => router.push('/review')}
              className="px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-full transition-all duration-200 shadow-sm"
            >
              <span className="flex items-center justify-center gap-1">
                <Star className="w-3 h-3" />
                후기 {reviewCount.toLocaleString()}개
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="relative max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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