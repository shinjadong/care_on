'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProductsCTA() {
  return (
    <section className="border-t bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 text-3xl font-bold">
          어떤 제품이 필요하신지 모르시겠나요?
        </h2>
        <p className="mb-8 text-xl opacity-90">
          전문가가 당신의 비즈니스에 맞는 최적의 솔루션을 추천해드립니다
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/enrollment">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              무료 상담 신청
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Headphones className="mr-2 h-5 w-5" />
              서비스 둘러보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}