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
import { Switch } from '@/components/ui/switch'
import { 
  Package, 
  Plus, 
  Edit, 
  Search,
  Wifi,
  Camera,
  CreditCard,
  Shield,
  Phone,
  Tv,
  MoreHorizontal,
  Copy,
  Trash2,
  RefreshCw
} from 'lucide-react'

interface Product {
  product_id: string
  name: string
  category: string
  provider: string | null
  monthly_fee: number
  description: string | null
  available: boolean
  closure_refund_rate: number
  created_at: string
}

interface Package {
  package_id: string
  name: string
  monthly_fee: number
  contract_period: number
  free_period: number
  closure_refund_rate: number
  included_services: string | null
  description: string | null
  active: boolean
  created_at: string
}

const categoryIcons: { [key: string]: any } = {
  '인터넷': Wifi,
  'CCTV': Camera,
  'POS': CreditCard,
  '키오스크': CreditCard,
  '보험': Shield,
  '통신': Phone,
  'TV': Tv,
  '기타': Package
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name_asc')
  const [showAvailableOnly, setShowAvailableOnly] = useState(true)
  const [isNewProductOpen, setIsNewProductOpen] = useState(false)
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // 선택 관리
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  
  // 휴지통 관리
  const [showDeleted, setShowDeleted] = useState(false)
  const [deletedProducts, setDeletedProducts] = useState<Product[]>([])
  
  // 복사 관리
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false)
  const [copyingProduct, setCopyingProduct] = useState<Product | null>(null)
  
  // 선택 상품으로 패키지 생성
  const [packageFromSelectionForm, setPackageFromSelectionForm] = useState({
    name: '',
    monthly_fee: 0,
    contract_period: 36,
    free_period: 12,
    included_services: '',
    description: ''
  })
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: '',
    provider: '',
    monthly_fee: 0,
    description: '',
    available: true,
    image_url: ''
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [newPackageForm, setNewPackageForm] = useState({
    name: '',
    monthly_fee: 0,
    contract_period: 36,
    free_period: 12,
    included_services: '',
    description: '',
    active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  // 선택된 상품이 변경될 때 패키지 월 요금 자동 계산
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const totalFee = selectedProducts.reduce((sum, id) => {
        const product = products.find(p => p.product_id === id)
        return sum + (product?.monthly_fee || 0)
      }, 0)
      
      setPackageFromSelectionForm(prev => ({
        ...prev,
        monthly_fee: totalFee
      }))
    }
  }, [selectedProducts, products])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, packagesRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/packages')
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData.products || [])
      }

      if (packagesRes.ok) {
        const packagesData = await packagesRes.json()
        setPackages(packagesData.packages || [])
      }

    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesAvailability = showAvailableOnly ? product.available : true

      return matchesSearch && matchesCategory && matchesAvailability
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'fee_asc':
          return a.monthly_fee - b.monthly_fee
        case 'fee_desc':
          return b.monthly_fee - a.monthly_fee
        case 'created_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'created_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category] || Package
    return <IconComponent className="h-4 w-4" />
  }

  const getAvailabilityBadge = (available: boolean) => {
    return available ? (
      <Badge variant="default">판매중</Badge>
    ) : (
      <Badge variant="secondary">판매중지</Badge>
    )
  }

  const categories = [...new Set(products.map(p => p.category))]

  // 선택 관리 함수들
  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.product_id))
      setSelectAll(true)
    } else {
      setSelectedProducts([])
      setSelectAll(false)
    }
  }

  // 삭제 함수 (휴지통으로 이동)
  const handleDeleteProducts = async (productIds: string[]) => {
    try {
      if (!confirm(`선택한 ${productIds.length}개 상품을 휴지통으로 이동하시겠습니까?`)) {
        return
      }

      const promises = productIds.map(id =>
        fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: id,
            available: false // 휴지통 = available false
          })
        })
      )

      await Promise.all(promises)
      alert(`${productIds.length}개 상품이 휴지통으로 이동되었습니다.`)
      setSelectedProducts([])
      fetchData()
    } catch (error) {
      console.error('상품 삭제 오류:', error)
      alert('상품 삭제에 실패했습니다.')
    }
  }

  // 복사 함수
  const handleCopyProduct = async (originalProduct: Product) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${originalProduct.name} (복사본)`,
          category: originalProduct.category,
          provider: originalProduct.provider,
          monthly_fee: originalProduct.monthly_fee,
          description: `${originalProduct.description || ''} (복사본)`,
          available: originalProduct.available,
          closure_refund_rate: originalProduct.closure_refund_rate
        })
      })

      if (response.ok) {
        alert('상품이 성공적으로 복사되었습니다.')
        fetchData()
      } else {
        alert('상품 복사에 실패했습니다.')
      }
    } catch (error) {
      console.error('상품 복사 오류:', error)
      alert('상품 복사에 실패했습니다.')
    }
  }

  // 복구 함수
  const handleRestoreProducts = async (productIds: string[]) => {
    try {
      const promises = productIds.map(id =>
        fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: id,
            available: true // 복구 = available true
          })
        })
      )

      await Promise.all(promises)
      alert(`${productIds.length}개 상품이 복구되었습니다.`)
      fetchData()
    } catch (error) {
      console.error('상품 복구 오류:', error)
      alert('상품 복구에 실패했습니다.')
    }
  }

  // 선택된 상품으로 패키지 생성
  const handleCreatePackageFromSelection = async () => {
    try {
      if (!packageFromSelectionForm.name) {
        alert('패키지명을 입력해주세요.')
        return
      }

      if (selectedProducts.length === 0) {
        alert('상품을 선택해주세요.')
        return
      }

      // 1. 패키지 생성
      const packageData = {
        name: packageFromSelectionForm.name,
        monthly_fee: packageFromSelectionForm.monthly_fee,
        contract_period: packageFromSelectionForm.contract_period,
        free_period: packageFromSelectionForm.free_period,
        included_services: packageFromSelectionForm.included_services,
        description: packageFromSelectionForm.description,
        active: true
      }

      const packageResponse = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...packageData,
          product_items: selectedProducts.map(productId => {
            const product = products.find(p => p.product_id === productId)
            return {
              product_id: productId,
              quantity: 1,
              item_fee: product?.monthly_fee || 0
            }
          })
        })
      })

      if (packageResponse.ok) {
        alert(`"${packageFromSelectionForm.name}" 패키지가 성공적으로 생성되었습니다!`)
        setSelectedProducts([]) // 선택 해제
        setPackageFromSelectionForm({
          name: '',
          monthly_fee: 0,
          contract_period: 36,
          free_period: 12,
          included_services: '',
          description: ''
        })
        fetchData() // 목록 새로고침
      } else {
        alert('패키지 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('패키지 생성 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  // 이미지 업로드 핸들러 (Base64 방식)
  const handleImageUpload = async (file: File, productId?: string) => {
    try {
      setUploadingImage(true)

      // 파일을 Base64로 변환
      const fileData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/admin/products/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData,
          fileName: file.name,
          fileType: file.type,
          productId
        })
      })

      const data = await response.json()

      if (response.ok) {
        return data.imageUrl
      } else {
        alert(data.error || '이미지 업로드에 실패했습니다.')
        return null
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  // 새 상품 이미지 업로드
  const handleNewProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const imageUrl = await handleImageUpload(file)
    if (imageUrl) {
      setNewProductForm({ ...newProductForm, image_url: imageUrl })
    }
  }

  // 수정 중인 상품 이미지 업로드
  const handleEditProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProduct) return

    const imageUrl = await handleImageUpload(file, editingProduct.product_id)
    if (imageUrl) {
      setEditingProduct({ ...editingProduct, image_url: imageUrl })
    }
  }

  const handleAddProduct = async () => {
    try {
      if (!newProductForm.name || !newProductForm.category) {
        alert('상품명과 카테고리는 필수입니다.')
        return
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProductForm)
      })

      if (response.ok) {
        alert('상품이 성공적으로 추가되었습니다.')
        setIsNewProductOpen(false)
        setNewProductForm({
          name: '',
          category: '',
          provider: '',
          monthly_fee: 0,
          description: '',
          available: true,
          image_url: ''
        })
        fetchData() // 목록 새로고침
      } else {
        alert('상품 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('상품 추가 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const handleAddPackage = async () => {
    try {
      if (!newPackageForm.name) {
        alert('패키지명은 필수입니다.')
        return
      }

      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPackageForm)
      })

      if (response.ok) {
        alert('패키지가 성공적으로 추가되었습니다.')
        setIsNewPackageOpen(false)
        setNewPackageForm({
          name: '',
          monthly_fee: 0,
          contract_period: 36,
          free_period: 12,
          included_services: '',
          description: '',
          active: true
        })
        fetchData() // 목록 새로고침
      } else {
        alert('패키지 추가에 실패했습니다.')
      }
    } catch (error) {
      console.error('패키지 추가 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditProductOpen(true)
  }

  const handleUpdateProduct = async () => {
    try {
      if (!editingProduct) return

      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: editingProduct.product_id,
          name: editingProduct.name,
          category: editingProduct.category,
          provider: editingProduct.provider,
          monthly_fee: editingProduct.monthly_fee,
          description: editingProduct.description,
          available: editingProduct.available,
          closure_refund_rate: editingProduct.closure_refund_rate
        })
      })

      if (response.ok) {
        alert('상품이 성공적으로 수정되었습니다.')
        setIsEditProductOpen(false)
        setEditingProduct(null)
        fetchData() // 목록 새로고침
      } else {
        alert('상품 수정에 실패했습니다.')
      }
    } catch (error) {
      console.error('상품 수정 오류:', error)
      alert('네트워크 오류가 발생했습니다.')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">상품/패키지 관리</h1>
          <p className="text-gray-600">서비스 상품과 패키지를 관리합니다</p>
        </div>
        <div className="flex space-x-2">
          {/* 선택된 상품 액션 버튼들 */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <Badge variant="outline">{selectedProducts.length}개 선택됨</Badge>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="default" 
                    size="sm"
                  >
                    <Package className="h-4 w-4 mr-1" />
                    패키지로 구성
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>선택된 상품으로 패키지 생성</DialogTitle>
                    <DialogDescription>
                      {selectedProducts.length}개 상품으로 새로운 패키지를 만듭니다
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* 선택된 상품 목록 */}
                    <div className="space-y-2">
                      <Label>포함될 상품들</Label>
                      <div className="max-h-40 overflow-y-auto border rounded p-3 bg-gray-50">
                        {selectedProducts.map(productId => {
                          const product = products.find(p => p.product_id === productId)
                          return product ? (
                            <div key={productId} className="flex justify-between items-center py-1">
                              <span className="text-sm">{product.name}</span>
                              <span className="text-sm font-medium">{product.monthly_fee.toLocaleString()}원</span>
                            </div>
                          ) : null
                        })}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>총 상품가 합계:</span>
                            <span>{selectedProducts.reduce((sum, id) => {
                              const product = products.find(p => p.product_id === id)
                              return sum + (product?.monthly_fee || 0)
                            }, 0).toLocaleString()}원/월</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 패키지 정보 입력 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="package_name_from_selection">패키지명 *</Label>
                        <Input 
                          id="package_name_from_selection" 
                          value={packageFromSelectionForm.name}
                          onChange={(e) => setPackageFromSelectionForm({
                            ...packageFromSelectionForm, 
                            name: e.target.value
                          })}
                          placeholder="예: 커스텀 패키지 A" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="package_monthly_fee_from_selection">패키지 월 요금 (원)</Label>
                        <Input 
                          id="package_monthly_fee_from_selection" 
                          type="number" 
                          value={packageFromSelectionForm.monthly_fee || selectedProducts.reduce((sum, id) => {
                            const product = products.find(p => p.product_id === id)
                            return sum + (product?.monthly_fee || 0)
                          }, 0)}
                          onChange={(e) => setPackageFromSelectionForm({
                            ...packageFromSelectionForm, 
                            monthly_fee: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>계약 기간 (개월)</Label>
                        <Input 
                          type="number" 
                          value={packageFromSelectionForm.contract_period}
                          onChange={(e) => setPackageFromSelectionForm({
                            ...packageFromSelectionForm, 
                            contract_period: parseInt(e.target.value) || 36
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>무료 기간 (개월)</Label>
                        <Input 
                          type="number" 
                          value={packageFromSelectionForm.free_period}
                          onChange={(e) => setPackageFromSelectionForm({
                            ...packageFromSelectionForm, 
                            free_period: parseInt(e.target.value) || 12
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>포함 서비스</Label>
                      <Textarea 
                        value={packageFromSelectionForm.included_services}
                        onChange={(e) => setPackageFromSelectionForm({
                          ...packageFromSelectionForm, 
                          included_services: e.target.value
                        })}
                        placeholder="이 패키지에 포함된 특별 서비스나 혜택을 설명하세요" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>패키지 설명</Label>
                      <Textarea 
                        value={packageFromSelectionForm.description}
                        onChange={(e) => setPackageFromSelectionForm({
                          ...packageFromSelectionForm, 
                          description: e.target.value
                        })}
                        placeholder="패키지에 대한 설명을 입력하세요" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">취소</Button>
                    <Button onClick={handleCreatePackageFromSelection}>
                      <Package className="h-4 w-4 mr-2" />
                      패키지 생성
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteProducts(selectedProducts)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                휴지통으로
              </Button>
            </div>
          )}
          
          {/* 휴지통 토글 */}
          <Button 
            variant={showDeleted ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDeleted(!showDeleted)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {showDeleted ? "활성 상품 보기" : "휴지통 보기"}
          </Button>

          <Dialog open={isNewProductOpen} onOpenChange={setIsNewProductOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                새 상품
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>새 상품 추가</DialogTitle>
                <DialogDescription>새로운 서비스 상품을 등록합니다</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_name">상품명 *</Label>
                    <Input 
                      id="product_name" 
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})}
                      placeholder="상품명을 입력하세요" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">카테고리 *</Label>
                    <Select value={newProductForm.category} onValueChange={(value) => setNewProductForm({...newProductForm, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="인터넷">인터넷</SelectItem>
                        <SelectItem value="CCTV">CCTV</SelectItem>
                        <SelectItem value="POS">POS</SelectItem>
                        <SelectItem value="키오스크">키오스크</SelectItem>
                        <SelectItem value="보험">보험</SelectItem>
                        <SelectItem value="통신">통신</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="provider">공급사</Label>
                    <Input 
                      id="provider" 
                      value={newProductForm.provider}
                      onChange={(e) => setNewProductForm({...newProductForm, provider: e.target.value})}
                      placeholder="예: KT, SK브로드밴드" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly_fee">월 요금 (원)</Label>
                    <Input 
                      id="monthly_fee" 
                      type="number" 
                      value={newProductForm.monthly_fee}
                      onChange={(e) => setNewProductForm({...newProductForm, monthly_fee: parseInt(e.target.value) || 0})}
                      placeholder="0" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">상품 설명</Label>
                  <Textarea 
                    id="description" 
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({...newProductForm, description: e.target.value})}
                    placeholder="상품에 대한 설명을 입력하세요" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_image">상품 이미지</Label>
                  <div className="flex items-center gap-4">
                    {newProductForm.image_url && (
                      <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                        <img 
                          src={newProductForm.image_url} 
                          alt="상품 이미지" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewProductForm({...newProductForm, image_url: ''})}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="product_image"
                        type="file"
                        accept="image/*"
                        onChange={handleNewProductImageUpload}
                        disabled={uploadingImage}
                        className="cursor-pointer"
                      />
                      {uploadingImage && (
                        <p className="text-sm text-gray-500 mt-1">업로드 중...</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="available" 
                    checked={newProductForm.available}
                    onCheckedChange={(checked) => setNewProductForm({...newProductForm, available: checked})}
                  />
                  <Label htmlFor="available">판매 가능</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewProductOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleAddProduct}>상품 추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewPackageOpen} onOpenChange={setIsNewPackageOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                새 패키지
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>새 패키지 추가</DialogTitle>
                <DialogDescription>새로운 서비스 패키지를 생성합니다</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="package_name">패키지명 *</Label>
                    <Input 
                      id="package_name" 
                      value={newPackageForm.name}
                      onChange={(e) => setNewPackageForm({...newPackageForm, name: e.target.value})}
                      placeholder="스타트케어 플러스" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="package_monthly_fee">월 요금 (원)</Label>
                    <Input 
                      id="package_monthly_fee" 
                      type="number" 
                      value={newPackageForm.monthly_fee}
                      onChange={(e) => setNewPackageForm({...newPackageForm, monthly_fee: parseInt(e.target.value) || 0})}
                      placeholder="0" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract_period">계약 기간 (개월)</Label>
                    <Input 
                      id="contract_period" 
                      type="number" 
                      value={newPackageForm.contract_period}
                      onChange={(e) => setNewPackageForm({...newPackageForm, contract_period: parseInt(e.target.value) || 36})}
                      placeholder="36" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="free_period">무료 기간 (개월)</Label>
                    <Input 
                      id="free_period" 
                      type="number" 
                      value={newPackageForm.free_period}
                      onChange={(e) => setNewPackageForm({...newPackageForm, free_period: parseInt(e.target.value) || 12})}
                      placeholder="12" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="included_services">포함 서비스</Label>
                  <Textarea 
                    id="included_services" 
                    value={newPackageForm.included_services}
                    onChange={(e) => setNewPackageForm({...newPackageForm, included_services: e.target.value})}
                    placeholder="출장 무료설치, 배달앱 등록 대행 등" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="package_description">패키지 설명</Label>
                  <Textarea 
                    id="package_description" 
                    value={newPackageForm.description}
                    onChange={(e) => setNewPackageForm({...newPackageForm, description: e.target.value})}
                    placeholder="패키지에 대한 설명을 입력하세요" 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="package_active" 
                    checked={newPackageForm.active}
                    onCheckedChange={(checked) => setNewPackageForm({...newPackageForm, active: checked})}
                  />
                  <Label htmlFor="package_active">활성화</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewPackageOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleAddPackage}>패키지 추가</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 탭 구조 */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">상품 관리</TabsTrigger>
          <TabsTrigger value="packages">패키지 관리</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">전체 상품</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">판매 중</p>
                    <p className="text-2xl font-bold">
                      {products.filter(p => p.available).length}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">활성</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">카테고리 수</p>
                    <p className="text-2xl font-bold">{categories.length}</p>
                  </div>
                  <div className="flex space-x-1">
                    {categories.slice(0, 3).map((cat, index) => (
                      <span key={index}>{getCategoryIcon(cat)}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">평균 요금</p>
                    <p className="text-2xl font-bold">
                      {Math.round(products.reduce((sum, p) => sum + p.monthly_fee, 0) / products.length || 0).toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">월</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 상품 목록 */}
          <Card>
            <CardHeader>
              <CardTitle>상품 목록</CardTitle>
              <CardDescription>등록된 모든 서비스 상품을 관리합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {/* 검색 및 기본 필터 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="상품명, 공급사로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="카테고리 필터" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 카테고리</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 고급 필터 및 정렬 */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-available"
                        checked={showAvailableOnly}
                        onCheckedChange={setShowAvailableOnly}
                      />
                      <Label htmlFor="show-available" className="text-sm">판매중만 표시</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Label className="text-sm font-medium">정렬:</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name_asc">상품명 ↑</SelectItem>
                        <SelectItem value="name_desc">상품명 ↓</SelectItem>
                        <SelectItem value="fee_asc">월요금 낮은순</SelectItem>
                        <SelectItem value="fee_desc">월요금 높은순</SelectItem>
                        <SelectItem value="created_desc">등록일 최신순</SelectItem>
                        <SelectItem value="created_asc">등록일 오래된순</SelectItem>
                        <SelectItem value="category">카테고리별</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 필터 결과 표시 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    총 {products.length}개 중 {filteredProducts.length}개 상품 표시
                    {categoryFilter !== 'all' && ` (${categoryFilter} 카테고리)`}
                    {!showAvailableOnly && ' (판매중지 포함)'}
                  </span>
                  <div className="flex space-x-2">
                    {searchTerm && (
                      <Badge variant="outline" className="bg-blue-50">
                        검색: "{searchTerm}"
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-1 hover:bg-red-100 rounded"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">상품 정보를 불러오는 중...</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="rounded"
                          />
                        </TableHead>
                        <TableHead className="w-[80px]">이미지</TableHead>
                        <TableHead>상품명</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>공급사</TableHead>
                        <TableHead>월 요금</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>등록일</TableHead>
                        <TableHead className="w-[120px]">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts
                        .filter(product => showDeleted ? !product.available : product.available)
                        .map((product) => (
                        <TableRow key={product.product_id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.product_id)}
                              onChange={(e) => handleSelectProduct(product.product_id, e.target.checked)}
                              className="rounded"
                            />
                          </TableCell>
                          <TableCell>
                            {product.image_url ? (
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getCategoryIcon(product.category)}
                              <div>
                                <div className={`font-medium ${!product.available ? 'text-gray-400 line-through' : ''}`}>
                                  {product.name}
                                </div>
                                {product.description && (
                                  <div className="text-sm text-gray-500">
                                    {product.description.slice(0, 50)}...
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>{product.provider || '-'}</TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {product.monthly_fee.toLocaleString()}원
                            </div>
                            {product.monthly_fee === 0 && (
                              <div className="text-sm text-green-600">무료</div>
                            )}
                          </TableCell>
                          <TableCell>{getAvailabilityBadge(product.available)}</TableCell>
                          <TableCell>
                            {new Date(product.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {product.available ? (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleCopyProduct(product)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteProducts([product.product_id])}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleRestoreProducts([product.product_id])}
                                >
                                  <RefreshCw className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
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
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          {/* 패키지 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">전체 패키지</p>
                    <p className="text-2xl font-bold">{packages.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">활성 패키지</p>
                    <p className="text-2xl font-bold">
                      {packages.filter(p => p.active).length}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">활성</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">평균 요금</p>
                    <p className="text-2xl font-bold">
                      {Math.round(packages.reduce((sum, p) => sum + p.monthly_fee, 0) / packages.length || 0).toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">월</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 패키지 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.package_id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </div>
                    <Badge variant={pkg.active ? "default" : "secondary"}>
                      {pkg.active ? "활성" : "비활성"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">월 요금</p>
                        <p className="text-lg font-bold">{pkg.monthly_fee.toLocaleString()}원</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">계약 기간</p>
                        <p className="text-lg font-bold">{pkg.contract_period}개월</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">무료 기간</p>
                        <p className="text-lg font-bold text-green-600">{pkg.free_period}개월</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">환급률</p>
                        <p className="text-lg font-bold">{pkg.closure_refund_rate}%</p>
                      </div>
                    </div>
                    {pkg.included_services && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">포함 서비스</p>
                        <p className="text-sm text-gray-700">{pkg.included_services}</p>
                      </div>
                    )}
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </Button>
                      <Button variant="outline" size="sm">
                        상품 구성 보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 상품 수정 다이얼로그 */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>상품 수정</DialogTitle>
            <DialogDescription>상품 정보를 수정합니다</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_product_name">상품명 *</Label>
                  <Input 
                    id="edit_product_name" 
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder="상품명을 입력하세요" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_category">카테고리 *</Label>
                  <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="인터넷">인터넷</SelectItem>
                      <SelectItem value="CCTV">CCTV</SelectItem>
                      <SelectItem value="POS">POS</SelectItem>
                      <SelectItem value="키오스크">키오스크</SelectItem>
                      <SelectItem value="보험">보험</SelectItem>
                      <SelectItem value="통신">통신</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_provider">공급사</Label>
                  <Input 
                    id="edit_provider" 
                    value={editingProduct.provider || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, provider: e.target.value})}
                    placeholder="예: KT, SK브로드밴드" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_monthly_fee">월 요금 (원)</Label>
                  <Input 
                    id="edit_monthly_fee" 
                    type="number" 
                    value={editingProduct.monthly_fee}
                    onChange={(e) => setEditingProduct({...editingProduct, monthly_fee: parseInt(e.target.value) || 0})}
                    placeholder="0" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_description">상품 설명</Label>
                <Textarea 
                  id="edit_description" 
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  placeholder="상품에 대한 설명을 입력하세요" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_product_image">상품 이미지</Label>
                <div className="flex items-center gap-4">
                  {editingProduct.image_url && (
                    <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                      <img 
                        src={editingProduct.image_url} 
                        alt="상품 이미지" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditingProduct({...editingProduct, image_url: null})}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="edit_product_image"
                      type="file"
                      accept="image/*"
                      onChange={handleEditProductImageUpload}
                      disabled={uploadingImage}
                      className="cursor-pointer"
                    />
                    {uploadingImage && (
                      <p className="text-sm text-gray-500 mt-1">업로드 중...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit_available" 
                  checked={editingProduct.available}
                  onCheckedChange={(checked) => setEditingProduct({...editingProduct, available: checked})}
                />
                <Label htmlFor="edit_available">판매 가능</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateProduct}>수정 완료</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}