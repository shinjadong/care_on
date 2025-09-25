"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"
import { ChevronRightIcon } from "lucide-react"

interface StepCardAgreementsProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string | boolean) => void
  onNext: () => void
  onBack: () => void
}

const cardCompanies = [
  { id: "woori", name: "우리카드", file: "우리카드-동의서.md" },
  { id: "bc", name: "BC카드", file: "비씨카드-동의서.md" },
  { id: "kookmin", name: "KB국민카드", file: "국민카드-동의서.md" },
  { id: "hana", name: "하나카드", file: "하나카드-동의서.md" },
  { id: "samsung", name: "삼성카드", file: "삼성카드-동의서.md" },
]

export default function StepCardAgreements({ updateFormData, onNext, onBack }: StepCardAgreementsProps) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set())
  const [viewedCards, setViewedCards] = useState<Set<string>>(new Set())

  const handleCardClick = (cardId: string, fileName: string) => {
    // Open agreement in new window or modal
    window.open(`/api/agreements/${fileName}`, "_blank", "width=800,height=600")

    // Mark as viewed
    setViewedCards(prev => new Set(prev).add(cardId))

    // Auto-select after viewing
    setTimeout(() => {
      setSelectedCards(prev => new Set(prev).add(cardId))
    }, 1000)
  }

  const handleNext = () => {
    updateFormData("agreeTosspay", true)
    updateFormData("agreedCardCompanies", Array.from(selectedCards).join(","))
    onNext()
  }

  const allCardsSelected = selectedCards.size === cardCompanies.length

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
        <h1 className="text-lg font-semibold ml-4">가입 신청서</h1>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-sm text-gray-600 mb-4">카드사 신청서</h2>
        </div>

        <div className="space-y-3">
          {cardCompanies.map((card) => {
            const isSelected = selectedCards.has(card.id)
            const isViewed = viewedCards.has(card.id)

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id, card.file)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-teal-50 border-teal-500"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                    isSelected
                      ? "bg-teal-500 border-teal-500"
                      : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-base ${isSelected ? "font-semibold" : ""}`}>
                    {card.name}
                  </span>
                  {isViewed && !isSelected && (
                    <span className="ml-2 text-xs text-orange-500">(확인됨)</span>
                  )}
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            • 비대면 카드가맹 서비스를 지원하지 않는 카드사의 가맹을 위해 페이허브에서 유선으로 안내드릴 예정이며, 입력하신 정보로 총 9개의 카드사에 접수될 예정입니다.
            (우리, BC, 국민, 농협, 신한, 삼성, 현대, 롯데, 하나)
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="text-sm text-gray-500">
            {selectedCards.size} / {cardCompanies.length} 카드사 동의 완료
          </span>
        </div>
      </div>

      <div className="p-6">
        <CareonButton
          onClick={handleNext}
          variant="teal"
          disabled={!allCardsSelected}
          className={!allCardsSelected ? "opacity-50" : ""}
        >
          {allCardsSelected ? "다음" : `모든 카드사 동의서를 확인해주세요 (${selectedCards.size}/5)`}
        </CareonButton>
      </div>
    </CareonContainer>
  )
}