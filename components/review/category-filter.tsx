"use client"

import { useState, useEffect } from "react"

interface ReviewFiltersProps {
  selectedCategory: string
  selectedBusiness: string
  onCategoryChange: (category: string) => void
  onBusinessChange: (business: string) => void
}

interface FilterOption {
  id: string
  label: string
  count?: number
}

export function ReviewFilters({ 
  selectedCategory, 
  selectedBusiness, 
  onCategoryChange, 
  onBusinessChange 
}: ReviewFiltersProps) {
  const [categories, setCategories] = useState<FilterOption[]>([])
  const [businesses, setBusinesses] = useState<FilterOption[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/reviews/filters')
        if (response.ok) {
          const data = await response.json()
          
          // 서비스 카테고리 설정
          const categoriesWithAll = [
            { id: "전체", label: "전체 서비스", count: data.totalCount },
            ...data.categories.map((cat: any) => ({
              id: cat.category,
              label: cat.category,
              count: cat.count
            }))
          ]
          setCategories(categoriesWithAll)

          // 업종 설정
          const businessesWithAll = [
            { id: "전체", label: "전체 업종", count: data.totalCount },
            ...data.businesses.map((bus: any) => ({
              id: bus.business,
              label: bus.business,
              count: bus.count
            }))
          ]
          setBusinesses(businessesWithAll)
        } else {
          // 기본값 설정
          setCategories([
            { id: "전체", label: "전체 서비스" },
            { id: "CCTV", label: "CCTV" },
            { id: "인터넷", label: "인터넷" },
            { id: "TV", label: "TV" }
          ])
          setBusinesses([
            { id: "전체", label: "전체 업종" },
            { id: "카페/음식점", label: "카페/음식점" },
            { id: "IT/스타트업", label: "IT/스타트업" },
            { id: "온라인 쇼핑몰", label: "온라인 쇼핑몰" }
          ])
        }
      } catch (error) {
        console.error('Error fetching filters:', error)
        setCategories([{ id: "전체", label: "전체 서비스" }])
        setBusinesses([{ id: "전체", label: "전체 업종" }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFilters()
  }, [])

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex gap-4">
          <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 서비스 종류 필터 */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900 mb-2">서비스 종류</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#148777] focus:ring-[#148777] focus:ring-1 bg-white"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label} {category.count ? `(${category.count})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 업종 필터 */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-900 mb-2">업종</label>
          <select
            value={selectedBusiness}
            onChange={(e) => onBusinessChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#148777] focus:ring-[#148777] focus:ring-1 bg-white"
          >
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.label} {business.count ? `(${business.count})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
