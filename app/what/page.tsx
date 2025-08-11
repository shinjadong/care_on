"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"

// 교육자 모드 설명:
// - 동적 임포트로 비디오/이미지/애니메이션이 포함된 섹션의 초기 비용을 뒤로 미룹니다.
// - onVideoEnd 콜백과 같이 상호작용이 필요한 부분은 가시화 시점에 마운트되므로 UX도 자연스럽습니다.

const WhatIntroSection = dynamic(() => import("@/components/what/intro-section").then(m => m.WhatIntroSection))
const WhatHeroSection = dynamic(() => import("@/components/what/hero-section").then(m => m.WhatHeroSection))
const WhyCheer = dynamic(() => import("@/components/what/why-cheer").then(m => m.WhyCheer))
const WhatStorySection = dynamic(() => import("@/components/what/story-section").then(m => m.WhatStorySection))
const WhyDoThis = dynamic(() => import("@/components/what/why-dothis").then(m => m.WhyDoThis))
const CarePromise = dynamic(() => import("@/components/what/care-promise").then(m => m.CarePromise))
const WhatOfferSection = dynamic(() => import("@/components/what/offer-section").then(m => m.WhatOfferSection))
const WhatCTASection = dynamic(() => import("@/components/what/cta-section").then(m => m.WhatCTASection))

export default function WhatPage() {
  const whyCheerRef = useRef<HTMLElement>(null);

  // 📖 자식(HeroSection)에서 영상 재생이 끝나면 호출될 함수
  // useRef로 참조하고 있는 whyCheer 섹션으로 부드럽게 스크롤합니다.
  const handleVideoEnd = () => {
    whyCheerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      <WhenVisible minHeight={600}><WhatIntroSection /></WhenVisible>
      <WhenVisible minHeight={600}><WhatHeroSection onVideoEnd={handleVideoEnd} /></WhenVisible>
      <WhenVisible minHeight={600}><WhyCheer ref={whyCheerRef} /></WhenVisible>
      <WhenVisible minHeight={600}><WhatStorySection /></WhenVisible>
      <WhenVisible minHeight={600}><WhyDoThis /></WhenVisible>
      <WhenVisible minHeight={500}><CarePromise /></WhenVisible>
      <WhenVisible minHeight={600}><WhatOfferSection /></WhenVisible>
      <WhenVisible minHeight={600}><WhatCTASection onInvestorClick={() => {}} /></WhenVisible>
    </main>
  )
}
