"use client"

import { useState, useEffect } from "react"
import BusinessTypeSelector from "./BusinessTypeSelector"
import AddressSearch from "./AddressSearch"
import { createClient } from "@/lib/supabase/client-with-fallback"
import { ChevronDown, ChevronRight, Check, User, Phone, MapPin, Store, Clock, FileText } from "lucide-react"

// Cloudflare Worker URL - 배포 후 실제 URL로 변경하세요
const CLOUDFLARE_WORKER_URL = 'https://careon-sms-proxy.YOUR-SUBDOMAIN.workers.dev'

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

// 업종 매핑
const businessTypeMap: { [key: number]: string } = {
  1: '요식업',
  2: '카페/베이커리',
  3: '미용/뷰티',
  4: '의료/병원',
  5: '학원/교육',
  6: '소매/판매',
  7: '사무실',
  8: '헬스/운동',
  9: '숙박업',
  10: '기타',
}

export default function CareonApplicationFormCloudflare({ useGrid = false, onSuccess }: Props) {
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
  
  // 페이지 상태
  const [currentPage, setCurrentPage] = useState<1 | 2>(1)
  
  // 추가 state 관리 (FormData 대신)
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [startupPeriod, setStartupPeriod] = useState("")
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeMarketing, setAgreeMarketing] = useState(false)
  
  // 섹션 완료 상태
  const [completedSections, setCompletedSections] = useState<Set<SectionType>>(new Set())

  useEffect(() => {
    setMounted(true)
  }, [])

  // 페이지 이동 핸들러
  const handleNextPage = () => {
    if (currentPage === 1 && checkSectionCompletion("basic")) {
      setCurrentPage(2)
    }
  }

  const handlePrevPage = () => {
    if (currentPage === 2) {
      setCurrentPage(1)
    }
  }

  // 섹션 완료 체크
  const checkSectionCompletion = (section: SectionType): boolean => {
    switch (section) {
      case "basic":
        return !!(name && phoneNumber.middle && phoneNumber.last && birthNumber.birth && birthNumber.gender)
      case "business":
        return !!(businessAddress && businessAddressDetail && businessType && businessStatus && startupPeriod)
      case "contact":
        return !!(callPreference && callTime)
      case "agreement":
        return agreePrivacy // 필수 동의사항 체크
      default:
        return false
    }
  }

  useEffect(() => {
    const newCompleted = new Set<SectionType>()
    if (checkSectionCompletion("basic")) newCompleted.add("basic")
    if (checkSectionCompletion("business")) newCompleted.add("business")
    if (checkSectionCompletion("contact")) newCompleted.add("contact")
    if (checkSectionCompletion("agreement")) newCompleted.add("agreement")
    setCompletedSections(newCompleted)
  }, [name, phoneNumber, birthNumber, businessAddress, businessAddressDetail, businessType, businessStatus, startupPeriod, callPreference, callTime, agreePrivacy])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    
    // 주민번호 조합
    const birthIdNumber = `${birthNumber.birth}${birthNumber.gender}`
    
    // 연락처 조합
    const fullPhoneNumber = `${phoneNumber.first}-${phoneNumber.middle}-${phoneNumber.last}`
    
    // 전화통화 일시 조합
    const callDateTime = callPreference === "asap" 
      ? `ASAP-${callTime}` 
      : (callDate && callTime ? `${callDate}T${callTime}:00` : "")
    
    const payload = {
      name: name.trim(),
      company_name: companyName.trim() || null,
      phone_number: fullPhoneNumber,
      business_address: businessAddress + (businessAddressDetail ? ` ${businessAddressDetail}` : ""),
      startup_period: startupPeriod,
      business_status: businessStatus,
      open_date: openDate || null,
      existing_services: existingServices,
      call_datetime: callDateTime,
      business_type: businessType || 0,
      birth_date: birthIdNumber,
      agree_privacy: agreePrivacy,
      agree_marketing: agreeMarketing,
    }

    // 세부 검증
    if (!name) {
      setError("이름을 입력해주세요.")
      return
    }
    if (!phoneNumber.middle || !phoneNumber.last) {
      setError("연락처를 정확히 입력해주세요.")
      return
    }
    if (!birthNumber.birth || birthNumber.birth.length !== 6) {
      setError("생년월일 6자리를 정확히 입력해주세요.")
      return
    }
    if (!birthNumber.gender || birthNumber.gender.length !== 1) {
      setError("주민번호 뒷자리 첫 번째 숫자를 입력해주세요.")
      return
    }
    if (!businessAddress || !businessAddressDetail) {
      setError("사업장 주소를 정확히 입력해주세요.")
      return
    }
    if (!businessType) {
      setError("업종을 선택해주세요.")
      return
    }
    if (!startupPeriod) {
      setError("창업 시기를 선택해주세요.")
      return
    }
    if (!businessStatus) {
      setError("사업장 현재 상태를 선택해주세요.")
      return
    }
    if (businessStatus === "interior" && !openDate) {
      setError("인테리어 공사중인 경우 오픈 예정일을 입력해주세요.")
      return
    }
    if (!callPreference) {
      setError("전화 상담 일정을 선택해주세요.")
      return
    }
    if (callPreference === "scheduled" && !callDate) {
      setError("원하는 날짜를 선택한 경우 날짜를 입력해주세요.")
      return
    }
    if (!callTime) {
      setError("선호 시간대를 선택해주세요.")
      return
    }
    if (!agreePrivacy) {
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
      
      // SMS 전송 - Cloudflare Worker 사용
      try {
        const smsResponse = await fetch(CLOUDFLARE_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: fullPhoneNumber,
            name: name.trim(),
            businessType: businessType ? businessTypeMap[businessType] : undefined,
          }),
        })
        
        const smsResult = await smsResponse.json()
        
        if (smsResult.success) {
          console.log('SMS 전송 성공 (Cloudflare):', smsResult)
        } else {
          console.error('SMS 전송 실패:', smsResult.error)
          // SMS 실패해도 신청은 성공으로 처리
        }
      } catch (smsError) {
        console.error('SMS 전송 오류:', smsError)
        // SMS 실패해도 신청은 성공으로 처리
      }
      
      setSuccess(true)
      // 모든 state 초기화
      setName("")
      setCompanyName("")
      setPhoneNumber({ first: "010", middle: "", last: "" })
      setBirthNumber({ birth: "", gender: "" })
      setBusinessAddress("")
      setBusinessAddressDetail("")
      setStartupPeriod("")
      setBusinessStatus("")
      setBusinessType(undefined)
      setOpenDate("")
      setExistingServices({ cctv: false, internet: false, insurance: false })
      setCallPreference("")
      setCallDate("")
      setCallTime("")
      setAgreePrivacy(false)
      setAgreeMarketing(false)
      setCurrentPage(1)
      
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
      <div className="mx-auto w-full max-w-lg rounded-xl border border-green-200 bg-green-50 p-6 text-center sm:rounded-2xl sm:p-8">
        <div className="mb-3 text-4xl sm:text-6xl sm:mb-4">✅</div>
        <h3 className="mb-2 text-lg font-bold sm:text-xl">신청이 완료되었습니다!</h3>
        <p className="text-sm text-gray-600 sm:text-base">곧 연락드리겠습니다.</p>
        <button
          onClick={() => {
            setSuccess(false)
            setCurrentPage(1)
          }}
          className="mt-3 text-xs text-blue-600 underline sm:mt-4 sm:text-sm"
        >
          다시 신청하기
        </button>
      </div>
    )
  }

  // 전체 완성도 계산 (페이지 기반)
  const totalProgress = currentPage === 1 
    ? (checkSectionCompletion("basic") ? 25 : 0)
    : 25 + ((completedSections.has("business") ? 1 : 0) + 
             (completedSections.has("contact") ? 1 : 0) + 
             (completedSections.has("agreement") ? 1 : 0)) * 25

  return (
    <form onSubmit={onSubmit} className="ajd-form mx-auto w-full max-w-lg space-y-3">
      {/* 완성도 게이지 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-600 font-medium">
            신청서 작성 ({currentPage}/2)
          </span>
          <span className="text-xs text-gray-600">{Math.round(totalProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand h-2 rounded-full transition-all duration-300" 
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>

      {/* 1페이지: 기본 정보 */}
      {currentPage === 1 && (
        <div className="ajd-card">
          <div className="ajd-head-btn">
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
          </div>
          
          <div className="ajd-body">
            <div className="pt-3 sm:pt-4">
              <label className="ajd-label">가입자 성함 *</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                placeholder="이름을 입력하세요"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 focus:border-brand focus:outline-none"
              />
            </div>

            <div>
              <label className="ajd-label">연락처 *</label>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                <select 
                  value={phoneNumber.first}
                  onChange={(e) => setPhoneNumber({ ...phoneNumber, first: e.target.value })}
                  className="col-span-2 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm"
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
                  className="col-span-2 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm text-center"
                />
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="0000"
                  value={phoneNumber.last}
                  onChange={(e) => setPhoneNumber({ ...phoneNumber, last: e.target.value.replace(/\D/g, '') })}
                  className="col-span-3 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm text-center"
                />
              </div>
            </div>

            <div>
              <label className="ajd-label">생년월일 *</label>
              <div className="flex items-center gap-1 sm:gap-2">
                <input 
                  type="text"
                  maxLength={6}
                  placeholder="940101"
                  value={birthNumber.birth}
                  onChange={(e) => setBirthNumber({ ...birthNumber, birth: e.target.value.replace(/\D/g, '') })}
                  className="w-24 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none text-center sm:w-28 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm"
                />
                <span className="text-xs text-gray-400 sm:text-sm">-</span>
                <input 
                  type="text"
                  maxLength={1}
                  placeholder="1"
                  value={birthNumber.gender}
                  onChange={(e) => setBirthNumber({ ...birthNumber, gender: e.target.value.replace(/\D/g, '') })}
                  className="w-8 text-xs rounded-lg border border-gray-200 px-2 py-2 focus:border-brand focus:outline-none text-center sm:w-10 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-sm"
                />
                <span className="text-[9px] text-gray-400 sm:text-[10px]">●●●●●●</span>
              </div>
              <p className="mt-1 text-[9px] text-gray-500 sm:text-[10px]">
                예: 1994년 1월 1일생 남성 → 940101 - 1
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2페이지: 사업장 정보, 상담 시간, 동의사항 */}
      {currentPage === 2 && (
        <>
          {/* 사업장 정보 섹션 */}
          <div className="ajd-card">
            <div className="ajd-head-btn">
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
            </div>
            
            <div className="ajd-body">
              <div className="pt-3 sm:pt-4">
                <label className="ajd-label">업체명</label>
                <input 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
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
                  value={startupPeriod}
                  onChange={(e) => setStartupPeriod(e.target.value)}
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
                <BusinessTypeSelector mode="toggle" value={businessType} onChange={setBusinessType} />
              </div>

              <div className="p-2 bg-gray-50 rounded-lg sm:p-3 sm:rounded-xl">
                <p className="text-[9px] font-medium mb-1 sm:text-[10px] sm:mb-1.5">현재 이용중인 서비스 (선택)</p>
                <div className="flex gap-3 sm:gap-4">
                  {[
                    { key: "cctv", label: "CCTV" },
                    { key: "internet", label: "인터넷" },
                    { key: "insurance", label: "화재보험" }
                  ].map(service => (
                    <label key={service.key} className="flex items-center gap-1.5 sm:gap-2">
                      <input
                        type="checkbox"
                        checked={existingServices[service.key as keyof typeof existingServices]}
                        onChange={(e) => setExistingServices({...existingServices, [service.key]: e.target.checked})}
                        className="w-3 h-3 rounded border-gray-300 sm:w-4 sm:h-4"
                      />
                      <span className="text-xs sm:text-sm">{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 상담 시간 섹션 */}
          <div className="ajd-card">
            <div className="ajd-head-btn">
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
            </div>
            
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
          </div>

          {/* 동의사항 섹션 */}
          <div className="ajd-card">
            <div className="ajd-head-btn">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="ajd-bullet idle">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-semibold sm:text-base">동의사항</h3>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="pt-3 space-y-2.5 sm:pt-4 sm:space-y-3">
                <label className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
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
                    checked={agreeMarketing}
                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-medium sm:text-sm">마케팅 정보 수신 동의</span>
                    <p className="text-[10px] text-gray-500 mt-0.5 sm:text-xs">유용한 정보와 혜택을 받아보세요</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 혜택 안내 - 2페이지에서만 표시 */}
      {currentPage === 2 && (
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
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 sm:rounded-xl sm:p-3 sm:text-sm">
          {error}
        </div>
      )}

      {/* 페이지 이동 버튼 */}
      <div className="flex gap-3">
        {currentPage === 2 && (
          <button
            type="button"
            onClick={handlePrevPage}
            className="flex-1 py-3 px-4 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors sm:text-base"
          >
            이전
          </button>
        )}
        
        {currentPage === 1 ? (
          <button
            type="button"
            onClick={handleNextPage}
            disabled={!checkSectionCompletion("basic")}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-colors sm:text-base ${
              checkSectionCompletion("basic")
                ? "bg-brand text-white hover:bg-brand/90"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            다음
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || completedSections.size < 4}
            className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-colors sm:text-base ${
              completedSections.size >= 4 
                ? "bg-brand text-white hover:bg-brand/90" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "신청 중..." : "무료체험단 신청하기"}
          </button>
        )}
      </div>
    </form>
  )
}