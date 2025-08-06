"use client"

import { useState, useRef } from "react"
import { WhatHeroSection } from "@/components/what/hero-section"
import { WhyCheer } from "@/components/what/why-cheer"
import { WhatStorySection } from "@/components/what/story-section"
import { WhatCTASection } from "@/components/what/cta-section"
import { WhatOfferSection } from "@/components/what/offer-section"

// 🎬 YouTube 쇼츠 영상 기반 스토리텔링 페이지
// 영상 종료 후 다음 섹션으로 자동 스크롤되는 인터랙티브 구조

export default function WhatPage() {
  const whyCheerRef = useRef<HTMLDivElement>(null)

  // 💡 투자자 메시지 표시 함수 - 브랜드 경험의 핵심 순간
  const showInvestorMessage = () => {
    alert('축하합니다! 당신은 이제 투자받는 사장님입니다.\n\n담당 매니저가 24시간 내 연락드립니다.\n케어온이 당신의 첫 투자자가 되겠습니다.')
  }

  // 🎥 영상 종료 핸들러 -> 자동 스크롤 실행
  const handleVideoEnd = () => {
    // useRef로 지정된 'WhyCheer' 컴포넌트 위치로 부드럽게 스크롤합니다.
    whyCheerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* 🎭 YouTube 쇼츠 영상 섹션 */}
      <WhatHeroSection onVideoEnd={handleVideoEnd} />
      
      {/* 🤔 왜 박수치는지 설명 섹션 - 스크롤의 목표 지점 */}
      <div ref={whyCheerRef}>
        {/* 이제 isVisible 프롭이 필요 없습니다. */}
        <WhyCheer />
      </div>
      
      {/* 📖 스토리 섹션 - 투자자 격차의 현실 */}
      <WhatStorySection />
      
      {/* 🎯 CTA 섹션 - 첫 투자자 제안 */}
      <WhatCTASection onInvestorClick={showInvestorMessage} />
      
      {/* 💎 오퍼 섹션 - 구체적 투자 패키지 */}
      <WhatOfferSection />
    </div>
  )
}
