import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import {
  Shield,
  Wifi,
  Camera,
  Package,
  Phone,
  Monitor
} from 'lucide-react'

// Clean Architecture: Use Cases
import { GetProductByIdUseCase } from '@/lib/application/product'
import { PrismaProductRepository } from '@/lib/infrastructure/database/repositories/PrismaProductRepository'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

// 카테고리별 아이콘 매핑
const categoryIcons: { [key: string]: any } = {
  'CCTV': Camera,
  '인터넷': Wifi,
  '보험': Shield,
  'POS': Monitor,
  '키오스크': Monitor,
  '통신': Phone,
  '종합솔루션': Package
}

// 카테고리별 그라디언트 색상
const categoryColors: { [key: string]: string } = {
  'CCTV': 'from-blue-600 to-blue-400',
  '인터넷': 'from-purple-600 to-purple-400',
  '보험': 'from-green-600 to-green-400',
  'POS': 'from-orange-600 to-orange-400',
  '키오스크': 'from-pink-600 to-pink-400',
  '통신': 'from-indigo-600 to-indigo-400',
  '종합솔루션': 'from-teal-600 to-teal-400'
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  try {
    // Clean Architecture: Use Case execution
    const repository = new PrismaProductRepository(prisma)
    const getProductUseCase = new GetProductByIdUseCase(repository)
    const product = await getProductUseCase.execute(id)

    // DB 데이터를 UI에 맞게 변환
    const gradientColor = categoryColors[product.category] || 'from-gray-600 to-gray-400'

    // 할인율 계산 (maxDiscountRate 사용)
    const hasDiscount = product.maxDiscountRate > 0
    const discountedPrice = hasDiscount
      ? Math.round(product.monthlyFee * (1 - product.maxDiscountRate))
      : product.monthlyFee

    // 기본 features 생성 (description 기반)
    const features = product.description
      ? [product.description]
      : ['고품질 제품', '전문 설치 지원', '24/7 고객센터']

    // discountTiers에서 주요 기능 생성 (아이콘 이름만 전달)
    const keyFeatures = product.discountTiers && product.discountTiers.length > 0
      ? product.discountTiers.slice(0, 4).map((tier: any) => ({
          iconName: 'Shield',
          title: tier.condition || '특별 할인',
          description: `최대 ${(tier.rate * 100).toFixed(0)}% 할인 혜택`
        }))
      : [
          {
            iconName: 'Shield',
            title: '품질 보증',
            description: '검증된 고품질 제품'
          },
          {
            iconName: 'CreditCard',
            title: '간편 결제',
            description: '다양한 결제 수단 지원'
          }
        ]

    // 제품 사양 생성
    const specifications = [
      { label: '제공업체', value: product.provider || '케어온' },
      { label: '서비스 기간', value: '월 단위 구독' },
      { label: '설치 지원', value: '무료 방문 설치' },
      { label: '고객 지원', value: '24/7 고객센터' },
      ...(product.closureRefundRate > 0 ? [
        { label: '폐업 환급률', value: `${(product.closureRefundRate * 100).toFixed(0)}%` }
      ] : [])
    ]

    // 할인 배지 정보
    const badge = hasDiscount ? {
      text: `최대 ${(product.maxDiscountRate * 100).toFixed(0)}% 할인`,
      color: 'bg-red-500'
    } : null

    // 아이콘 이름 결정 (카테고리 기반)
    let productIconName = 'Package'
    if (categoryIcons[product.category]) {
      // 카테고리에 직접 매핑된 아이콘 이름 찾기
      const iconNames: { [key: string]: string } = {
        'CCTV': 'Camera',
        '인터넷': 'Wifi',
        '보험': 'Shield',
        'POS': 'Monitor',
        '키오스크': 'Monitor',
        '통신': 'Phone',
        '종합솔루션': 'Package'
      }
      productIconName = iconNames[product.category] || 'Package'
    }

    // 클라이언트 컴포넌트에 전달할 데이터 (Domain Entity → UI format)
    const productData = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: discountedPrice,
      originalPrice: hasDiscount ? product.monthlyFee : undefined,
      badge,
      rating: 4.5, // 기본값 (추후 리뷰 시스템 연동 시 변경)
      reviews: 0, // 기본값 (추후 리뷰 시스템 연동 시 변경)
      description: product.description || product.name,
      longDescription: product.description || `${product.name}은 ${product.provider || '케어온'}에서 제공하는 고품질 서비스입니다.`,
      inStock: product.available,
      features,
      keyFeatures,
      specifications,
      productIconName,
      gradientColor,
      provider: product.provider,
      maxDiscountRate: product.maxDiscountRate,
      discountTiers: product.discountTiers || [],
      imageUrl: product.imageUrl
    }

    return <ProductDetailClient product={productData} />
  } catch (error) {
    console.error('Failed to load product:', error)
    notFound()
  }
}
