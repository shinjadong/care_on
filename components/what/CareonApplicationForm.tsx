"use client"

import { useState, useEffect } from "react"
import BusinessTypeSelect from "./BusinessTypeSelect"
import BusinessTypeGrid from "./BusinessTypeGrid"
import BusinessTypeGridCompact from "./BusinessTypeGridCompact"
import BusinessTypeToggle from "./BusinessTypeToggle"
import AddressSearch from "./AddressSearch"
import { createClient } from "@/lib/supabase/client-with-fallback"

type FormData = {
  name: string
  company_name?: string
  phone_number: string
  startup_period: string
  on_site_estimate_datetime: string
  business_type: number
  birth_date: string
  agree_review: boolean
  agree_photo: boolean
  agree_privacy: boolean
  agree_marketing: boolean
}

type Props = {
  useGrid?: boolean
  onSuccess?: () => void
}

export default function CareonApplicationForm({ useGrid = false, onSuccess }: Props) {
  const [businessType, setBusinessType] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState({ first: "010", middle: "", last: "" })
  const [businessStatus, setBusinessStatus] = useState("")
  const [openDate, setOpenDate] = useState("")
  const [existingServices, setExistingServices] = useState({ cctv: false, internet: false, insurance: false })
  const [birthNumber, setBirthNumber] = useState({ birth: "", gender: "" })
  const [businessAddress, setBusinessAddress] = useState("")
  const [businessAddressDetail, setBusinessAddressDetail] = useState("")
  const [callPreference, setCallPreference] = useState<"asap" | "scheduled" | "">("")
  const [callDate, setCallDate] = useState("")
  const [callTime, setCallTime] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    const fd = new FormData(e.currentTarget)
    
    // 주민번호 조합
    const birthIdNumber = `${birthNumber.birth}${birthNumber.gender}`
    
    // 연락처 조합
    const fullPhoneNumber = `${phoneNumber.first}-${phoneNumber.middle}-${phoneNumber.last}`
    
    // 전화통화 일시 조합
    const callDateTime = callPreference === "asap" 
      ? `ASAP-${callTime}` 
      : (callDate && callTime ? `${callDate}T${callTime}:00` : "")
    
    const payload = {
      name: String(fd.get("name") || "").trim(),
      company_name: String(fd.get("company_name") || "").trim() || null,
      phone_number: fullPhoneNumber,
      business_address: businessAddress + (businessAddressDetail ? ` ${businessAddressDetail}` : ""),
      startup_period: String(fd.get("startup_period") || ""),
      business_status: businessStatus,
      open_date: openDate || null,
      existing_services: existingServices,
      call_datetime: callDateTime, // 전화통화 가능 시간
      business_type: businessType || 0,
      birth_date: birthIdNumber, // 주민번호 앞 7자리 저장
      agree_privacy: fd.get("agree_privacy") === "on",
      agree_marketing: fd.get("agree_marketing") === "on",
    }

    if (!payload.name || !phoneNumber.middle || !phoneNumber.last || !businessAddress || !businessAddressDetail || !payload.business_type || 
        !payload.startup_period || !businessStatus || !callPreference || !callTime || !birthNumber.birth || !birthNumber.gender) {
      if (businessStatus === "interior" && !openDate) {
        setError("인테리어 공사중인 경우 오픈 예정일을 입력해주세요.")
        return
      }
      if (callPreference === "scheduled" && !callDate) {
        setError("원하는 날짜를 선택한 경우 날짜를 입력해주세요.")
        return
      }
      if (birthNumber.birth && birthNumber.birth.length !== 6) {
        setError("생년월일 6자리를 정확히 입력해주세요.")
      } else if (birthNumber.gender && birthNumber.gender.length !== 1) {
        setError("주민번호 뒷자리 첫 번째 숫자를 입력해주세요.")
      } else {
        setError("필수 항목을 모두 입력해주세요.")
      }
      return
    }

    if (!payload.agree_privacy) {
      setError("개인정보 수집 및 이용에 동의해주세요.")
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase
        .from("careon_applications")
        .insert(payload)

      if (error) throw error
      
      // SMS 기능은 API 키 발급 후 활성화 예정
      // 현재는 Supabase 저장만 진행
      
      setSuccess(true)
      e.currentTarget.reset()
      setBusinessType(undefined)
      setPhoneNumber({ first: "010", middle: "", last: "" })
      setBusinessStatus("")
      setOpenDate("")
      setExistingServices({ cctv: false, internet: false, insurance: false })
      setBirthNumber({ birth: "", gender: "" })
      setBusinessAddress("")
      setBusinessAddressDetail("")
      setCallPreference("")
      setCallDate("")
      setCallTime("")
      
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
    return <div className="mx-auto max-w-xl p-8 text-center">로딩중...</div>
  }

  if (success) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h3 className="mb-2 text-xl font-bold">신청이 완료되었습니다!</h3>
        <p className="text-gray-600">곧 연락드리겠습니다.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-blue-600 underline"
        >
          다시 신청하기
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-6 rounded-2xl bg-white p-6 shadow-lg">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold">케어온 무료체험단 신청</h2>
        <p className="text-sm text-gray-600">사장님의 첫 투자자가 되겠습니다.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">업체명</label>
          <input 
            name="company_name" 
            placeholder="예: OO치킨, OO카페" 
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">가입자 성함 *</label>
          <input 
            name="name" 
            required 
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">연락처 *</label>
          <div className="mt-1 flex gap-2">
            <select 
              value={phoneNumber.first}
              onChange={(e) => setPhoneNumber({ ...phoneNumber, first: e.target.value })}
              className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <span className="flex items-center">-</span>
            <input 
              type="tel"
              maxLength={4}
              placeholder="0000"
              value={phoneNumber.middle}
              onChange={(e) => setPhoneNumber({ ...phoneNumber, middle: e.target.value.replace(/\D/g, '') })}
              className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            />
            <span className="flex items-center">-</span>
            <input 
              type="tel"
              maxLength={4}
              placeholder="0000"
              value={phoneNumber.last}
              onChange={(e) => setPhoneNumber({ ...phoneNumber, last: e.target.value.replace(/\D/g, '') })}
              className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">생년월일 정보를 입력해주세요 *</label>
          <div className="mt-1 flex items-center gap-2">
            <input 
              type="text"
              maxLength={6}
              placeholder="940101"
              value={birthNumber.birth}
              onChange={(e) => setBirthNumber({ ...birthNumber, birth: e.target.value.replace(/\D/g, '') })}
              className="w-32 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none text-center"
            />
            <span className="text-gray-500">-</span>
            <input 
              type="text"
              maxLength={1}
              placeholder="1"
              value={birthNumber.gender}
              onChange={(e) => setBirthNumber({ ...birthNumber, gender: e.target.value.replace(/\D/g, '') })}
              className="w-12 rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none text-center"
            />
            <span className="text-xs text-gray-500">●●●●●●</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            예시: 1994년 1월 1일생 남성의 경우 940101 - 1
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium">사업장 주소 *</label>
          <AddressSearch 
            value={businessAddress}
            onComplete={(data) => setBusinessAddress(data.address)}
            placeholder="클릭하여 주소 검색"
          />
          {businessAddress && (
            <input
              type="text"
              placeholder="상세 주소 입력 (필수)"
              value={businessAddressDetail}
              onChange={(e) => setBusinessAddressDetail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">창업 시기 *</label>
          <select 
            name="startup_period" 
            required
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
          >
            <option value="">선택하세요</option>
            <option value="preparing">창업 준비중</option>
            <option value="within_1_year">창업 1년 이내</option>
            <option value="1_to_3_years">창업 1년~3년</option>
            <option value="over_3_years">창업 3년 이상</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">사업장의 현재 상태는 어떻습니까? *</label>
          
          {/* 사업장 상태 선택 */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="business_status"
                value="immediate"
                checked={businessStatus === "immediate"}
                onChange={(e) => setBusinessStatus(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">현재 영업중 - 5일 이내 설치 필요 🔥</p>
                <p className="text-xs text-gray-600">바로 설치가 가능한 상태입니다</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="business_status"
                value="interior"
                checked={businessStatus === "interior"}
                onChange={(e) => setBusinessStatus(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">5일 이후에 설치 가능</p>
                <p className="text-xs text-gray-600">원하는 일정에 맞춰 설치 진행</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="business_status"
                value="preparing"
                checked={businessStatus === "preparing"}
                onChange={(e) => setBusinessStatus(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-sm">창업 준비중 (매장 없음)</p>
                <p className="text-xs text-gray-600">사업장 확정 후 설치 가능</p>
              </div>
            </label>
          </div>

          {/* 오픈 예정일 입력 (인테리어 공사중일 때만) */}
          {businessStatus === "interior" && (
            <div className="mt-3">
              <label className="block text-sm font-medium mb-1">원하시는 일정을 선택해주세요 *</label>
              <input
                type="date"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none"
                required={businessStatus === "interior"}
              />
            </div>
          )}
          
          {/* 기존 서비스 가입 상태 */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium mb-2">현재 가입된 서비스가 있다면 체크해주세요:</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={existingServices.cctv}
                  onChange={(e) => setExistingServices({...existingServices, cctv: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">CCTV</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={existingServices.internet}
                  onChange={(e) => setExistingServices({...existingServices, internet: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">인터넷</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={existingServices.insurance}
                  onChange={(e) => setExistingServices({...existingServices, insurance: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">화재보험</span>
              </label>
            </div>
          </div>
        </div>

        <BusinessTypeToggle value={businessType} onChange={setBusinessType} />

        <div>
          <label className="block text-sm font-medium mb-2">전화통화 가능한 시간 (5분 내외 소요) *</label>
          
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="call_preference"
                value="asap"
                checked={callPreference === "asap"}
                onChange={(e) => {
                  setCallPreference("asap")
                  setCallDate("")
                }}
              />
              <div>
                <p className="font-medium text-sm">가능한 빨리</p>
                <p className="text-xs text-gray-600">순차적으로 연락드립니다</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="call_preference"
                value="scheduled"
                checked={callPreference === "scheduled"}
                onChange={(e) => setCallPreference("scheduled")}
              />
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm">원하는 날짜</p>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </label>
          </div>

          {/* 날짜 선택 (원하는 날짜 선택시만 표시) */}
          {callPreference === "scheduled" && (
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-medium">원하시는 날짜를 선택해주세요</p>
              <input 
                type="date"
                value={callDate}
                onChange={(e) => setCallDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none bg-white"
              />
            </div>
          )}
          
          {/* 시간대 선택 (항상 표시) */}
          {callPreference && (
            <div className="mt-3">
              <label className="block text-xs font-medium mb-1">선호하는 통화 시간대 *</label>
              <select
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-black focus:outline-none bg-white"
                required
              >
                <option value="">시간대를 선택하세요</option>
                <option value="09:00-12:00">오전 (9시-12시)</option>
                <option value="12:00-15:00">점심 (12시-3시)</option>
                <option value="15:00-18:00">오후 (3시-6시)</option>
                <option value="18:00-20:00">저녁 (6시-8시)</option>
              </select>
            </div>
          )}
        </div>

          
        <div className="space-y-2 rounded-xl bg-gray-50 p-4">
          <div className="text-sm font-medium">동의사항</div>
          


          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="agree_privacy" 
              required
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">개인정보 수집 및 이용에 동의합니다 *</span>
          </label>

          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              name="agree_marketing"
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm">마케팅 정보 수신에 동의합니다 (선택)</span>
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-black px-4 py-3 text-white transition-opacity disabled:opacity-50"
      >
        {loading ? "신청 중..." : "무료체험단 신청하기"}
      </button>

      <div className="rounded-xl bg-blue-50 p-4 text-xs text-gray-600">
        <div className="mb-2 font-bold">✅ 케어온이 지원하는 혜택:</div>
        <ul className="space-y-1">
          <li>• 12개월간 통신비 전액 지원</li>
          <li>• 폐업시 100% 환급 보장 (TV 결합시)</li>
          <li>• 설치비, 철거비 모두 무료</li>
        </ul>
      </div>
    </form>
  )
}