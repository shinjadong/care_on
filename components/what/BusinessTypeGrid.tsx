import { BUSINESS_TYPES } from "@/lib/businessTypes"
import { cn } from "@/lib/utils"

type Props = {
  value?: number
  onChange: (val: number) => void
  name?: string
}

export default function BusinessTypeGrid({ 
  value, 
  onChange, 
  name = "business_type" 
}: Props) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium">업종 *</legend>
      <input type="hidden" name={name} value={value ?? ""} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {BUSINESS_TYPES.map((b) => {
          const selected = value === b.id
          return (
            <button
              key={b.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(b.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-all",
                selected 
                  ? "border-black bg-black/5 shadow-md" 
                  : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              )}
            >
              <span className="text-2xl">{b.emoji}</span>
              <span className="text-xs font-medium">{b.label}</span>
              <span className="text-[10px] text-gray-500">#{b.id}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-gray-500">선택된 항목의 ID만 DB에 저장됩니다.</p>
    </fieldset>
  )
}