"use client"

import { Check, Star, Crown } from "lucide-react"

export type PackageType = "mini" | "standard" | "pro"

interface PackageSelectorProps {
  selected: PackageType
  onSelect: (type: PackageType) => void
}

const packages = [
  {
    id: "mini" as PackageType,
    name: "스타트케어 패키지 미니",
    description: "기본 필수 서비스",
    icon: Check,
    color: "from-blue-400 to-blue-600",
    monthlyFee: "45,000원",
    yearlyFee: "540,000원",
    features: ["갤럭시탭", "토스 프론트", "KT AI CCTV 1대", "매장 인터넷전화", "100M 인터넷"],
    available: true,
  },
  {
    id: "standard" as PackageType,
    name: "스타트케어 패키지",
    description: "1년 무료 체험단 EVENT",
    icon: Star,
    color: "from-green-400 to-green-600",
    monthlyFee: "78,000원",
    yearlyFee: "936,000원",
    features: ["갤럭시탭+토스터미널", "토스프론트", "KT AI CCTV 4대", "SK 기가라이트 500M", "한화시큐리티보험"],
    available: true,
    badge: "인기",
  },
  {
    id: "pro" as PackageType,
    name: "스타트케어 패키지 PRO",
    description: "올인원 프리미엄 패키지",
    icon: Crown,
    color: "from-purple-400 to-purple-600",
    monthlyFee: "94,500원",
    yearlyFee: "1,134,000원",
    features: ["갤럭시탭+토스터미널", "토스프론트", "KT AI CCTV 6대", "SK 기가 1G", "삼탠바이미", "한화시큐리티보험 1000"],
    available: true,
    badge: "추천",
  },
]

export function PackageSelector({ selected, onSelect }: PackageSelectorProps) {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const Icon = pkg.icon
          const isSelected = selected === pkg.id

          return (
            <button
              key={pkg.id}
              onClick={() => onSelect(pkg.id)}
              className={`
                relative group text-left
                transition-all duration-300
                ${isSelected ? "scale-105" : "hover:scale-102"}
              `}
            >
              <div
                className={`
                  relative overflow-hidden rounded-3xl p-8 h-full
                  transition-all duration-300
                  ${isSelected 
                    ? "bg-gradient-to-br " + pkg.color + " shadow-2xl text-white" 
                    : "bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg text-gray-900"
                  }
                `}
              >
                {pkg.badge && (
                  <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full
                    ${isSelected ? "bg-white/20 text-white" : "bg-gradient-to-r " + pkg.color + " text-white"}
                  `}>
                    {pkg.badge}
                  </span>
                )}

                <div className="flex items-start gap-4 mb-6">
                  <div className={`
                    p-3 rounded-2xl
                    ${isSelected ? "bg-white/20" : "bg-gray-100"}
                  `}>
                    <Icon className={`
                      w-6 h-6
                      ${isSelected ? "text-white" : "text-gray-600"}
                    `} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-2">
                      {pkg.name}
                    </h3>
                    <p className={`text-sm mb-4 ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                      {pkg.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{pkg.monthlyFee}</span>
                    <span className={`text-sm ${isSelected ? "text-white/70" : "text-gray-500"}`}>/월</span>
                  </div>
                  <div className={`text-sm ${isSelected ? "text-white/70" : "text-gray-500"}`}>
                    연간: {pkg.yearlyFee}
                  </div>
                </div>

                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 ${isSelected ? "text-white" : "text-green-500"}`} />
                      <span className={`text-sm ${isSelected ? "text-white/90" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div className="absolute bottom-4 right-4">
                    <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
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
