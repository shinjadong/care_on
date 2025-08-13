"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Video, Wifi, Monitor, ShieldCheck, Check } from "lucide-react"
import Image from "next/image"

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

// 서비스별 이미지 URL
const serviceImages = [
  "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-1.png", // KT CCTV
  "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-2.png", // 초고속 인터넷
  "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-3.png", // IPTV
  "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-4.png", // 화재, 도난, 파손 보험
];

const productDetails = [
  {
    title: "KT CCTV",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-1.png",
    badge: "x4",
    features: ["설치비 무료", "1년 요금 무료"],
    highlight: "4대 설치"
  },
  {
    title: "초고속 인터넷",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-2.png",
    badge: "500M",
    features: ["설치비 무료", "1년 요금 무료"],
    highlight: "기가급 속도"
  },
  {
    title: "IPTV",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-3.png",
    features: ["설치비 무료", "1년 요금 무료"],
    highlight: "프리미엄 채널"
  },
  {
    title: "종합 보험",
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/products-table-4.png",
    features: ["화재·도난·파손 보장", "1년 무료 가입"],
    note: "1년 후 선택 연장",
    highlight: "3종 보장"
  }
];

export function WhatOfferSection() {
  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStartY = useRef(0);
  const lastStepScrollCount = useRef(0);

  // 🔄 스크롤/터치 이벤트 제어 (기존 컴포넌트와 동일한 패턴)
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    
    const changeStep = (direction: 'up' | 'down') => {
      if (isAnimating) return;
      
      // 일반적인 스크롤 처리
      const newStep = direction === 'down' ? step + 1 : step - 1;
      if (newStep >= 0 && newStep <= MAX_STEPS) {
        setIsAnimating(true);
        setStep(newStep);
        setTimeout(() => setIsAnimating(false), 800);
        // 마지막 스텝 진입 시 카운터 초기화
        if (newStep === MAX_STEPS) {
          lastStepScrollCount.current = 0;
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      // 마지막 스텝에서 추가 스크롤 처리
      if (goingDown && step === MAX_STEPS) {
        if (lastStepScrollCount.current < 1) {
          e.preventDefault();
          lastStepScrollCount.current += 1;
          return;
        }
        // 요구 충족 후에는 기본 스크롤 허용
        return;
      }

      // 일반적인 스크롤 처리
      if (step < MAX_STEPS && goingDown) { 
        e.preventDefault(); 
        changeStep('down'); 
      } else if (step > 0 && goingUp) { 
        e.preventDefault(); 
        lastStepScrollCount.current = 0;
        changeStep('up'); 
      }
    };
    
    const handleTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const goingDown = deltaY > 0;
      const goingUp = deltaY < 0;

      // 마지막 스텝에서 추가 스크롤 요구 중에는 기본 스크롤 막기
      if (goingDown && step === MAX_STEPS && lastStepScrollCount.current < 1) {
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

      // 마지막 스텝에서 아래로 스와이프 시 추가 스크롤 요구
      if (goingDown && step === MAX_STEPS) {
        if (lastStepScrollCount.current < 1) {
          lastStepScrollCount.current += 1;
          return;
        }
        return;
      }

      if (goingDown && step < MAX_STEPS) {
        changeStep('down');
      } else if (goingUp && step > 0) {
        lastStepScrollCount.current = 0;
        changeStep('up');
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
      className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-b from-[#f7f3ed] to-gray-100 flex items-center justify-center p-4"
    >
      <AnimatePresence mode="wait">
        {/* Step 0: 케어온 선물 메시지 */}
        {step === 0 && (
          <motion.div 
            key="step0"
            className="text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              케어온의 선물,
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl md:text-4xl font-semibold bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                스타트 케어
              </span>
            </div>
          </motion.div>
        )}

        {/* Step 1: 서비스 목록 표시 */}
        {step === 1 && (
          <motion.div 
            key="step1"
            className="text-center w-full max-w-md px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.56, ease: "easeOut" }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              4가지 필수 서비스
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.24 + index * 0.08 }}
                >
                  <service.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-teal-500 mb-2" />
                  <span className="text-xs sm:text-sm md:text-base font-medium text-gray-800 text-center leading-tight">
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
            className="text-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <motion.div className="mb-4 sm:mb-6" layoutId="free-year-text">
              <motion.div
                className="text-5xl sm:text-6xl md:text-8xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.64, delay: 0.16, type: "spring", bounce: 0.4 }}
              >
                1년
              </motion.div>
              <motion.p
                className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.48 }}
              >
                완전 무료
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3: 제품 상세 정보 - 개선된 디자인 유지 */}
        {step === 3 && (
          <motion.div 
            key="step3"
            className="w-full max-w-3xl px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.64, ease: "easeOut" }}
          >
            <motion.div layoutId="free-year-text" className="text-center mb-4 sm:mb-6 md:mb-8">
              <div className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                1년 완전 무료
              </div>
            </motion.div>
            
            {/* 제품 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {productDetails.map((product, index) => (
                <motion.div
                  key={product.title}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* 제품 이미지 */}
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-1.5 sm:p-2 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {product.badge && (
                          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
                            {product.badge}
                          </div>
                        )}
                      </div>
                      
                      {/* 제품 정보 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 mb-1.5 sm:mb-2 flex-wrap">
                          <h4 className="font-bold text-base sm:text-lg text-gray-900">{product.title}</h4>
                          {product.highlight && (
                            <span className="text-[10px] sm:text-xs bg-teal-100 text-teal-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                              {product.highlight}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-0.5 sm:space-y-1">
                          {product.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 sm:gap-2">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs sm:text-sm text-gray-700 leading-tight">{feature}</span>
                            </div>
                          ))}
                          {product.note && (
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">{product.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}
