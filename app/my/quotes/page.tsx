'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Suspense } from 'react'
import { 
  FileText, 
  Building, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calculator,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
  Shield,
  Wifi,
  Camera,
  CreditCard,
  AlertCircle,
  Download
} from 'lucide-react'

interface CustomerQuote {
  contract_id: string
  contract_number: string
  customer: {
    customer_code: string
    business_name: string
    owner_name: string
    phone: string
    email?: string
    address?: string
  }
  package?: {
    name: string
    monthly_fee: number
    contract_period: number
    free_period: number
    closure_refund_rate: number
    included_services: string
  }
  contract_items?: Array<{
    product: {
      name: string
      category: string
      provider: string
    }
    quantity: number
    fee: number
  }>
  total_monthly_fee: number
  status: string
  created_at: string
  processed_at?: string
  start_date?: string
  end_date?: string
}

function MyQuotesContent() {
  const searchParams = useSearchParams()
  const [quote, setQuote] = useState<CustomerQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSignModalOpen, setIsSignModalOpen] = useState(false)
  const [signatureAgreed, setSignatureAgreed] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [privacyAgreed, setPrivacyAgreed] = useState(false)

  // URL에서 고객 번호 또는 계약 번호 가져오기
  const customerNumber = searchParams.get('customer') || searchParams.get('c')
  const contractNumber = searchParams.get('contract') || searchParams.get('id')

  useEffect(() => {
    if (customerNumber || contractNumber) {
      fetchQuote()
    } else {
      setError('견적서 정보를 찾을 수 없습니다. 링크를 다시 확인해주세요.')
      setLoading(false)
    }
  }, [customerNumber, contractNumber])

  const fetchQuote = async () => {
    try {
      setLoading(true)
      const searchParam = customerNumber ? `customer_number=${customerNumber}` : `contract_number=${contractNumber}`
      const response = await fetch(`/api/contract/search?${searchParam}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.customer) {
          setQuote(data.customer)
        } else {
          setError('해당 견적서를 찾을 수 없습니다.')
        }
      } else {
        setError('견적서 조회 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('견적서 조회 오류:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignContract = async () => {
    if (!signatureAgreed || !termsAgreed || !privacyAgreed) {
      alert('모든 약관에 동의해주세요.')
      return
    }

    try {
      const response = await fetch('/api/contract/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract_id: quote?.contract_id,
          customer_signature: true,
          signed_at: new Date().toISOString()
        })
      })

      if (response.ok) {
        alert('계약서 서명이 완료되었습니다! 곧 서비스 설치 연락을 드리겠습니다.')
        setIsSignModalOpen(false)
        fetchQuote() // 상태 업데이트
      } else {
        alert('서명 처리 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error('서명 처리 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'quoted':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />견적 대기</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />승인 완료</Badge>
      case 'active':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />서비스 이용중</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '인터넷':
        return <Wifi className="h-4 w-4" />
      case 'CCTV':
        return <Camera className="h-4 w-4" />
      case 'POS':
      case '키오스크':
        return <CreditCard className="h-4 w-4" />
      case '보험':
        return <Shield className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">견적서를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">오류가 발생했습니다</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">견적서를 찾을 수 없습니다</h3>
            <p className="text-gray-600">링크를 다시 확인해주세요.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CareOn 견적서
          </h1>
          <p className="text-gray-600">
            고객님의 맞춤형 서비스 견적을 확인해보세요
          </p>
        </div>

        {/* 고객 정보 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              고객 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">사업체명</p>
                    <p className="font-medium">{quote.customer.business_name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">대표자</p>
                    <p className="font-medium">{quote.customer.owner_name}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">연락처</p>
                    <p className="font-medium">{quote.customer.phone}</p>
                  </div>
                </div>
                {quote.customer.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">이메일</p>
                      <p className="font-medium">{quote.customer.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 견적 정보 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                견적 정보
              </CardTitle>
              {getStatusBadge(quote.status)}
            </div>
            <CardDescription>
              견적번호: {quote.contract_number} | 견적일: {new Date(quote.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quote.package ? (
              /* 패키지 기반 견적 */
              <div className="space-y-4">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    {quote.package.name}
                  </h3>
                  <p className="text-blue-700 mb-4">
                    {quote.package.included_services}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 font-medium">계약기간</p>
                      <p className="font-bold">{quote.package.contract_period}개월</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">무료혜택</p>
                      <p className="font-bold">{quote.package.free_period}개월 무료</p>
                    </div>
                    <div>
                      <p className="text-purple-600 font-medium">환급보장</p>
                      <p className="font-bold">{quote.package.closure_refund_rate}% 환급</p>
                    </div>
                    <div>
                      <p className="text-red-600 font-medium">월 요금</p>
                      <p className="font-bold text-lg">{quote.total_monthly_fee.toLocaleString()}원</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* 커스텀 견적 */
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">맞춤형 서비스 구성</h3>
                {quote.contract_items && quote.contract_items.length > 0 && (
                  <div className="space-y-3">
                    {quote.contract_items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(item.product.category)}
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.product.provider} | 수량: {item.quantity}개
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.fee.toLocaleString()}원</p>
                          <p className="text-sm text-gray-500">월</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 요금 정보 */}
            <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold">최종 견적</h4>
                {quote.package?.free_period && (
                  <Badge className="bg-green-100 text-green-800">
                    🎁 {quote.package.free_period}개월 무료!
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">무료 기간 중</p>
                  <p className="text-2xl font-bold text-green-600">0원</p>
                  <p className="text-xs text-gray-400">
                    {quote.package?.free_period || 12}개월간
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">무료 기간 후</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {quote.total_monthly_fee.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-400">월</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">폐업시 환급</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {quote.package?.closure_refund_rate || 100}%
                  </p>
                  <p className="text-xs text-gray-400">보장</p>
                </div>
              </div>

              {/* 총 절약 금액 */}
              {quote.package?.free_period && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">무료 기간 총 절약액:</span>
                    <span className="text-xl font-bold text-yellow-600">
                      {(quote.total_monthly_fee * quote.package.free_period).toLocaleString()}원
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 계약 진행 단계 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>계약 진행 현황</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                quote.status === 'quoted' || quote.status === 'approved' || quote.status === 'active' 
                  ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  quote.status === 'quoted' || quote.status === 'approved' || quote.status === 'active'
                    ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span>견적 완료</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-200"></div>
              
              <div className={`flex items-center space-x-2 ${
                quote.status === 'approved' || quote.status === 'active' 
                  ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  quote.status === 'approved' || quote.status === 'active'
                    ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <FileText className="h-4 w-4" />
                </div>
                <span>계약 서명</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-gray-200"></div>
              
              <div className={`flex items-center space-x-2 ${
                quote.status === 'active' ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  quote.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Package className="h-4 w-4" />
                </div>
                <span>서비스 시작</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            견적서 다운로드
          </Button>
          
          {quote.status === 'quoted' && (
            <Button 
              size="lg"
              onClick={() => setIsSignModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-4 w-4 mr-2" />
              계약 서명하기
            </Button>
          )}

          {quote.status === 'active' && (
            <Button size="lg" asChild>
              <a href="/my/services">
                <Package className="h-4 w-4 mr-2" />
                내 서비스 확인
              </a>
            </Button>
          )}
        </div>

        {/* 전자서명 모달 */}
        <Dialog open={isSignModalOpen} onOpenChange={setIsSignModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>계약 전자서명</DialogTitle>
              <DialogDescription>
                {quote.customer.business_name} 계약서에 전자서명을 진행합니다
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* 계약 요약 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">계약 요약</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>패키지:</span>
                    <span className="font-medium">{quote.package?.name || '커스텀'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>월 이용료:</span>
                    <span className="font-medium">{quote.total_monthly_fee.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>계약 기간:</span>
                    <span className="font-medium">{quote.package?.contract_period || 36}개월</span>
                  </div>
                  <div className="flex justify-between">
                    <span>무료 혜택:</span>
                    <span className="font-medium text-green-600">{quote.package?.free_period || 12}개월 무료</span>
                  </div>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-4">
                <h4 className="font-medium">약관 동의</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={termsAgreed}
                      onCheckedChange={(checked) => setTermsAgreed(!!checked)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      서비스 이용약관에 동의합니다 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="privacy"
                      checked={privacyAgreed}
                      onCheckedChange={(checked) => setPrivacyAgreed(!!checked)}
                    />
                    <Label htmlFor="privacy" className="text-sm">
                      개인정보 처리방침에 동의합니다 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="signature"
                      checked={signatureAgreed}
                      onCheckedChange={(checked) => setSignatureAgreed(!!checked)}
                    />
                    <Label htmlFor="signature" className="text-sm">
                      전자서명에 동의하며, 계약 내용을 확인했습니다 <span className="text-red-500">*</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSignModalOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleSignContract}
                disabled={!signatureAgreed || !termsAgreed || !privacyAgreed}
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                계약 서명 완료
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function MyQuotesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">견적서를 불러오는 중...</p>
        </div>
      </div>
    }>
      <MyQuotesContent />
    </Suspense>
  )
}