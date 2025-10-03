"use client"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import { Suspense } from "react"
import { WhyDoThis } from "@/components/what/why-dothis"

// 첫 화면에 보이는 컴포넌트는 정적 임포트로 즉시 로드
// 나머지는 동적 임포트로 성능 최적화

const WhatStorySection = dynamic(() => import("@/components/what/story-section").then(m => m.WhatStorySection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhatOfferSection = dynamic(() => import("@/components/what/offer-section").then(m => m.WhatOfferSection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})

const WhatCTASection = dynamic(() => import("@/components/what/cta-section-simple").then(m => m.WhatCTASection), {
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
    <main className="w-full">
      {/* 첫 화면은 즉시 렌더링 (WhenVisible 불필요) */}
      <WhyDoThis />

      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatOfferSection /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><StartCareSlidesSection /></WhenVisible>
      </Suspense>
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-t from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatStorySection /></WhenVisible>
      </Suspense>

      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatCTASection onInvestorClick={() => {}} /></WhenVisible>
      </Suspense>
      <div id="faq-section-wrapper">
        <Suspense fallback={<div className="w-screen bg-white animate-pulse" style={{ minHeight: 600 }} />}>
          <WhenVisible minHeight={600} rootMargin="50px 0px"><WhatFAQSection /></WhenVisible>
        </Suspense>
      </div>


    </main>
  )
}