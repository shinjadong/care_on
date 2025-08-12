"use client"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import { Suspense } from "react"

// 교육자 모드 설명:
// - 동적 임포트로 비디오/이미지/애니메이션이 포함된 섹션의 초기 비용을 뒤로 미룹니다.
// - onVideoEnd 콜백과 같이 상호작용이 필요한 부분은 가시화 시점에 마운트되므로 UX도 자연스럽습니다.

const WhatStorySection = dynamic(() => import("@/components/what/story-section").then(m => m.WhatStorySection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhyDoThis = dynamic(() => import("@/components/what/why-dothis").then(m => m.WhyDoThis), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhatOfferSection = dynamic(() => import("@/components/what/offer-section").then(m => m.WhatOfferSection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})

const WhatCTASection = dynamic(() => import("@/components/what/cta-section").then(m => m.WhatCTASection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 animate-pulse" />
})
const WhatFAQSection = dynamic(() => import("@/components/what/faq-section").then(m => m.WhatFAQSection), {
  loading: () => <div className="w-screen bg-white animate-pulse" style={{ minHeight: 600 }} />
})
const StartCareSlidesSection = dynamic(() => import("@/components/what/startcare-slides").then(m => m.StartCareSlidesSection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})

export default function WhatPage() {
  // hero/why-cheer 임시 제외 상태

  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhyDoThis /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatOfferSection /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-t from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatStorySection /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><StartCareSlidesSection /></WhenVisible>
      </Suspense>
      
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatCTASection onInvestorClick={() => {}} /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="w-screen bg-white animate-pulse" style={{ minHeight: 600 }} />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatFAQSection /></WhenVisible>
      </Suspense>
    </main>
  )
}
