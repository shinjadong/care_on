import dynamic from "next/dynamic"
import { WhenVisible } from "@/components/common/when-visible"

// 교육자 모드 설명:
// - 동적 임포트(dynamic import)는 필요한 배우(코드)를 장면(스크린)에 등장할 때만 불러오는 방식입니다.
// - 이렇게 하면 첫 장면에서 쓰지 않는 배우를 미리 호출하지 않아 대기실(네트워크/메모리) 혼잡을 줄입니다.
// - 아래와 같이 각 섹션을 분리하면 초기 번들을 작게 나누어 성능을 개선할 수 있습니다.

const HeroSection = dynamic(() => import("@/components/main/hero-section").then(m => m.HeroSection))
const EmpathyStory = dynamic(() => import("@/components/main/empathy-story").then(m => m.EmpathyStory))
const FailureExperience = dynamic(() => import("@/components/main/failure-experience").then(m => m.FailureExperience))
const SolutionInsight = dynamic(() => import("@/components/main/solution-insight").then(m => m.SolutionInsight))
const SuccessProof = dynamic(() => import("@/components/main/success-proof").then(m => m.SuccessProof))
const TargetChecklist = dynamic(() => import("@/components/main/target-checklist").then(m => m.TargetChecklist))
const FinalCTA = dynamic(() => import("@/components/main/final-cta").then(m => m.FinalCTA))

// 메인 페이지 - 이상한마케팅 아카데미 구조를 케어온 버전으로 클론
// 각 섹션이 마치 소설의 챕터처럼 순서대로 구성되어 완전한 스토리를 만듦

export default function MainPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
        {/* 1. 히어로 섹션 - 강력한 문제 제기로 관심 끌기
            WhenVisible: 관객의 시야에 들어올 때 무대에 올립니다. 레이아웃 시프트 방지를 위해 적절한 minHeight 권장 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <HeroSection />
          </WhenVisible>
        </div>
        
        {/* 2. 공감 스토리 - 동질감 형성으로 신뢰 구축 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <EmpathyStory />
          </WhenVisible>
        </div>
        
        {/* 3. 실패 경험 - 현실적인 어려움으로 문제 구체화 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <FailureExperience />
          </WhenVisible>
        </div>
        
        {/* 4. 솔루션 깨달음 - 핵심 해결책 제시 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <SolutionInsight />
          </WhenVisible>
        </div>
        
        {/* 5. 성과 증명 - 구체적 수치로 신뢰도 구축 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <SuccessProof />
          </WhenVisible>
        </div>
        
        {/* 6. 타겟팅 체크리스트 - 적합한 대상 명시 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <TargetChecklist />
          </WhenVisible>
        </div>
        
        {/* 7. 최종 CTA - 행동 유도 */}
        <div className="snap-start">
          <WhenVisible minHeight={600}>
            <FinalCTA />
          </WhenVisible>
        </div>
      </main>
    </div>
  )
}
