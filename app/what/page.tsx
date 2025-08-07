"use client"

import { useState } from "react"
import { WhatHeroSection } from "@/components/what/hero-section"
import { WhyCheer } from "@/components/what/why-cheer"
import { WhatStorySection } from "@/components/what/story-section"
import { WhatOfferSection } from "@/components/what/offer-section"
import { WhatCTASection } from "@/components/what/cta-section"

// 🌐 /what 페이지 - 풀페이지 스크롤 컨테이너
// 이 컴포넌트는 모든 'what' 관련 섹션을 담는 껍데기 역할을 합니다.
// CSS의 'scroll-snap' 기능을 사용하여, 사용자가 스크롤할 때마다
// 자식 섹션들이 화면에 착 달라붙는 효과를 만듭니다.

export default function WhatPage() {
  const [isVideoEnded, setIsVideoEnded] = useState(false)

  // 자식 컴포넌트(HeroSection)에서 비디오 재생이 끝나면 호출될 함수
  const handleVideoEnd = () => {
    setIsVideoEnded(true)
    // 필요하다면, 비디오가 끝난 후 다음 섹션으로 자동 스크롤하는 로직을 추가할 수 있습니다.
    // 예: document.getElementById('why-cheer-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      {/* 
        [개발자 노트]
        - h-screen, w-screen: 컨테이너가 화면 전체 높이와 너비를 차지하도록 합니다.
        - overflow-y-scroll: 세로 스크롤을 항상 활성화합니다.
        - snap-y snap-mandatory:
          - snap-y: Y축(세로)으로 스크롤 스냅을 활성화합니다.
          - snap-mandatory: 스크롤이 멈출 때, 반드시 스냅 지점(자식 섹션의 시작점)에 위치하도록 강제합니다.
          - 이것이 바로 한 페이지씩 넘어가는 마법의 핵심입니다.
      */}
      <WhatHeroSection onVideoEnd={handleVideoEnd} />
      <WhyCheer />
      <WhatStorySection />
      <WhatOfferSection />
      <WhatCTASection onInvestorClick={() => {}} />
    </main>
  )
}
