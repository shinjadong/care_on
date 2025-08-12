"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef, forwardRef } from "react"

const MAX_STEPS = 3;

export const WhyCheer = forwardRef<HTMLElement>((props, ref) => {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);

  // 부모로부터 받은 ref와 내부 ref를 연결합니다.
  useEffect(() => {
    const internalRef = sectionRef.current;
    if (typeof ref === 'function') {
      ref(internalRef);
    } else if (ref) {
      ref.current = internalRef;
    }
  }, [ref]);

  // 📖 스크롤 및 터치 이벤트 제어 로직 (수정됨)
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
      const isScrollingDown = e.deltaY > 0;
      if (isScrollingDown) {
        if (step < MAX_STEPS) {
          e.preventDefault();
          changeStep('down');
        }
      } else {
        if (step > 1) {
          e.preventDefault();
          changeStep('up');
        }
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
            if(step < MAX_STEPS) changeStep('down');
        } else {
            if(step > 1) changeStep('up');
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

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.5, ease: "easeIn" } },
  };

  return (
    <section 
        ref={sectionRef}
        className="relative h-screen w-screen snap-start bg-gradient-to-b from-black to-gray-800 flex items-center justify-center px-4 overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
            <motion.h1 key="step1" className="text-4xl md:text-6xl font-black text-white text-center" variants={variants} initial="hidden" animate="visible" exit="exit">
                실패가 두렵지 않은 이유?
            </motion.h1>
        )}
        {step === 2 && (
            <motion.div key="step2" className="text-center" variants={variants} initial="hidden" animate="visible" exit="exit">
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                    소중한 내 도전, <br />
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        &apos;케어&apos;받을 수 있으니까
                    </span>
                </h2>
            </motion.div>
        )}
        {step === 3 && (
            <motion.div key="step3" className="text-center max-w-4xl" variants={variants} initial="hidden" animate="visible" exit="exit">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                    실패가 <br />
                    <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                        두렵지 않은 세상,
                    </span>
                </h1>
                <div className="mt-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent text-xl md:text-2xl font-bold">
                    케어온이 <br />
                    사장님의 성공에 투자하겠습니다.
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
});

WhyCheer.displayName = "WhyCheer";
