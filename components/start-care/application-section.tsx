"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function ApplicationSection() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const countdownDate = new Date("2025-07-30T23:59:59").getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = countdownDate - now

      if (distance < 0) {
        clearInterval(interval)
        setTimeLeft("마감되었습니다")
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(
        `${String(days).padStart(2, "0")}일 ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-semibold">안전한 첫 창업을 위한 현명한 선택</p>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            세이프 스타트팩, <br />
            한정된 인원만 가능합니다.
          </h2>
        </div>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 relative">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-full">
            전문직 별도 문의
          </div>
          <div className="relative mb-6">
            <Image
              src="/placeholder.svg?height=596&width=1168"
              alt="세이프 스타트 패키지"
              width={1168}
              height={596}
              className="rounded-lg"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 p-2 rounded">
              마감까지 <span className="font-bold text-lg ml-2">{timeLeft}</span>
            </div>
          </div>
          <div className="text-center">
            <em className="block text-teal-400 not-italic">careon consulting</em>
            <strong className="block text-2xl font-bold mt-2">49기 케어온 아카데미(2개월)</strong>
          </div>
          <ul className="list-disc list-inside my-6 space-y-2 text-gray-300">
            <li>오프라인 대면 컨설팅 총 3회</li>
            <li>온라인 피드백 주 3회</li>
            <li>매출 증가를 위한 구체적인 방향성 제시</li>
            <li>마케팅 성과 관리 방향성 제시</li>
          </ul>
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <strong className="text-lg">마감 정보</strong>
            <dl className="grid grid-cols-3 gap-4 mt-2 text-sm">
              <div>
                <dt className="font-semibold">마감일</dt>
                <dd>7월 30일 (수)</dd>
              </div>
              <div>
                <dt className="font-semibold">모집 인원</dt>
                <dd>15명 한정</dd>
              </div>
              <div>
                <dt className="font-semibold">실사 시작일</dt>
                <dd>8월 4일 (월)</dd>
              </div>
            </dl>
          </div>
          <div className="text-center">
            <span className="text-gray-400">계약금 : 별도 안내</span>
            <div className="my-2">
              <strong className="text-4xl font-extrabold text-teal-400">월 17.5만원</strong>
              <span className="ml-2">(36개월 과정)</span>
            </div>
          </div>
          <div className="mt-8 flex flex-col space-y-4">
            <a href="https://forms.gle/xUcRxNYcFnYGZjga7" target="_blank" rel="noopener noreferrer" className="w-full">
              <Button size="lg" className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-lg">
                지금 바로 신청하기
              </Button>
            </a>
            <Button
              variant="outline"
              size="lg"
              className="w-full border-teal-500 text-teal-400 hover:bg-gray-700 hover:text-white h-12 text-lg bg-transparent"
            >
              보장범위 / 알아보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 