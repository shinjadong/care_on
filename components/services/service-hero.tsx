"use client"

import { useEffect, useState } from "react"

export function ServiceHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 pb-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 text-xs font-medium text-brand bg-brand/10 rounded-full">
            케어온 서비스
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            생활의 모든 것을
            <br />
            <span className="text-brand">하나의 패키지</span>로
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed">
            AI CCTV부터 초고속 인터넷, 안전보험까지
            <br />
            당신의 일상을 더 안전하고 편리하게 만들어드립니다
          </p>
        </div>
      </div>
    </section>
  )
}