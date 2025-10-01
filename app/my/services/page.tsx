'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'
import { 
  Wifi, 
  Camera, 
  CreditCard, 
  Shield, 
  Phone,
  Building, 
  User, 
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Headphones,
  Settings,
  TrendingUp
} from 'lucide-react'

interface CustomerService {
  customer: {
    customer_code: string
    business_name: string
    owner_name: string
    phone: string
    email?: string
  }
  contracts: Array<{
    contract_number: string
    status: string
    total_monthly_fee: number
    start_date: string
    end_date: string
    next_billing_at?: string
    package?: {
      name: string
      contract_period: number
      free_period: number
    }
  }>
  current_services: {
    internet?: { active: boolean, plan: string, monthly_fee: number, start_date?: string }
    cctv?: { active: boolean, count: number, monthly_fee: number, start_date?: string }
    pos?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
    insurance?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
    phone?: { active: boolean, type: string, monthly_fee: number, start_date?: string }
  }
  cs_tickets?: Array<{
    id: string
    subject: string
    status: string
    created_at: string
  }>
  billing_history?: Array<{
    amount: number
    due_date: string
    status: string
    paid_at?: string
  }>
}

function MyServicesContent() {
  const searchParams = useSearchParams()
  const [serviceData, setServiceData] = useState<CustomerService | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const customerNumber = searchParams.get('customer') || searchParams.get('c')

  useEffect(() => {
    if (customerNumber) {
      fetchServiceData()
    } else {
      setError('고객 정보를 찾을 수 없습니다. 링크를 다시 확인해주세요.')
      setLoading(false)
    }
  }, [customerNumber])

  const fetchServiceData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/customers/services?customer_number=${customerNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setServiceData(data.customer)
      } else {
        setError('서비스 정보를 불러올 수 없습니다.')
      }
    } catch (error) {
      console.error('서비스 조회 오류:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'internet':
        return <Wifi className="h-5 w-5 text-primary" />
      case 'cctv':
        return <Camera className="h-5 w-5 text-green-500" />
      case 'pos':
        return <CreditCard className="h-5 w-5 text-purple-500" />
      case 'insurance':
        return <Shield className="h-5 w-5 text-red-500" />
      case 'phone':
        return <Phone className="h-5 w-5 text-orange-500" />
      default:
        return <Settings className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />이용 중</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />설치 대기</Badge>
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="h-3 w-3 mr-1" />일시 중지</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calculateContractProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const now = new Date()
    
    const totalDays = end.getTime() - start.getTime()
    const passedDays = now.getTime() - start.getTime()
    
    return Math.min(100, Math.max(0, (passedDays / totalDays) * 100))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">서비스 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !serviceData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">정보를 찾을 수 없습니다</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalMonthlyFee = Object.values(serviceData.current_services || {})
    .reduce((sum: number, service: any) => sum + (service?.active ? (service.monthly_fee || 0) : 0), 0)

  const activeServicesCount = Object.values(serviceData.current_services || {})
    .filter((service: any) => service?.active).length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            내 서비스 현황
          </h1>
          <p className="text-gray-600">
            {serviceData.customer.business_name}의 CareOn 서비스를 확인하세요
          </p>
        </div>

        {/* 고객 정보 요약 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{serviceData.customer.business_name}</h3>
                  <p className="text-gray-600">{serviceData.customer.customer_code} | {serviceData.customer.owner_name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{totalMonthlyFee.toLocaleString()}원</p>
                <p className="text-sm text-gray-500">월 이용료</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 서비스 현황 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">이용 서비스</p>
                  <p className="text-2xl font-bold">{activeServicesCount}개</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">월 이용료</p>
                  <p className="text-2xl font-bold">{totalMonthlyFee.toLocaleString()}원</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">계약 상태</p>
                  <p className="text-2xl font-bold">
                    {serviceData.contracts?.[0] ? '활성' : '대기'}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">CS 요청</p>
                  <p className="text-2xl font-bold">{serviceData.cs_tickets?.length || 0}건</p>
                </div>
                <Headphones className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 탭 메뉴 */}
        <Tabs defaultValue="services" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">이용 서비스</TabsTrigger>
            <TabsTrigger value="contracts">계약 정보</TabsTrigger>
            <TabsTrigger value="billing">요금 내역</TabsTrigger>
            <TabsTrigger value="support">고객 지원</TabsTrigger>
          </TabsList>

          {/* 서비스 탭 */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceData.current_services && Object.entries(serviceData.current_services).map(([key, service]: [string, any]) => 
                service?.active && (
                  <Card key={key}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getServiceIcon(key)}
                          <div>
                            <h4 className="font-bold text-lg capitalize">
                              {key === 'internet' ? '인터넷' : 
                               key === 'cctv' ? 'CCTV' : 
                               key === 'pos' ? 'POS' : 
                               key === 'insurance' ? '보험' : 
                               key === 'phone' ? '전화' : key}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {service.plan || service.type || '이용 중'}
                            </p>
                          </div>
                        </div>
                        <Badge variant="default">활성</Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">월 이용료</span>
                          <span className="font-bold">{service.monthly_fee?.toLocaleString() || 0}원</span>
                        </div>
                        
                        {key === 'cctv' && service.count && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">설치 대수</span>
                            <span className="font-bold">{service.count}대</span>
                          </div>
                        )}
                        
                        {service.start_date && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">서비스 시작</span>
                            <span className="text-sm">{new Date(service.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>

            {activeServicesCount === 0 && (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">서비스를 준비중입니다</h3>
                <p className="text-gray-600">곧 설치가 완료되면 서비스를 이용하실 수 있습니다.</p>
              </div>
            )}
          </TabsContent>

          {/* 계약 정보 탭 */}
          <TabsContent value="contracts" className="space-y-4">
            {serviceData.contracts?.map((contract) => (
              <Card key={contract.contract_number}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>계약번호: {contract.contract_number}</CardTitle>
                    {getStatusBadge(contract.status)}
                  </div>
                  <CardDescription>
                    {contract.package?.name || '맞춤형 계약'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">계약 기간</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>시작일:</span>
                          <span>{new Date(contract.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>종료일:</span>
                          <span>{new Date(contract.end_date).toLocaleDateString()}</span>
                        </div>
                        <Progress 
                          value={calculateContractProgress(contract.start_date, contract.end_date)} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 text-center">
                          계약 진행률: {Math.round(calculateContractProgress(contract.start_date, contract.end_date))}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">요금 정보</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>월 이용료:</span>
                          <span className="font-bold">{contract.total_monthly_fee.toLocaleString()}원</span>
                        </div>
                        {contract.next_billing_at && (
                          <div className="flex justify-between">
                            <span>다음 결제일:</span>
                            <span>{new Date(contract.next_billing_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">혜택 정보</p>
                      {contract.package && (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>계약 기간:</span>
                            <span>{contract.package.contract_period}개월</span>
                          </div>
                          <div className="flex justify-between">
                            <span>무료 혜택:</span>
                            <span className="text-green-600 font-medium">{contract.package.free_period}개월</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 요금 내역 탭 */}
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>최근 요금 내역</CardTitle>
                <CardDescription>지난 6개월간의 이용료 내역입니다</CardDescription>
              </CardHeader>
              <CardContent>
                {serviceData.billing_history && serviceData.billing_history.length > 0 ? (
                  <div className="space-y-4">
                    {serviceData.billing_history.map((bill, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{bill.amount.toLocaleString()}원</p>
                          <p className="text-sm text-gray-500">납기일: {new Date(bill.due_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          {bill.status === 'paid' ? (
                            <Badge className="bg-green-100 text-green-800">
                              납부 완료
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              납부 대기
                            </Badge>
                          )}
                          {bill.paid_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              납부일: {new Date(bill.paid_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">아직 요금 내역이 없습니다</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 고객 지원 탭 */}
          <TabsContent value="support" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CS 문의 내역 */}
              <Card>
                <CardHeader>
                  <CardTitle>문의 내역</CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceData.cs_tickets && serviceData.cs_tickets.length > 0 ? (
                    <div className="space-y-3">
                      {serviceData.cs_tickets.slice(0, 5).map((ticket) => (
                        <div key={ticket.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{ticket.subject}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Headphones className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">문의 내역이 없습니다</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 빠른 문의 */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 문의</CardTitle>
                  <CardDescription>서비스 관련 문의사항이 있으시면 연락주세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      고객센터 전화
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <FileText className="h-4 w-4 mr-2" />
                      온라인 문의
                    </Button>
                    <div className="text-center text-sm text-gray-500">
                      <p>고객센터: 1588-1234</p>
                      <p>운영시간: 평일 09:00-18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function MyServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">서비스 정보를 불러오는 중...</p>
        </div>
      </div>
    }>
      <MyServicesContent />
    </Suspense>
  )
}