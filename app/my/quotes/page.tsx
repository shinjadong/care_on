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
  free_period?: number
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
            free_period: data.customer.free_period,
            
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
        return <Badge className="bg-primary/10 text-primary"><Clock className="h-3 w-3 mr-1" />견적 대기</Badge>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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

        {/* 구성 상품 목록 */}
        {quote.contract_items && quote.contract_items.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            <div className="text-gray-700 font-medium mb-4">구성 상품</div>
            <div className="space-y-3">
              {quote.contract_items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.product.provider} | 수량: {item.quantity}개
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-medium">
                      {item.fee.toLocaleString()}원
                    </div>
                    {(item.original_price || 0) > item.fee && (
                      <div className="text-xs text-gray-400 line-through">
                        {(item.original_price || item.fee).toLocaleString()}원
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 할인 정보 (미니멀하게 강조) */}
        {quote.contract_items && quote.contract_items.some(item => (item.original_price || 0) > item.fee) && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">매니저 특별 할인 적용</div>
              <div className="flex justify-center items-center space-x-4">
                <span className="text-gray-400 line-through">
                  {quote.contract_items.reduce((sum, item) => 
                    sum + ((item.original_price || item.fee) * item.quantity), 0
                  ).toLocaleString()}원
                </span>
                <span className="text-lg font-bold text-red-600">
                  -{quote.contract_items.reduce((sum, item) => 
                    sum + (((item.original_price || item.fee) - item.fee) * item.quantity), 0
                  ).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 토스 스타일 깔끔한 요금 정보 */}
        <div className="space-y-1 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700">월 납입료</span>
                <span className="text-2xl font-bold text-gray-900">
                  {quote.total_monthly_fee.toLocaleString()}원
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">약정기간</span>
                <span className="text-gray-900">{quote.package?.contract_period || quote.contract_period || 36}개월</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">무료이용기간</span>
                <span className="text-gray-900">{quote.package?.free_period || quote.free_period || 12}개월</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-700">1년간 월납입료</span>
                <span className="text-gray-900">0원</span>
              </div>
              
              <div className="flex justify-between border-t pt-4 mt-4">
                <span className="text-gray-700">13개월차부터 (가입 후 366일차) 월 납입액</span>
                <span className="text-xl font-bold text-gray-900">
                  {quote.total_monthly_fee.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          {quote.status === 'quoted' && (
            <Button
              onClick={() => setIsSignModalOpen(true)}
              className="w-full py-4 text-lg bg-primary hover:bg-primary/90 rounded-lg"
            >
              계약 서명하기
            </Button>
          )}

          {quote.status === 'active' && (
            <Button className="w-full py-4 text-lg rounded-lg" asChild>
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
              <div className="bg-primary/5 p-4 rounded-lg">
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">견적서를 불러오는 중...</p>
        </div>
      </div>
    }>
      <MyQuotesContent />
    </Suspense>
  )
}