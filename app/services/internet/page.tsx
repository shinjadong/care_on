"use client"

import { useState } from "react"
import { Wifi, Zap, Globe, Router, CheckCircle, ArrowLeft, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function InternetPage() {
  const [activeTab, setActiveTab] = useState("features")

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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Wifi className="w-4 h-4" />
                기가 인터넷
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                초고속 인터넷
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                최대 1Gbps 속도로 끊김 없는 인터넷을 경험하세요.
                재택근무, 온라인 게임, 4K 스트리밍까지
                모든 것이 빨라집니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-colors">
                  속도 측정하기
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  요금 계산기
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <Wifi className="w-32 h-32 text-white/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">현재 속도</p>
                    <p className="text-lg font-bold">1,000 Mbps</p>
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
          {["features", "speeds", "pricing"].map((tab) => (
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
              {tab === "features" && "주요 특징"}
              {tab === "speeds" && "속도 비교"}
              {tab === "pricing" && "요금제"}
            </button>
          ))}
        </div>

        {/* Features Content */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Zap,
                title: "초고속 기가 인터넷",
                description: "최대 1Gbps 다운로드 속도로 대용량 파일도 순식간에 다운로드"
              },
              {
                icon: Router,
                title: "최신 WiFi 6 공유기",
                description: "더 많은 기기를 동시에 연결하고 더 빠른 속도를 경험하세요"
              },
              {
                icon: Globe,
                title: "무제한 데이터",
                description: "데이터 제한 없이 마음껏 사용하세요. 추가 요금 걱정 없습니다"
              },
              {
                icon: Wifi,
                title: "24시간 안정성",
                description: "99.9% 가동률 보장으로 언제나 안정적인 인터넷 서비스"
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
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

        {/* Speed Comparison */}
        {activeTab === "speeds" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">속도별 활용 예시</h3>
              <div className="space-y-4">
                {[
                  { speed: "100Mbps", activity: "HD 스트리밍 (2-3대)", time: "1GB 파일: 80초" },
                  { speed: "500Mbps", activity: "4K 스트리밍 (5-6대)", time: "1GB 파일: 16초" },
                  { speed: "1Gbps", activity: "8K 스트리밍 + 게임 + 재택근무", time: "1GB 파일: 8초" }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.speed}</p>
                      <p className="text-sm text-gray-600">{item.activity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Content */}
        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "라이트",
                speed: "100Mbps",
                price: "29,900",
                features: ["100Mbps 속도", "무제한 데이터", "기본 공유기", "설치비 무료"],
                recommended: false
              },
              {
                name: "스탠다드",
                speed: "500Mbps",
                price: "39,900",
                features: ["500Mbps 속도", "무제한 데이터", "WiFi 6 공유기", "설치비 무료", "스트리밍 최적화"],
                recommended: true
              },
              {
                name: "프리미엄",
                speed: "1Gbps",
                price: "49,900",
                features: ["1Gbps 속도", "무제한 데이터", "WiFi 6E 공유기", "설치비 무료", "게이밍 최적화", "우선 기술지원"],
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
                <p className="text-sm text-gray-500 mb-4">{plan.speed}</p>
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