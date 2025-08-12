"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Users, CheckCircle } from "lucide-react"

// 🎯 CTA 섹션 - 스크롤 기반 스텝별 한정성 메시지와 강력한 행동 유도
// 기존 컴포넌트들과 일관된 흐름으로 재구성

const MAX_STEPS = 2;

interface WhatCTASectionProps {
  onInvestorClick: () => void // 부모 컴포넌트에서 전달받는 콜백 함수
}

export function WhatCTASection({ onInvestorClick }: WhatCTASectionProps) {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 🔄 스크롤/터치 이벤트 제어 (기존 컴포넌트와 동일한 패턴)
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
      <AnimatePresence mode="wait">
        {/* Step 0: 한정성 메시지 */}
        {step === 0 && (
          <motion.div 
            key="step1"
            className="text-center max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-t from-[#148777] to-[#148777]/70 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-bold text-[#222222] mb-6 leading-tight">
              모두에게 드릴 순 없습니다
            </h3>
            <p className="text-md md:text-xl text-[#222222] leading-relaxed">
              정말 필요한 분들에게만 <br />
              제대로 된 케어를 제공하고 싶습니다
            </p>
          </motion.div>
        )}

        {/* Step 1: 긴급성 메시지 */}
        {step === 1 && (
          <motion.div 
            key="step2"
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-red-500/90 rounded-full flex items-center justify-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.1, 1] }}
              transition={{ duration: 0.64, delay: 0.16, type: "spring", bounce: 0.4 }}
            >
              <Clock className="w-10 h-10 text-white" />
            </motion.div>
            <div className="mb-6">
              <motion.div
                className="text-5xl md:text-7xl font-black text-red-500 mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.64, delay: 0.16, type: "spring", bounce: 0.4 }}
              >
                딱, 3일
              </motion.div>
              <motion.p
                className="text-xl md:text-2xl font-bold text-[#222222]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
              >
                동안만 모집합니다
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step 2: 최종 CTA */}
        {step === 2 && (
          <motion.div 
            key="step3"
            className="text-center max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-t from-[#148777] to-[#148777]/70 rounded-full flex items-center justify-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 leading-tight">
              지금 시작하세요!
            </h3>
            <motion.button
              className="inline-flex items-center px-8 py-4 bg-white text-teal-600 text-lg md:text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group"
              onClick={() => window.location.href = 'https://forms.gle/xUcRxNYcFnYGZjga7'}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              예약 대기 신청
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
