"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

// 카운트다운 훅
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        setTimeLeft("마감됨")
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

// 가중치 랜덤 함수 (낮은 숫자가 더 높은 확률)
const getWeightedRandomSlots = () => {
  const weights = [30, 25, 20, 15, 7, 3] // 4:30%, 5:25%, 6:20%, 7:15%, 8:7%, 9:3%
  const numbers = [4, 5, 6, 7, 8, 9]
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  const random = Math.random() * totalWeight
  
  let currentWeight = 0
  for (let i = 0; i < weights.length; i++) {
    currentWeight += weights[i]
    if (random <= currentWeight) {
      return numbers[i]
    }
  }
  return 4 // 기본값
}

// 하단 고정 플로팅 배너 컴포넌트
export function FloatingBanner() {
  const [remainingSlots, setRemainingSlots] = useState(4)
  const [isVisible, setIsVisible] = useState(true)
  
  // 이번 주 일요일 자정으로 설정
  const thisWeekEnd = new Date()
  const daysUntilSunday = 7 - thisWeekEnd.getDay()
  thisWeekEnd.setDate(thisWeekEnd.getDate() + daysUntilSunday)
  thisWeekEnd.setHours(23, 59, 59)
  
  const timeLeft = useCountdown(thisWeekEnd)

  useEffect(() => {
    // 컴포넌트 마운트 시 랜덤 슬롯 설정
    setRemainingSlots(getWeightedRandomSlots())
    
    // 10분마다 랜덤하게 변경
    const interval = setInterval(() => {
      setRemainingSlots(getWeightedRandomSlots())
    }, 600000) // 10분 = 600,000ms
    
    return () => clearInterval(interval)
  }, [])

  const handleApply = () => {
    window.location.href = '/start-care'
  }

  const handleReview = () => {
    window.location.href = '/review'
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* 상단 빨간색 긴급 배너 */}
        <div className="bg-red-600 text-white py-2 px-4 text-center text-xs font-medium relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
          <div className="relative z-10 flex items-center justify-center space-x-2">
            <span>🔥 무료체험단 마감 임박!</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="font-mono font-bold">{timeLeft}</span>
            </div>
          </div>
        </div>
        
        {/* 메인 콘텐츠 영역 */}
        <div className="bg-white p-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">
              지금까지 <span className="font-bold text-blue-600">3,549명</span>의 사업자가 함께했어요
            </span>
          </div>
          
          <div className="mb-4">
            <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg mb-2">
              <span className="text-sm font-semibold">
                이번 주 마감: 남은 인원 {remainingSlots}명
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleApply}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-colors"
            >
              지금 신청하기
            </button>
            <button 
              onClick={handleReview}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold text-sm transition-colors"
            >
              후기 확인하기
            </button>
          </div>
        </div>
        
        {/* 닫기 버튼 */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 