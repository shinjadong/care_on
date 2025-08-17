import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"

// 교육자 모드 설명:
// - 스크롤로 진행되는 긴 랜딩 페이지는 각 섹션을 필요할 때 불러오면 초기 로드가 빨라집니다.
// - IntersectionObserver 기반의 WhenVisible로 실제로 화면에 들어왔을 때만 마운트합니다.

const HeroSection = dynamic(() => import("@/components/start-care/hero-section").then(m => m.HeroSection))
const AuthorityCoCompanies = dynamic(() => import("@/components/start-care/authority-co-companies").then(m => m.AuthorityCoCompanies))
const TestSafety = dynamic(() => import("@/components/start-care/test-safety").then(m => m.TestSafety))
const ScoreExplanation = dynamic(() => import("@/components/start-care/score-explanation").then(m => m.ScoreExplanation))
const UnbelievableButTrue = dynamic(() => import("@/components/start-care/unbelievable-but-true").then(m => m.UnbelievableButTrue))
const ThreeOneOff = dynamic(() => import("@/components/start-care/three-one-off").then(m => m.ThreeOneOff))
const AnxietyCheck = dynamic(() => import("@/components/start-care/anxiety-check").then(m => m.AnxietyCheck))
const ThreeUntoldSecrets = dynamic(() => import("@/components/start-care/three-untold-secrets").then(m => m.ThreeUntoldSecrets))
const Secrets1to3 = dynamic(() => import("@/components/start-care/secrets-1to3").then(m => m.Secrets1to3))
const NoOneProtectsYou = dynamic(() => import("@/components/start-care/no-one-protects-you").then(m => m.NoOneProtectsYou))
const ThreeNoFailSecrets = dynamic(() => import("@/components/start-care/three-no-fail-secrets").then(m => m.ThreeNoFailSecrets))
const FirstYearMatters = dynamic(() => import("@/components/start-care/first-year-matters").then(m => m.FirstYearMatters))
const FaqSection = dynamic(() => import("@/components/start-care/faq-section").then(m => m.FaqSection))


export default function StartCarePage() {
  return (
    <div className="bg-white text-gray-800">
      <main>
        <WhenVisible minHeight={600}><HeroSection /></WhenVisible>
        <div id="academy">
          <WhenVisible minHeight={500}><AuthorityCoCompanies /></WhenVisible>
          <WhenVisible minHeight={500}><TestSafety /></WhenVisible>
          <WhenVisible minHeight={500}><ScoreExplanation /></WhenVisible>
        </div>
        <WhenVisible minHeight={500}><UnbelievableButTrue /></WhenVisible>
        <WhenVisible minHeight={500}><ThreeOneOff /></WhenVisible>
        <WhenVisible minHeight={500}><AnxietyCheck /></WhenVisible>
        <WhenVisible minHeight={500}><ThreeUntoldSecrets /></WhenVisible>
        <div id="review">
          <WhenVisible minHeight={500}><Secrets1to3 /></WhenVisible>
        </div>
        <WhenVisible minHeight={500}><NoOneProtectsYou /></WhenVisible>
        <div id="curriculum">
          <WhenVisible minHeight={500}><ThreeNoFailSecrets /></WhenVisible>
        </div>
        <WhenVisible minHeight={500}><FirstYearMatters /></WhenVisible>
        <WhenVisible minHeight={500}><FaqSection /></WhenVisible>
      </main>
    </div>
  )
}
