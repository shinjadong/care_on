"use client"

import { useState } from "react"
import { Tv, Play, Film, Mic, CheckCircle, ArrowLeft, Monitor } from "lucide-react"
import Link from "next/link"

export default function TVPage() {
  const [activeTab, setActiveTab] = useState("channels")

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 ios-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/services" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>서비스</span>
            </Link>
            <button className="px-4 py-2 bg-brand text-white font-medium rounded-xl hover:bg-brand/90 transition-colors">
              신청하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-700/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
                <Tv className="w-4 h-4" />
                프리미엄 엔터테인먼트
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                스마트 TV
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                200여개 채널과 OTT 서비스를 하나로.
                4K 화질과 음성인식으로 즐기는
                차세대 TV 경험을 만나보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-colors">
                  채널 가이드 보기
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  미리보기
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-red-400 to-red-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <Tv className="w-32 h-32 text-white/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">화질</p>
                    <p className="text-lg font-bold">4K UHD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-12 overflow-x-auto">
          {["channels", "features", "pricing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 px-4 py-3 font-medium rounded-lg transition-all whitespace-nowrap
                ${activeTab === tab 
                  ? "bg-white text-brand shadow-sm" 
                  : "text-gray-600 hover:text-gray-900"
                }
              `}
            >
              {tab === "channels" && "채널 구성"}
              {tab === "features" && "주요 기능"}
              {tab === "pricing" && "요금제"}
            </button>
          ))}
        </div>

        {/* Channels Content */}
        {activeTab === "channels" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  category: "지상파 & 종합편성",
                  count: "20+",
                  channels: ["KBS", "MBC", "SBS", "EBS", "JTBC", "TV조선", "채널A", "MBN"],
                  color: "from-blue-400 to-blue-600"
                },
                {
                  category: "영화 & 드라마",
                  count: "30+",
                  channels: ["OCN", "tvN", "CGV", "스크린", "드라맥스", "중화TV", "AXN", "FOX"],
                  color: "from-purple-400 to-purple-600"
                },
                {
                  category: "스포츠 & 뉴스",
                  count: "25+",
                  channels: ["SPOTV", "SBS Sports", "KBS N", "YTN", "연합뉴스", "MBC Sports", "JTBC Golf", "SBS Golf"],
                  color: "from-green-400 to-green-600"
                },
                {
                  category: "키즈 & 교육",
                  count: "20+",
                  channels: ["디즈니", "카툰네트워크", "애니맥스", "투니버스", "JEI재능TV", "대교어린이", "EBS Kids", "니켈로디언"],
                  color: "from-yellow-400 to-yellow-600"
                },
                {
                  category: "음악 & 예능",
                  count: "15+",
                  channels: ["Mnet", "SBS MTV", "MBC Music", "아리랑TV", "KBS Joy", "MBC Every1", "코미디TV", "E채널"],
                  color: "from-pink-400 to-pink-600"
                },
                {
                  category: "OTT 통합",
                  count: "5+",
                  channels: ["Netflix", "Disney+", "Wavve", "Tving", "Watcha"],
                  color: "from-red-400 to-red-600"
                }
              ].map((category, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${category.color}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                      <span className="text-sm font-medium text-gray-500">{category.count} 채널</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.channels.slice(0, 6).map((channel, j) => (
                        <span key={j} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                          {channel}
                        </span>
                      ))}
                      {category.channels.length > 6 && (
                        <span className="px-2 py-1 text-xs text-gray-500">
                          +{category.channels.length - 6}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Content */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Monitor,
                title: "4K UHD 화질",
                description: "선명한 4K 초고화질로 생생한 화면을 경험하세요"
              },
              {
                icon: Mic,
                title: "AI 음성인식",
                description: "리모컨 없이 음성으로 채널 변경과 검색이 가능합니다"
              },
              {
                icon: Film,
                title: "OTT 통합",
                description: "Netflix, Disney+ 등 인기 OTT를 하나의 플랫폼에서"
              },
              {
                icon: Play,
                title: "시간이동 & 다시보기",
                description: "놓친 프로그램도 7일간 다시보기로 언제든 시청"
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pricing Content */}
        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "라이트",
                price: "14,900",
                channels: "100+",
                features: ["기본 100채널", "HD 화질", "모바일 시청", "다시보기 3일"],
                recommended: false
              },
              {
                name: "스탠다드",
                price: "24,900",
                channels: "200+",
                features: ["프리미엄 200채널", "4K 화질", "OTT 2개 포함", "다시보기 7일", "음성인식"],
                recommended: true
              },
              {
                name: "프리미엄",
                price: "34,900",
                channels: "250+",
                features: ["전체 250채널", "4K 화질", "OTT 5개 포함", "다시보기 30일", "음성인식", "멀티뷰"],
                recommended: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`
                  relative rounded-2xl p-6 border-2 transition-all
                  ${plan.recommended 
                    ? "border-brand bg-brand/5 scale-105" 
                    : "border-gray-200 bg-white"
                  }
                `}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-brand text-white text-xs font-medium rounded-full">
                      인기
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.channels} 채널</p>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">원/월</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`
                  w-full py-3 font-medium rounded-xl transition-colors
                  ${plan.recommended 
                    ? "bg-brand text-white hover:bg-brand/90" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}>
                  선택하기
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}