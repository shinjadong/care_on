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
  const [isScrollVisible, setIsScrollVisible] = useState(false)
  
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
    window.location.href = 'https://forms.gle/xUcRxNYcFnYGZjga7'
  }

  if (!isScrollVisible) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 w-full flex justify-center">
      <div className="animate-slide-up-bounce">
      <div className="relative w-full max-w-4xl">
        <div className="flex justify-center">
            <button 
              onClick={handleApply}
            className="bg-gradient-to-b from-[#048777]/90 to-[#036558]/90 hover:from-[#059a88]/95 hover:to-[#047264]/95 backdrop-blur-sm text-white py-2 px-24 rounded-lg font-semibold text-lg transition-all duration-300 border-0 border-gray-100/50 shadow-lg"
            >
              지금 신청하기
            </button>
        </div>
      </div>
      </div>
    </div>
  )
} 