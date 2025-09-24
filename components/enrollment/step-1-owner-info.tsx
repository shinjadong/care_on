"use client"

import { useRef, useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { CareonInput } from "@/components/ui/careon-input"
import { BackButton } from "@/components/ui/back-button"
import type { FormData } from "@/app/enrollment/page"

interface StepOwnerInfoProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepOwnerInfo({ formData, updateFormData, onNext, onBack }: StepOwnerInfoProps) {
  const genderRef = useRef<HTMLInputElement>(null)
  const [selectedCarrier, setSelectedCarrier] = useState("")

  const handleBirthDateChange = (value: string) => {
    updateFormData("birthDate", value)
    if (value.length === 6) {
      setTimeout(() => {
        genderRef.current?.focus()
      }, 0)
    }
  }

  const carriers = [
    { value: "skt", label: "SKT" },
    { value: "kt", label: "KT" },
    { value: "lg", label: "LG U+" },
    { value: "mvno", label: "알뜰폰" },
  ]

  // Progressive display conditions
  const showBirthDate = formData.ownerName.trim() !== ""
  const showPhoneAndCarrier =
    formData.birthDate.length === 6 &&
    formData.birthGender.length === 1

  const isValid =
    formData.ownerName.trim() !== "" &&
    formData.birthDate.length === 6 &&
    formData.birthGender.length === 1 &&
    selectedCarrier !== "" &&
    formData.phoneNumber.length >= 10

  return (
    <CareonContainer>
      <div className="flex items-center justify-start p-4 pb-0">
        <BackButton onClick={onBack} />
      </div>
      <div className="flex-1 flex flex-col justify-start pt-16 px-6">
        <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
          대표자 본인 정보를<br />
          입력해 주세요
        </h1>

        <div className="space-y-6">
          <div>
            <CareonInput
              label="대표자 성명"
              placeholder="예) 홍길동"
              value={formData.ownerName}
              onChange={(value) => updateFormData("ownerName", value)}
            />
          </div>

          {showBirthDate && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="block text-base font-medium text-black mb-3">생년월일</label>
              <div className="flex gap-3">
                <CareonInput
                  placeholder="990101"
                  value={formData.birthDate}
                  onChange={handleBirthDateChange}
                  maxLength={6}
                  inputMode="numeric"
                />
                <CareonInput
                  ref={genderRef}
                  placeholder="●"
                  value={formData.birthGender}
                  onChange={(value) => updateFormData("birthGender", value)}
                  maxLength={1}
                  type="password"
                  inputMode="numeric"
                />
              </div>
            </div>
          )}

          {showPhoneAndCarrier && (
            <>
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <label className="block text-base font-medium text-black mb-3">통신사</label>
                <div className="grid grid-cols-2 gap-2">
                  {carriers.map((carrier) => (
                    <button
                      key={carrier.value}
                      onClick={() => setSelectedCarrier(carrier.value)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedCarrier === carrier.value
                          ? "border-[#009DA2] bg-[#009DA2]/5 font-medium"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {carrier.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <CareonInput
                  label="핸드폰 번호"
                  placeholder="핸드폰 번호를 입력해 주세요"
                  value={formData.phoneNumber}
                  onChange={(value) => updateFormData("phoneNumber", value)}
                  type="tel"
                  inputMode="numeric"
                />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="p-6 pt-0">
        <CareonButton onClick={onNext} variant="teal" disabled={!isValid}>
          다음
        </CareonButton>
      </div>
    </CareonContainer>
  )
}