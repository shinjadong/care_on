"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Wifi, ShieldCheck, Video } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile" // 정확한 함수 이름으로 수정

const features = [
    {
        id: 1,
        icon: Video,
        title: "지능형 AI CCTV",
        description: "AI가 사람, 동물, 차량을 정확히 인식합니다.",
        gifUrl: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/ai-cctv-2.gif",
    },
    {
        id: 2,
        icon: Wifi,
        title: "GIGA 인터넷",
        description: "끊김 없는 인터넷으로 사업을 안정적으로 지원합니다.",
        gifUrl: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/5g-internet.gif",
        logos: [
            { src: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/1.png", alt: "KT" },
            { src: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/2.png", alt: "SKT" },
            { src: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/3.png", alt: "LGU+" },
        ],
    },
    { id: 3, icon: Monitor, title: "선명한 화질의 TV", description: "고객의 시선을 사로잡는 다양한 콘텐츠를 활용하세요." },
    { id: 4, icon: ShieldCheck, title: "세이프 케어", description: "예기치 못한 위험에 대비하는 든든한 보험 솔루션입니다." },
];

const MAX_STEPS = 5;

export function WhatStorySection() {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const touchStartY = useRef(0);
    const isMobile = useIsMobile(); // 정확한 함수 이름으로 수정

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;
        
        const changeStep = (direction: 'up' | 'down') => {
            if (isAnimating) return;
            const newStep = direction === 'down' ? step + 1 : step - 1;
            if (newStep >= 0 && newStep <= MAX_STEPS) {
                setIsAnimating(true);
                setStep(newStep);
                setTimeout(() => setIsAnimating(false), 1000);
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

    const getSlideIndex = () => {
        if (step === 1) return 0;
        if (step >= 2 && step <= 3) return 1;
        if (step === 4) return 2;
        if (step === 5) return 3;
        return 0;
    };
    const slideIndex = getSlideIndex();

    // PC/모바일 반응형 애니메이션 정의
    const textAnimation = isMobile ? {
        // 📱 모바일: 콘텐츠 등장 시 텍스트 완전히 숨김
        initial: { opacity: 1, top: "50%", left: "50%", x: "-50%", y: "-50%" },
        animate: { opacity: 0, top: "13%", left: "50%", x: "-50%", y: "-50%" },
    } : {
        // 💻 PC 화면에서 좌측으로 이동, 간격을 좁힘
        initial: { opacity: 1, top: "50%", left: "50%", x: "-50%", y: "-50%" },
        animate: { opacity: 1, top: "50%", left: "37.5%", x: "-50%", y: "-50%" },
    };

    const frameAnimation = isMobile ? {
        // 📱 모바일: 프레임 크기 5% 축소하고 완전 중앙 위치
        initial: { opacity: 0, scale: 0.9, top: "50%", left: "50%", x: "-50%", y: "-50%" },
        animate: { opacity: 1, scale: 0.95, top: "50%", left: "50%", x: "-50%", y: "-50%" },
    } : {
        // 💻 PC 화면에서 우측으로 이동, 간격을 좁힘
        initial: { opacity: 0, scale: 0.8, top: "50%", left: "50%", x: "-50%", y: "-50%" },
        animate: { opacity: 1, scale: 1, top: "50%", left: "57%", x: "-50%", y: "-50%" },
    };

    return (
        <section ref={sectionRef} className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-t from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <motion.h2
                className="absolute text-2xl md:text-3xl text-center z-20"
                variants={textAnimation}
                initial="initial"
                animate={step === 0 ? "initial" : "animate"}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <span className="font-bold text-gray-900">사장님</span>
                <span className="font-semibold text-gray-700">을 위한,</span>
                <br />
                <span className="font-semibold text-gray-700">케어온의 </span>
                <span className="font-bold text-gray-900">선물</span>
            </motion.h2>
      
        <motion.div 
                className="absolute w-[300px] h-[610px] md:w-[350px] md:h-[712px] z-10"
                variants={frameAnimation}
                initial="initial"
                animate={step === 0 ? "initial" : "animate"}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
                <Image
                    src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/iphone-frame2"
                    alt="iPhone Frame"
                    layout="fill"
                    objectFit="contain"
                    className="pointer-events-none z-20"
                    priority
                />
                <div className="absolute top-[0%] left-[3%] right-[3%] bottom-[0%] z-10">
                    <div className="relative w-full h-full bg-white rounded-[24px] md:rounded-[40px] overflow-hidden">
                        {/* 반투명 유리 효과 레이어 */}
                        <div className="absolute inset-0 z-0 bg-gray-200 backdrop-blur-sm"></div>

                        {/* 카드 컨텐츠 레이어 */}
        <motion.div 
                            className="relative z-10 h-full flex"
                            animate={{ x: `-${slideIndex * 100}%` }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {features.map((feature) => (
                                <div key={feature.id} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center translate-y-1 md:translate-y-0 p-5 md:p-6 gap-3">
                                    <div className="relative w-full h-64 md:h-72 mt-2 mb-3 md:mt-3 md:mb-4 rounded-2xl bg-white/90 backdrop-blur-[2px] ring-1 ring-black/5 overflow-hidden shadow-md">
                                        <AnimatePresence>
                                            { (feature.id !== 2 || step !== 3) && feature.gifUrl && (
                                                <motion.div key={`${feature.id}-gif`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <Image src={feature.gifUrl} alt={feature.title} layout="fill" objectFit="cover" unoptimized />
                                                </motion.div>
                                            )}
                                            { feature.id === 2 && step === 3 && (
                                                <motion.div key="logos" className="w-full h-full flex items-center justify-center gap-x-2 md:gap-x-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                    {feature.logos?.map((logo) => (
                                                        <motion.div key={logo.alt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                                            <Image src={logo.src} alt={logo.alt} width={72} height={72} objectFit="contain" />
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
              </div>
                                    <div className="w-full bg-white/90 backdrop-blur-[2px] rounded-2xl py-4 md:py-5 px-3 md:px-4 shadow-md">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <feature.icon className="w-5 h-5 text-teal-500" />
                                            <h3 className="text-base md:text-xl font-semibold text-gray-900">{feature.title}</h3>
              </div>
                                        <p className="text-sm md:text-base text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            </div>
                            ))}
                        </motion.div>
            </div>
          </div>
        </motion.div>
    </section>
    );
}
