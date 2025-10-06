'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Grid3X3, List, ShoppingCart } from 'lucide-react'
import FlipProductCard from '@/components/products/FlipProductCard'
import ShoppingCartComponent from '@/components/cart/ShoppingCart'
import { useCartStore } from '@/lib/store/cart-store'

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  inStock: boolean
  provider: string | null
  maxDiscountRate: number
  discountTiers: any[]
  imageUrl?: string
}

interface Category {
  id: string
  name: string
  display_order: number
}

interface ProductsClientWrapperProps {
  initialProducts: Product[]
  categories: Category[]
  productCounts: { [key: string]: number }
  initialCategory: string
}

export default function ProductsClientWrapper({
  initialProducts,
  categories,
  productCounts,
  initialCategory
}: ProductsClientWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name_asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // 카테고리별 features 생성
  const generateFeatures = (category: string): string[] => {
    const featuresMap: Record<string, string[]> = {
      'POS': [
        '실시간 매출 관리',
        '재고 관리 시스템',
        '멀티 결제 지원',
        '클라우드 백업',
      ],
      'KIOSK': [
        '터치스크린 주문',
        '다국어 지원',
        '실시간 메뉴 업데이트',
        '결제 시스템 연동',
      ],
      '네트워크/인터넷': [
        '고속 인터넷 제공',
        '안정적인 연결',
        '24시간 고객 지원',
        '무료 설치 서비스',
      ],
      '보안/CCTV': [
        'HD 화질 녹화',
        '실시간 모니터링',
        '모션 감지 알림',
        '클라우드 저장',
      ],
      '음악/사운드': [
        '저작권 걱정 없는 BGM',
        '업종별 맞춤 플레이리스트',
        '음량 자동 조절',
        '광고 없는 스트리밍',
      ],
      '프린터/부가장비': [
        '고속 인쇄',
        '무선 연결 지원',
        '자동 용지 감지',
        '에너지 절약 모드',
      ],
      'TV/디스플레이': [
        '4K UHD 지원',
        '다양한 입력 포트',
        '원격 관리 가능',
        '디지털 사이니지 기능',
      ],
    }
    return featuresMap[category] || ['전문적인 서비스 제공', '안정적인 운영 지원', '고객 만족도 향상']
  }

  // 카테고리별 benefits 생성
  const generateBenefits = (category: string): string[] => {
    const benefitsMap: Record<string, string[]> = {
      'POS': [
        '매출 증대 효과',
        '운영 효율성 개선',
        '고객 데이터 분석',
      ],
      'KIOSK': [
        '인건비 절감',
        '주문 오류 감소',
        '대기 시간 단축',
      ],
      '네트워크/인터넷': [
        '업무 생산성 향상',
        '고객 Wi-Fi 제공',
        '온라인 마케팅 가능',
      ],
      '보안/CCTV': [
        '도난 방지',
        '직원 관리',
        '보험료 할인',
      ],
      '음악/사운드': [
        '매장 분위기 개선',
        '고객 체류 시간 증가',
        '브랜드 이미지 향상',
      ],
      '프린터/부가장비': [
        '업무 효율 증대',
        '문서 관리 편의',
        '비용 절감',
      ],
      'TV/디스플레이': [
        '홍보 효과 극대화',
        '고객 관심 유도',
        '정보 전달 효율',
      ],
    }
    return benefitsMap[category] || ['비즈니스 성장 지원', '운영 비용 절감', '경쟁력 강화']
  }

  // Product 형식 변환
  const products = initialProducts.map(p => ({
    product_id: p.id,
    name: p.name,
    category: p.category,
    provider: p.provider,
    monthly_fee: p.price,
    description: p.description || null,
    available: p.inStock,
    closure_refund_rate: p.maxDiscountRate || 0,
    image_url: p.imageUrl || null,
    features: generateFeatures(p.category),
    benefits: generateBenefits(p.category),
  }))

  // 필터링 및 정렬
  const filteredProducts = products
    .filter(product => {
      if (!product.available) return false

      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'price_asc':
          return a.monthly_fee - b.monthly_fee
        case 'price_desc':
          return b.monthly_fee - a.monthly_fee
        default:
          return 0
      }
    })

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)

    // Update URL with new category
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    const queryString = params.toString()
    router.push(queryString ? `?${queryString}` : '/products')
  }

  return (
    <>
      {/* 필터 바 */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* 모바일: 세로 정렬, 데스크톱: 가로 정렬 */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* 검색 및 필터 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                <div className="relative flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="상품명, 공급사로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="카테고리" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      전체 ({productCounts['all'] || 0})
                    </SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name} ({productCounts[category.name] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="정렬" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name_asc">이름 (가-하)</SelectItem>
                    <SelectItem value="name_desc">이름 (하-가)</SelectItem>
                    <SelectItem value="price_asc">가격 낮은순</SelectItem>
                    <SelectItem value="price_desc">가격 높은순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 뷰 모드 버튼 - 모바일에서 숨김 */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 size={18} />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </Button>
              </div>
            </div>

            {/* 결과 표시 */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>총 {filteredProducts.length}개 상품</span>
              {searchTerm && (
                <Badge variant="secondary">
                  "{searchTerm}" 검색 결과
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 제품 목록 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
            <ShoppingCart size={64} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="text-sm mt-2">다른 검색어를 입력해보세요</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <FlipProductCard key={product.product_id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.product_id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-24 h-24 object-contain rounded-lg border"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                          <ShoppingCart size={32} className="text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <Badge variant="secondary" className="mt-1">
                          {product.category}
                        </Badge>
                        {product.provider && (
                          <p className="text-sm text-gray-600 mt-1">{product.provider}</p>
                        )}
                        {product.description && (
                          <p className="text-sm text-gray-700 mt-2">{product.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <p className="text-2xl font-bold text-primary">
                      {product.monthly_fee.toLocaleString()}원
                      <span className="text-sm font-normal text-gray-600">/월</span>
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => {
                        useCartStore.getState().addItem({
                          product_id: product.product_id,
                          name: product.name,
                          category: product.category,
                          provider: product.provider,
                          monthly_fee: product.monthly_fee,
                          image_url: product.image_url,
                        })
                      }}
                    >
                      장바구니 담기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 장바구니 플로팅 버튼 */}
      <ShoppingCartComponent />
    </>
  )
}