'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface ProductCardProps {
  product: {
    id: string
    name: string
    category: string
    price: number
    description: string
    inStock: boolean
    provider?: string | null
    maxDiscountRate?: number
    discountTiers?: any[]
    imageUrl?: string | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const getProductGradient = (category: string) => {
    // Use category to determine gradient since IDs are now UUIDs
    switch (category) {
      case '종합솔루션': return 'from-purple-600 to-purple-400'
      case '보안': return 'from-blue-600 to-blue-400'
      case '결제': return 'from-green-600 to-green-400'
      case '계약관리': return 'from-indigo-600 to-indigo-400'
      case '마케팅': return 'from-orange-600 to-orange-400'
      case '컨설팅': return 'from-teal-600 to-teal-400'
      case '운영관리': return 'from-pink-600 to-pink-400'
      case '인사관리': return 'from-yellow-600 to-yellow-400'
      case '배달': return 'from-red-600 to-red-400'
      case '회계': return 'from-cyan-600 to-cyan-400'
      case '예약관리': return 'from-emerald-600 to-emerald-400'
      default: return 'from-gray-600 to-gray-400'
    }
  }

  return (
    <div className="product-card-hover">
      <Card className="group relative h-full overflow-hidden border-gray-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-2">
        {/* 할인 뱃지 */}
        {product.maxDiscountRate && product.maxDiscountRate > 0 && (
          <div className="absolute left-4 top-4 z-10">
            <Badge className="bg-red-500 text-white">
              <TrendingDown className="mr-1 h-3 w-3" />
              최대 {product.maxDiscountRate}% 할인
            </Badge>
          </div>
        )}

        {/* 이미지 영역 */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className={`p-6 bg-gradient-to-r ${getProductGradient(product.category)} rounded-full`}>
                <Package className="h-16 w-16 text-white" />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* 카테고리 */}
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-purple-600">
            {product.category}
          </p>

          {/* 제품명 */}
          <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-purple-600">
            {product.name}
          </h3>

          {/* 제공업체 */}
          {product.provider && (
            <p className="mb-3 text-xs text-gray-500">
              제공: {product.provider}
            </p>
          )}

          {/* 설명 */}
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>

          {/* 할인 조건 태그 */}
          {product.discountTiers && product.discountTiers.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1">
              {product.discountTiers.slice(0, 2).map((tier: any, idx: number) => (
                <span
                  key={idx}
                  className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
                >
                  {tier.condition}: {tier.rate}% 할인
                </span>
              ))}
            </div>
          )}

          {/* 가격 */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₩{formatPrice(product.price)}
                </span>
              </div>
              <p className="text-xs text-gray-500">월 구독료</p>
            </div>

            {/* 이용 상태 */}
            <span className={`text-xs font-medium ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock ? '이용 가능' : '품절'}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Link href={`/products/${product.id}`} className="w-full">
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={!product.inStock}
            >
              {product.inStock ? '자세히 보기' : '품절'}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
