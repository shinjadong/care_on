'use client'

import React from 'react'
import { Zap, Star, Users, Shield, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ProductsHeader() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 px-4 py-20 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative mx-auto max-w-7xl text-center">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
          케어온 제품
        </h1>
        <p className="mx-auto max-w-2xl text-xl opacity-90">
          당신의 비즈니스를 성공으로 이끄는 스마트한 선택
        </p>

        {/* 통계 배지 추가 */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Badge className="bg-white/20 text-white text-sm px-4 py-2">
            <Zap className="w-4 h-4 mr-1" />
            95% 생존율 달성
          </Badge>
          <Badge className="bg-white/20 text-white text-sm px-4 py-2">
            <Star className="w-4 h-4 mr-1" />
            평균 평점 4.7
          </Badge>
          <Badge className="bg-white/20 text-white text-sm px-4 py-2">
            <Users className="w-4 h-4 mr-1" />
            10,000+ 고객사
          </Badge>
        </div>
      </div>

      {/* 플로팅 아이콘 - CSS 애니메이션으로 처리 */}
      <div className="absolute -right-10 top-10 opacity-10">
        <div className="animate-float">
          <Shield className="h-40 w-40" />
        </div>
      </div>
      <div className="absolute -left-10 bottom-10 opacity-10">
        <div className="animate-float-delayed">
          <CreditCard className="h-32 w-32" />
        </div>
      </div>
    </section>
  )
}