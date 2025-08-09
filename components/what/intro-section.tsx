"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

// 🎭 What 페이지 인트로 섹션 
// 스크롤할 때마다 텍스트가 한 줄씩 위에서 아래로 쌓이는 애니메이션

const MAX_STEPS = 3;

const TEXT_LINES = [
  "사장님,",
  "케어온이 1년간", 
  "모든걸 보장해 드립니다."
];

export function WhatIntroSection() {
  const [step, setStep] = useState(1); // 1단계부터 시작
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 🔄 스크롤/터치 이벤트 제어
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
        setTimeout(() => setIsAnimating(false), 450);
      }
    };

    // 마우스 휠 핸들러
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

  return (
    <section 
      ref={sectionRef}
      className="h-screen w-screen snap-start bg-[#f7f3ed] flex flex-col items-center justify-center px-4 relative overflow-hidden"
    >
      {/* 쌓이는 텍스트 컨테이너 */}
      <div className="text-center max-w-4xl">
        {/* 각 스텝까지의 모든 텍스트를 표시 */}
        {TEXT_LINES.slice(0, step).map((text, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: index === step - 1 ? 0 : 0 // 새로 추가되는 텍스트만 딜레이 없음
            }}
            className={`
              ${index === 0 ? 'text-5xl md:text-7xl lg:text-8xl font-black' : ''}
              ${index === 1 ? 'text-4xl md:text-6xl lg:text-7xl font-bold' : ''}
              ${index === 2 ? 'text-3xl md:text-5xl lg:text-6xl font-semibold' : ''}
              text-[#222222] leading-tight
            `}
          >
            {text}
          </motion.div>
        ))}
      </div>


    </section>
  )
}