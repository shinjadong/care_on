import { HeroSection } from "@/components/start-care/hero-section"
import { AuthorityCoCompanies } from "@/components/start-care/authority-co-companies"
import { TestSafety } from "@/components/start-care/test-safety"
import { ScoreExplanation } from "@/components/start-care/score-explanation"
import { UnbelievableButTrue } from "@/components/start-care/unbelievable-but-true"
import { ThreeOneOff } from "@/components/start-care/three-one-off"
import { AnxietyCheck } from "@/components/start-care/anxiety-check"
import { ThreeUntoldSecrets } from "@/components/start-care/three-untold-secrets"
import { Secrets1to3 } from "@/components/start-care/secrets-1to3"
import { NoOneProtectsYou } from "@/components/start-care/no-one-protects-you"
import { ThreeNoFailSecrets } from "@/components/start-care/three-no-fail-secrets"
import { FirstYearMatters } from "@/components/start-care/first-year-matters"
import { ApplicationSection } from "@/components/start-care/application-section"
import { FaqSection } from "@/components/start-care/faq-section"
import { FinalCta } from "@/components/start-care/final-cta"
import { ImageUploader } from "@/components/start-care/image-uploader"

export default function StartCarePage() {
  return (
    <div className="bg-white text-gray-800">
      <main>
        <HeroSection />
        <div id="academy">
          <AuthorityCoCompanies />
          <TestSafety />
          <ScoreExplanation />
        </div>
        <UnbelievableButTrue />
        <ThreeOneOff />
        <AnxietyCheck />
        <ThreeUntoldSecrets />
        <div id="review">
          <Secrets1to3 />
        </div>
        <NoOneProtectsYou />
        <div id="curriculum">
          <ThreeNoFailSecrets />
        </div>
        <FirstYearMatters />
        <div id="apply">
          <ApplicationSection />
        </div>
        <FaqSection />
        <FinalCta />
        <ImageUploader />
      </main>
    </div>
  )
}
