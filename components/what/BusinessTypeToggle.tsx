import { useState } from "react"
import { BUSINESS_TYPES } from "@/lib/businessTypes"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

type Props = {
  value?: number
  onChange: (val: number) => void
  name?: string
}

export default function BusinessTypeToggle({ 
  value, 
  onChange, 
  name = "business_type" 
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedType = BUSINESS_TYPES.find(b => b.id === value)

  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">업종 선택 *</legend>
      <input type="hidden" name={name} value={value ?? ""} />
      
      {/* 토글 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
          isOpen ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400",
          !value && "text-gray-500"
        )}
      >
        <span className="flex items-center gap-2">
          {selectedType ? (
            <>
              <span className="text-lg">{selectedType.emoji}</span>
              <span className="text-sm font-medium">{selectedType.label}</span>
            </>
          ) : (
            <span className="text-sm">업종을 선택해주세요</span>
          )}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* 업종 선택 그리드 */}
      {isOpen && (
        <div className="mt-2 p-3 border rounded-xl bg-white animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {BUSINESS_TYPES.map((b) => {
              const selected = value === b.id
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    onChange(b.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                    "border hover:shadow-sm",
                    selected 
                      ? "border-black bg-black text-white" 
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <span className="text-base">{b.emoji}</span>
                  <span className="text-xs font-medium truncate">{b.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </fieldset>
  )
}