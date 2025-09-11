'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Plus, 
  Search,
  Eye,
  Edit,
  Calculator,
  Send,
  Package,
  User,
  DollarSign,
  Trash2
} from 'lucide-react'

interface Quote {
  contract_id: string
  contract_number: string
  customer: {
    customer_code: string
    business_name: string
    owner_name: string
    phone: string
  }
  package?: {
    name: string
    monthly_fee: number
    contract_period: number
    free_period: number
  }
  total_monthly_fee: number
  status: string
  created_at: string
  processed_by: string
  processed_at: string
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false)
  const [isQuoteDetailOpen, setIsQuoteDetailOpen] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)
  const [isEditQuoteOpen, setIsEditQuoteOpen] = useState(false)

  // 새 견적 생성 폼
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')
  const [searchedCustomers, setSearchedCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [packages, setPackages] = useState([])
  const [quoteType, setQuoteType] = useState<'package' | 'custom'>('package')
  
  // 커스텀 패키지용
  const [products, setProducts] = useState([])
  const [selectedCustomProducts, setSelectedCustomProducts] = useState<Array<{
    product: any
    quantity: number
    custom_fee: number
  }>>([])
  const [customQuoteDetails, setCustomQuoteDetails] = useState({
    contract_period: 36,
    free_period: 12,
    discount_amount: 0,
    notes: ''
  })

  useEffect(() => {
    fetchQuotes()
    fetchPackages()
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?available=true')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchQuotes = async () => {
    try {
      setLoading(true)
      // 계약 테이블에서 견적 상태인 것들 조회
      const response = await fetch('/api/manager/contracts?status=quoted')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.contracts || [])
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages?active_only=true')
      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages || [])
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  const handleCustomerSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setSearchedCustomers([])
      return
    }

    try {
      const response = await fetch(`/api/customers?search=${encodeURIComponent(searchTerm)}&limit=10`)
      if (response.ok) {
        const data = await response.json()
        setSearchedCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('고객 검색 오류:', error)
    }
  }

  // 커스텀 패키지 관리 함수들
  const addProductToCustom = (product: any) => {
    const existingIndex = selectedCustomProducts.findIndex(p => p.product.product_id === product.product_id)
    
    if (existingIndex >= 0) {
      // 이미 추가된 상품의 수량 증가
      const updated = [...selectedCustomProducts]
      updated[existingIndex].quantity += 1
      setSelectedCustomProducts(updated)
    } else {
      // 새 상품 추가
      setSelectedCustomProducts([...selectedCustomProducts, {
        product,
        quantity: 1,
        custom_fee: product.monthly_fee || 0
      }])
    }
  }

  const removeProductFromCustom = (product_id: string) => {
    setSelectedCustomProducts(selectedCustomProducts.filter(p => p.product.product_id !== product_id))
  }

  const updateProductQuantity = (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeProductFromCustom(product_id)
      return
    }
    
    setSelectedCustomProducts(selectedCustomProducts.map(p => 
      p.product.product_id === product_id 
        ? { ...p, quantity }
        : p
    ))
  }

  const updateProductFee = (product_id: string, custom_fee: number) => {
    setSelectedCustomProducts(selectedCustomProducts.map(p => 
      p.product.product_id === product_id 
        ? { ...p, custom_fee: Math.max(0, custom_fee) }
        : p
    ))
  }

  const calculateCustomTotal = () => {
    const subtotal = selectedCustomProducts.reduce((sum, item) => 
      sum + (item.custom_fee * item.quantity), 0
    )
    return Math.max(0, subtotal - customQuoteDetails.discount_amount)
  }

  const handleCreateQuote = async () => {
    try {
      if (!selectedCustomer) {
        alert('고객을 선택해주세요.')
        return
      }

      if (quoteType === 'package' && !selectedPackage) {
        alert('패키지를 선택해주세요.')
        return
      }

      if (quoteType === 'custom' && selectedCustomProducts.length === 0) {
        alert('최소 하나의 상품을 선택해주세요.')
        return
      }

      // 계약 기본 정보 준비
      const contractData = {
        business_name: selectedCustomer.business_name,
        owner_name: selectedCustomer.owner_name,
        phone: selectedCustomer.phone,
        email: selectedCustomer.email || '',
        address: selectedCustomer.address || '',
        business_registration: selectedCustomer.business_registration || '',
        installation_address: selectedCustomer.address || '',
        bank_name: '미입력',
        account_number: '미입력',
        account_holder: selectedCustomer.owner_name,
        terms_agreed: true,
        info_agreed: true
      }

      // 패키지형 vs 커스텀형에 따른 처리
      if (quoteType === 'package') {
        // 패키지 기반 견적
        const contractResponse = await fetch('/api/contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...contractData,
            internet_plan: selectedPackage.name,
            cctv_count: '패키지 포함'
          })
        })

        if (contractResponse.ok) {
          const contract = await contractResponse.json()
          
          const quoteResponse = await fetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contract_id: contract.id,
              customer_id: selectedCustomer.customer_id,
              package_id: selectedPackage.package_id,
              manager_name: '관리자',
              quote_notes: `${selectedPackage.name} 패키지 기반 견적`
            })
          })

          if (quoteResponse.ok) {
            alert('패키지 기반 견적서가 성공적으로 생성되었습니다!')
          } else {
            alert('견적서 생성에 실패했습니다.')
          }
        }
      } else {
        // 커스텀 견적
        const customTotal = calculateCustomTotal()
        const productsList = selectedCustomProducts.map(p => p.product.name).join(', ')
        
        const contractResponse = await fetch('/api/contract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...contractData,
            internet_plan: '커스텀',
            cctv_count: '커스텀',
            total_monthly_fee: customTotal
          })
        })

        if (contractResponse.ok) {
          const contract = await contractResponse.json()
          
          const quoteResponse = await fetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contract_id: contract.id,
              customer_id: selectedCustomer.customer_id,
              custom_items: selectedCustomProducts.map(item => ({
                product_id: item.product.product_id,
                quantity: item.quantity,
                fee: item.custom_fee
              })),
              manager_name: '관리자',
              quote_notes: `커스텀 패키지: ${productsList}`,
              discount_amount: customQuoteDetails.discount_amount
            })
          })

          if (quoteResponse.ok) {
            alert(`커스텀 견적서가 성공적으로 생성되었습니다!\n총액: ${customTotal.toLocaleString()}원/월`)
          } else {
            alert('견적서 생성에 실패했습니다.')
          }
        }
      }

      // 폼 리셋
      setIsNewQuoteOpen(false)
      setSelectedCustomer(null)
      setSelectedPackage(null)
      setSelectedCustomProducts([])
      setCustomerSearchTerm('')
      setQuoteType('package')
      fetchQuotes() // 목록 새로고침
    } catch (error) {
      console.error('견적 생성 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">대기</Badge>
      case 'quoted':
        return <Badge variant="default">견적완료</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인</Badge>
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">활성</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">견적 관리</h1>
          <p className="text-gray-600">고객별 견적서를 생성하고 관리합니다</p>
        </div>
        <Dialog open={isNewQuoteOpen} onOpenChange={setIsNewQuoteOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              새 견적서 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>새 견적서 생성</DialogTitle>
              <DialogDescription>고객을 선택하고 패키지 또는 커스텀 구성으로 견적서를 생성합니다</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* 고객 검색 */}
              <div className="space-y-2">
                <Label htmlFor="quote_customer_search">고객 검색 *</Label>
                <Input 
                  id="quote_customer_search" 
                  value={customerSearchTerm}
                  onChange={(e) => {
                    setCustomerSearchTerm(e.target.value)
                    handleCustomerSearch(e.target.value)
                  }}
                  placeholder="고객명 또는 사업체명으로 검색" 
                />
                {searchedCustomers.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {searchedCustomers.map((customer: any) => (
                      <div 
                        key={customer.customer_id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setCustomerSearchTerm(customer.business_name)
                          setSearchedCustomers([])
                        }}
                      >
                        <div className="font-medium">{customer.business_name}</div>
                        <div className="text-sm text-gray-500">
                          {customer.customer_code} | {customer.owner_name} | {customer.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCustomer && (
                  <div className="p-4 bg-blue-50 rounded-md">
                    <div className="font-medium text-blue-800">선택된 고객:</div>
                    <div className="text-sm text-blue-600">
                      {selectedCustomer.business_name} ({selectedCustomer.customer_code})
                    </div>
                    <div className="text-xs text-blue-500">
                      {selectedCustomer.owner_name} | {selectedCustomer.phone}
                    </div>
                  </div>
                )}
              </div>

              {/* 견적 타입 선택 */}
              <div className="space-y-4">
                <Label>견적 타입 선택 *</Label>
                <Tabs value={quoteType} onValueChange={(value) => setQuoteType(value as 'package' | 'custom')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="package">표준 패키지</TabsTrigger>
                    <TabsTrigger value="custom">커스텀 구성</TabsTrigger>
                  </TabsList>

                  {/* 표준 패키지 탭 */}
                  <TabsContent value="package" className="mt-4">
                    <div className="space-y-3">
                      <Label>패키지 선택 *</Label>
                      {packages.map((pkg: any) => (
                        <div 
                          key={pkg.package_id}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedPackage?.package_id === pkg.package_id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedPackage(pkg)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-lg">{pkg.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{pkg.description}</div>
                              <div className="text-sm text-gray-500 mt-2">
                                계약: {pkg.contract_period}개월 | 무료: {pkg.free_period}개월 | 환급률: {pkg.closure_refund_rate}%
                              </div>
                              {pkg.included_services && (
                                <div className="text-sm text-green-600 mt-1">
                                  ✓ {pkg.included_services}
                                </div>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <div className="font-bold text-xl text-blue-600">
                                {pkg.monthly_fee.toLocaleString()}원
                              </div>
                              <div className="text-sm text-gray-500">월</div>
                              {pkg.free_period > 0 && (
                                <div className="text-xs text-green-600 mt-1">
                                  {pkg.free_period}개월 무료!
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* 커스텀 구성 탭 */}
                  <TabsContent value="custom" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 상품 선택 섹션 */}
                        <div className="space-y-3">
                          <Label>상품 선택</Label>
                          <div className="max-h-60 overflow-y-auto border rounded-lg">
                            {products.map((product: any) => (
                              <div 
                                key={product.product_id}
                                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => addProductToCustom(product)}
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium">{product.name}</div>
                                    <div className="text-sm text-gray-500">
                                      {product.category} | {product.provider || '미지정'}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">
                                      {product.monthly_fee.toLocaleString()}원
                                    </div>
                                    <div className="text-xs text-gray-500">월</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 선택된 상품 목록 */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>선택된 상품</Label>
                            <div className="text-lg font-bold text-blue-600">
                              총 {calculateCustomTotal().toLocaleString()}원/월
                            </div>
                          </div>
                          {selectedCustomProducts.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                              <Package className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                              <p>상품을 선택해주세요</p>
                            </div>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {selectedCustomProducts.map((item) => (
                                <div key={item.product.product_id} className="p-3 border rounded-lg bg-gray-50">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium">{item.product.name}</div>
                                      <div className="text-sm text-gray-500">{item.product.category}</div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex items-center space-x-1">
                                        <Label className="text-xs">수량:</Label>
                                        <Input
                                          type="number"
                                          value={item.quantity}
                                          onChange={(e) => updateProductQuantity(
                                            item.product.product_id, 
                                            parseInt(e.target.value) || 1
                                          )}
                                          className="w-16 h-8"
                                          min="1"
                                        />
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Label className="text-xs">요금:</Label>
                                        <Input
                                          type="number"
                                          value={item.custom_fee}
                                          onChange={(e) => updateProductFee(
                                            item.product.product_id, 
                                            parseInt(e.target.value) || 0
                                          )}
                                          className="w-20 h-8"
                                          min="0"
                                        />
                                        <span className="text-xs text-gray-500">원</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeProductFromCustom(item.product.product_id)}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-right mt-2">
                                    <span className="font-medium">
                                      소계: {(item.custom_fee * item.quantity).toLocaleString()}원/월
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 커스텀 견적 옵션 */}
                          {selectedCustomProducts.length > 0 && (
                            <div className="space-y-3 pt-4 border-t">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-sm">계약기간 (개월)</Label>
                                  <Input
                                    type="number"
                                    value={customQuoteDetails.contract_period}
                                    onChange={(e) => setCustomQuoteDetails({
                                      ...customQuoteDetails,
                                      contract_period: parseInt(e.target.value) || 36
                                    })}
                                    className="h-8"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-sm">무료기간 (개월)</Label>
                                  <Input
                                    type="number"
                                    value={customQuoteDetails.free_period}
                                    onChange={(e) => setCustomQuoteDetails({
                                      ...customQuoteDetails,
                                      free_period: parseInt(e.target.value) || 12
                                    })}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm">할인 금액 (원)</Label>
                                <Input
                                  type="number"
                                  value={customQuoteDetails.discount_amount}
                                  onChange={(e) => setCustomQuoteDetails({
                                    ...customQuoteDetails,
                                    discount_amount: parseInt(e.target.value) || 0
                                  })}
                                  className="h-8"
                                  min="0"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-sm">견적 메모</Label>
                                <Textarea
                                  value={customQuoteDetails.notes}
                                  onChange={(e) => setCustomQuoteDetails({
                                    ...customQuoteDetails,
                                    notes: e.target.value
                                  })}
                                  rows={2}
                                  placeholder="특별 조건이나 메모를 입력하세요"
                                />
                              </div>
                              <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">최종 월 요금:</span>
                                  <span className="text-xl font-bold text-blue-600">
                                    {calculateCustomTotal().toLocaleString()}원
                                  </span>
                                </div>
                                {customQuoteDetails.discount_amount > 0 && (
                                  <div className="text-sm text-green-600 mt-1">
                                    할인 적용: -{customQuoteDetails.discount_amount.toLocaleString()}원
                                  </div>
                                )}
                                {customQuoteDetails.free_period > 0 && (
                                  <div className="text-sm text-green-600">
                                    {customQuoteDetails.free_period}개월 무료 제공
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewQuoteOpen(false)}>
                취소
              </Button>
              <Button 
                onClick={handleCreateQuote}
                disabled={!selectedCustomer || (quoteType === 'package' && !selectedPackage) || (quoteType === 'custom' && selectedCustomProducts.length === 0)}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {quoteType === 'package' ? '패키지 견적 생성' : `커스텀 견적 생성 (${calculateCustomTotal().toLocaleString()}원/월)`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 견적 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 견적</p>
                <p className="text-2xl font-bold">{quotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">승인 대기</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {quotes.filter(q => q.status === 'quoted').length}
                </p>
              </div>
              <Calculator className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">승인 완료</p>
                <p className="text-2xl font-bold text-green-600">
                  {quotes.filter(q => q.status === 'approved').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 견적액</p>
                <p className="text-2xl font-bold">
                  {quotes.reduce((sum, q) => sum + (q.total_monthly_fee || 0), 0).toLocaleString()}원
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 견적 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>견적 목록</CardTitle>
          <CardDescription>생성된 모든 견적서를 확인하고 관리합니다</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="고객명, 사업체명, 계약번호로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="quoted">견적완료</SelectItem>
                <SelectItem value="approved">승인</SelectItem>
                <SelectItem value="active">활성</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">견적 정보를 불러오는 중...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">견적서가 없습니다</h3>
              <p className="text-gray-600 mb-6">첫 번째 견적서를 생성해보세요.</p>
              <Button onClick={() => setIsNewQuoteOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                견적서 생성
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>계약번호</TableHead>
                    <TableHead>고객정보</TableHead>
                    <TableHead>패키지</TableHead>
                    <TableHead>월 요금</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="w-[100px]">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes
                    .filter(quote => {
                      const matchesSearch = 
                        quote.customer?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quote.customer?.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        quote.contract_number?.toLowerCase().includes(searchTerm.toLowerCase())
                      
                      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
                      return matchesSearch && matchesStatus
                    })
                    .map((quote, index) => (
                      <TableRow key={quote.contract_id}>
                        <TableCell className="font-medium">
                          {quote.contract_number}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.customer.business_name}</div>
                            <div className="text-sm text-gray-500">
                              {quote.customer.customer_code} | {quote.customer.owner_name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {quote.customer.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {quote.package ? (
                            <div>
                              <div className="font-medium">{quote.package.name}</div>
                              <div className="text-sm text-gray-500">
                                {quote.package.contract_period}개월 계약
                              </div>
                            </div>
                          ) : (
                            <Badge variant="outline">맞춤형</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-lg">
                            {quote.total_monthly_fee.toLocaleString()}원
                          </div>
                          {quote.package?.free_period && (
                            <div className="text-sm text-green-600">
                              {quote.package.free_period}개월 무료
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {quote.processed_by || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(quote.created_at).toLocaleDateString()}
                          </div>
                          {quote.processed_at && (
                            <div className="text-xs text-gray-500">
                              견적: {new Date(quote.processed_at).toLocaleDateString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedQuote(quote)
                                setIsQuoteDetailOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedQuote(quote)
                                setIsEditQuoteOpen(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // 견적서 PDF 다운로드 또는 이메일 발송 기능
                                alert(`${quote.customer.business_name}에 견적서를 발송합니다.`)
                              }}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 견적서 상세 보기 다이얼로그 */}
      <Dialog open={isQuoteDetailOpen} onOpenChange={setIsQuoteDetailOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>견적서 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedQuote?.contract_number} - {selectedQuote?.customer.business_name}
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-6">
              {/* 고객 정보 */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">고객 정보</Label>
                  <div className="space-y-1 mt-2">
                    <p className="font-medium">{selectedQuote.customer.business_name}</p>
                    <p className="text-sm text-gray-600">{selectedQuote.customer.owner_name}</p>
                    <p className="text-sm text-gray-600">{selectedQuote.customer.customer_code}</p>
                    <p className="text-sm text-gray-600">{selectedQuote.customer.phone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">견적 정보</Label>
                  <div className="space-y-1 mt-2">
                    <p className="font-medium">계약번호: {selectedQuote.contract_number}</p>
                    <p className="text-sm text-gray-600">상태: {selectedQuote.status}</p>
                    <p className="text-sm text-gray-600">
                      생성일: {new Date(selectedQuote.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">담당자: {selectedQuote.processed_by || '미지정'}</p>
                  </div>
                </div>
              </div>

              {/* 패키지/상품 정보 */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">구성 내역</Label>
                {selectedQuote.package ? (
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">{selectedQuote.package.name}</h4>
                        <p className="text-sm text-gray-600">
                          계약기간: {selectedQuote.package.contract_period}개월 | 
                          무료기간: {selectedQuote.package.free_period}개월
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-blue-600">
                          {selectedQuote.package.monthly_fee.toLocaleString()}원
                        </div>
                        <div className="text-sm text-gray-500">월</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-lg">커스텀 패키지</h4>
                        <p className="text-sm text-gray-600">맞춤형 구성</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl text-blue-600">
                          {selectedQuote.total_monthly_fee.toLocaleString()}원
                        </div>
                        <div className="text-sm text-gray-500">월</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 총액 정보 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">최종 월 납부액:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {selectedQuote.total_monthly_fee.toLocaleString()}원
                  </span>
                </div>
                {selectedQuote.package?.free_period && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {selectedQuote.package.free_period}개월 무료 혜택 포함
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuoteDetailOpen(false)}>
              닫기
            </Button>
            <Button onClick={() => {
              setIsQuoteDetailOpen(false)
              setIsEditQuoteOpen(true)
            }}>
              <Edit className="h-4 w-4 mr-2" />
              견적 수정
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 견적서 수정 다이얼로그 */}
      <Dialog open={isEditQuoteOpen} onOpenChange={setIsEditQuoteOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>견적서 수정</DialogTitle>
            <DialogDescription>
              {selectedQuote?.contract_number} 견적을 수정합니다
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">고객: {selectedQuote?.customer.business_name}</p>
              <p className="text-sm text-gray-600">현재 월 요금: {selectedQuote?.total_monthly_fee.toLocaleString()}원</p>
            </div>
            <div className="space-y-2">
              <Label>수정된 월 요금 (원)</Label>
              <Input 
                type="number" 
                defaultValue={selectedQuote?.total_monthly_fee}
                placeholder="새로운 월 요금을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label>견적 상태</Label>
              <Select defaultValue={selectedQuote?.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">대기</SelectItem>
                  <SelectItem value="quoted">견적완료</SelectItem>
                  <SelectItem value="approved">승인</SelectItem>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="terminated">해지</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>수정 메모</Label>
              <Textarea 
                placeholder="견적 수정 사유나 특별 조건을 입력하세요"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditQuoteOpen(false)}>
              취소
            </Button>
            <Button onClick={() => {
              alert('견적서가 수정되었습니다.')
              setIsEditQuoteOpen(false)
              fetchQuotes()
            }}>
              <Edit className="h-4 w-4 mr-2" />
              수정 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}