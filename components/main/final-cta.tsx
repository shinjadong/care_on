"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// 최종 CTA 섹션 - 행동을 유도하는 마지막 구간
// 마치 영화의 클라이맥스처럼, 결정적인 순간을 제시하여 행동을 이끌어냄

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }} // 마지막 메시지가 힘차게 등장
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8"
              style={{ fontFamily: 'Noto Serif KR, serif' }}>
            도전하세요
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-4">
            케어온 서비스 신청은 선착순이 아닙니다.
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-12">
            저희 서비스가 도움이 된다고 <br />
            확신이 되는 분에 한해 진행해드립니다.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg">
              <Link href="/start-care">스타트케어 살펴보기</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg">
              <Link href="/review">성공 사례 확인하기</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}