'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Package,
  CalendarIcon,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  TruckIcon,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Order {
  orderId: string
  orderDate: string
  orderStatus: string
  orderStatusName?: string
  customerName: string
  receiverName: string
  receiverTel: string
  totalPaymentAmount: number
  productOrderInfos?: any[]
}

interface OrderDetail extends Order {
  receiverAddress: string
  shippingMemo?: string
  ordererName: string
  ordererTel: string
  deliveryFee: number
  paymentMethod: string
}

const orderStatusMap: Record<string, { label: string; color: string; icon: any }> = {
  'PAYMENT_WAITING': { label: '결제대기', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  'PAYED': { label: '결제완료', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
  'DELIVERING': { label: '배송중', color: 'bg-purple-100 text-purple-800', icon: TruckIcon },
  'DELIVERED': { label: '배송완료', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'PURCHASE_DECIDED': { label: '구매확정', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'CANCELED': { label: '취소완료', color: 'bg-red-100 text-red-800', icon: XCircle },
  'RETURNED': { label: '반품완료', color: 'bg-gray-100 text-gray-800', icon: XCircle }
}

export default function NaverOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  // 시스템 날짜 (10월)와 네이버 API 서버 날짜 (1월) 불일치 처리
  const systemDate = new Date() // 시스템: 2025년 10월
  const realDate = new Date('2025-01-30') // 실제: 2025년 1월
  const [dateRange, setDateRange] = useState({
    startDate: '2025-01-29', // API용: 1월 날짜
    endDate: '2025-01-30'
  })
  const [orderStatus, setOrderStatus] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // 10월 모의 주문 데이터 (API가 10월 날짜를 거부하므로)
  const mockOctoberOrders: Order[] = [
    {
      orderId: '2025100401',
      orderDate: '2025-10-04T14:30:00.000+09:00',
      orderStatus: 'PAYED',
      orderStatusName: '결제완료',
      customerName: '김민수',
      receiverName: '김민수',
      receiverTel: '010-1234-5678',
      totalPaymentAmount: 35000,
      productOrderInfos: [
        {
          productOrderId: 'P2025100401',
          productName: '케어온 기본 서비스',
          quantity: 1,
          totalPrice: 35000,
          orderStatus: 'PAYED'
        }
      ]
    },
    {
      orderId: '2025100301',
      orderDate: '2025-10-03T10:15:00.000+09:00',
      orderStatus: 'DELIVERED',
      orderStatusName: '배송완료',
      customerName: '이영희',
      receiverName: '이영희',
      receiverTel: '010-9876-5432',
      totalPaymentAmount: 50000,
      productOrderInfos: [
        {
          productOrderId: 'P2025100301',
          productName: '케어온 프리미엄 서비스',
          quantity: 1,
          totalPrice: 50000,
          orderStatus: 'DELIVERED'
        }
      ]
    },
    {
      orderId: '2025100102',
      orderDate: '2025-10-01T16:45:00.000+09:00',
      orderStatus: 'PURCHASE_DECIDED',
      orderStatusName: '구매확정',
      customerName: '박철수',
      receiverName: '박철수',
      receiverTel: '010-5555-6666',
      totalPaymentAmount: 28000,
      productOrderInfos: [
        {
          productOrderId: 'P2025100102',
          productName: '케어온 스타터 패키지',
          quantity: 1,
          totalPrice: 28000,
          orderStatus: 'PURCHASE_DECIDED'
        }
      ]
    }
  ]

  // 주문 목록 조회
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)

    // 모의 데이터 모드일 때
    if (useMockData) {
      setTimeout(() => {
        // 날짜 범위에 따라 모의 데이터 필터링
        const startDate = new Date(dateRange.startDate)
        const endDate = new Date(dateRange.endDate)
        endDate.setHours(23, 59, 59, 999)

        let filteredOrders = mockOctoberOrders.filter(order => {
          const orderDate = new Date(order.orderDate)
          return orderDate >= startDate && orderDate <= endDate
        })

        // 상태 필터링
        if (orderStatus && orderStatus !== 'all') {
          filteredOrders = filteredOrders.filter(order => order.orderStatus === orderStatus)
        }

        setOrders(filteredOrders)
        setTotalCount(filteredOrders.length)
        setLoading(false)
      }, 500) // 로딩 효과를 위한 짧은 지연
      return
    }

    // 실제 API 호출 (1월 날짜만 가능)
    try {
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        page: currentPage.toString(),
        size: '20'
      })

      if (orderStatus && orderStatus !== 'all') {
        params.append('orderStatus', orderStatus)
      }

      const response = await fetch(`/api/naver/orders?${params}`)
      const data = await response.json()

      if (response.ok) {
        setOrders(data.orders || [])
        setTotalCount(data.totalCount || 0)
      } else {
        const errorMsg = String(data.error || '주문 조회에 실패했습니다.')
        console.error('주문 조회 실패:', errorMsg)

        // IP 차단 에러인 경우 특별한 메시지 표시
        if (errorMsg.includes('IP') || errorMsg.includes('허용되지 않은')) {
          setError('API 호출이 허용되지 않은 IP입니다. 네이버 커머스 개발자 센터에서 IP(125.180.6.168)를 추가해주세요.')
        } else if (errorMsg.includes('인증') || errorMsg.includes('토큰')) {
          setError('인증에 실패했습니다. 환경 변수를 확인해주세요.')
        } else if (errorMsg.includes('날짜')) {
          setError('네이버 API는 10월 날짜를 미래 날짜로 인식합니다. 모의 데이터 모드를 사용하거나 1월 날짜로 조회해주세요.')
        } else {
          setError(errorMsg)
        }
      }
    } catch (error) {
      console.error('주문 조회 오류:', error)
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 주문 상세 조회
  const fetchOrderDetail = async (orderId: string) => {
    // 모의 데이터 모드일 때
    if (useMockData) {
      const mockOrder = mockOctoberOrders.find(order => order.orderId === orderId)
      if (mockOrder) {
        // 모의 상세 데이터 생성
        setSelectedOrder({
          ...mockOrder,
          receiverAddress: '서울시 강남구 테헤란로 123',
          shippingMemo: '부재시 경비실에 맡겨주세요',
          ordererName: mockOrder.customerName,
          ordererTel: mockOrder.receiverTel,
          deliveryFee: 3000,
          paymentMethod: '네이버페이'
        } as OrderDetail)
      }
      return
    }

    // 실제 API 호출
    try {
      const response = await fetch(`/api/naver/orders/${orderId}`)
      const data = await response.json()

      if (response.ok) {
        setSelectedOrder(data)
      } else {
        console.error('주문 상세 조회 실패:', data.error)
      }
    } catch (error) {
      console.error('주문 상세 조회 오류:', error)
    }
  }

  // 모드 전환 시 날짜 범위 변경
  const handleModeToggle = () => {
    const newMode = !useMockData
    setUseMockData(newMode)
    setSelectedOrder(null)
    setOrders([])

    if (newMode) {
      // 모의 데이터 모드: 10월 날짜로 변경
      setDateRange({
        startDate: '2025-10-01',
        endDate: '2025-10-05'
      })
    } else {
      // API 모드: 1월 날짜로 변경
      setDateRange({
        startDate: '2025-01-29',
        endDate: '2025-01-30'
      })
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [currentPage, orderStatus, useMockData])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원'
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm', { locale: ko })
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">네이버 스마트스토어 주문 관리</h1>
        <p className="text-muted-foreground mt-2">
          네이버 커머스 API를 통해 실시간으로 주문을 조회하고 관리합니다.
        </p>
      </div>

      {/* 날짜 불일치 경고 및 모드 전환 */}
      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-900">시스템 날짜 불일치 안내</AlertTitle>
        <AlertDescription className="text-amber-700">
          <div className="space-y-2">
            <p>현재 시스템 날짜는 <strong>2025년 10월</strong>이지만, 네이버 API 서버는 <strong>2025년 1월</strong>로 인식하고 있습니다.</p>
            <p>10월 주문을 보려면 <strong>모의 데이터 모드</strong>를 활성화하세요.</p>
            <div className="flex items-center space-x-2 mt-3">
              <Switch
                id="mock-mode"
                checked={useMockData}
                onCheckedChange={handleModeToggle}
              />
              <Label htmlFor="mock-mode" className="cursor-pointer">
                {useMockData ? '모의 데이터 모드 (10월 주문 표시)' : 'API 모드 (1월 주문만 조회 가능)'}
              </Label>
            </div>
            {useMockData && (
              <p className="text-sm mt-2 text-amber-600">
                ⚠️ 현재 모의 데이터를 표시 중입니다. 실제 데이터를 조회하려면 스위치를 끄세요.
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>검색 필터</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 블로거 방식 조회 옵션 */}
          {!useMockData && (
            <Alert className="mb-4 border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">블로거 추천 조회 방식</AlertTitle>
              <AlertDescription className="text-blue-700">
                <div className="space-y-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={async () => {
                      setLoading(true)
                      try {
                        const response = await fetch('/api/naver/orders?queryMode=changed&lastChangedType=PAYED&hours=3')
                        const data = await response.json()
                        if (response.ok) {
                          setOrders(data.orders || [])
                          setTotalCount(data.totalCount || 0)
                        }
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
                    결제완료 주문 조회 (3시간)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={async () => {
                      setLoading(true)
                      try {
                        const response = await fetch('/api/naver/orders?queryMode=changed&lastChangedType=DISPATCHED&hours=24')
                        const data = await response.json()
                        if (response.ok) {
                          setOrders(data.orders || [])
                          setTotalCount(data.totalCount || 0)
                        }
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
                    발송처리 주문 조회 (24시간)
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      setLoading(true)
                      try {
                        const response = await fetch('/api/naver/orders?queryMode=recent&hours=3')
                        const data = await response.json()
                        if (response.ok) {
                          setOrders(data.orders || [])
                          setTotalCount(data.totalCount || 0)
                        }
                      } finally {
                        setLoading(false)
                      }
                    }}
                  >
                    최근 3시간 주문
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>시작일</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div>
              <Label>종료일</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div>
              <Label>주문 상태</Label>
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="PAYMENT_WAITING">결제대기</SelectItem>
                  <SelectItem value="PAYED">결제완료</SelectItem>
                  <SelectItem value="DELIVERING">배송중</SelectItem>
                  <SelectItem value="DELIVERED">배송완료</SelectItem>
                  <SelectItem value="PURCHASE_DECIDED">구매확정</SelectItem>
                  <SelectItem value="CANCELED">취소완료</SelectItem>
                  <SelectItem value="RETURNED">반품완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchOrders}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                검색
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">오류</AlertTitle>
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 주문 목록 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>주문 목록</CardTitle>
                <Badge variant="secondary">
                  총 {totalCount}건
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>주문일시</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>결제금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>액션</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const status = orderStatusMap[order.orderStatus] || {
                      label: order.orderStatus,
                      color: 'bg-gray-100 text-gray-800'
                    }
                    return (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-mono text-sm">
                          {order.orderId}
                        </TableCell>
                        <TableCell>{formatDateTime(order.orderDate)}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{formatPrice(order.totalPaymentAmount)}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchOrderDetail(order.orderId)}
                          >
                            상세
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {/* 페이지네이션 */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  이전
                </Button>
                <span className="text-sm text-muted-foreground">
                  페이지 {currentPage + 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={orders.length < 20}
                >
                  다음
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 주문 상세 */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle>주문 상세</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                      주문번호
                    </h4>
                    <p className="font-mono text-sm">{selectedOrder.orderId}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                      주문일시
                    </h4>
                    <p>{formatDateTime(selectedOrder.orderDate)}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">
                      주문 상태
                    </h4>
                    <Badge className={orderStatusMap[selectedOrder.orderStatus]?.color}>
                      {orderStatusMap[selectedOrder.orderStatus]?.label || selectedOrder.orderStatus}
                    </Badge>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      주문자 정보
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">이름:</span> {selectedOrder.ordererName}</p>
                      <p><span className="font-medium">연락처:</span> {selectedOrder.ordererTel}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      수령자 정보
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">이름:</span> {selectedOrder.receiverName}</p>
                      <p><span className="font-medium">연락처:</span> {selectedOrder.receiverTel}</p>
                      <p><span className="font-medium">주소:</span> {selectedOrder.receiverAddress}</p>
                      {selectedOrder.shippingMemo && (
                        <p><span className="font-medium">배송메모:</span> {selectedOrder.shippingMemo}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      결제 정보
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">결제방법:</span> {selectedOrder.paymentMethod}</p>
                      <p><span className="font-medium">상품금액:</span> {formatPrice(selectedOrder.totalPaymentAmount - selectedOrder.deliveryFee)}</p>
                      <p><span className="font-medium">배송비:</span> {formatPrice(selectedOrder.deliveryFee)}</p>
                      <p className="font-semibold text-lg pt-2">
                        총 결제금액: {formatPrice(selectedOrder.totalPaymentAmount)}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.productOrderInfos && selectedOrder.productOrderInfos.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                        주문 상품
                      </h4>
                      <div className="space-y-2">
                        {selectedOrder.productOrderInfos.map((product: any) => (
                          <div key={product.productOrderId} className="p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium">{product.productName}</p>
                            {product.productOption && (
                              <p className="text-xs text-muted-foreground">{product.productOption}</p>
                            )}
                            <div className="flex justify-between text-sm mt-1">
                              <span>{product.quantity}개</span>
                              <span>{formatPrice(product.totalPrice)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  주문을 선택하면 상세 정보가 표시됩니다
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
