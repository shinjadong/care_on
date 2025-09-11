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
        console.log('견적 페이지 API 응답:', data)
        
        if (data.customer) {
          // API 응답 데이터 구조에 맞게 변환
          const transformedQuote = {
            contract_id: data.customer.id,
            contract_number: data.customer.contract_number,
            customer: {
              customer_code: data.customer.customer_number,
              business_name: data.customer.business_name,
              owner_name: data.customer.name,
              phone: data.customer.phone,
              email: data.customer.email,
              address: data.customer.address
            },
            total_monthly_fee: data.customer.total_monthly_fee,
            status: data.customer.status,
            created_at: data.customer.created_at,
            processed_at: data.customer.created_at,
            start_date: data.customer.start_date,
            end_date: data.customer.end_date,
            
            // 패키지 정보 (있는 경우)
            package: data.customer.package ? {
              name: data.customer.package.name,
              monthly_fee: data.customer.package.monthly_fee,
              contract_period: data.customer.package.contract_period,
              free_period: data.customer.package.free_period,
              closure_refund_rate: data.customer.package.closure_refund_rate,
              included_services: data.customer.package.included_services
            } : null,
            
            // 계약 상품 정보 (커스텀 계약인 경우)
            contract_items: data.customer.contract_items || []
          }
          
          setQuote(transformedQuote)
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
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-lg mx-auto px-4">
        {/* 심플 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {quote.customer.business_name}
          </h1>
          <p className="text-gray-500 mt-1">견적서</p>
        </div>

        {/* 서비스 구성 */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          {quote.package ? (
            /* 패키지 */
            <div>
              <h3 className="text-lg font-bold mb-4">{quote.package.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>계약기간: {quote.package.contract_period}개월</p>
                <p>무료혜택: {quote.package.free_period}개월</p>
                <p>환급보장: {quote.package.closure_refund_rate}%</p>
              </div>
            </div>
          ) : (
            /* 커스텀 구성 */
            <div>
              <h3 className="text-lg font-bold mb-4">서비스 구성</h3>
              <div className="space-y-4">
                {quote.contract_items?.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(item.product.category)}
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">수량: {item.quantity}개</div>
                      </div>
                    </div>
                    
                    {/* 할인 정보 표시 */}
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">정가</p>
                        <p className="font-medium text-gray-400 line-through">
                          {(item.original_price || item.fee).toLocaleString()}원
                        </p>
                      </div>
                      <div>
                        <p className="text-red-500">할인율</p>
                        <p className="font-bold text-red-500">
                          {item.discount_rate || 0}% 할인
                        </p>
                      </div>
                      <div>
                        <p className="text-blue-500">할인가</p>
                        <p className="font-bold text-blue-600">
                          {item.fee.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    
                    {/* 할인 사유 표시 */}
                    {item.discount_reason && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                        💡 {item.discount_reason}
                      </div>
                    )}
                    
                    {/* 절약액 표시 */}
                    {(item.original_price || item.fee) > item.fee && (
                      <div className="mt-2 text-right">
                        <span className="text-xs text-green-600">
                          절약: {((item.original_price || item.fee) - item.fee).toLocaleString()}원/월
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 총 요금 및 할인 정보 */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-8">
          {/* 할인 정보 요약 (커스텀 견적인 경우) */}
          {quote.contract_items && quote.contract_items.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
              <div className="text-center">
                <p className="text-sm text-gray-600">정가 합계</p>
                <p className="text-lg font-bold text-gray-400 line-through">
                  {quote.contract_items.reduce((sum, item) => 
                    sum + ((item.original_price || item.fee) * item.quantity), 0
                  ).toLocaleString()}원
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600">총 절약액</p>
                <p className="text-lg font-bold text-green-600">
                  -{quote.contract_items.reduce((sum, item) => 
                    sum + (((item.original_price || item.fee) - item.fee) * item.quantity), 0
                  ).toLocaleString()}원
                </p>
              </div>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-gray-600 mb-2">할인 적용 후 월 이용료</p>
            <p className="text-4xl font-bold text-blue-600">
              {quote.total_monthly_fee.toLocaleString()}원
            </p>
            
            {/* 추가 혜택 표시 */}
            <div className="mt-4 space-y-1">
              {quote.package?.free_period && (
                <p className="text-green-600 font-medium">
                  🎁 {quote.package.free_period}개월 무료
                </p>
              )}
              
              {quote.contract_items && quote.contract_items.some(item => item.discount_rate > 0) && (
                <p className="text-red-500 font-medium">
                  💰 최대 {Math.max(...(quote.contract_items.map(item => item.discount_rate || 0)))}% 특별 할인 적용
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {quote.status === 'quoted' && (
            <Button 
              size="lg"
              onClick={() => setIsSignModalOpen(true)}
              className="w-full py-4 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700"
            >
              계약 서명하기
            </Button>
          )}

          {quote.status === 'active' && (
            <Button size="lg" className="w-full py-4 text-lg rounded-2xl" asChild>
              <a href="/my/services">
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