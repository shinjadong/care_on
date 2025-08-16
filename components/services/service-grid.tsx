"use client"

import { PackageType } from "@/app/services/page"
import { ServiceCard } from "./service-card"
import { Camera, Wifi, Shield, Tv, Phone, Home, Lock, Heart } from "lucide-react"

const services = {
  basic: [
    {
      id: "ai-cctv",
      title: "지능형 AI CCTV",
      subtitle: "24시간 스마트 보안",
      description: "인공지능이 실시간으로 이상 상황을 감지하고 즉시 알려드립니다",
      icon: Camera,
      color: "from-purple-500 to-purple-700",
      features: ["실시간 모니터링", "AI 이상감지", "클라우드 저장", "모바일 알림"],
      price: "월 29,900원",
      href: "/services/ai-cctv",
    },
    {
      id: "internet",
      title: "초고속 인터넷",
      subtitle: "기가급 속도",
      description: "끊김 없는 초고속 인터넷으로 스마트한 일상을 경험하세요",
      icon: Wifi,
      color: "from-blue-500 to-blue-700",
      features: ["최대 1Gbps", "무제한 사용", "24시간 A/S", "공유기 무료"],
      price: "월 39,900원",
      href: "/services/internet",
    },
    {
      id: "insurance",
      title: "화재·안전 보험",
      subtitle: "종합 안전보장",
      description: "화재, 도난, 상해까지 한번에 보장하는 종합 안전보험",
      icon: Shield,
      color: "from-green-500 to-green-700",
      features: ["화재보장 1억", "도난보장 500만", "상해보장", "즉시 보상"],
      price: "월 19,900원",
      href: "/services/insurance",
    },
    {
      id: "tv",
      title: "스마트 TV",
      subtitle: "프리미엄 채널",
      description: "200여개 채널과 OTT 서비스를 하나로 즐기세요",
      icon: Tv,
      color: "from-red-500 to-red-700",
      features: ["200+ 채널", "OTT 통합", "4K 화질", "음성인식"],
      price: "월 24,900원",
      href: "/services/tv",
    },
  ],
  pro: [
    {
      id: "phone",
      title: "스마트폰 요금제",
      subtitle: "무제한 데이터",
      description: "데이터 걱정 없는 진짜 무제한 요금제",
      icon: Phone,
      color: "from-indigo-500 to-indigo-700",
      features: ["무제한 데이터", "무제한 통화", "해외 로밍", "부가서비스"],
      price: "월 59,900원",
      href: "/services/phone",
    },
    {
      id: "smart-home",
      title: "스마트홈 시스템",
      subtitle: "IoT 통합 제어",
      description: "집안의 모든 기기를 하나로 연결하고 제어하세요",
      icon: Home,
      color: "from-teal-500 to-teal-700",
      features: ["음성제어", "자동화 시나리오", "에너지 절약", "원격제어"],
      price: "월 34,900원",
      href: "/services/smart-home",
    },
  ],
  premium: [
    {
      id: "security",
      title: "프리미엄 보안",
      subtitle: "출동 서비스",
      description: "24시간 보안요원 출동 서비스와 함께하는 완벽한 보안",
      icon: Lock,
      color: "from-gray-700 to-gray-900",
      features: ["24시간 출동", "경비원 순찰", "비상벨", "CCTV 연동"],
      price: "월 89,900원",
      href: "/services/security",
    },
    {
      id: "health",
      title: "헬스케어 서비스",
      subtitle: "건강 관리",
      description: "IoT 기기와 전문가 상담으로 건강을 지키세요",
      icon: Heart,
      color: "from-pink-500 to-pink-700",
      features: ["건강 모니터링", "전문의 상담", "응급 알림", "건강 리포트"],
      price: "월 49,900원",
      href: "/services/health",
    },
  ],
}

interface ServiceGridProps {
  selectedPackage: PackageType
}

export function ServiceGrid({ selectedPackage }: ServiceGridProps) {
  const currentServices = services[selectedPackage] || []
  const isComingSoon = selectedPackage !== "basic"

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {isComingSoon ? (
        <div className="text-center py-32">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            준비 중입니다
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {selectedPackage === "pro" ? "프로" : "프리미엄"} 패키지는 곧 출시 예정입니다.
            <br />
            더 나은 서비스로 찾아뵙겠습니다.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              베이직 패키지 서비스
            </h2>
            <p className="text-lg text-gray-600">
              생활 필수 서비스를 합리적인 가격으로 만나보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>

          <div className="mt-16 bg-gradient-to-br from-brand/5 to-brand/10 rounded-3xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              베이직 패키지 특별 혜택
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6">
                <div className="text-3xl font-bold text-brand mb-2">30%</div>
                <p className="text-gray-600">패키지 할인</p>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="text-3xl font-bold text-brand mb-2">무료</div>
                <p className="text-gray-600">설치 및 개통</p>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <div className="text-3xl font-bold text-brand mb-2">24시간</div>
                <p className="text-gray-600">고객 지원</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-brand text-white font-semibold rounded-2xl hover:bg-brand/90 transition-colors">
                패키지 신청하기
              </button>
              <button className="px-8 py-4 bg-white text-brand font-semibold rounded-2xl border-2 border-brand/20 hover:border-brand/40 transition-colors">
                상담 예약하기
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}