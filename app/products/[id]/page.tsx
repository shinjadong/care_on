import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/supabase/products'
import ProductDetailClient from './ProductDetailClient'
import {
  Shield,
  CreditCard,
  Wifi,
  Camera,
  Package,
  Phone,
  Monitor
} from 'lucide-react'

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
  
  // Supabase에서 제품 데이터 가져오기
  const { data: product, error } = await getProductById(id)

  if (error || !product) {
    notFound()
  }

  // DB 데이터를 UI에 맞게 변환
  const ProductIcon = categoryIcons[product.category] || Package
  const gradientColor = categoryColors[product.category] || 'from-gray-600 to-gray-400'

  // 할인율 계산 (max_discount_rate 사용)
  const hasDiscount = product.max_discount_rate > 0
  const discountedPrice = hasDiscount 
    ? Math.round(product.monthly_fee * (1 - product.max_discount_rate / 100))
    : product.monthly_fee

  // 기본 features 생성 (description 기반)
  const features = product.description 
    ? [product.description]
    : ['고품질 제품', '전문 설치 지원', '24/7 고객센터']

  // discount_tiers에서 주요 기능 생성 (아이콘 이름만 전달)
  const keyFeatures = product.discount_tiers && product.discount_tiers.length > 0
    ? product.discount_tiers.slice(0, 4).map((tier: any) => ({
        iconName: 'Shield',
        title: tier.condition || '특별 할인',
        description: tier.description || `최대 ${tier.rate}% 할인 혜택`
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
    ...(product.closure_refund_rate > 0 ? [
      { label: '폐업 환급률', value: `${product.closure_refund_rate}%` }
    ] : [])
  ]

  // 할인 배지 정보
  const badge = hasDiscount ? {
    text: `최대 ${product.max_discount_rate}% 할인`,
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

  // 클라이언트 컴포넌트에 전달할 데이터 (아이콘 이름만 전달)
  const productData = {
    id: product.product_id,
    name: product.name,
    category: product.category,
    price: discountedPrice,
    originalPrice: hasDiscount ? product.monthly_fee : undefined,
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
    maxDiscountRate: product.max_discount_rate,
    discountTiers: product.discount_tiers,
    imageUrl: product.image_url
  }

  return <ProductDetailClient product={productData} />
}
