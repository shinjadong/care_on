"use client"

import { useState } from "react"
import { CareonBottomSheet } from "./careon-bottom-sheet"
import { cn } from "@/lib/utils"

interface CareonCarrierSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const carriers = [
  { value: "skt", label: "SKT" },
  { value: "kt", label: "KT" },
  { value: "lgu", label: "LG U+" },
  { value: "skt-mvno", label: "SKT 알뜰폰" },
  { value: "kt-mvno", label: "KT 알뜰폰" },
  { value: "lgu-mvno", label: "LG U+ 알뜰폰" },
  { value: "other-mvno", label: "기타 알뜰폰" },
]

export function CareonCarrierSelect({ value, onChange, className }: CareonCarrierSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedCarrier = carriers.find((carrier) => carrier.value === value)

  const handleSelect = (carrierValue: string) => {
    onChange(carrierValue)
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full py-4 px-0 border-0 border-b border-gray-200 bg-transparent text-base text-left focus:border-[#009da2] focus:outline-none transition-colors duration-200",
          !value && "text-gray-400",
          value && "text-black",
          className,
        )}
      >
        {selectedCarrier ? selectedCarrier.label : "통신사를 선택해주세요"}
      </button>

      <CareonBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="통신사 선택">
        <div className="space-y-0">
          {carriers.map((carrier, index) => (
            <button
              key={carrier.value}
              onClick={() => handleSelect(carrier.value)}
              className={cn(
                "w-full py-4 text-left text-base transition-colors duration-200",
                value === carrier.value ? "text-[#009da2] font-medium" : "text-black",
                index !== carriers.length - 1 && "border-b border-gray-100",
              )}
            >
              {carrier.label}
            </button>
          ))}
        </div>
      </CareonBottomSheet>
    </>
  )
}
