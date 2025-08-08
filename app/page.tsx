import { HeroSection } from "@/components/main/hero-section"
import { EmpathyStory } from "@/components/main/empathy-story"
import { FailureExperience } from "@/components/main/failure-experience"
import { SolutionInsight } from "@/components/main/solution-insight"
import { SuccessProof } from "@/components/main/success-proof"
import { TargetChecklist } from "@/components/main/target-checklist"
import { FinalCTA } from "@/components/main/final-cta"

// 메인 페이지 - 이상한마케팅 아카데미 구조를 케어온 버전으로 클론
// 각 섹션이 마치 소설의 챕터처럼 순서대로 구성되어 완전한 스토리를 만듦

export default function MainPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <main className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory">
        {/* 1. 히어로 섹션 - 강력한 문제 제기로 관심 끌기 */}
        <div className="snap-start"><HeroSection /></div>
        
        {/* 2. 공감 스토리 - 동질감 형성으로 신뢰 구축 */}
        <div className="snap-start"><EmpathyStory /></div>
        
        {/* 3. 실패 경험 - 현실적인 어려움으로 문제 구체화 */}
        <div className="snap-start"><FailureExperience /></div>
        
        {/* 4. 솔루션 깨달음 - 핵심 해결책 제시 */}
        <div className="snap-start"><SolutionInsight /></div>
        
        {/* 5. 성과 증명 - 구체적 수치로 신뢰도 구축 */}
        <div className="snap-start"><SuccessProof /></div>
        
        {/* 6. 타겟팅 체크리스트 - 적합한 대상 명시 */}
        <div className="snap-start"><TargetChecklist /></div>
        
        {/* 7. 최종 CTA - 행동 유도 */}
        <div className="snap-start"><FinalCTA /></div>
      </main>
    </div>
  )
}
