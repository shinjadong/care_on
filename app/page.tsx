"use client"
import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"
import { Suspense } from "react"

// 오픈 이벤트 페이지 컴포넌트들
const WhyDoThis = dynamic(() => import("@/components/what/why-dothis").then(m => m.WhyDoThis), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhatOfferSection = dynamic(() => import("@/components/what/offer-section").then(m => m.WhatOfferSection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const StartCareSlidesSection = dynamic(() => import("@/components/what/startcare-slides").then(m => m.StartCareSlidesSection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhatStorySection = dynamic(() => import("@/components/what/story-section").then(m => m.WhatStorySection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />
})
const WhatCTASection = dynamic(() => import("@/components/what/cta-section-simple").then(m => m.WhatCTASection), {
  loading: () => <div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 animate-pulse" />
})
const WhatFAQSection = dynamic(() => import("@/components/what/faq-section").then(m => m.WhatFAQSection), {
  loading: () => <div className="w-screen bg-white animate-pulse" style={{ minHeight: 600 }} />
})

// 기존 메인 페이지 컴포넌트들 (주석 처리)
// const HeroSection = dynamic(() => import("@/components/main/hero-section").then(m => m.HeroSection))
// const EmpathyStory = dynamic(() => import("@/components/main/empathy-story").then(m => m.EmpathyStory))
// const FailureExperience = dynamic(() => import("@/components/main/failure-experience").then(m => m.FailureExperience))
// const SolutionInsight = dynamic(() => import("@/components/main/solution-insight").then(m => m.SolutionInsight))
// const SuccessProof = dynamic(() => import("@/components/main/success-proof").then(m => m.SuccessProof))
// const TargetChecklist = dynamic(() => import("@/components/main/target-checklist").then(m => m.TargetChecklist))
// const FinalCTA = dynamic(() => import("@/components/main/final-cta").then(m => m.FinalCTA))

export default function MainPage() {
  return (
    <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      <Suspense fallback={<div className="h-screen w-screen bg-gradient-to-b from-[#f7f3ed] to-gray-100 animate-pulse" />}>
        <WhenVisible minHeight={600} rootMargin="50px 0px"><WhyDoThis /></WhenVisible>
      </Suspense>
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
