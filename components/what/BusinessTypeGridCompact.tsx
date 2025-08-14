import { BUSINESS_TYPES } from "@/lib/businessTypes"
import { cn } from "@/lib/utils"

type Props = {
  value?: number
  onChange: (val: number) => void
  name?: string
}

export default function BusinessTypeGridCompact({ 
  value, 
  onChange, 
  name = "business_type" 
}: Props) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">업종 선택 *</legend>
      <input type="hidden" name={name} value={value ?? ""} />
      
      {/* 컴팩트한 그리드 레이아웃 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {BUSINESS_TYPES.map((b) => {
          const selected = value === b.id
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(b.id)}
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
      
      {value && (
        <p className="mt-2 text-xs text-gray-600">
          선택됨: <strong>{BUSINESS_TYPES.find(b => b.id === value)?.label}</strong>
        </p>
      )}
    </fieldset>
  )
}