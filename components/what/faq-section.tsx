"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client-with-fallback"
import Image from "next/image"

interface FAQItem {
  id: number
  question: string
  answer: string
  visible: boolean
  order_index: number
}

// 타이핑 효과를 위한 커스텀 훅
function useTypewriter(text: string, speed: number = 30) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (!text) return
    
    setIsTyping(true)
    setDisplayedText("")
    let index = 0
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setIsTyping(false)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return { displayedText, isTyping }
}

export function FAQSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [animatingId, setAnimatingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchFAQs = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('visible', true)
        .order('order_index', { ascending: true })
      
      if (!error && data) {
        setFaqs(data)
        setFilteredFaqs(data)
      }
      setLoading(false)
    }

    fetchFAQs()
  }, [])

  // 검색 및 필터링
  useEffect(() => {
    let filtered = faqs

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFaqs(filtered)
    
    // 검색 결과가 1개면 자동으로 펼치기
    if (filtered.length === 1) {
      handleExpand(filtered[0].id)
    }
  }, [searchTerm, faqs])

  const handleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null)
      setAnimatingId(null)
    } else {
      setAnimatingId(id)
      // 애니메이션 후 답변 표시
      setTimeout(() => {
        setExpandedId(id)
      }, 300)
    }
  }

  if (loading) {
    return (
      <section id="faq-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="bg-gray-200 rounded-2xl p-4 w-full max-w-[600px] animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="faq-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          자주 묻는 질문
        </h2>
        <p className="text-center text-gray-600 mb-8">
          판판이가 답변해드립니다 🐼
        </p>

        {/* 검색 바 */}
        <div className="mb-8 space-y-4">
          {/* 검색 입력 */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="궁금한 내용을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#148777] focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 빠른 필터 버튼들 - 중앙 정렬 */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSearchTerm("비용")}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-full text-sm transition-colors border border-gray-200"
            >
              💰 비용
            </button>
            <button
              onClick={() => setSearchTerm("설치")}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-full text-sm transition-colors border border-gray-200"
            >
              🔧 설치
            </button>
            <button
              onClick={() => setSearchTerm("폐업")}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-full text-sm transition-colors border border-gray-200"
            >
              🔄 폐업/환급
            </button>
            <button
              onClick={() => setSearchTerm("A/S")}
              className="px-4 py-2 bg-white hover:bg-gray-100 rounded-full text-sm transition-colors border border-gray-200"
            >
              🛠️ A/S
            </button>
          </div>
        </div>

        {/* 검색 결과 메시지 */}
        {searchTerm && (
          <div className="mb-4 text-sm text-gray-600 text-center">
            "{searchTerm}" 검색 결과: {filteredFaqs.length}개
            {filteredFaqs.length === 0 && (
              <p className="mt-2 text-gray-500">
                검색 결과가 없습니다. 다른 키워드로 검색해보세요.
              </p>
            )}
          </div>
        )}

        {/* FAQ 목록 */}
        <div className="space-y-8">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="relative">
              {/* 질문과 답변이 펼쳐진 상태 */}
              {(expandedId === faq.id || animatingId === faq.id) ? (
                <div className="space-y-4">
                  {/* 질문 - 왼쪽으로 이동 */}
                  <div className={`flex items-start gap-3 transition-all duration-500 ${
                    animatingId === faq.id ? 'animate-slide-left' : ''
                  }`}>
                    {/* 질문자 아이콘 */}
                    <div className="flex-shrink-0 w-10 h-10 relative">
                      <Image
                        src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%ED%8C%90%ED%8C%90-%EC%A7%88%EB%AC%B8.png"
                        alt="질문"
                        width={40}
                        height={40}
                        className="object-contain rounded-full"
                      />
                    </div>
                    
                    <button
                      onClick={() => handleExpand(faq.id)}
                      className="group max-w-[70%] text-left"
                    >
                      <div className="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-[#148777] to-[#0f6b5c] text-white shadow-lg">
                        <p className="font-medium">{faq.question}</p>
                        {/* 말풍선 꼬리 */}
                        <div className="absolute -left-2 top-4 w-3 h-3 bg-[#148777] transform rotate-45"></div>
                      </div>
                    </button>
                  </div>

                  {/* 답변 - 오른쪽에서 나타남 */}
                  {expandedId === faq.id && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%]">
                        <AnswerBubble answer={faq.answer} isExpanded={true} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 질문만 표시 - 중앙 정렬 */
                <div className="flex justify-center">
                  <button
                    onClick={() => handleExpand(faq.id)}
                    className="group max-w-[700px] w-full text-left transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="relative px-6 py-4 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 flex-1">{faq.question}</p>
                        <div className="ml-4 w-8 h-8 rounded-full bg-[#148777]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#148777] text-sm">?</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredFaqs.length === 0 && !searchTerm && (
          <div className="text-center py-12 text-gray-500">
            등록된 FAQ가 없습니다.
          </div>
        )}

        {/* 추가 문의 안내 */}
        <div className="mt-16 text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <p className="text-gray-700 mb-6 text-lg">
            더 궁금한 점이 있으신가요?
          </p>
          
          {/* 판판즈 이미지 */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#148777]/20 rounded-full blur-2xl animate-pulse"></div>
              <Image
                src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%ED%8C%90%ED%8C%90%EC%A6%88.gif"
                alt="판판즈"
                width={140}
                height={140}
                className="object-contain relative z-10"
              />
            </div>
          </div>
          
          {/* 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/review"
              className="inline-block px-8 py-3 bg-[#148777] hover:bg-[#0f6b5c] text-white rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              리뷰 보러가기
            </a>
            
            <a
              href="tel:1866-1845"
              className="inline-block px-8 py-3 bg-white hover:bg-gray-50 text-[#148777] border-2 border-[#148777] rounded-full font-medium transition-all duration-200 transform hover:scale-105"
            >
              전화문의 1866-1845
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// 답변 컴포넌트 (타이핑 효과 포함)
function AnswerBubble({ answer, isExpanded }: { answer: string, isExpanded: boolean }) {
  const { displayedText, isTyping } = useTypewriter(isExpanded ? answer : "", 15)
  
  // 마크다운 렌더링
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="flex items-start gap-3 justify-end animate-fade-in-right">
      {/* 답변 말풍선 */}
      <div className="relative max-w-full">
        <div className="px-5 py-3 bg-white rounded-2xl shadow-md border border-gray-100">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(displayedText) }}
          />
          {isTyping && <span className="inline-block w-0.5 h-4 bg-gray-400 animate-blink ml-0.5"></span>}
        </div>
        {/* 말풍선 꼬리 */}
        <div className="absolute -right-2 top-4 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
      </div>

      {/* 답변자 아이콘 - 애니메이션 효과 추가 */}
      <div className="flex-shrink-0 relative">
        <div className="absolute inset-0 bg-[#148777]/30 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-12 h-12 bg-gradient-to-br from-[#148777] to-[#0f6b5c] rounded-full p-2 shadow-lg animate-bounce-slow">
          <Image
            src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%ED%8C%90%ED%8C%90-a"
            alt="판판 답변"
            width={48}
            height={48}
            className="object-contain rounded-full"
          />
        </div>
        {isTyping && (
          <div className="absolute -bottom-1 -left-1 flex gap-0.5">
            <span className="w-2 h-2 bg-[#148777] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#148777] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#148777] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        )}
      </div>
    </div>
  )
}

// Export alias for dynamic import
export const WhatFAQSection = FAQSection
