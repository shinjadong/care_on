"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client-with-fallback"
import { User, Phone, Store, Check } from "lucide-react"
import { motion } from "framer-motion"

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
  const [step, setStep] = useState<1 | 2>(1) // 1: 혜택 안내, 2: 신청서 작성
  
  // 폼 데이터 state
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState({ first: "010", middle: "", last: "" })

  useEffect(() => {
    setMounted(true)
  }, [])

  // 폼 완성도 체크
  const isFormComplete = name.trim() && phoneNumber.middle && (phoneNumber.middle.length + phoneNumber.last.length >= 7)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    // 연락처 조합
    const fullPhoneNumber = `${phoneNumber.first}-${phoneNumber.middle}-${phoneNumber.last}`
    
    const payload = {
      name: name.trim(),
      company_name: companyName.trim() || null,
      phone_number: fullPhoneNumber,
    }

    // 기본 검증
    if (!name.trim()) {
      setError("이름을 입력해주세요.")
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
      setName("")
      setCompanyName("")
      setPhoneNumber({ first: "010", middle: "", last: "" })
      setStep(1) // 첫 번째 단계로 리셋
      
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
        <h3 className="mb-2 text-lg font-bold sm:text-xl">대기 신청이 완료되었습니다!</h3>
      </div>
    )
  }

  // 1단계: 혜택 안내
  if (step === 1) {
    return (
      <div className="ajd-form mx-auto w-full max-w-lg">
        {/* 혜택 안내 */}
        <motion.div 
          className="mb-12 px-6 sm:px-8 pt-6 sm:pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h4 
            className="font-bold text-2xl mb-6 text-[#0f6c5d] sm:text-3xl"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            체험단은 이런 혜택을 받아요
          </motion.h4>
          <motion.ul 
            className="space-y-2 text-lg sm:text-xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                  delayChildren: 0.4
                }
              }
            }}
          >
            <motion.li
              className="text-gray-800 font-semibold"
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              • 12개월간 통신비 전액 지원
            </motion.li>
            <motion.li
              className="text-gray-800 font-semibold"
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              • 폐업시 100% 환급 보장
            </motion.li>
            <motion.li
              className="text-gray-800 font-semibold"
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: { x: 0, opacity: 1 }
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              • 설치비 무료
            </motion.li>
          </motion.ul>
        </motion.div>

        {/* 확인 버튼 */}
        <motion.button
          onClick={() => setStep(2)}
          className="w-full py-3 px-4 text-base font-bold rounded-xl transition-colors sm:text-lg bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white hover:shadow-lg hover:shadow-[#148777]/15"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          확인했어요!
        </motion.button>
      </div>
    )
  }

  // 2단계: 신청서 작성
  return (
    <form onSubmit={onSubmit} className="ajd-form mx-auto w-full max-w-lg">
      {/* 헤더 */}
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:text-2xl">무료 체험단 대기 신청</h2>
        <p className="text-sm text-gray-600 sm:text-base">간단한 정보만 입력하시면 연락드리겠습니다</p>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="ajd-card">
        <div className="ajd-head-btn">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`ajd-bullet ${isFormComplete ? "done" : "idle"}`}>
              {isFormComplete ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <User className="w-3 h-3 sm:w-4 sm:h-4" />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold sm:text-base">기본 정보</h3>
              {isFormComplete && (
                <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">입력 완료</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="ajd-body space-y-4">
          <div className="pt-3 sm:pt-4">
            <label className="ajd-label">성함 *</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
              placeholder="이름을 입력하세요"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#148777] focus:outline-none"
            />
          </div>

          <div>
            <label className="ajd-label">업체명</label>
            <input 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="예: OO치킨, OO카페 (선택사항)"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-[#148777] focus:outline-none"
            />
          </div>

          <div>
            <label className="ajd-label">연락처 *</label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              <select 
                value={phoneNumber.first}
                onChange={(e) => setPhoneNumber({ ...phoneNumber, first: e.target.value })}
                className="col-span-2 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-[#148777] focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm"
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
                className="col-span-3 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-[#148777] focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm text-center"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 sm:rounded-xl sm:p-3 sm:text-sm">
          {error}
        </div>
      )}

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={loading || !isFormComplete}
        className={`w-full py-3 px-4 text-sm font-semibold rounded-xl transition-colors sm:text-base ${
          isFormComplete 
            ? "bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white hover:shadow-lg hover:shadow-[#148777]/15" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? "신청 중..." : "무료체험단 대기 신청하기"}
      </button>

      <p className="mt-3 text-center text-xs text-gray-500 sm:text-sm">
        심사 후 담당자가 빠른 시일 내에 연락드리겠습니다
      </p>
    </form>
  )
}