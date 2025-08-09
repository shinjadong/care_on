"use client"

// 마케팅 심리학에서 '문제 인식' 단계 = 고객이 자신의 문제를 깨닫게 하는 구간
// 이는 마치 의사가 환자에게 증상을 설명해주는 것과 같음

import { motion } from "framer-motion"
import Image from "next/image"

const secrets = [
  {
    number: "SECRET 1",
    title: "손님이 와도 적자입니다.",
    description: [
      "하루매출 50만원!",
      "나쁘지 않죠?",
      "그런데 왜...",
      "",
      "통장엔 0원일까요?"
    ],
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%A0%81%EC%9E%90%EC%9D%B4%EB%AF%B8%EC%A7%80"
  },
  {
    number: "SECRET 2", 
    title: "열심히 할 수록, 가난해집니다.",
    description: [
      "새벽부터 자정까지.",
      "쉬는 날도 반납하고,",
      "",
      "그런데 왜 시급은 3,500원일까요?"
    ],
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%B0%94%EC%81%A8%EC%9D%B4%EB%AF%B8%EC%A7%80"
  },
  {
    number: "SECRET 3",
    title: "안전장치가 없습니다.",
    description: [
      "화재? 화재보험이 있죠.",
      "도난? 도난보험 있습니다.",
      "",
      "그런데 왜 폐업의 위험은 보장해주는 곳이 없을까요?"
    ],
    image: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%82%99%ED%95%98%EC%9D%B4%EB%AF%B8%EC%A7%80"
  }
]

export function Secrets1to3() {
  return (
    <section className="pt-4 md:pt-6 pb-16 md:pb-24 bg-black">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* 비밀 리스트 - 각 비밀을 카드 형태로 표현 */}
        <div className="space-y-8">
          {secrets.map((secret, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-800 rounded-lg hover:shadow-2xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: 60, scale: 0.95 }} // 각 SECRET 카드가 아래에서 올라오며 살짝 작게 시작 (비밀 상자가 열리는 것처럼)
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.1, // 각 카드가 0.1초씩 지연되며 순차 등장 (비밀이 하나씩 공개되는 것처럼)
                ease: "easeOut" 
              }}
              whileHover={{ 
                scale: 1.02, // 호버 시 살짝 확대 (비밀이 부각되는 느낌)
                transition: { duration: 0.2 }
              }}
              viewport={{ once: true, amount: 0.1 }} // 10%만 보여도 즉각 트리거
            >
              {/* 데스크탑: 좌우 배치 */}
              <div className="hidden md:flex h-64">
                {/* 텍스트 콘텐츠 영역 */}
                <div className="flex-1 p-8 flex flex-col justify-center relative z-10">
                  {/* 번호와 SECRET 라벨 */}
                  <motion.div 
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, x: -20 }} // SECRET 라벨이 왼쪽에서 슬라이드 인 (비밀이 공개되는 것처럼)
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + 0.2, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-[#148777] rounded-full">
                      <em className="text-black font-bold text-sm not-italic">
                        {index + 1}
                      </em>
                    </div>
                    <div className="text-white font-bold text-xs">
                      SECRET
                    </div>
                  </motion.div>
                  
                  {/* 제목 - 임팩트 있는 문제 제기 */}
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }} // 제목이 아래에서 올라옴 (충격적인 진실이 드러나는 것처럼)
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + 0.3, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {secret.title}
                  </motion.h3>
                  
                  {/* 설명 - 공감대 형성을 위한 리듬감 있는 문장 구조 */}
                  <motion.div 
                    className="text-gray-300 leading-snug"
                    initial={{ opacity: 0, y: 15 }} // 설명이 마지막에 아래에서 등장 (세부사항이 밝혀지는 것처럼)
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index * 0.1) + 0.4, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {secret.description.map((line, lineIndex) => (
                      <p key={lineIndex} className={`${line === "" ? "mt-2" : ""} ${lineIndex === secret.description.length - 1 ? "font-bold text-white" : ""}`}>
                        {line}
                      </p>
                    ))}
                  </motion.div>
                </div>

                {/* 이미지 영역 - 데스크탑: 오른쪽 */}
                <div className="w-80 h-full relative bg-gray-700">
                  {/* 실제 이미지 */}
                  <Image
                    src={secret.image}
                    alt={`${secret.title} 관련 이미지`}
                    fill
                    className="object-cover"
                    sizes="320px"
                    priority={index === 0} // 첫 번째 이미지만 우선 로딩
                  />
                  
                  {/* 그라데이션 오버레이 - 텍스트 쪽에서 이미지 쪽으로 투명해짐 */}
                  <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-gray-900/85 to-gray-900"></div>
                </div>
              </div>

              {/* 모바일: 정사각형 컨테이너에 이미지 배경 + 텍스트 오버레이 */}
              <div className="md:hidden aspect-square relative">
                {/* 배경 이미지 영역 */}
                <div className="absolute inset-0 bg-gray-600">
                  {/* 실제 이미지 */}
                  <Image
                    src={secret.image}
                    alt={`${secret.title} 관련 이미지`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0} // 첫 번째 이미지만 우선 로딩
                  />
                </div>
                
                {/* 그라데이션 오버레이 - 위에서 아래로 텍스트 가독성 확보 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-gray-900/85 to-black/40"></div>
                
                {/* 텍스트 콘텐츠 오버레이 */}
                <div className="absolute inset-0 p-6 flex flex-col justify-start">
                  {/* 번호와 SECRET 라벨 */}
                  <motion.div 
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, x: -20 }} // 모바일에서도 같은 애니메이션
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + 0.2, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    <div className="flex items-center justify-center w-6 h-6 bg-[#148777] rounded-full">
                      <em className="text-white font-bold text-sm not-italic">
                        {index + 1}
                      </em>
                    </div>
                    <div className="text-white font-bold text-xs">
                      SECRET
                    </div>
                  </motion.div>
                  
                  {/* 제목 - 임팩트 있는 문제 제기 */}
                  <motion.h3 
                    className="text-xl font-bold text-white mb-4 leading-tight"
                    initial={{ opacity: 0, y: 20 }} // 모바일에서도 같은 애니메이션
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index * 0.1) + 0.3, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {secret.title}
                  </motion.h3>
                  
                  {/* 설명 - 공감대 형성을 위한 리듬감 있는 문장 구조 */}
                  <motion.div 
                    className="text-gray-200 leading-snug"
                    initial={{ opacity: 0, y: 15 }} // 모바일에서도 같은 애니메이션
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: (index * 0.1) + 0.4, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.5 }}
                  >
                    {secret.description.map((line, lineIndex) => (
                      <p key={lineIndex} className={`${line === "" ? "mt-2" : ""} ${lineIndex === secret.description.length - 1 ? "font-bold text-white" : ""}`}>
                        {line}
                      </p>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
