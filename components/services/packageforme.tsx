"use client"

import { useState } from "react"

export type PackageType = "mini" | "standard" | "pro"

interface PackageForMeProps {
  selected: PackageType
  onSelect: (type: PackageType) => void
}

// 케어온 서비스 적용 가능한 업종들 (Apple Music과 정확히 일치하는 미니멀 아이콘)
const businessTypes = [
  {
    id: "cafe",
    name: "카페",
    description: "커피숍, 디저트카페",
    icon: "☕",
    recommendedPackage: "standard" as PackageType,
  },
  {
    id: "restaurant", 
    name: "음식점",
    description: "한식, 양식, 중식, 일식",
    icon: "🍽️",
    recommendedPackage: "standard" as PackageType,
  },
  {
    id: "beauty",
    name: "헤어샵",
    description: "헤어, 네일, 뷰티샵",
    icon: "✂️",
    recommendedPackage: "pro" as PackageType,
  },
  {
    id: "nailshop",
    name: "네일/왁싱/뷰티샵", 
    description: "네일아트, 왁싱, 피부관리",
    icon: "💄",
    recommendedPackage: "pro" as PackageType,
  },
  {
    id: "convenience",
    name: "편의점",
    description: "편의점, 마트, 슈퍼",
    icon: "🏪",
    recommendedPackage: "standard" as PackageType,
  },
  {
    id: "unmanned",
    name: "무인매장",
    description: "무인카페, 무인편의점", 
    icon: "🤖",
    recommendedPackage: "pro" as PackageType,
  },
  {
    id: "academy",
    name: "학원",
    description: "학습 공간, 교육시설",
    icon: "🎓",
    recommendedPackage: "mini" as PackageType,
    additionalInfo: {
      text: "호환되는 차량 찾기"
    }
  },
  {
    id: "factory",
    name: "공장",
    description: "제조업, 공장시설",
    icon: "🏭",
    recommendedPackage: "pro" as PackageType,
    additionalInfo: {
      text: "Google Play에서",
      linkText: "다운로드하기"
    }
  },
  {
    id: "retail",
    name: "유통업",
    description: "소매업, 도매업",
    icon: "🖥️",
    recommendedPackage: "standard" as PackageType,
    additionalInfo: {
      text: "Microsoft Store에서", 
      linkText: "다운로드하기"
    }
  },
]

// 파트너사 로고 (Apple Music devices-other 섹션)
const partners = [
  { name: "PlayStation", logo: "🎮" },
  { name: "XBOX", logo: "🎮" },
  { name: "Roku", logo: "📺" },
  { name: "SAMSUNG", logo: "📱" },
  { name: "LG SMART TV", logo: "📺" },
  { name: "alexa", logo: "🗣️" },
  { name: "SONOS", logo: "🔊" },
  { name: "Google Nest", logo: "🏠" },
  { name: "Microsoft", logo: "🪟" },
]

export function PackageForMe({ selected, onSelect }: PackageForMeProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null)

  const handleBusinessSelect = (businessId: string) => {
    setSelectedBusiness(selectedBusiness === businessId ? null : businessId)
    const business = businessTypes.find(b => b.id === businessId)
    if (business && selectedBusiness !== businessId) {
      onSelect(business.recommendedPackage)
    }
  }

  return (
    <section className="section section-devices" data-analytics-section-engagement="name:packages">
      <div className="section-content">
        <div className="devices-apple">
          <div className="devices-intro column large-centered large-9 medium-11">
            <h2 className="devices-headline typography-section-headline">
              케어온의 패키지는<br className="large" /><br className="medium" />
              <span className="text-gradient">모든 업종에 맞춤 세팅할 수 있습니다.</span>
            </h2>
          </div>
          
          {/* Business Types Selection - Apple Music Style */}
          <ul className="devices-item-container" role="list">
            {businessTypes.slice(0, 6).map((business) => (
              <li 
                key={business.id}
                className={`devices-item devices-item-alt2024 device-${business.id} ${
                  selectedBusiness === business.id ? 'selected' : ''
                }`}
                role="listitem"
                onClick={() => handleBusinessSelect(business.id)}
              >
                <div className="devices-item-icon">
                  <span className="text-3xl">{business.icon}</span>
                </div>
                <p className="devices-item-name typography-device-item-name">
                  {business.name}
                </p>
                {business.additionalInfo && (
                  <p className="devices-item-copy typography-device-item-copy">
                    <a href="#" className="icon-wrapper">
                      <span className="icon-copy">
                        {business.additionalInfo.text}
                        {business.additionalInfo.linkText && <><br/>{business.additionalInfo.linkText}</>}
                      </span>
                      <span className="icon icon-after icon-external"></span>
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Partner Companies Section - Apple Music devices-other */}
        <div className="devices-other">
          <div className="devices-intro column large-centered large-8 small-12">
            <h3 className="devices-headline typography-eyebrow-super">
              신뢰의 다른 이름,<br className="medium" /><br className="small" />
              케어온과 함께하는 파트너사
            </h3>
            <p className="typography-device-item-copy">
              <a href="#setup" className="icon-wrapper">
                <span className="icon-copy">기기 설정하기</span>
                <span className="icon icon-after more"></span>
              </a>
            </p>
          </div>
          
          {/* Partner Companies Grid */}
          <ul className="devices-item-container devices-item-container-alt" role="list">
            {partners.map((partner, index) => (
              <li 
                key={index}
                className="devices-item device-partner-alt devices-item-alt" 
                role="listitem"
              >
                <div className="devices-item-icon partner-logo">
                  <span className="text-2xl">{partner.logo}</span>
                </div>
                <p className="devices-item-name typography-device-item-name text-xs">
                  {partner.name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}