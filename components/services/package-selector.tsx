"use client"

import { PackageType } from "@/app/services/page"
import { Check, Star, Crown } from "lucide-react"

interface PackageSelectorProps {
  selected: PackageType
  onSelect: (type: PackageType) => void
}

const packages = [
  {
    id: "basic" as PackageType,
    name: "베이직",
    description: "필수 서비스",
    icon: Check,
    color: "from-gray-400 to-gray-600",
    available: true,
  },
  {
    id: "pro" as PackageType,
    name: "프로",
    description: "추천 패키지",
    icon: Star,
    color: "from-blue-400 to-blue-600",
    available: false,
    badge: "Coming Soon",
  },
  {
    id: "premium" as PackageType,
    name: "프리미엄",
    description: "올인원 패키지",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    available: false,
    badge: "Coming Soon",
  },
]

export function PackageSelector({ selected, onSelect }: PackageSelectorProps) {
  return (
    <div className="py-6">
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {packages.map((pkg) => {
          const Icon = pkg.icon
          const isSelected = selected === pkg.id

          return (
            <button
              key={pkg.id}
              onClick={() => pkg.available && onSelect(pkg.id)}
              disabled={!pkg.available}
              className={`
                relative flex-shrink-0 group
                ${pkg.available ? "cursor-pointer" : "cursor-not-allowed opacity-60"}
              `}
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl p-6 pr-12 transition-all duration-300
                  ${isSelected 
                    ? "bg-gradient-to-br " + pkg.color + " shadow-lg scale-105" 
                    : "bg-white border-2 border-gray-200 hover:border-gray-300"
                  }
                  ${pkg.available && !isSelected ? "hover:shadow-md" : ""}
                `}
              >
                {pkg.badge && (
                  <span className="absolute top-2 right-2 px-2 py-1 text-[10px] font-medium bg-black/20 text-white rounded-full">
                    {pkg.badge}
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className={`
                    p-2 rounded-xl
                    ${isSelected ? "bg-white/20" : "bg-gray-100"}
                  `}>
                    <Icon className={`
                      w-5 h-5
                      ${isSelected ? "text-white" : "text-gray-600"}
                    `} />
                  </div>

                  <div className="text-left">
                    <h3 className={`
                      font-semibold text-lg mb-1
                      ${isSelected ? "text-white" : "text-gray-900"}
                    `}>
                      {pkg.name}
                    </h3>
                    <p className={`
                      text-sm
                      ${isSelected ? "text-white/80" : "text-gray-500"}
                    `}>
                      {pkg.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute bottom-2 right-2">
                    <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}