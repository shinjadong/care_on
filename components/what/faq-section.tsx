"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown, HelpCircle, Shield, Clock, CreditCard, AlertCircle, Users, Zap, FileCheck, Phone, Loader2 } from "lucide-react"

// 🤝 FAQ 섹션 - 손주은式 "진짜 궁금한 것들"에 답하는 철학 반영
// 의구심을 직면하고 투명하게 해소하는 상세 FAQ

interface FAQItem {
  id: number
  icon: any
  category: string
  question: string
  answer: string
  highlight?: string
}

const faqData: FAQItem[] = [
  // 🎯 스타트 케어 기본 개념
  {
    id: 1,
    icon: HelpCircle,
    category: "스타트케어",
    question: "스타트 케어에 대해 정확히 알려주세요",
    answer: "스타트 케어는 **창업 1년간 폐업 위험을 보장**하는 케어온의 핵심 서비스입니다.\n\nCCTV 보안, GIGA 인터넷, TV, 보험 등 창업 필수 인프라를 제공합니다.\n\n만약 **1년 내 폐업 시 납부하신 모든 월 이용료를 100% 환급**해드립니다.\n\n창업 초기 시행착오의 부담을 덜어드리는 것이 목적입니다.",
    highlight: "폐업 시 100% 전액 환급"
  },
  
  // 🔥 체험단 특별함 강조
  {
    id: 2,
    icon: AlertCircle,
    category: "체험단",
    question: "체험단과 일반 스타트 케어가 어떻게 다른가요?",
    answer: "일반 스타트 케어는 **'폐업 시 환급 보장'** 서비스입니다.\n\n하지만 이번 오픈 기념 체험단(50명 한정)은 **폐업 보장을 넘어서 아예 1년 완전 무료**입니다.\n\n조건은 **설치 완료 후 사진/영상 촬영 및 후기 작성**뿐입니다.\n\n케어온 포트폴리오 구축을 위한 **단 한 번뿐인 기회**입니다.",
    highlight: "체험단만 1년 완전 무료"
  },
  {
    id: 3,
    icon: CreditCard,
    category: "체험단", 
    question: "체험단은 정말 완전 무료인가요?",
    answer: "네, **설치비부터 1년간 모든 이용료까지 완전 무료**입니다.\n\nCCTV 4대 + 기가 인터넷 + TV 패키지 기준 **일반 가격 연 180만원 상당을 무료**로 제공합니다.\n\n**숨겨진 비용, 보증금, 위약금 모두 없습니다.**\n\n진짜 무료가 맞습니다.",
    highlight: "연 180만원 상당 무료"
  },
  
  // 📋 체험단 자격/조건
  {
    id: 4,
    icon: FileCheck,
    category: "체험단",
    question: "체험단은 누구나 신청할 수 있나요?",
    answer: "**50명 한정**이며 다음 조건을 만족해야 합니다.\n\n① **사업자등록증 보유**\n\n② **실제 매장 운영 중**\n\n③ **설치 후 사진/영상 촬영 협조**\n\n④ **업종 제한 없음**(단, 유흥업소 제외)\n\n선착순 마감이므로 서둘러 신청하세요.",
    highlight: "50명 선착순 마감"
  },
  {
    id: 5,
    icon: FileCheck,
    category: "체험단",
    question: "체험단 신청 절차는 어떻게 되나요?",
    answer: "**온라인 신청 → 24시간 내 전화 확인 → 48시간 내 현장 견적**으로 진행됩니다.\n\n**견적 승인 후 2-3일 내 설치 완료**(총 5일).\n\n현장 견적 시 매장 상태와 설치 조건을 확인한 후 최종 승인됩니다.\n\n조건 미충족 시 일반 스타트 케어로 안내드립니다.",
    highlight: "신청 후 5일 내 설치 완료"
  },
  {
    id: 6,
    icon: Clock,
    category: "체험단",
    question: "후기 작성이 부담스러운가요?",
    answer: "전혀 부담스럽지 않습니다.\n\n**얼굴이 나올 필요도 없고**, 설치 완료 후 **사진과 영상만 촬영**하면 됩니다.\n\n**케어온 리뷰 게시판에 간단히 작성**해주시면 됩니다.\n\n후기 미작성 시에도 위약금은 없으며, 단지 2년차부터 일반 요금이 적용됩니다.",
    highlight: "얼굴 노출 없이 간단 촬영"
  },
  
  // 🛡️ 일반 스타트 케어 관련
  {
    id: 7,
    icon: Shield,
    category: "일반서비스",
    question: "일반 스타트 케어 요금은 얼마인가요?",
    answer: "**CCTV 4대 + 기가 인터넷 + TV 패키지 기준 월 8만원대**입니다.\n\n대기업 직거래 가격보다 **20-30% 저렴한 수준**입니다.\n\n**1년 내 폐업 시 지금까지 납부하신 모든 요금을 100% 환급**해드립니다.\n\n창업 위험 부담을 완전히 없애드립니다.",
    highlight: "월 8만원대 합리적 요금"
  },
  
  // 📦 제품/서비스 관련  
  {
    id: 8,
    icon: Zap,
    category: "제품",
    question: "어떤 브랜드 제품인가요?",
    answer: "**KT AI CCTV, KT/SK/LG 기가 인터넷, 삼성/LG 스마트TV** 등 국내 대기업 정품만 사용합니다.\n\n**저가 중국산이나 재생품은 절대 사용하지 않습니다.**\n\n모든 제품은 **제조사 정식 A/S가 가능**합니다.\n\n품질과 신뢰성을 보장합니다.",
    highlight: "대기업 정품 100% 보장"
  },
  {
    id: 9,
    icon: Zap,
    category: "제품",
    question: "A/S는 어떻게 받나요?",
    answer: "**고장 신고 → 2시간 내 전화 확인 → 6시간 내 기사 방문**으로 진행됩니다.\n\n**24시간 내 수리 완료 또는 장비 교체**를 원칙으로 합니다.\n\n**케어온 전담 매니저가 A/S 전 과정을 대행**하므로 여러 업체에 연락할 필요가 없습니다.\n\n원스톱 서비스입니다.",
    highlight: "24시간 내 처리 완료"
  },
  
  // ❓ 기타 궁금증
  {
    id: 10,
    icon: Users,
    category: "기타",
    question: "다른 업체와 뭐가 다른가요?",
    answer: "일반 렌탈사는 **설치비와 위약금으로 수익**을 냅니다.\n\n초기엔 관리가 잘 되지만, **A/S 신청 시 확인이 불편하고 고객 정보 관리가 허술**합니다.\n\n케어온은 **한 곳에서 모든 렌탈 장비를 오랫동안 안정적으로 관리**해드리는 것이 목적입니다.\n\n장기 파트너십이 핵심입니다.",
    highlight: "원스톱 통합 관리"
  },
  {
    id: 11,
    icon: CreditCard,
    category: "기타", 
    question: "왜 이렇게 좋은 조건인가요?",
    answer: "솔직히 말하면 **저희도 수익이 있습니다.**\n\n다만 **설치비나 위약금이 아닌, 장기 고객 유지를 통해 수익을 창출**하는 구조입니다.\n\n특히 **체험단은 케어온의 포트폴리오와 신뢰도 구축이 목적**이므로 파격적 조건이 가능합니다.\n\n**사장님이 성공해야 저희도 성공하는 상생 구조**입니다.",
    highlight: "상생을 위한 파격 조건"
  }
]

const categories = [
  { name: "전체", icon: HelpCircle },
  { name: "스타트케어", icon: Shield },
  { name: "체험단", icon: AlertCircle },
  { name: "일반서비스", icon: CreditCard },
  { name: "제품", icon: Zap },
  { name: "기타", icon: Users }
]

// 텍스트 포맷팅 함수 - 볼드 처리와 줄바꿈 처리
function formatAnswer(text: string) {
  // 줄바꿈 처리
  const paragraphs = text.split('\n\n')
  
  return paragraphs.map((paragraph, idx) => {
    // **텍스트** 패턴을 찾아서 <strong> 태그로 변환
    const parts = paragraph.split(/\*\*(.*?)\*\*/g)
    
    return (
      <span key={idx} className="block mb-3 last:mb-0">
        {parts.map((part, index) => 
          index % 2 === 1 ? <strong key={index} className="font-bold text-gray-900">{part}</strong> : part
        )}
      </span>
    )
  })
}

export function WhatFAQSection() {
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isPhoneLoading, setIsPhoneLoading] = useState(false)
  const [showPhoneError, setShowPhoneError] = useState(false)

  const filteredFAQs = selectedCategory === "전체" 
    ? faqData 
    : faqData.filter(faq => faq.category === selectedCategory)

  // 모바일 여부 체크
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

  const handlePhoneReservation = () => {
    // 모바일에서만 작동
    if (isMobile) {
      setIsPhoneLoading(true)
      setShowPhoneError(false)
      
      // 2초 후 에러 메시지 표시
      setTimeout(() => {
        setIsPhoneLoading(false)
        setShowPhoneError(true)
        
        // 3초 후 에러 메시지 숨김
        setTimeout(() => {
          setShowPhoneError(false)
        }, 3000)
      }, 2000)
    } else {
      // PC에서는 그냥 전화 걸기
      window.location.href = 'tel:1688-0000'
    }
  }

  return (
    <section className="relative w-screen snap-start bg-white">
      <div className="mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-24">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
            자주 묻는 질문
          </h3>
          <p className="text-lg md:text-xl text-gray-600">
            궁금한 모든 것, <span className="text-teal-600 font-semibold">솔직하게</span> 답해드립니다
          </p>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
                ${selectedCategory === category.name
                  ? 'bg-teal-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <category.icon className="w-4 h-4" />
              <span className="font-medium">{category.name}</span>
              {category.name !== "전체" && (
                <span className="text-sm">
                  ({faqData.filter(faq => faq.category === category.name).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* FAQ 리스트 */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  className="w-full text-left rounded-2xl border border-gray-200 p-5 md:p-6 bg-white hover:bg-gray-50 hover:border-teal-300 transition-all duration-300 group"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`
                        p-2 rounded-xl transition-colors duration-300
                        ${expandedId === faq.id ? 'bg-teal-100' : 'bg-gray-100 group-hover:bg-teal-50'}
                      `}>
                        <faq.icon className={`
                          w-5 h-5 transition-colors duration-300
                          ${expandedId === faq.id ? 'text-teal-600' : 'text-gray-600 group-hover:text-teal-500'}
                        `} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                          {faq.question}
                        </h4>
                        {faq.highlight && !expandedId && (
                          <p className="text-sm text-teal-600 font-medium">
                            💡 {faq.highlight}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronDown className={`
                      w-5 h-5 text-gray-400 transition-transform duration-300
                      ${expandedId === faq.id ? 'rotate-180' : ''}
                    `} />
                  </div>
                  
                  <AnimatePresence>
                    {expandedId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 pl-14">
                          <div className="text-base md:text-lg text-gray-700 leading-relaxed">
                            {formatAnswer(faq.answer)}
                          </div>
                          {faq.highlight && (
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-teal-50 rounded-full">
                              <span className="text-sm font-semibold text-teal-700">
                                {faq.highlight}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 추가 문의 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-3xl p-8 md:p-10">
            <Phone className="w-12 h-12 text-teal-600 mx-auto mb-4" />
            <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              더 궁금한 점이 있으신가요?
            </h4>
            <p className="text-lg text-gray-700 mb-6">
              지금 바로 상담 받아보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-4 bg-teal-600 text-white font-bold rounded-full hover:bg-teal-700 transition-all duration-300 transform hover:scale-105"
                onClick={() => window.location.href = 'https://forms.gle/xUcRxNYcFnYGZjga7'}
              >
                체험단 예약대기
              </button>
              <button 
                className="relative px-8 py-4 bg-white text-teal-600 font-bold rounded-full border-2 border-teal-600 hover:bg-teal-50 transition-all duration-300"
                onClick={handlePhoneReservation}
                disabled={isPhoneLoading}
              >
                {isPhoneLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  '전화 예약'
                )}
              </button>
            </div>
            {/* 에러 메시지 */}
            <AnimatePresence>
              {showPhoneError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 font-medium">
                    죄송합니다. 현재 전화 상담 예약이 모두 마감되었습니다.
                  </p>
                  <p className="text-red-500 text-sm mt-1">
                    체험단 예약대기를 이용해주세요.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatFAQSection