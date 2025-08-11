"use client"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"

// 교육자 모드 설명:
// - 동적 임포트로 비디오/이미지/애니메이션이 포함된 섹션의 초기 비용을 뒤로 미룹니다.
// - onVideoEnd 콜백과 같이 상호작용이 필요한 부분은 가시화 시점에 마운트되므로 UX도 자연스럽습니다.

const WhatStorySection = dynamic(() => import("@/components/what/story-section").then(m => m.WhatStorySection))
const WhyDoThis = dynamic(() => import("@/components/what/why-dothis").then(m => m.WhyDoThis))
const WhatOfferSection = dynamic(() => import("@/components/what/offer-section").then(m => m.WhatOfferSection))
const WhatIsItSection = dynamic(() => import("@/components/what/what-isit").then(m => m.WhatIsItSection))
const WhatCTASection = dynamic(() => import("@/components/what/cta-section").then(m => m.WhatCTASection))
const StartCareSlidesSection = dynamic(() => import("@/components/what/startcare-slides").then(m => m.StartCareSlidesSection))

export default function WhatPage() {
  // hero/why-cheer 임시 제외 상태

  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
      <WhenVisible minHeight={600}><WhyDoThis /></WhenVisible>
      <WhenVisible minHeight={600}><WhatStorySection /></WhenVisible>
      <WhenVisible minHeight={600}><WhatOfferSection /></WhenVisible>
      <WhenVisible minHeight={600}><StartCareSlidesSection /></WhenVisible>
      <WhenVisible minHeight={600}><WhatIsItSection /></WhenVisible>
      <WhenVisible minHeight={600}><WhatCTASection onInvestorClick={() => {}} /></WhenVisible>
    </main>
  )
}
