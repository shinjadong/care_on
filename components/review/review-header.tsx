"use client"

import { useEffect, useState } from "react"

interface ReviewHeaderProps {
  totalCount: number
  falseReviewCount: number
  onScrollClick: () => void
}

export function ReviewHeader({ totalCount, falseReviewCount, onScrollClick }: ReviewHeaderProps) {
  const [displayCount, setDisplayCount] = useState(0)
  const multipliedCount = totalCount * 3 // 실제 리뷰 수에 3을 곱한 값
  
  // 숫자 카운트 애니메이션
  useEffect(() => {
    const duration = 1500 // 1.5초
    const steps = 60
    const increment = multipliedCount / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= multipliedCount) {
        setDisplayCount(multipliedCount)
        clearInterval(timer)
      } else {
        setDisplayCount(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [multipliedCount])
  
  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-gray-800 py-16 md:py-20">
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        {/* 메인 타이틀 - 사이즈 축소 */}
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          케어온 멤버십,
          <span className="text-[#148777] ml-2"> 리얼 후기</span>
        </h1>
        
        {/* 카운트 버튼 - 더 컴팩트하게 */}
        <button
          onClick={onScrollClick}
          className="inline-flex items-center bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 mb-4"
        >
          <span className="text-2xl md:text-3xl font-extrabold">
            {displayCount.toLocaleString()}
          </span>
          <span className="text-sm md:text-base ml-1">명</span>
          <span className="text-sm md:text-base ml-2 opacity-90">사장님들의 선택</span>
        </button>
        
        {/* 서브 텍스트 - 간결하게 */}
        <div className="text-gray-300 text-sm md:text-base">
          <p>
            실패가 두렵지 않은 세상, <br /> 
            케어온의 <span className="text-white font-semibold ml-1">안전망</span>이 필요합니다.
          </p>
          {falseReviewCount > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              (인증 대기중: {falseReviewCount}건)
            </p>
          )}
        </div>
      </div>
    </section>
  )
}