"use client"

import { useState } from "react"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onSearchChange("")
  }

  return (
    <div className="w-full max-w-md">
      {/* 검색 입력창 */}
      <div className="relative">
        <div className={`
          relative flex items-center bg-white border rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-[#148777] shadow-md' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}>
          {/* 검색 아이콘 */}
          <div className="absolute left-3 text-gray-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>

          {/* 입력 필드 */}
          <input
            type="text"
            placeholder="후기 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-transparent outline-none placeholder-gray-400"
          />

          {/* 클리어 버튼 */}
          {searchTerm && (
            <button
              onClick={handleClear}
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
