"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

// 🎭 What 페이지 인트로 섹션 
// 스크롤에 반응하여 순차적으로 텍스트가 나타나는 3단계 애니메이션
// 다른 컴포넌트들과 일관된 스크롤 핸들링 패턴 적용

const MAX_STEPS = 3;

export function WhatIntroSection() {
  const [step, setStep] = useState(1); // 1단계부터 시작
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 🔄 스크롤/터치 이벤트 제어 (다른 컴포넌트와 동일한 패턴)
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    
    // 스텝을 변경하는 중앙 함수
    const changeStep = (direction: 'up' | 'down') => {
      if (isAnimating) return;
      
      const newStep = direction === 'down' ? step + 1 : step - 1;
      if (newStep >= 1 && newStep <= MAX_STEPS) {
        setIsAnimating(true);
        setStep(newStep);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    };

    // 마우스 휠 핸들러: 마지막/첫 스텝에서는 기본 스크롤을 허용
    const handleWheel = (e: WheelEvent) => {
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      if (goingDown && step < MAX_STEPS) {
        e.preventDefault();
        changeStep('down');
      } else if (goingUp && step > 1) {
        e.preventDefault();
        changeStep('up');
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    
    // 터치 이동 핸들러: 스크롤 영역 내에서만 기본 동작 방지
    const handleTouchMove = (e: TouchEvent) => {
      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchCurrentY;
      
      if (deltaY > 0 && step < MAX_STEPS) { // 아래로 스와이프
        e.preventDefault();
      } else if (deltaY < 0 && step > 1) { // 위로 스와이프
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;
      const SWIPE_THRESHOLD = 50;

      if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
        if (deltaY > 0) {
          if (step < MAX_STEPS) changeStep('down');
        } else {
          if (step > 1) changeStep('up');
        }
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

  // 애니메이션 variants 정의
  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <section 
      ref={sectionRef}
      className="h-screen w-screen snap-start bg-[#f7f3ed] flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* 
        [개발자 노트]
        - h-screen, w-screen: 섹션이 화면 전체를 꽉 채우도록 합니다.
        - snap-start: 이 섹션의 시작 부분이 부모의 스냅 지점이 되도록 설정합니다.
        - overflow-hidden: 애니메이션 중 텍스트가 화면 밖으로 나가는 것을 방지합니다.
        - 무채색 테마 적용: bg-gray-50
      */}
      
      <AnimatePresence mode="wait">
        {/* Step 1: "사장님," */}
        {step === 1 && (
          <motion.div 
            key="step1"
            className="text-center"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#222222]">
              사장님,
            </h1>
          </motion.div>
        )}

        {/* Step 2: "케어온이 1년간" */}
        {step === 2 && (
          <motion.div 
            key="step2"
            className="text-center"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#222222] leading-tight">
              케어온이 1년간
            </h2>
          </motion.div>
        )}

        {/* Step 3: "모든걸 보장해 드립니다." */}
        {step === 3 && (
          <motion.div 
            key="step3"
            className="text-center max-w-4xl"
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#222222] leading-tight">
              모든걸 보장해 드립니다.
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 스크롤 인디케이터 - 마지막 스텝에서만 표시 */}
      {step === MAX_STEPS && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </motion.div>
          <p className="text-sm text-gray-500 mt-2 text-center">스크롤하세요</p>
        </motion.div>
      )}
    </section>
  )
}