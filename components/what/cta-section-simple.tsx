"use client"

import { useState, useEffect, useRef } from "react"
import { Clock, Users, CheckCircle, X } from "lucide-react"
import dynamic from "next/dynamic"

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
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    
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
  }, [step, isAnimating]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-b from-[#f7f3ed] to-gray-50 flex items-center justify-center p-4"
    >
      <div className="transition-opacity duration-500">
        {/* Step 0: 한정성 메시지 */}
        {step === 0 && (
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-t from-[#148777] to-[#148777]/70 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#222222] mb-4 sm:mb-6 leading-tight px-4">
              폐업을 보장하는 '스타트 케어'
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-[#222222] leading-relaxed px-4">
              1년 내 폐업할 시, 최대 100% 환급 <br className="hidden sm:block" />
              <span className="sm:hidden">1년 내 폐업할 시, 최대 100% 환급</span>
              <br className="sm:hidden" />
              그리고, '단 한번'만 진행하는 특별한 혜택
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
              체험단 <span className="font-bold text-red-500">50명 중 42명</span> 신청 완료
            </p>
          </div>
        )}
      </div>

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