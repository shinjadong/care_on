"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client-with-fallback"

type FormData = {
  name: string
  company_name: string
  phone_number: string
}

type Props = {
  onSuccess?: () => void
}

export default function QuickApplicationForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 폼 데이터 state - 업체명과 전화번호만
  const [companyName, setCompanyName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState({ first: "010", middle: "", last: "" })

  useEffect(() => {
    setMounted(true)
  }, [])

  // 폼 완성도 체크 - 업체명과 전화번호만
  const isFormComplete = companyName.trim() && phoneNumber.middle && (phoneNumber.middle.length + phoneNumber.last.length >= 7)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    // 연락처 조합
    const fullPhoneNumber = `${phoneNumber.first}-${phoneNumber.middle}-${phoneNumber.last}`
    
    const payload = {
      name: companyName.trim(), // 업체명을 name 필드에 저장
      company_name: companyName.trim(),
      phone_number: fullPhoneNumber,
    }

    // 기본 검증
    if (!companyName.trim()) {
      setError("업체명을 입력해주세요.")
      return
    }
    if (!phoneNumber.middle || !phoneNumber.last) {
      setError("연락처를 정확히 입력해주세요.")
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase
        .from("quick_applications")
        .insert(payload)

      if (error) throw error
      
      setSuccess(true)
      // 모든 state 초기화
      setCompanyName("")
      setPhoneNumber({ first: "010", middle: "", last: "" })
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setError(`신청 중 오류가 발생했습니다: ${err?.message ?? "알 수 없는 오류"}`)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return <div className="mx-auto w-full max-w-lg p-6 text-center sm:p-8">로딩중...</div>
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-lg p-6 text-center sm:p-8">
        <div className="mb-3 text-4xl sm:text-6xl sm:mb-4">✅</div>
        <h3 className="mb-2 text-lg font-bold glass-text-primary sm:text-xl">신청이 완료되었습니다</h3>
        <p className="glass-text-secondary">담당자가 빠른 시일 내에 연락드리겠습니다</p>
      </div>
    )
  }

  // 바로 신청서 작성 폼으로
  return (
    <form onSubmit={onSubmit} className="ajd-form mx-auto w-full max-w-lg">
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold glass-text-primary mb-2 sm:text-2xl">체험단 신청</h2>
        <p className="text-sm glass-text-secondary sm:text-base">간단한 정보만 입력하시면 연락드리겠습니다</p>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="glass-card p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium glass-text-primary mb-2">업체명 *</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              placeholder="예: OO치킨, OO카페"
              className="glass-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium glass-text-primary mb-2">연락처 *</label>
            <div className="grid grid-cols-5 gap-2">
              <select
                value={phoneNumber.first}
                onChange={(e) => setPhoneNumber({ ...phoneNumber, first: e.target.value })}
                className="col-span-2 glass-input text-center"
              >
                <option value="010">010</option>
                <option value="011">011</option>
              </select>
              <input
                type="tel"
                maxLength={8}
                placeholder="00000000"
                value={`${phoneNumber.middle}${phoneNumber.last}`}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  if (value.length <= 4) {
                    setPhoneNumber({ ...phoneNumber, middle: value, last: "" })
                  } else {
                    setPhoneNumber({ ...phoneNumber, middle: value.slice(0, 4), last: value.slice(4, 8) })
                  }
                }}
                className="col-span-3 glass-input text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="glass-container p-3 mb-4 border border-red-400/30 bg-red-500/20">
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={loading || !isFormComplete}
        className={`w-full py-3 px-6 text-base font-semibold rounded-xl transition-all duration-300 ${
          isFormComplete
            ? "glass-container-strong glass-bg-primary glass-text-primary hover:scale-[1.02] active:scale-[0.98]"
            : "glass-container glass-text-muted cursor-not-allowed opacity-50"
        }`}
      >
{loading ? "신청 중..." : "체험단 신청하기"}
      </button>

      <p className="mt-4 text-center text-sm glass-text-secondary">
        심사 후 담당자가 빠른 시일 내에 연락드리겠습니다
      </p>
    </form>
  )
}