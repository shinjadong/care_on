"use client"

import { useState, useEffect } from "react"
import BusinessTypeSelect from "./BusinessTypeSelect"
import BusinessTypeGrid from "./BusinessTypeGrid"
import BusinessTypeGridCompact from "./BusinessTypeGridCompact"
import BusinessTypeToggle from "./BusinessTypeToggle"
import AddressSearch from "./AddressSearch"
import { createClient } from "@/lib/supabase/client-with-fallback"
import { ChevronDown, ChevronRight, Check, User, Phone, MapPin, Store, Clock, FileText } from "lucide-react"

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

type SectionType = "basic" | "business" | "contact" | "agreement"

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
  
  // 섹션 토글 상태
  const [expandedSections, setExpandedSections] = useState<Set<SectionType>>(new Set(["basic"]))
  
  // 섹션 완료 상태
  const [completedSections, setCompletedSections] = useState<Set<SectionType>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleSection = (section: SectionType) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // 섹션 완료 체크
  const checkSectionCompletion = (section: SectionType): boolean => {
    switch (section) {
      case "basic":
        return !!(phoneNumber.middle && phoneNumber.last && birthNumber.birth && birthNumber.gender)
      case "business":
        return !!(businessAddress && businessAddressDetail && businessType && businessStatus)
      case "contact":
        return !!(callPreference && callTime)
      case "agreement":
        return true // 동의사항은 제출시 체크
      default:
        return false
    }
  }

  useEffect(() => {
    const newCompleted = new Set<SectionType>()
    if (checkSectionCompletion("basic")) newCompleted.add("basic")
    if (checkSectionCompletion("business")) newCompleted.add("business")
    if (checkSectionCompletion("contact")) newCompleted.add("contact")
    setCompletedSections(newCompleted)
  }, [phoneNumber, birthNumber, businessAddress, businessAddressDetail, businessType, businessStatus, callPreference, callTime])

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
      call_datetime: callDateTime,
      business_type: businessType || 0,
      birth_date: birthIdNumber,
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
    <form onSubmit={onSubmit} className="ajd-form mx-auto max-w-xl space-y-4">
      <div className="text-center mb-4 sm:mb-8">
        <h2 className="ajd-title">케어온 무료체험단 신청</h2>
        <p className="ajd-sub">사장님의 첫 투자자가 되겠습니다</p>
      </div>

      {/* 기본 정보 섹션 */}
      <div className="ajd-card">
        <button
          type="button"
          onClick={() => toggleSection("basic")}
          className="ajd-head-btn"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`ajd-bullet ${
              completedSections.has("basic") ? "done" : "idle"
            }`}>
              {completedSections.has("basic") ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <User className="w-3 h-3 sm:w-4 sm:h-4" />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold sm:text-base">기본 정보</h3>
              {completedSections.has("basic") && (
                <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">입력 완료</p>
              )}
            </div>
          </div>
          {expandedSections.has("basic") ? 
            <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
          }
        </button>
        
        {expandedSections.has("basic") && (
          <div className="ajd-body">
            <div className="pt-3 sm:pt-4">
              <label className="ajd-label">가입자 성함 *</label>
              <input 
                name="name" 
                required 
                placeholder="이름을 입력하세요"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="ajd-label">연락처 *</label>
              <div className="flex gap-1.5 sm:gap-2">
                <select 
                  value={phoneNumber.first}
                  onChange={(e) => setPhoneNumber({ ...phoneNumber, first: e.target.value })}
                  className="w-20 text-sm rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:w-24 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-base"
                >
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="0000"
                  value={phoneNumber.middle}
                  onChange={(e) => setPhoneNumber({ ...phoneNumber, middle: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 text-sm rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-base"
                />
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="0000"
                  value={phoneNumber.last}
                  onChange={(e) => setPhoneNumber({ ...phoneNumber, last: e.target.value.replace(/\D/g, '') })}
                  className="flex-1 text-sm rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-base"
                />
              </div>
            </div>

            <div>
              <label className="ajd-label">생년월일 *</label>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="940101"
                  value={birthNumber.birth}
                  onChange={(e) => setBirthNumber({ ...birthNumber, birth: e.target.value.replace(/\D/g, '') })}
                  className="w-28 text-sm rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none text-center sm:w-32 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-base"
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="text"
                  maxLength={1}
                  placeholder="1"
                  value={birthNumber.gender}
                  onChange={(e) => setBirthNumber({ ...birthNumber, gender: e.target.value.replace(/\D/g, '') })}
                  className="w-10 text-sm rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none text-center sm:w-12 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-base"
                />
                <span className="text-[10px] text-gray-400 sm:text-xs">●●●●●●</span>
              </div>
              <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                예: 1994년 1월 1일생 남성 → 940101 - 1
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 사업장 정보 섹션 */}
      <div className="ajd-card">
        <button
          type="button"
          onClick={() => toggleSection("business")}
          className="ajd-head-btn"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`ajd-bullet ${
              completedSections.has("business") ? "done" : "idle"
            }`}>
              {completedSections.has("business") ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Store className="w-3 h-3 sm:w-4 sm:h-4" />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold sm:text-base">사업장 정보</h3>
              {completedSections.has("business") && (
                <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">입력 완료</p>
              )}
            </div>
          </div>
          {expandedSections.has("business") ? 
            <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
          }
        </button>
        
        {expandedSections.has("business") && (
          <div className="ajd-body">
            <div className="pt-3 sm:pt-4">
              <label className="ajd-label">업체명</label>
              <input 
                name="company_name" 
                placeholder="예: OO치킨, OO카페" 
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="ajd-label">사업장 주소 *</label>
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
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
                  required
                />
              )}
            </div>

            <div>
              <label className="ajd-label">창업 시기 *</label>
              <select 
                name="startup_period" 
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
              >
                <option value="">선택하세요</option>
                <option value="preparing">창업 준비중</option>
                <option value="within_1_year">창업 1년 이내</option>
                <option value="1_to_3_years">창업 1년~3년</option>
                <option value="over_3_years">창업 3년 이상</option>
              </select>
            </div>

            <div>
              <label className="ajd-label">사업장 현재 상태 *</label>
              <div className="space-y-2">
                {[
                  { value: "immediate", label: "현재 영업중 - 5일 이내 설치 필요 🔥", desc: "바로 설치가 가능한 상태입니다" },
                  { value: "interior", label: "5일 이후에 설치 가능", desc: "원하는 일정에 맞춰 설치 진행" },
                  { value: "preparing", label: "창업 준비중 (매장 없음)", desc: "사업장 확정 후 설치 가능" }
                ].map(status => (
                  <label key={status.value} className="ajd-choice">
                    <input
                      type="radio"
                      name="business_status"
                      value={status.value}
                      checked={businessStatus === status.value}
                      onChange={(e) => setBusinessStatus(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-xs font-medium sm:text-sm">{status.label}</p>
                      <p className="text-[10px] text-gray-600 sm:text-xs">{status.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {businessStatus === "interior" && (
                <div className="mt-3">
                  <label className="ajd-label">원하시는 일정 *</label>
                  <input
                    type="date"
                    value={openDate}
                    onChange={(e) => setOpenDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
                    required={businessStatus === "interior"}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="ajd-label">업종 선택 *</label>
              <BusinessTypeToggle value={businessType} onChange={setBusinessType} />
            </div>

            <div className="p-2.5 bg-gray-50 rounded-lg sm:p-3 sm:rounded-xl">
              <p className="text-[10px] font-medium mb-1.5 sm:text-xs sm:mb-2">현재 이용중인 서비스 (선택)</p>
              <div className="flex gap-4">
                {[
                  { key: "cctv", label: "CCTV" },
                  { key: "internet", label: "인터넷" },
                  { key: "insurance", label: "화재보험" }
                ].map(service => (
                  <label key={service.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={existingServices[service.key as keyof typeof existingServices]}
                      onChange={(e) => setExistingServices({...existingServices, [service.key]: e.target.checked})}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 상담 시간 섹션 */}
      <div className="ajd-card">
        <button
          type="button"
          onClick={() => toggleSection("contact")}
          className="ajd-head-btn"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`ajd-bullet ${
              completedSections.has("contact") ? "done" : "idle"
            }`}>
              {completedSections.has("contact") ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Clock className="w-3 h-3 sm:w-4 sm:h-4" />}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold sm:text-base">상담 시간</h3>
              {completedSections.has("contact") && (
                <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">입력 완료</p>
              )}
            </div>
          </div>
          {expandedSections.has("contact") ? 
            <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
          }
        </button>
        
        {expandedSections.has("contact") && (
          <div className="ajd-body">
            <div className="pt-3 sm:pt-4">
              <label className="ajd-label">전화 상담 일정 (5분 내외) *</label>
              <div className="space-y-2">
                <label className="ajd-choice">
                  <input
                    type="radio"
                    name="call_preference"
                    value="asap"
                    checked={callPreference === "asap"}
                    onChange={() => {
                      setCallPreference("asap")
                      setCallDate("")
                    }}
                  />
                  <div>
                    <p className="text-xs font-medium sm:text-sm">가능한 빨리</p>
                    <p className="text-[10px] text-gray-600 sm:text-xs">순차적으로 연락드립니다</p>
                  </div>
                </label>

                <label className="ajd-choice">
                  <input
                    type="radio"
                    name="call_preference"
                    value="scheduled"
                    checked={callPreference === "scheduled"}
                    onChange={() => setCallPreference("scheduled")}
                  />
                  <div>
                    <p className="text-xs font-medium sm:text-sm">원하는 날짜 선택</p>
                    <p className="text-[10px] text-gray-600 sm:text-xs">편한 시간에 연락드립니다</p>
                  </div>
                </label>
              </div>

              {callPreference === "scheduled" && (
                <div className="mt-3">
                  <input 
                    type="date"
                    value={callDate}
                    onChange={(e) => setCallDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
                  />
                </div>
              )}
              
              {callPreference && (
                <div className="mt-3">
                  <label className="ajd-label">선호 시간대 *</label>
                  <select
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
                    required
                  >
                    <option value="">시간대 선택</option>
                    <option value="09:00-12:00">오전 (9시-12시)</option>
                    <option value="12:00-15:00">점심 (12시-3시)</option>
                    <option value="15:00-18:00">오후 (3시-6시)</option>
                    <option value="18:00-20:00">저녁 (6시-8시)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 동의사항 섹션 */}
      <div className="ajd-card">
        <button
          type="button"
          onClick={() => toggleSection("agreement")}
          className="ajd-head-btn"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="ajd-bullet idle">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold sm:text-base">동의사항</h3>
            </div>
          </div>
          {expandedSections.has("agreement") ? 
            <ChevronDown className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" /> : 
            <ChevronRight className="w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
          }
        </button>
        
        {expandedSections.has("agreement") && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="pt-3 space-y-2.5 sm:pt-4 sm:space-y-3">
              <label className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="agree_privacy" 
                  required
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <span className="text-xs font-medium sm:text-sm">개인정보 수집 및 이용 동의 *</span>
                  <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">신청에 필요한 정보를 수집합니다</p>
                </div>
              </label>

              <label className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="agree_marketing"
                  className="mt-1 rounded border-gray-300"
                />
                <div>
                  <span className="text-xs font-medium sm:text-sm">마케팅 정보 수신 동의</span>
                  <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">유용한 정보와 혜택을 받아보세요</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 혜택 안내 */}
      <div className="ajd-benefit">
        <div className="flex items-start gap-3">
          <div className="icon mt-0.5">
            <Check className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">케어온 혜택</h4>
            <ul className="space-y-1 text-xs text-gray-700">
              <li>• 12개월간 통신비 전액 지원</li>
              <li>• 폐업시 100% 환급 보장 (TV 결합시)</li>
              <li>• 설치비, 철거비 모두 무료</li>
            </ul>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || completedSections.size < 3}
        className={`ajd-submit ${
          completedSections.size >= 3 
            ? "enabled" 
            : "disabled"
        }`}
      >
        {loading ? "신청 중..." : "무료체험단 신청하기"}
      </button>
    </form>
  )
}