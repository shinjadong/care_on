"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Wifi, Monitor, ShieldCheck, Heart } from "lucide-react"

// 🎁 케어온의 오퍼 섹션 - 1년 무료 제공의 철학 전달
// 기존 story-section에서 소개한 4가지 서비스를 1년간 무상 지원하는 메시지 전달
// 스크롤 기반 스텝별 연출로 세련된 오퍼 경험 제공

const MAX_STEPS = 3;

const services = [
  { icon: Video, name: "지능형 AI CCTV" },
  { icon: Wifi, name: "GIGA 인터넷" },
  { icon: Monitor, name: "선명한 화질의 TV" },
  { icon: ShieldCheck, name: "세이프 케어" },
];

export function WhatOfferSection() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [step3ScrollCount, setStep3ScrollCount] = useState(0); // Step 3(마지막 스텝)에서 추가 스크롤 1회 요구
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 🔄 스크롤/터치 이벤트 제어 (기존 컴포넌트와 동일한 패턴)
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    
    const changeStep = (direction: 'up' | 'down') => {
      if (isAnimating) return;
      
      // 마지막 스텝(3)에서 아래로 스크롤할 때: 첫 번째만 잡고 머무름
      if (step === 3 && direction === 'down') {
        if (step3ScrollCount === 0) {
          setStep3ScrollCount(1);
        }
        return; // 두 번째 이후는 기본 스크롤 허용(핸들러에서 prevent 안 함)
      }
      
      // 일반적인 스크롤 처리
      const newStep = direction === 'down' ? step + 1 : step - 1;
      if (newStep >= 0 && newStep <= MAX_STEPS) {
        setIsAnimating(true);
        setStep(newStep);
        // Step 3에 진입할 때 카운터 초기화
        if (newStep === 3) {
          setStep3ScrollCount(0);
        }
        setTimeout(() => setIsAnimating(false), 800);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // Step 3: 첫 번째 아래 스크롤만 막고 체류, 그 다음은 기본 스크롤 허용해 다음 섹션 이동
      if (step === 3 && goingDown) {
        if (step3ScrollCount === 0) {
          e.preventDefault();
          changeStep('down');
          return;
        }
        // 두 번째 이후: prevent 하지 않음 → 다음 섹션으로 넘어감
        return;
      }

      // 일반적인 스크롤 처리
      if (step < MAX_STEPS && goingDown) { 
        e.preventDefault(); 
        changeStep('down'); 
      } else if (step > 0 && goingUp) { 
        e.preventDefault(); 
        changeStep('up'); 
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;

      // Step 3: 첫 아래 스와이프만 막고 체류, 그 다음은 허용
      if (step === 3 && goingDown && step3ScrollCount === 0) {
        e.preventDefault();
        return;
      }

      // 일반적인 터치 처리
      if (goingDown && step < MAX_STEPS) e.preventDefault();
      else if (goingUp && step > 0) e.preventDefault();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;
      const SWIPE_THRESHOLD = 50;
      if (Math.abs(deltaY) <= SWIPE_THRESHOLD) return;

      if (goingDown) {
        if (step === 3) {
          if (step3ScrollCount === 0) {
            setStep3ScrollCount(1);
            return; // 첫 스와이프는 체류
          }
          return; // 두 번째 이후는 허용
        }
        if (step < MAX_STEPS) changeStep('down');
      } else if (goingUp && step > 0) {
        changeStep('up');
      }
    };
    
    element.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    element.addEventListener('touchstart', handleTouchStart, { passive: false, capture: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: false, capture: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    return () => {
      element.removeEventListener('wheel', handleWheel, { capture: true } as any);
      element.removeEventListener('touchstart', handleTouchStart, { capture: true } as any);
      element.removeEventListener('touchend', handleTouchEnd, { capture: true } as any);
      element.removeEventListener('touchmove', handleTouchMove, { capture: true } as any);
    };
  }, [step, isAnimating, step3ScrollCount]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        {/* Step 0: 초기 메시지 */}
        {step === 0 && (
          <motion.div 
            key="step0"
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              이 모든 것을
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                케어온이 선물합니다
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 1: 서비스 목록 표시 */}
        {step === 1 && (
          <motion.div 
            key="step1"
            className="text-center max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.56, ease: "easeOut" }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              4가지 필수 서비스
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.24 + index * 0.08 }}
                >
                  <service.icon className="w-8 h-8 md:w-10 md:h-10 text-teal-500 mb-2" />
                  <span className="text-sm md:text-base font-medium text-gray-800 text-center leading-tight">
                    {service.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: 1년 무료 강조 */}
        {step === 2 && (
          <motion.div 
            key="step2"
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <div className="mb-6">
              <motion.div
                className="text-6xl md:text-8xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.64, delay: 0.16, type: "spring", bounce: 0.4 }}
              >
                1년
              </motion.div>
              <motion.p
                className="text-xl md:text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
              >
                완전 무료
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* Step 3: 케어온의 철학 메시지 */}
        {step === 3 && (
          <motion.div 
            key="step3"
            className="text-center max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <div className="mb-6">
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.64, type: "spring", bounce: 0.3 }}
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                사장님의 성공이 <br />
                <span className="bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                  우리의 성공
                </span>
              </h3>
              <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed">
                가장 어려운 첫 시작, <br />
                케어온이 함께하겠습니다
              </p>
            </div>
          </motion.div>
        )}


      </AnimatePresence>
    </section>
  )
}
