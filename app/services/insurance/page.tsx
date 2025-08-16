"use client"

import { useState } from "react"
import { Shield, Flame, Home, Heart, CheckCircle, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState("coverage")

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
              가입하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-700/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                종합 안전보장
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                화재·안전 보험
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                화재, 도난, 상해까지 한 번에 보장하는 종합 보험.
                예상치 못한 사고로부터 당신의 가정을 지켜드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-brand text-white font-semibold rounded-xl hover:bg-brand/90 transition-colors">
                  보험료 계산하기
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  약관 보기
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <Shield className="w-32 h-32 text-white/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">최대 보장</p>
                    <p className="text-lg font-bold">1억원</p>
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
          {["coverage", "benefits", "pricing"].map((tab) => (
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
              {tab === "coverage" && "보장 내용"}
              {tab === "benefits" && "혜택"}
              {tab === "pricing" && "보험료"}
            </button>
          ))}
        </div>

        {/* Coverage Content */}
        {activeTab === "coverage" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Flame,
                title: "화재 보장",
                description: "화재로 인한 건물, 가재도구 손해를 최대 1억원까지 보상",
                coverage: "최대 1억원"
              },
              {
                icon: Home,
                title: "도난 보장",
                description: "도난 및 침입으로 인한 손실을 최대 500만원까지 보상",
                coverage: "최대 500만원"
              },
              {
                icon: Heart,
                title: "상해 보장",
                description: "가정 내 사고로 인한 의료비를 실비로 보상",
                coverage: "실비 보상"
              },
              {
                icon: Shield,
                title: "배상책임",
                description: "타인에게 입힌 손해에 대한 법적 배상책임 보장",
                coverage: "최대 1000만원"
              }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 mb-3">{item.description}</p>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        {item.coverage}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Benefits Content */}
        {activeTab === "benefits" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">케어온 가입자 특별 혜택</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "24시간 사고 접수 및 처리",
                  "즉시 보상 시스템",
                  "무료 안전 점검 서비스",
                  "보험료 할인 혜택",
                  "간편 모바일 청구",
                  "전담 상담사 배정"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
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
                name: "기본형",
                price: "9,900",
                coverage: "3천만원",
                features: ["화재 3천만원", "도난 100만원", "기본 상해보장", "모바일 청구"],
                recommended: false
              },
              {
                name: "표준형",
                price: "19,900",
                coverage: "5천만원",
                features: ["화재 5천만원", "도난 300만원", "상해 실비", "배상책임 500만원", "24시간 상담"],
                recommended: true
              },
              {
                name: "프리미엄",
                price: "29,900",
                coverage: "1억원",
                features: ["화재 1억원", "도난 500만원", "상해 실비", "배상책임 1천만원", "VIP 상담", "무료 안전점검"],
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
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">최대 {plan.coverage}</p>
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
                  가입하기
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}