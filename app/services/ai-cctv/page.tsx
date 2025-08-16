"use client"

import { useState } from "react"
import { Camera, Shield, Cloud, Smartphone, CheckCircle, ArrowLeft, Play } from "lucide-react"
import Link from "next/link"

export default function AICCTVPage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-700/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
                <Camera className="w-4 h-4" />
                AI 보안 솔루션
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                지능형 AI CCTV
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                인공지능이 24시간 당신의 공간을 지켜드립니다.
                실시간 이상 감지부터 스마트 알림까지,
                진정한 스마트 보안을 경험하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-colors">
                  무료 상담 신청
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  데모 영상 보기
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <Camera className="w-32 h-32 text-white/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">실시간 모니터링 중</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-12 overflow-x-auto">
          {["features", "specs", "pricing"].map((tab) => (
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
              {tab === "features" && "주요 기능"}
              {tab === "specs" && "제품 사양"}
              {tab === "pricing" && "요금제"}
            </button>
          ))}
        </div>

        {/* Features Content */}
        {activeTab === "features" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Shield,
                title: "AI 이상 감지",
                description: "딥러닝 기반 인공지능이 침입, 배회, 쓰러짐 등 이상 상황을 실시간으로 감지합니다"
              },
              {
                icon: Cloud,
                title: "클라우드 저장",
                description: "30일간 영상을 안전하게 클라우드에 저장하고 언제 어디서나 확인할 수 있습니다"
              },
              {
                icon: Smartphone,
                title: "모바일 알림",
                description: "이상 상황 발생 시 즉시 스마트폰으로 알림을 받고 실시간 영상을 확인하세요"
              },
              {
                icon: Camera,
                title: "4K 고화질",
                description: "선명한 4K 화질과 야간 적외선 기능으로 24시간 또렷한 영상을 제공합니다"
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-600" />
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

        {/* Specs Content */}
        {activeTab === "specs" && (
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "해상도", value: "4K (3840 x 2160)" },
                { label: "시야각", value: "110도 광각" },
                { label: "야간 촬영", value: "적외선 LED 지원" },
                { label: "저장 기간", value: "30일 클라우드 저장" },
                { label: "AI 기능", value: "사람/차량/동물 구분" },
                { label: "양방향 오디오", value: "내장 마이크 & 스피커" },
                { label: "방수 등급", value: "IP66 실외 사용 가능" },
                { label: "전원", value: "PoE 또는 DC 12V" }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">{spec.label}</span>
                  <span className="font-medium text-gray-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Content */}
        {activeTab === "pricing" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "기본형",
                price: "29,900",
                features: ["카메라 1대", "30일 저장", "AI 기본 감지", "모바일 앱"],
                recommended: false
              },
              {
                name: "표준형",
                price: "49,900",
                features: ["카메라 2대", "30일 저장", "AI 고급 감지", "모바일 앱", "양방향 통화"],
                recommended: true
              },
              {
                name: "프리미엄",
                price: "79,900",
                features: ["카메라 4대", "60일 저장", "AI 고급 감지", "모바일 앱", "양방향 통화", "출동 서비스"],
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
                      추천
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
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