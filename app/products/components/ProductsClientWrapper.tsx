'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'

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
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)

  // Update filtered products when category changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(initialProducts)
    } else {
      setFilteredProducts(initialProducts.filter(p => p.category === selectedCategory))
    }
  }, [selectedCategory, initialProducts])

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
      {/* 카테고리 필터 */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        productCounts={productCounts}
      />

      {/* 제품 그리드 */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory === 'all' ? '전체 제품' : selectedCategory}
          </h2>
          <p className="text-gray-600">
            {filteredProducts.length}개 제품
          </p>
        </div>

        <ProductGrid
          products={filteredProducts}
          selectedCategory={selectedCategory}
          onResetCategory={() => handleCategoryChange('all')}
        />
      </section>
    </>
  )
}