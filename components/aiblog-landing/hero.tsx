"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { FloatingPaper } from "@/components/aiblog-landing/floating-paper"
import { RoboAnimation } from "@/components/aiblog-landing/robo-animation"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              AI로 작성된
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-github-purple to-github-blue">
                {" "}
                최고의 콘텐츠
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
            자동AI가 생성한 최신 트렌드 분석, 마케팅 인사이트, 비즈니스 전략 콘텐츠를 
            지금 바로 확인하세요.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <Button size="lg" asChild className="bg-careon-primary hover:bg-careon-primary-hover text-white px-12 py-6 text-lg">
              <Link href="/aiblog/generator">
                <Sparkles className="mr-2 h-5 w-5" />
                무료로 체험해보기
              </Link>
            </Button>
          </motion.div>

          {/* 통계 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-gray-400">작성된 글</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">12+</div>
              <div className="text-gray-400">카테고리</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24시간</div>
              <div className="text-gray-400">실시간 업데이트</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none">
        <RoboAnimation />
      </div>
    </div>
  )
}

