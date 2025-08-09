"use client"

import { useRef } from "react"
import { WhatIntroSection } from "@/components/what/intro-section"
import { WhatHeroSection } from "@/components/what/hero-section"
import { WhyCheer } from "@/components/what/why-cheer"
import { WhatStorySection } from "@/components/what/story-section"
import { WhatOfferSection } from "@/components/what/offer-section"
import { WhatCTASection } from "@/components/what/cta-section"

export default function WhatPage() {
  const whyCheerRef = useRef<HTMLElement>(null);

  // 📖 자식(HeroSection)에서 영상 재생이 끝나면 호출될 함수
  // useRef로 참조하고 있는 whyCheer 섹션으로 부드럽게 스크롤합니다.
  const handleVideoEnd = () => {
    whyCheerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      <WhatIntroSection />
      <WhatHeroSection onVideoEnd={handleVideoEnd} />
      <WhyCheer ref={whyCheerRef} />
      <WhatStorySection />
      <WhatOfferSection />
      <WhatCTASection onInvestorClick={() => {}} />
    </main>
  )
}
