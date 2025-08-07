"use client"

import { motion } from "framer-motion"
import Link from "next/link"

// 💎 오퍼 상세 섹션 - 구체적 혜택 제시
// 투자 패키지 형태로 포장해 일반적인 할인 혜택을 투자 수익으로 재프레이밍

export function WhatOfferSection() {
  // 🚀 투자 패키지 혜택 데이터 - 배열로 관리해 확장성 확보
  const investmentPackage = [
    {
      title: "통신비 + CCTV 12개월 무료",
      value: "연 600만원 지원",
      desc: "창업 첫해 고정비 부담 완전 제거",
    },
    {
      title: "TV 결합시 추가 절감",
      value: "월 30만원",
      desc: "엔터테인먼트까지 케어하는 토탈 패키지",
    },
    {
      title: "창업 축하금 일시 지급",
      value: "60만원",
      desc: "첫 출발을 응원하는 마음",
    },
    {
      title: "전담 매니저 1:1 멘토링",
      value: "무제한",
      desc: "성공할 때까지 함께하는 파트너",
    },
  ]

  return (
    <section
      className="h-screen w-screen snap-start py-20 md:py-24 bg-gray-50 flex items-center justify-center"
      id="apply"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 🚀 시드 투자 패키지 */}
        <motion.div
          className="bg-gradient-to-br from-blue-50 to-teal-50 p-8 md:p-12 rounded-3xl shadow-xl mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            🚀 시드 투자 패키지
          </h3>
          <div className="grid gap-6">
            {investmentPackage.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <div className="flex-shrink-0 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {item.title}
                    </span>
                    <span className="font-bold text-teal-600">{item.value}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🛡️ 100% 폐업 보장 */}
        <motion.div
          className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 p-8 rounded-3xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-yellow-800 mb-4">
            🛡️ 100% 폐업 보장
          </h3>
          <p className="text-lg text-yellow-700 leading-relaxed">
            1년 내 폐업시 사용 금액 전액 환급
            <br />
            <small className="text-sm text-yellow-600">
              * TV 결합 고객 한정
            </small>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
