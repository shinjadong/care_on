'use client'

import React from 'react'
import {
  Package,
  Briefcase,
  Shield,
  CreditCard,
  FileCheck,
  TrendingUp,
  Users,
  Settings,
  ShoppingCart,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: React.ElementType
}

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  productCounts?: { [key: string]: number }
}

const categories: Category[] = [
  { id: 'all', name: '전체', icon: Package },
  { id: '종합솔루션', name: '종합솔루션', icon: Briefcase },
  { id: '보안', name: '보안', icon: Shield },
  { id: '결제', name: '결제', icon: CreditCard },
  { id: '계약관리', name: '계약관리', icon: FileCheck },
  { id: '마케팅', name: '마케팅', icon: TrendingUp },
  { id: '컨설팅', name: '컨설팅', icon: Users },
  { id: '운영', name: '운영', icon: Settings },
  { id: '인사', name: '인사', icon: Users },
  { id: '주문', name: '주문', icon: ShoppingCart }
]

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  productCounts
}: CategoryFilterProps) {
  return (
    <section className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const count = productCounts?.[category.id]

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
                {count !== undefined && count > 0 && category.id !== 'all' && (
                  <span className="ml-1 text-xs">
                    ({count})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}