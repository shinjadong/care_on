"use client"

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

const businessTypes = [
  { id: "전체", label: "전체" },
  { id: "카페/음식점", label: "카페/음식점" },
  { id: "IT/스타트업", label: "IT/스타트업" },
  { id: "온라인 쇼핑몰", label: "온라인 쇼핑몰" },
  { id: "헬스/뷰티", label: "헬스/뷰티" },
  { id: "학원/교육", label: "학원/교육" },
  { id: "프랜차이즈", label: "프랜차이즈" },
  { id: "제조/배달", label: "제조/배달" },
  { id: "숙박/펜션", label: "숙박/펜션" },
  { id: "기타", label: "기타" }
]

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">업종별 후기보기</h3>
      {/* 업종 탭 목록 */}
      <div className="flex flex-wrap gap-2">
        {businessTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onCategoryChange(type.id)}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium
              transition-all duration-200
              ${selectedCategory === type.id
                ? 'bg-[#148777] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }
            `}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  )
}
