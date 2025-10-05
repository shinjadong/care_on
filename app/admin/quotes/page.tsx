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
  Trash2,
  Copy,
  CheckCircle
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
  
  // 선택 관리
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // 인라인 편집
  const [editingField, setEditingField] = useState<{contract_id: string, field: string} | null>(null)
  const [editingValue, setEditingValue] = useState('')
  
  // 벌크 액션
  const [bulkAction, setBulkAction] = useState('')

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
    original_price: number  // 정가
    custom_fee: number      // 할인가
    discount_rate: number   // 할인율
    discount_reason: string // 할인 사유
  }>>([])
  const [customQuoteDetails, setCustomQuoteDetails] = useState({
    contract_period: 36,
    free_period: 12,
    discount_amount: 0,
    notes: ''
  })
  
  // 매니저 할인 권한 (실제로는 로그인된 매니저 정보에서 가져와야 함)
  const managerDiscountLimit = 20 // 최대 20% 할인 권한

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

  // 할인 계산 함수들
  const calculateDiscountedPrice = (originalPrice: number, discountRate: number) => {
    return Math.round(originalPrice * (100 - discountRate) / 100)
  }

  const getDiscountTiers = (product: any) => {
    return product.discount_tiers || [
      {rate: 5, condition: '신규고객', description: '첫 계약 고객'},
      {rate: 10, condition: '패키지할인', description: '다른 서비스와 함께'},
      {rate: 15, condition: '특별할인', description: '매니저 재량'}
    ]
  }

  const getMaxAllowedDiscount = (product: any) => {
    return Math.min(product.max_discount_rate || 15, managerDiscountLimit)
  }

  // 커스텀 패키지 관리 함수들 (할인 시스템 포함)
  const addProductToCustom = (product: any) => {
    const existingIndex = selectedCustomProducts.findIndex(p => p.product.product_id === product.product_id)
    
    if (existingIndex >= 0) {
      // 이미 추가된 상품의 수량 증가
      const updated = [...selectedCustomProducts]
      updated[existingIndex].quantity += 1
      setSelectedCustomProducts(updated)
    } else {
      // 새 상품 추가 (할인 정보 포함)
      const originalPrice = product.monthly_fee || 0
      setSelectedCustomProducts([...selectedCustomProducts, {
        product,
        quantity: 1,
        original_price: originalPrice,
        custom_fee: originalPrice, // 기본값은 정가
        discount_rate: 0,
        discount_reason: ''
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
    setSelectedCustomProducts(selectedCustomProducts.map(p => {
      if (p.product.product_id === product_id) {
        // 할인가 직접 입력 시 할인율 자동 계산
        const newFee = Math.max(0, custom_fee)
        const newDiscountRate = p.original_price > 0 ? 
          Math.round((p.original_price - newFee) / p.original_price * 100) : 0
        
        return { 
          ...p, 
          custom_fee: newFee,
          discount_rate: Math.max(0, newDiscountRate)
        }
      }
      return p
    }))
  }

  // 할인율 직접 적용 함수
  const updateProductDiscount = (product_id: string, discount_rate: number, reason: string = '') => {
    setSelectedCustomProducts(selectedCustomProducts.map(p => {
      if (p.product.product_id === product_id) {
        const maxDiscount = getMaxAllowedDiscount(p.product)
        const appliedRate = Math.min(discount_rate, maxDiscount)
        const discountedPrice = calculateDiscountedPrice(p.original_price, appliedRate)
        
        return { 
          ...p, 
          discount_rate: appliedRate,
          custom_fee: discountedPrice,
          discount_reason: reason
        }
      }
      return p
    }))
  }

  // 빠른 할인 적용 함수
  const applyQuickDiscount = (product_id: string, discountTier: any) => {
    updateProductDiscount(product_id, discountTier.rate, discountTier.condition)
  }

  const calculateCustomTotal = () => {
    const subtotal = selectedCustomProducts.reduce((sum, item) => 
      sum + (item.custom_fee * item.quantity), 0
    )
    return Math.max(0, subtotal - customQuoteDetails.discount_amount)
  }

  // 견적 관리 함수들
  const handleSelectQuote = (contract_id: string, checked: boolean) => {
    if (checked) {
      setSelectedQuotes([...selectedQuotes, contract_id])
    } else {
      setSelectedQuotes(selectedQuotes.filter(id => id !== contract_id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const filteredQuotes = quotes.filter(quote => {
      const matchesSearch = 
        quote.customer?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer?.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.contract_number?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
      return matchesSearch && matchesStatus
    })

    if (checked) {
      setSelectedQuotes(filteredQuotes.map(q => q.contract_id))
      setSelectAll(true)
    } else {
      setSelectedQuotes([])
      setSelectAll(false)
    }
  }

  // 인라인 편집 함수들
  const startEditing = (contract_id: string, field: string, currentValue: string) => {
    setEditingField({ contract_id, field })
    setEditingValue(currentValue || '')
  }

  const cancelEditing = () => {
    setEditingField(null)
    setEditingValue('')
  }

  const saveFieldEdit = async (contract_id: string, field: string, value: string) => {
    try {
      const response = await fetch(`/api/contracts/${contract_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [field]: field === 'total_monthly_fee' ? parseInt(value) || 0 : value
        })
      })

      if (response.ok) {
        // 성공 시 견적 목록에서 해당 필드 업데이트
        setQuotes(quotes.map(quote => 
          quote.contract_id === contract_id 
            ? { ...quote, [field]: field === 'total_monthly_fee' ? parseInt(value) || 0 : value }
            : quote
        ))
        setEditingField(null)
        setEditingValue('')
      } else {
        alert('수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('필드 수정 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, contract_id: string, field: string) => {
    if (e.key === 'Enter') {
      saveFieldEdit(contract_id, field, editingValue)
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  const isEditing = (contract_id: string, field: string) => {
    return editingField?.contract_id === contract_id && editingField?.field === field
  }

  // 견적서 삭제 (소프트 삭제)
  const handleDeleteQuotes = async (quoteIds: string[]) => {
    try {
      if (!confirm(`선택한 ${quoteIds.length}개 견적서를 삭제하시겠습니까?`)) {
        return
      }

      console.log('삭제할 견적서 IDs:', quoteIds)

      const promises = quoteIds.map(async (id) => {
        const response = await fetch(`/api/contracts/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error(`견적서 ${id} 삭제 실패:`, errorData)
          throw new Error(`견적서 삭제 실패: ${errorData.error}`)
        }
        
        return response.json()
      })

      const results = await Promise.all(promises)
      console.log('삭제 결과:', results)
      
      alert(`${quoteIds.length}개 견적서가 성공적으로 취소되었습니다.`)
      setSelectedQuotes([])
      setSelectAll(false)
      fetchQuotes() // 목록 새로고침
    } catch (error) {
      console.error('견적서 삭제 오류:', error)
      alert(`삭제 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    }
  }

  // 견적서 복사
  const handleCopyQuote = async (originalQuote: Quote) => {
    try {
      // 같은 고객에 대한 새 견적 생성
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: originalQuote.customer.customer_code, // 임시
          package_id: originalQuote.package ? 'package_copy' : null,
          total_monthly_fee: originalQuote.total_monthly_fee,
          manager_name: '관리자 (복사)',
          quote_notes: `${originalQuote.contract_number}의 복사본`
        })
      })

      if (response.ok) {
        alert('견적서가 성공적으로 복사되었습니다.')
        fetchQuotes()
      } else {
        alert('견적서 복사에 실패했습니다.')
      }
    } catch (error) {
      console.error('견적서 복사 오류:', error)
      alert('복사에 실패했습니다.')
    }
  }

  // 벌크 액션 처리
  const handleBulkAction = async (action: string) => {
    if (selectedQuotes.length === 0) {
      alert('견적서를 선택해주세요.')
      return
    }

    try {
      switch (action) {
        case 'approve':
          await Promise.all(selectedQuotes.map(id => 
            fetch(`/api/contracts/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'approved' })
            })
          ))
          alert(`${selectedQuotes.length}개 견적서가 승인되었습니다.`)
          break
          
        case 'reject':
          await Promise.all(selectedQuotes.map(id => 
            fetch(`/api/contracts/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'cancelled' })
            })
          ))
          alert(`${selectedQuotes.length}개 견적서가 거절되었습니다.`)
          break
          
        case 'delete':
          handleDeleteQuotes(selectedQuotes)
          return
          
        case 'export':
          handleExportQuotes(selectedQuotes)
          break
      }
      
      setSelectedQuotes([])
      setBulkAction('')
      fetchQuotes()
    } catch (error) {
      console.error('벌크 액션 오류:', error)
      alert('일괄 작업에 실패했습니다.')
    }
  }

  const handleExportQuotes = (quoteIds: string[]) => {
    const exportData = quotes
      .filter(q => quoteIds.includes(q.contract_id))
      .map(q => ({
        견적번호: q.contract_number,
        고객명: q.customer.business_name,
        대표자: q.customer.owner_name,
        전화번호: q.customer.phone,
        패키지: q.package?.name || '커스텀',
        월요금: q.total_monthly_fee,
        상태: q.status,
        생성일: new Date(q.created_at).toLocaleDateString(),
        담당자: q.processed_by
      }))

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `견적서목록_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
          {selectedQuotes.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{selectedQuotes.length}개 선택됨</Badge>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('approve')}>
                <CheckCircle className="h-4 w-4 mr-1" />
                일괄 승인
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('reject')}>
                일괄 거절
              </Button>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="일괄 작업" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">승인</SelectItem>
                  <SelectItem value="reject">거절</SelectItem>
                  <SelectItem value="delete">삭제</SelectItem>
                  <SelectItem value="export">선택 견적서 내보내기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
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
                                <div key={item.product.product_id} className="p-4 border rounded-lg bg-white">
                                  {/* 상품 정보 헤더 */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1">
                                      <div className="font-medium">{item.product.name}</div>
                                      <div className="text-sm text-gray-500">{item.product.category} | {item.product.provider}</div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeProductFromCustom(item.product.product_id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>

                                  {/* 가격 정보 */}
                                  <div className="grid grid-cols-2 gap-4 mb-3">
                                    <div>
                                      <Label className="text-xs text-gray-600">정가</Label>
                                      <div className="text-lg font-bold text-gray-400 line-through">
                                        {item.original_price.toLocaleString()}원
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-600">할인가</Label>
                                      <div className="text-lg font-bold text-blue-600">
                                        {item.custom_fee.toLocaleString()}원
                                        {item.discount_rate > 0 && (
                                          <span className="text-sm text-red-500 ml-2">
                                            {item.discount_rate}% 할인
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* 빠른 할인 버튼들 */}
                                  <div className="mb-3">
                                    <Label className="text-xs text-gray-600 mb-2 block">빠른 할인 적용</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {getDiscountTiers(item.product).map((tier: any, tierIndex: number) => (
                                        <Button
                                          key={`${item.product.product_id}-tier-${tierIndex}`}
                                          variant="outline"
                                          size="sm"
                                          className="text-xs h-8"
                                          onClick={() => applyQuickDiscount(item.product.product_id, tier)}
                                          disabled={tier.rate > getMaxAllowedDiscount(item.product)}
                                        >
                                          {tier.rate}% ({tier.condition})
                                        </Button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 세부 조정 */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <Label className="text-xs">수량</Label>
                                      <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateProductQuantity(
                                          item.product.product_id, 
                                          parseInt(e.target.value) || 1
                                        )}
                                        className="h-8"
                                        min="1"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">할인율(%)</Label>
                                      <Input
                                        type="number"
                                        value={item.discount_rate}
                                        onChange={(e) => {
                                          const rate = parseInt(e.target.value) || 0
                                          updateProductDiscount(
                                            item.product.product_id, 
                                            rate,
                                            item.discount_reason
                                          )
                                        }}
                                        className="h-8"
                                        min="0"
                                        max={getMaxAllowedDiscount(item.product)}
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">할인가</Label>
                                      <Input
                                        type="number"
                                        value={item.custom_fee}
                                        onChange={(e) => updateProductFee(
                                          item.product.product_id, 
                                          parseInt(e.target.value) || 0
                                        )}
                                        className="h-8"
                                        min="0"
                                      />
                                    </div>
                                  </div>

                                  {/* 할인 사유 */}
                                  {item.discount_rate > 0 && (
                                    <div className="mt-2">
                                      <Input
                                        placeholder="할인 사유 (선택)"
                                        value={item.discount_reason}
                                        onChange={(e) => {
                                          setSelectedCustomProducts(selectedCustomProducts.map(p => 
                                            p.product.product_id === item.product.product_id 
                                              ? { ...p, discount_reason: e.target.value }
                                              : p
                                          ))
                                        }}
                                        className="h-8 text-xs"
                                      />
                                    </div>
                                  )}

                                  {/* 소계 및 절약액 */}
                                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                                    <div>
                                      {item.discount_rate > 0 && (
                                        <span className="text-xs text-green-600">
                                          절약: {((item.original_price - item.custom_fee) * item.quantity).toLocaleString()}원/월
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-bold">
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
                              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                                {/* 할인 요약 */}
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <p className="text-sm text-gray-600">정가 합계</p>
                                    <p className="text-lg font-bold text-gray-500 line-through">
                                      {selectedCustomProducts.reduce((sum, item) => 
                                        sum + (item.original_price * item.quantity), 0
                                      ).toLocaleString()}원
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">총 절약액</p>
                                    <p className="text-lg font-bold text-green-600">
                                      -{selectedCustomProducts.reduce((sum, item) => 
                                        sum + ((item.original_price - item.custom_fee) * item.quantity), 0
                                      ).toLocaleString()}원
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="border-t pt-3">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium text-lg">할인 적용 후 월 요금:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                      {calculateCustomTotal().toLocaleString()}원
                                    </span>
                                  </div>
                                  
                                  {/* 평균 할인율 표시 */}
                                  {selectedCustomProducts.length > 0 && (
                                    <div className="text-sm text-green-600 mt-2">
                                      평균 할인율: {Math.round(
                                        selectedCustomProducts.reduce((sum, item) => 
                                          sum + (item.discount_rate * item.quantity), 0
                                        ) / selectedCustomProducts.reduce((sum, item) => sum + item.quantity, 0)
                                      )}% 적용됨
                                    </div>
                                  )}
                                  
                                  {customQuoteDetails.free_period > 0 && (
                                    <div className="text-sm text-purple-600">
                                      🎁 {customQuoteDetails.free_period}개월 무료 제공
                                    </div>
                                  )}
                                </div>
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
                {quoteType === 'package' ? '패키지 견적 생성' : 
                  selectedCustomProducts.length > 0 ? (
                    `커스텀 견적 생성 (${calculateCustomTotal().toLocaleString()}원/월, ${
                      selectedCustomProducts.reduce((sum, item) => 
                        sum + ((item.original_price - item.custom_fee) * item.quantity), 0
                      ).toLocaleString()
                    }원 절약)`
                  ) : '커스텀 견적 생성'
                }
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
                    <TableHead className="w-[50px]">
                      <input
                        type="checkbox"
                        checked={selectedQuotes.length > 0 && quotes.length > 0 && selectedQuotes.length === quotes.filter(quote => {
                          const matchesSearch = 
                            quote.customer?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quote.customer?.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            quote.contract_number?.toLowerCase().includes(searchTerm.toLowerCase())
                          const matchesStatus = statusFilter === 'all' || quote.status === statusFilter
                          return matchesSearch && matchesStatus
                        }).length}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>계약번호</TableHead>
                    <TableHead>고객정보</TableHead>
                    <TableHead>패키지</TableHead>
                    <TableHead>월 요금</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>담당자</TableHead>
                    <TableHead>생성일</TableHead>
                    <TableHead className="w-[120px]">작업</TableHead>
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
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedQuotes.includes(quote.contract_id)}
                            onChange={(e) => handleSelectQuote(quote.contract_id, e.target.checked)}
                            className="rounded"
                          />
                        </TableCell>
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
                          {/* 월 요금 인라인 편집 */}
                          {isEditing(quote.contract_id, 'total_monthly_fee') ? (
                            <Input
                              type="number"
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyDown={(e) => handleKeyPress(e, quote.contract_id, 'total_monthly_fee')}
                              onBlur={() => saveFieldEdit(quote.contract_id, 'total_monthly_fee', editingValue)}
                              className="w-24 h-8 text-right"
                              autoFocus
                            />
                          ) : (
                            <div 
                              className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                              onClick={() => startEditing(quote.contract_id, 'total_monthly_fee', quote.total_monthly_fee.toString())}
                              title="클릭하여 수정"
                            >
                              <div className="font-bold text-lg">
                                {quote.total_monthly_fee.toLocaleString()}원
                              </div>
                              {quote.package?.free_period && (
                                <div className="text-sm text-green-600">
                                  {quote.package.free_period}개월 무료
                                </div>
                              )}
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
                              title="상세 보기"
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
                              title="견적 수정"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopyQuote(quote)}
                              title="견적 복사"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteQuotes([quote.contract_id])}
                              title="견적 삭제"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/kakao/send-quote', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      contract_id: quote.contract_id
                                    })
                                  })

                                  if (response.ok) {
                                    const data = await response.json()
                                    alert(`${quote.customer.business_name}에 카카오톡 견적서를 발송했습니다!\n\n발송 링크: ${data.quote_url}`)
                                  } else {
                                    alert('발송에 실패했습니다.')
                                  }
                                } catch (error) {
                                  console.error('카톡 발송 오류:', error)
                                  alert('네트워크 오류가 발생했습니다.')
                                }
                              }}
                              title="카카오톡 발송"
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