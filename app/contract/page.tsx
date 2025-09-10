"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { CheckCircle, Building2, Wifi, Camera, CreditCard, Phone, FileImage, IdCard, FileText } from "lucide-react"
import { DocumentUploader } from "@/components/contract/document-uploader"

export default function ContractPage() {
  const [formData, setFormData] = useState({
    // 기본 정보
    business_name: "",
    owner_name: "",
    phone: "",
    email: "",
    address: "",
    business_registration: "",
    
    // 서비스 정보
    internet_plan: "",
    cctv_count: "",
    installation_address: "",
    
    // 결제 정보
    bank_name: "",
    account_number: "",
    account_holder: "",
    
    // 추가 요청사항
    additional_requests: "",
    
    // 서류 이미지
    bank_account_image: "",
    id_card_image: "",
    business_registration_image: "",
    
    // 동의
    terms_agreed: false,
    info_agreed: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<{customer_number: string, contract_number: string} | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // API 호출로 계약 정보 저장
      const response = await fetch('/api/contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        setCustomerInfo({
          customer_number: result.customer_number,
          contract_number: result.contract_number
        })
        setIsSubmitted(true)
      } else {
        alert('제출에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('계약 정보 제출 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">계약 정보 접수 완료</h2>
          
          {/* 고객번호 및 계약번호 표시 */}
          {customerInfo && (
            <div className="bg-[#148777]/10 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">고객번호:</span>
                <span className="text-lg font-bold text-[#148777]">{customerInfo.customer_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">계약번호:</span>
                <span className="text-lg font-bold text-[#148777]">{customerInfo.contract_number}</span>
              </div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            계약 정보가 성공적으로 접수되었습니다.<br />
            위 번호들을 기억해 두시고, 담당자가 확인 후 곧 연락드리겠습니다.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Phone className="w-4 h-4" />
            <span>문의: 1866-1845</span>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f3ed] to-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-8 h-8 text-[#148777]" />
            <h1 className="text-3xl font-bold text-gray-900">케어온 계약 정보 입력</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            인터넷 + CCTV 서비스 계약을 위한 정보를 입력해주세요.<br />
            <span className="text-[#148777] font-medium">첫 1년 무료, 3년 약정</span> 조건으로 서비스를 제공해드립니다.
          </p>
        </div>

        {/* 서비스 정보 카드 */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-[#148777]/5 to-[#148777]/10 border-[#148777]/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-[#148777]" />
              <span className="font-medium text-[#148777]">인터넷</span>
            </div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#148777]" />
              <span className="font-medium text-[#148777]">CCTV</span>
            </div>
          </div>
          <div className="text-sm text-gray-700">
            <p>• <strong>첫 1년</strong>: 인터넷 + CCTV 서비스 <span className="text-red-600 font-bold">완전 무료</span></p>
            <p>• <strong>2-3년차</strong>: 정상 요금 적용</p>
            <p>• <strong>결제방식</strong>: 월 자동 카드 출금</p>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 사업자 기본 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              사업자 기본 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사업체명 *</label>
                <Input
                  value={formData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                  placeholder="예) 행복카페"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">대표자명 *</label>
                <Input
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="01012345678"
                  maxLength={11}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">사업장 주소 *</label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 123, 456호"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
                <Input
                  value={formData.business_registration}
                  onChange={(e) => handleInputChange('business_registration', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="1234567890"
                  maxLength={10}
                />
              </div>
            </div>
          </Card>

          {/* 서비스 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="flex gap-1">
                <Wifi className="w-5 h-5 text-blue-600" />
                <Camera className="w-5 h-5 text-orange-600" />
              </div>
              서비스 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">인터넷 요금제 *</label>
                <select
                  value={formData.internet_plan}
                  onChange={(e) => handleInputChange('internet_plan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777] focus:border-transparent"
                  required
                >
                  <option value="">요금제를 선택하세요</option>
                  <option value="100M">100M (월 3만원)</option>
                  <option value="500M">500M (월 4만원)</option>
                  <option value="1G">1G (월 5만원)</option>
                  <option value="기가플러스">기가플러스 (월 6만원)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CCTV 설치 대수 *</label>
                <select
                  value={formData.cctv_count}
                  onChange={(e) => handleInputChange('cctv_count', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777] focus:border-transparent"
                  required
                >
                  <option value="">대수를 선택하세요</option>
                  <option value="4대">4대 (월 8만원)</option>
                  <option value="6대">6대 (월 12만원)</option>
                  <option value="8대">8대 (월 16만원)</option>
                  <option value="맞춤">맞춤 설치 (별도 문의)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">설치 주소</label>
                <Input
                  value={formData.installation_address}
                  onChange={(e) => handleInputChange('installation_address', e.target.value)}
                  placeholder="사업장 주소와 다른 경우에만 입력"
                />
                <p className="text-xs text-gray-500 mt-1">비어있으면 사업장 주소와 동일하게 처리됩니다</p>
              </div>
            </div>
          </Card>

          {/* 결제 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              결제 정보
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>중요:</strong> 매월 카드 출금일 이전에 현금으로 미리 이체해주셔야 합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">은행명 *</label>
                <select
                  value={formData.bank_name}
                  onChange={(e) => handleInputChange('bank_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#148777] focus:border-transparent"
                  required
                >
                  <option value="">은행을 선택하세요</option>
                  <option value="국민은행">국민은행</option>
                  <option value="신한은행">신한은행</option>
                  <option value="우리은행">우리은행</option>
                  <option value="하나은행">하나은행</option>
                  <option value="농협은행">농협은행</option>
                  <option value="기업은행">기업은행</option>
                  <option value="기타">기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">계좌번호 *</label>
                <Input
                  value={formData.account_number}
                  onChange={(e) => handleInputChange('account_number', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456789012"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">예금주명 *</label>
                <Input
                  value={formData.account_holder}
                  onChange={(e) => handleInputChange('account_holder', e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>
            </div>
          </Card>

          {/* 필수 서류 업로드 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileImage className="w-5 h-5" />
              필수 서류 업로드
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 mb-2">
                <strong>주의사항:</strong> 모든 서류는 명확하게 이름과 정보가 보이도록 촬영해주세요.
              </p>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• 사진이 흐리거나 글자가 안 보이면 재촬영 요청드릴 수 있습니다</li>
                <li>• 개인정보는 안전하게 암호화되어 저장됩니다</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              {/* 통장 사본 */}
              <DocumentUploader
                label="통장 사본"
                description="계좌번호, 예금주명이 명확히 보이는 통장 첫 페이지 또는 체크카드"
                value={formData.bank_account_image}
                onChange={(url) => handleInputChange('bank_account_image', url)}
                icon={<CreditCard className="w-4 h-4 text-green-600" />}
                required
              />
              
              {/* 신분증 */}
              <DocumentUploader
                label="신분증"
                description="대표자 본인의 주민등록증 또는 운전면허증 (사진이 명확한 면)"
                value={formData.id_card_image}
                onChange={(url) => handleInputChange('id_card_image', url)}
                icon={<IdCard className="w-4 h-4 text-blue-600" />}
                required
              />
              
              {/* 사업자등록증 */}
              <DocumentUploader
                label="사업자등록증"
                description="사업자등록증 원본 또는 사본 (등록번호, 상호명이 명확히 보이는 면)"
                value={formData.business_registration_image}
                onChange={(url) => handleInputChange('business_registration_image', url)}
                icon={<FileText className="w-4 h-4 text-purple-600" />}
                required
              />
            </div>
          </Card>

          {/* 추가 요청사항 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">추가 요청사항</h3>
            <Textarea
              value={formData.additional_requests}
              onChange={(e) => handleInputChange('additional_requests', e.target.value)}
              placeholder="특별한 요청사항이나 문의사항이 있으시면 적어주세요."
              rows={4}
              className="resize-none"
            />
          </Card>

          {/* 약관 동의 */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">약관 동의</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                <p className="font-medium mb-2">계약 조건 요약:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>첫 1년</strong>: 인터넷 + CCTV 서비스 완전 무료</li>
                  <li>• <strong>계약 기간</strong>: 3년 약정</li>
                  <li>• <strong>결제 방식</strong>: 월 자동 카드 출금 (2년차부터)</li>
                  <li>• <strong>제품 보증</strong>: KT 텔레카, SK 브로드밴드, LG 유플러스 등 공급업체 직접 보증</li>
                  <li>• <strong>AS 및 기술지원</strong>: 케어온에서 중계 지원</li>
                </ul>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.terms_agreed}
                  onChange={(e) => handleInputChange('terms_agreed', e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  <strong>서비스 이용약관 및 계약 조건</strong>에 동의합니다. (필수)
                </span>
              </label>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.info_agreed}
                  onChange={(e) => handleInputChange('info_agreed', e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  <strong>개인정보 수집 및 이용</strong>에 동의합니다. (필수)
                </span>
              </label>
            </div>
          </Card>

          {/* 제출 버튼 */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={
                isSubmitting || 
                !formData.terms_agreed || 
                !formData.info_agreed ||
                !formData.bank_account_image ||
                !formData.id_card_image ||
                !formData.business_registration_image
              }
              className="bg-[#148777] hover:bg-[#0f6b5c] text-white px-12 py-4 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  처리 중...
                </>
              ) : (
                '계약 정보 제출하기'
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-3">
              제출 후 담당자가 확인하여 빠르게 연락드리겠습니다.
            </p>
          </div>
        </form>

        {/* 연락처 정보 */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gray-800 text-white">
            <h4 className="font-bold text-lg mb-4">긴급 문의</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <a
                href="tel:1866-1845"
                className="flex items-center gap-2 bg-white text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                1866-1845
              </a>
              <p className="text-sm text-gray-300">
                평일 09:00-18:00 | 주말/공휴일 휴무
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}