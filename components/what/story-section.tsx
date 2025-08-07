"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Wifi, ShieldCheck, Video } from "lucide-react"
import Image from "next/image"

// 📖 스토리 섹션 - 스마트폰 UI를 활용한 인터랙티브 프레젠테이션
// 사용자의 스크롤에 반응하여 스마트폰 화면 속 카드가 좌우로 슬라이드되는 효과를 구현합니다.

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

const MAX_STEPS = 5; // 0:시작, 1:카드1, 2:카드2(gif), 3:카드2(logo), 4:카드3, 5:카드4

export function WhatStorySection() {
    const [step, setStep] = useState(0);
    const [isWheeling, setIsWheeling] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;
        const handleWheel = (e: WheelEvent) => {
            if (isWheeling) { e.preventDefault(); return; }
            const scrollDown = e.deltaY > 0;
            const scrollUp = e.deltaY < 0;
            if (scrollDown && step < MAX_STEPS) {
                e.preventDefault();
                setIsWheeling(true);
                setStep(s => s + 1);
                setTimeout(() => setIsWheeling(false), 1000);
            } else if (scrollUp && step > 0) {
                e.preventDefault();
                setIsWheeling(true);
                setStep(s => s - 1);
                setTimeout(() => setIsWheeling(false), 1000);
            }
        };
        element.addEventListener('wheel', handleWheel, { passive: false });
        return () => element.removeEventListener('wheel', handleWheel);
    }, [step, isWheeling]);

    const getSlideIndex = () => {
        if (step === 1) return 0;
        if (step === 2 || step === 3) return 1;
        if (step === 4) return 2;
        if (step === 5) return 3;
        return 0; // 초기 또는 비활성 상태
    };
    const slideIndex = getSlideIndex();

    return (
        <section ref={sectionRef} className="relative h-screen w-screen snap-start overflow-hidden bg-gradient-to-t from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            {/* 상단으로 이동하는 카피라이팅 */}
            <motion.h2
                className="absolute text-2xl md:text-3xl text-center z-20"
                animate={ step === 0 ? { opacity: 1, top: "50%", y: "-50%" } : { opacity: 1, top: "15%", y: "-50%" }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <span className="font-bold text-gray-900">사장님</span>
                <span className="font-semibold text-gray-700">을 위한,</span>
                <br />
                <span className="font-semibold text-gray-700">케어온의 </span>
                <span className="font-bold text-gray-900">선물</span>
            </motion.h2>

            {/* 스마트폰 프레임 */}
            <motion.div
                className="w-[300px] h-[550px] md:w-[350px] md:h-[700px] bg-gray-300 rounded-[30px] p-3 shadow-2xl flex items-center justify-center z-10"
                initial={{ opacity: 0, scale: 0.8, y: 0 }}
                animate={{ 
                    opacity: step > 0 ? 1 : 0, 
                    scale: step > 0 ? 1 : 0.8,
                    y: step > 0 ? 50 : 0 // 프레임 나타날 때 아래로 살짝 이동
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
            >
                <div className="w-full h-full bg-white rounded-[24px] overflow-hidden">
                    {/* 가로 슬라이드 컨테이너 */}
                    <motion.div
                        className="h-full flex"
                        animate={{ x: `-${slideIndex * 100}%` }}
                        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {features.map((feature) => (
                            <div key={feature.id} className="w-full h-full flex-shrink-0 flex flex-col items-center justify-center p-6">
                                {/* 미디어 영역 */}
                                <div className="relative w-full h-60 mb-6 rounded-lg bg-gray-200 overflow-hidden">
                                    <AnimatePresence>
                                        { (feature.id !== 2 || step !== 3) && feature.gifUrl && (
                                            <motion.div key={`${feature.id}-gif`} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                <Image src={feature.gifUrl} alt={feature.title} layout="fill" objectFit="cover" unoptimized />
                                            </motion.div>
                                        )}
                                        { feature.id === 2 && step === 3 && (
                                            <motion.div key="logos" className="w-full h-full flex items-center justify-around" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                {feature.logos?.map((logo) => (
                                                    <motion.div key={logo.alt} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                                        <Image src={logo.src} alt={logo.alt} width={50} height={50} objectFit="contain" />
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                {/* 텍스트 영역 */}
                                <div className="text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <feature.icon className="w-6 h-6 text-teal-500 mr-2" />
                                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
