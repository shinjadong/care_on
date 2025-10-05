import { useState } from "react"
import { BUSINESS_TYPES } from "@/lib/businessTypes"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

type DisplayMode = 'grid' | 'compact' | 'toggle' | 'select'

type Props = {
  value?: number
  onChange: (val: number) => void
  name?: string
  mode?: DisplayMode
  label?: string
}

export default function BusinessTypeSelector({ 
  value, 
  onChange, 
  name = "business_type",
  mode = "grid",
  label = "업종"
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedType = BUSINESS_TYPES.find(b => b.id === value)

  // Toggle 모드
  if (mode === 'toggle') {
    return (
      <fieldset className="relative">
        <legend className="mb-2 block text-sm font-medium">{label} *</legend>
        <input type="hidden" name={name} value={value ?? ""} />
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <span className={cn(
            "text-sm",
            selectedType ? "text-gray-900" : "text-gray-500"
          )}>
            {selectedType ? selectedType.name : "업종을 선택해주세요"}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {BUSINESS_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  onChange(type.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-3 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg",
                  value === type.id ? "bg-blue-50 text-blue-900" : "text-gray-900"
                )}
              >
                {type.name}
              </button>
            ))}
          </div>
        )}
      </fieldset>
    )
  }

  // Select 모드
  if (mode === 'select') {
    return (
      <fieldset>
        <legend className="mb-2 block text-sm font-medium">{label} *</legend>
        <select
          name={name}
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">업종을 선택해주세요</option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </fieldset>
    )
  }

  // Grid 및 Compact 모드
  const gridCols = mode === 'compact' ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
  const buttonSize = mode === 'compact' ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'

  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">{label} *</legend>
      <input type="hidden" name={name} value={value ?? ""} />
      <div className={cn("grid gap-2", gridCols)}>
        {BUSINESS_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={cn(
              "border rounded-lg font-medium transition-colors text-center",
              buttonSize,
              value === type.id
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            )}
          >
            {type.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}