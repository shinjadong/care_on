import { BUSINESS_TYPES } from "@/lib/businessTypes"

type Props = {
  value?: number
  onChange: (val: number) => void
  required?: boolean
  name?: string
}

export default function BusinessTypeSelect({ 
  value, 
  onChange, 
  required, 
  name = "business_type" 
}: Props) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">업종 *</span>
      <select
        name={name}
        required={required}
        className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none transition-colors"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="업종 선택"
      >
        <option value="" disabled>업종을 선택하세요</option>
        {BUSINESS_TYPES.map((b) => (
          <option key={b.id} value={b.id}>
            {b.emoji ? `${b.emoji} ` : ""}{b.id}. {b.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">저장 시 숫자(ID)가 DB에 기록됩니다.</p>
    </label>
  )
}