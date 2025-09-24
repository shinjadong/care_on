"use client"

import { useState } from "react"
import { CareonContainer } from "@/components/ui/careon-container"
import { CareonButton } from "@/components/ui/careon-button"
import { CareonInput } from "@/components/ui/careon-input"
import { BackButton } from "@/components/ui/back-button"
import DaumPostcode from "react-daum-postcode"
import type { FormData } from "@/app/enrollment/page"

interface StepStoreInfoProps {
  formData: FormData
  updateFormData: (field: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

export default function StepStoreInfo({ formData, updateFormData, onNext, onBack }: StepStoreInfoProps) {
  const [sameAsBusinessName, setSameAsBusinessName] = useState(false)
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false)
  const [detailAddress, setDetailAddress] = useState("")

  const handleSameAsBusinessName = (checked: boolean) => {
    setSameAsBusinessName(checked)
    if (checked) {
      updateFormData("storeName", formData.businessName)
    }
  }

  const handlePostcodeComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ""
    let postcode = data.zonecode

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : ""
    }

    updateFormData("storePostcode", postcode)
    updateFormData("storeAddress", fullAddress)
    setIsPostcodeOpen(false)
  }

  const isValid =
    formData.storeName.trim() !== "" &&
    formData.storeAddress.trim() !== "" &&
    formData.storeArea.trim() !== ""

  return (
    <>
      <CareonContainer>
        <div className="flex items-center justify-start p-4 pb-0">
          <BackButton onClick={onBack} />
        </div>
        <div className="flex-1 flex flex-col justify-start pt-16 px-6">
          <h1 className="text-2xl font-semibold text-black leading-relaxed mb-10">
            매장 정보를<br />
            입력해주세요
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium text-black mb-3">간판명</label>
              <div className="mb-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsBusinessName}
                    onChange={(e) => handleSameAsBusinessName(e.target.checked)}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm">상호명과 동일합니다</span>
                </label>
              </div>
              <CareonInput
                placeholder="예) 히어로 카페"
                value={formData.storeName}
                onChange={(value) => updateFormData("storeName", value)}
                readOnly={sameAsBusinessName}
              />
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-3">사업장 주소</label>
              <button
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setIsPostcodeOpen(true)}
              >
                {formData.storePostcode
                  ? `[${formData.storePostcode}] ${formData.storeAddress}`
                  : "우편번호 찾기"
                }
              </button>
              {formData.storeAddress && (
                <CareonInput
                  placeholder="상세주소를 입력해 주세요"
                  value={detailAddress}
                  onChange={(value) => setDetailAddress(value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <CareonInput
                label="매장 면적(m²)"
                placeholder="예) 45, 소수점일 경우 반올림하여 입력"
                value={formData.storeArea}
                onChange={(value) => {
                  const cleaned = value.replace(/[^0-9]/g, "")
                  updateFormData("storeArea", cleaned)
                }}
                inputMode="numeric"
              />
              <p className="text-xs text-gray-500 mt-2">
                매장 면적은 영업신고증이나 임대차계약서 혹은 건축물대장에서 확인할 수 있어요.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 pt-0">
          <CareonButton onClick={onNext} variant="teal" disabled={!isValid}>
            다음
          </CareonButton>
        </div>
      </CareonContainer>

      {/* Daum Postcode Modal */}
      {isPostcodeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">우편번호 찾기</h2>
              <button
                onClick={() => setIsPostcodeOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <DaumPostcode
                onComplete={handlePostcodeComplete}
                style={{ height: "450px" }}
                autoClose={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}