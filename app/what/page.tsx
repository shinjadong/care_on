"use client"

import { WhatHeroSection } from "@/components/what/hero-section"
import { WhatStorySection } from "@/components/what/story-section"
import { WhatCTASection } from "@/components/what/cta-section"
import { WhatOfferSection } from "@/components/what/offer-section"

// 🎬 실패를 축하하는 SpaceX 스타일의 스토리텔링 페이지
// 컴포넌트 단위로 분리해 유지보수성과 재사용성을 높인 구조

export default function WhatPage() {
  // 💡 투자자 메시지 표시 함수 - 브랜드 경험의 핵심 순간
  const showInvestorMessage = () => {
    alert('축하합니다! 당신은 이제 투자받는 사장님입니다.\n\n담당 매니저가 24시간 내 연락드립니다.\n케어온이 당신의 첫 투자자가 되겠습니다.')
  }

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* 🎭 히어로 섹션 - 강렬한 첫 인상 */}
      <WhatHeroSection />
      
      {/* 📖 스토리 섹션 - 투자자 격차의 현실 */}
      <WhatStorySection />
      
      {/* 🎯 CTA 섹션 - 첫 투자자 제안 */}
      <WhatCTASection onInvestorClick={showInvestorMessage} />
      
      {/* 💎 오퍼 섹션 - 구체적 투자 패키지 */}
      <WhatOfferSection />
    </div>
  )
}