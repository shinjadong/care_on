'use client'

import React from 'react'
import ProductCard from './ProductCard'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  inStock: boolean
  provider?: string | null
  maxDiscountRate?: number
  discountTiers?: any[]
}

interface ProductGridProps {
  products: Product[]
  onResetCategory: () => void
}

export default function ProductGrid({
  products,
  onResetCategory
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          제품이 없습니다
        </h3>
        <p className="text-gray-500">
          선택한 카테고리에 제품이 없습니다.
        </p>
        <Button
          onClick={onResetCategory}
          className="mt-4"
          variant="outline"
        >
          전체 제품 보기
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}