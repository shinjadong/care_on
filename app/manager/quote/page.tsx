"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, User, Phone, Building2, Wifi, Camera, CreditCard, FileCheck, Send, Eye as EyeIcon } from "lucide-react"

interface CustomerData {
  id: string  // contract ID 추가
  customer_number: string
  name: string
  phone: string
  business_name: string
  address: string
  email?: string
  business_registration?: string
  bank_name: string
  account_number: string
  account_holder: string
  documents: {
    bank_account_image: string
    id_card_image: string
    business_registration_image: string
  }
}

function ManagerQuoteContent() {
  const [searchData, setSearchData] = useState({
    name: "",
    phone: ""
  })
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [quoteData, setQuoteData] = useState({
    // 서비스 정보
    internet_plan: "",
    internet_monthly_fee: 0,
    cctv_count: "",
    cctv_monthly_fee: 0,
    installation_address: "",
    
    // 추가 서비스
    pos_needed: false,
    pos_monthly_fee: 0,
    tv_needed: false,
    tv_monthly_fee: 0,
    insurance_needed: false,
    insurance_monthly_fee: 0,
    
    // 계약 조건
    free_period: 12, // 무료 기간 (개월)
    contract_period: 36, // 계약 기간 (개월)
    
    // 특별 할인
    discount_rate: 0,
    special_conditions: "",
    
    // 매니저 메모
    manager_notes: ""
  })
  const [isSearching, setIsSearching] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isQuoteSent, setIsQuoteSent] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const customerNumber = searchParams.get('customer_number')
    if (customerNumber) {
      // 고객번호로 직접 검색
      searchByCustomerNumber(customerNumber)
    }
  }, [searchParams])

  const searchByCustomerNumber = async (customerNumber: string) => {
    setIsSearching(true)
    
    try {
      const response = await fetch('/api/contract/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_number: customerNumber
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.customer) {
          setCustomer(result.customer)
          setQuoteData(prev => ({
            ...prev,
            installation_address: result.customer.address
          }))
        }
      }
    } catch (error) {
      console.error('고객 검색 오류:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async () => {
    if (!searchData.name.trim() || !searchData.phone.trim()) {
      alert("고객 이름과 전화번호를 모두 입력해주세요.")
      return
    }

    setIsSearching(true)
    
    try {
      // 기존 reviews 테이블에서 계약 신청 데이터 검색
      const response = await fetch('/api/contract/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: searchData.name.trim(),
          phone: searchData.phone.replace(/[^0-9]/g, '')
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.customer) {
          setCustomer(result.customer)
          setQuoteData(prev => ({
            ...prev,
            installation_address: result.customer.address
          }))
        } else {
          alert('해당 고객 정보를 찾을 수 없습니다. 이름과 전화번호를 다시 확인해주세요.')
        }
      } else {
        alert('검색 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('고객 검색 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleQuoteChange = (field: string, value: string | number | boolean) => {
    setQuoteData(prev => ({ ...prev, [field]: value }))
  }

  const calculateTotal = () => {
    const monthlyTotal = 
      quoteData.internet_monthly_fee +
      quoteData.cctv_monthly_fee +
      (quoteData.pos_needed ? quoteData.pos_monthly_fee : 0) +
      (quoteData.tv_needed ? quoteData.tv_monthly_fee : 0) +
      (quoteData.insurance_needed ? quoteData.insurance_monthly_fee : 0)
    
    const discountAmount = monthlyTotal * (quoteData.discount_rate / 100)
    return monthlyTotal - discountAmount
  }

  const handleSendQuote = async () => {
    if (!customer) return
    
    setIsSending(true)
    
    try {
      // 견적 정보를 서버에 저장
      const response = await fetch('/api/contract/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contract_id: customer.id,
          customer_number: customer.customer_number,
          quote: quoteData,
          total_monthly_fee: calculateTotal(),
          manager_name: "매니저" // 실제로는 로그인한 매니저 정보
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('[Manager Quote] Quote saved:', result)
        
        // 카카오톡 발송 (실제 구현 필요)
        setIsQuoteSent(true)
      } else {
        const errorData = await response.json()
        alert(`견적 저장에 실패했습니다: ${errorData.error}`)
      }
    } catch (error) {
      console.error('견적서 전송 오류:', error)
      alert('견적서 전송에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  if (isQuoteSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">견적서 전송 완료</h2>
          <p className="text-gray-600 mb-6">
            {customer?.name}님에게<br />
            카카오톡으로 견적서가 전송되었습니다.
          </p>
          <Button
            onClick={() => {
              setIsQuoteSent(false)
              setCustomer(null)
              setSearchData({ name: "", phone: "" })
            }}
            className="w-full"
          >
            새 견적서 작성
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">매니저 견적 관리</h1>
          <p className="text-gray-600">실사 완료 후 고객별 맞춤 견적을 확정하고 전송하세요</p>
        </div>

        {/* 고객 검색 */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5" />
            고객 검색
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">고객 이름</label>
              <Input
                value={searchData.name}
                onChange={(e) => setSearchData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
              <Input
                value={searchData.phone}
                onChange={(e) => setSearchData(prev => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))}
                placeholder="01012345678"
                maxLength={11}
              />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full mt-4 bg-[#148777] hover:bg-[#0f6b5c]"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                검색 중...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                고객 정보 검색
              </>
            )}
          </Button>
        </Card>

        {customer && (
          <>
            {/* 고객 정보 표시 */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                고객 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>고객번호:</strong> <span className="text-[#148777] font-mono">{customer.customer_number}</span></p>
                  <p><strong>이름:</strong> {customer.name}</p>
                  <p><strong>전화번호:</strong> {customer.phone}</p>
                  <p><strong>이메일:</strong> {customer.email || '없음'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>사업체명:</strong> {customer.business_name}</p>
                  <p><strong>주소:</strong> {customer.address}</p>
                  <p><strong>사업자번호:</strong> {customer.business_registration || '없음'}</p>
                  <p><strong>계좌:</strong> {customer.bank_name} {customer.account_number}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium text-gray-700 mb-2">제출 서류:</p>
                <div className="flex gap-4 text-xs">
                  <span className={`px-2 py-1 rounded-full ${customer.documents.bank_account_image ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {customer.documents.bank_account_image ? '✓' : '✗'} 통장사본
                  </span>
                  <span className={`px-2 py-1 rounded-full ${customer.documents.id_card_image ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {customer.documents.id_card_image ? '✓' : '✗'} 신분증
                  </span>
                  <span className={`px-2 py-1 rounded-full ${customer.documents.business_registration_image ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {customer.documents.business_registration_image ? '✓' : '✗'} 사업자등록증
                  </span>
                </div>
              </div>
            </Card>

            {/* 견적 작성 */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                맞춤 견적 작성
              </h3>
              
              {/* 인터넷 서비스 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wifi className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">인터넷 서비스</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">요금제</label>
                    <select
                      value={quoteData.internet_plan}
                      onChange={(e) => handleQuoteChange('internet_plan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777]"
                    >
                      <option value="">선택하세요</option>
                      <option value="100M">100M</option>
                      <option value="500M">500M</option>
                      <option value="1G">1G</option>
                      <option value="기가플러스">기가플러스</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">월 요금 (원)</label>
                    <Input
                      type="number"
                      value={quoteData.internet_monthly_fee}
                      onChange={(e) => handleQuoteChange('internet_monthly_fee', Number(e.target.value))}
                      placeholder="30000"
                    />
                  </div>
                </div>
              </div>

              {/* CCTV 서비스 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Camera className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold text-gray-900">CCTV 서비스</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">설치 대수</label>
                    <Input
                      value={quoteData.cctv_count}
                      onChange={(e) => handleQuoteChange('cctv_count', e.target.value)}
                      placeholder="4대"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">월 요금 (원)</label>
                    <Input
                      type="number"
                      value={quoteData.cctv_monthly_fee}
                      onChange={(e) => handleQuoteChange('cctv_monthly_fee', Number(e.target.value))}
                      placeholder="80000"
                    />
                  </div>
                </div>
              </div>

              {/* 추가 서비스 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">추가 서비스</h4>
                <div className="space-y-4">
                  {/* POS */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={quoteData.pos_needed}
                        onChange={(e) => handleQuoteChange('pos_needed', e.target.checked)}
                        className="rounded"
                      />
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">POS 시스템</span>
                    </div>
                    {quoteData.pos_needed && (
                      <Input
                        type="number"
                        value={quoteData.pos_monthly_fee}
                        onChange={(e) => handleQuoteChange('pos_monthly_fee', Number(e.target.value))}
                        placeholder="월 요금"
                        className="w-32"
                      />
                    )}
                  </div>
                  
                  {/* TV */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={quoteData.tv_needed}
                        onChange={(e) => handleQuoteChange('tv_needed', e.target.checked)}
                        className="rounded"
                      />
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">TV 서비스</span>
                    </div>
                    {quoteData.tv_needed && (
                      <Input
                        type="number"
                        value={quoteData.tv_monthly_fee}
                        onChange={(e) => handleQuoteChange('tv_monthly_fee', Number(e.target.value))}
                        placeholder="월 요금"
                        className="w-32"
                      />
                    )}
                  </div>
                  
                  {/* 보험 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={quoteData.insurance_needed}
                        onChange={(e) => handleQuoteChange('insurance_needed', e.target.checked)}
                        className="rounded"
                      />
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="font-medium">업소용 보험</span>
                    </div>
                    {quoteData.insurance_needed && (
                      <Input
                        type="number"
                        value={quoteData.insurance_monthly_fee}
                        onChange={(e) => handleQuoteChange('insurance_monthly_fee', Number(e.target.value))}
                        placeholder="월 요금"
                        className="w-32"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* 계약 조건 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">계약 조건</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">무료 기간 (개월)</label>
                    <Input
                      type="number"
                      value={quoteData.free_period}
                      onChange={(e) => handleQuoteChange('free_period', Number(e.target.value))}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">계약 기간 (개월)</label>
                    <Input
                      type="number"
                      value={quoteData.contract_period}
                      onChange={(e) => handleQuoteChange('contract_period', Number(e.target.value))}
                      placeholder="36"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">할인율 (%)</label>
                    <Input
                      type="number"
                      value={quoteData.discount_rate}
                      onChange={(e) => handleQuoteChange('discount_rate', Number(e.target.value))}
                      placeholder="0"
                      max="50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">특별 조건</label>
                  <Input
                    value={quoteData.special_conditions}
                    onChange={(e) => handleQuoteChange('special_conditions', e.target.value)}
                    placeholder="예: 6개월 단위 선납 시 5% 추가 할인"
                  />
                </div>
              </div>

              {/* 총 요금 표시 */}
              <div className="bg-[#148777]/10 rounded-lg p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">월 총 요금</p>
                  <p className="text-3xl font-bold text-[#148777]">
                    {calculateTotal().toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    ({quoteData.free_period}개월 무료 후 적용)
                  </p>
                </div>
              </div>

              {/* 견적서 미리보기 */}
              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreviewing(!isPreviewing)}
                  className="w-full"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  견적서 미리보기
                </Button>
              </div>
              
              {isPreviewing && (
                <Card className="mb-6 p-6 bg-gray-50">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">견적서 미리보기</h4>
                  
                  <div className="space-y-4">
                    {/* 고객 정보 */}
                    <div className="border-b pb-4">
                      <h5 className="font-semibold mb-2">고객 정보</h5>
                      <div className="text-sm space-y-1">
                        <p><strong>업체명:</strong> {customer.business_name}</p>
                        <p><strong>대표자:</strong> {customer.name}</p>
                        <p><strong>연락처:</strong> {customer.phone}</p>
                      </div>
                    </div>
                    
                    {/* 서비스 내역 */}
                    <div className="border-b pb-4">
                      <h5 className="font-semibold mb-2">서비스 내역</h5>
                      <div className="text-sm space-y-2">
                        {quoteData.internet_plan && (
                          <div className="flex justify-between">
                            <span>인터넷 {quoteData.internet_plan}</span>
                            <span>{quoteData.internet_monthly_fee.toLocaleString()}원/월</span>
                          </div>
                        )}
                        {quoteData.cctv_count && (
                          <div className="flex justify-between">
                            <span>CCTV {quoteData.cctv_count}</span>
                            <span>{quoteData.cctv_monthly_fee.toLocaleString()}원/월</span>
                          </div>
                        )}
                        {quoteData.pos_needed && (
                          <div className="flex justify-between">
                            <span>POS 시스템</span>
                            <span>{quoteData.pos_monthly_fee.toLocaleString()}원/월</span>
                          </div>
                        )}
                        {quoteData.tv_needed && (
                          <div className="flex justify-between">
                            <span>TV 서비스</span>
                            <span>{quoteData.tv_monthly_fee.toLocaleString()}원/월</span>
                          </div>
                        )}
                        {quoteData.insurance_needed && (
                          <div className="flex justify-between">
                            <span>업소용 보험</span>
                            <span>{quoteData.insurance_monthly_fee.toLocaleString()}원/월</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* 계약 조건 */}
                    <div className="border-b pb-4">
                      <h5 className="font-semibold mb-2">계약 조건</h5>
                      <div className="text-sm space-y-1">
                        <p>• 무료 이용 기간: <strong>{quoteData.free_period}개월</strong></p>
                        <p>• 총 계약 기간: <strong>{quoteData.contract_period}개월</strong></p>
                        {quoteData.discount_rate > 0 && (
                          <p>• 특별 할인: <strong>{quoteData.discount_rate}%</strong></p>
                        )}
                      </div>
                    </div>
                    
                    {/* 요금 요약 */}
                    <div className="bg-[#148777]/10 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">첫 {quoteData.free_period}개월 무료</p>
                        <p className="text-2xl font-bold text-[#148777] mb-1">
                          월 {calculateTotal().toLocaleString()}원
                        </p>
                        <p className="text-xs text-gray-500">
                          {quoteData.free_period + 1}개월차부터 적용
                        </p>
                      </div>
                    </div>
                    
                    {quoteData.special_conditions && (
                      <div>
                        <h5 className="font-semibold mb-2">특별 조건</h5>
                        <p className="text-sm">{quoteData.special_conditions}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}
              
              {/* 매니저 메모 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">매니저 메모</label>
                <textarea
                  value={quoteData.manager_notes}
                  onChange={(e) => handleQuoteChange('manager_notes', e.target.value)}
                  placeholder="고객 특이사항, 설치 요청사항 등..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777]"
                />
              </div>

              {/* 견적서 전송 버튼 */}
              <Button
                onClick={handleSendQuote}
                disabled={isSending || !quoteData.internet_plan || !quoteData.cctv_count}
                className="w-full bg-[#148777] hover:bg-[#0f6b5c] py-4 text-lg font-semibold"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                    카카오톡 전송 중...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    고객에게 견적서 전송
                  </>
                )}
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

export default function ManagerQuotePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManagerQuoteContent />
    </Suspense>
  )
}