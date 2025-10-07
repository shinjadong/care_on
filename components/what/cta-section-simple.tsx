"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Users, CheckCircle, X } from "lucide-react"
import dynamic from "next/dynamic"
import { FAQSection } from "./faq-section"

const CareonApplicationForm = dynamic(() => import("./CareonApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})

const MAX_STEPS = 2;

interface WhatCTASectionProps {
  onInvestorClick: () => void
}

export function WhatCTASection({ onInvestorClick }: WhatCTASectionProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(0);
  const [remainingSlots, setRemainingSlots] = useState(8);
  const [showFAQ, setShowFAQ] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 플로팅 배너와 동일한 로직으로 신청중 숫자 표시
  useEffect(() => {
    // Use fixed initial value to avoid hydration mismatch
    setCurrentUsers(18)
    setRemainingSlots(50 - (35 + 18 - 15)) // 38명 신청 완료

    const interval = setInterval(() => {
      setCurrentUsers(prev => {
        const change = Math.floor(Math.random() * 5) - 2
        const newValue = prev + change
        
        if (newValue < 12) return 12
        if (newValue > 28) return 28
        
        setRemainingSlots(50 - (35 + newValue - 15))
        return newValue
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])


  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    
    // FAQ가 열려있으면 스크롤 이벤트 처리하지 않음
    if (showFAQ) return;
    
    const changeStep = (direction: 'up' | 'down') => {
      if (isAnimating) return;
      const newStep = direction === 'down' ? step + 1 : step - 1;
      if (newStep >= 0 && newStep <= MAX_STEPS) {
        setIsAnimating(true);
        setStep(newStep);
        setTimeout(() => setIsAnimating(false), 800);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (step < MAX_STEPS && e.deltaY > 0) { e.preventDefault(); changeStep('down'); }
      else if (step > 0 && e.deltaY < 0) { e.preventDefault(); changeStep('up'); }
    };
    
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (deltaY > 0 && step < MAX_STEPS) e.preventDefault();
      else if (deltaY < 0 && step > 0) e.preventDefault();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && step < MAX_STEPS) changeStep('down');
        else if (deltaY < 0 && step > 0) changeStep('up');
      }
    };
    
    element.addEventListener('wheel', handleWheel, { passive: false });
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, [step, isAnimating, showFAQ]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full bg-gradient-to-b from-[#f7f3ed] to-gray-50 flex items-center justify-center p-4"
    >
      <div className="transition-opacity duration-500">
        {/* Step 0: 한정성 메시지 */}
        {step === 0 && (
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-t from-[#148777] to-[#148777]/70 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-4 sm:mb-6 leading-tight px-4">
              실패가 두렵지 않은 세상,
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-[#222222] leading-relaxed px-4">
              단 한번뿐인<br className="hidden sm:block" />
              <span className="sm:hidden"></span>
              <br className="sm:hidden" />
               특별한 혜택
            </p>
          </div>
        )}

        {/* Step 1: 긴급성 메시지 */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/90 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <div className="mb-6">
              <div className="text-4xl sm:text-5xl md:text-7xl font-black text-red-500 mb-2">
                단 3일 동안
              </div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#222222] px-4">
                스타트 케어 체험단을 모집합니다.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: 최종 CTA */}
        {step === 2 && (
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-t from-[#148777] to-[#148777]/70 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-700 mb-4 sm:mb-6 leading-tight">
              지금 시작하세요!
            </h3>
            <button
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-teal-600 text-base sm:text-lg md:text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105"
              onClick={() => setShowApplicationModal(true)}
            >
              예약 대기 신청
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            
            <p className="mt-4 text-sm text-gray-600">
              체험단 <span className="font-bold text-red-500">50명 중 {50 - remainingSlots}명</span> 신청 완료
            </p>
            
            {/* FAQ 토글 버튼 */}
            <button
              onClick={() => setShowFAQ(!showFAQ)}
              className="mt-4 text-sm text-teal-600 hover:text-teal-700 underline transition-colors"
            >
              궁금한 게 있으신가요?
            </button>
          </div>
        )}
      </div>

      {/* FAQ 섹션 토글 */}
      {showFAQ && (
        <div className="fixed inset-0 bg-white z-50 animate-slide-up-from-bottom">
          <div className="relative h-full overflow-y-auto">
            {/* FAQ 닫기 버튼 - 고정 위치 */}
            <button
              onClick={() => setShowFAQ(false)}
              className="fixed right-6 top-6 z-[60] p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <FAQSection />
          </div>
        </div>
      )}

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative max-h-[90vh] overflow-y-auto bg-white rounded-2xl">
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CareonApplicationForm 
              useGrid={true}
              onSuccess={() => {
                setTimeout(() => setShowApplicationModal(false), 2000)
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
