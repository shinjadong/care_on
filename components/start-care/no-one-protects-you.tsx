// 마케팅의 '공포 어필' 전략 = 현실적 위험을 직시하게 만드는 기법
// 마치 의사가 환자에게 병의 심각성을 알려주는 것과 같음

"use client"

import { useState } from "react"
import Image from "next/image"

export function NoOneProtectsYou() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoId = "T-dBapdmLtM" // 유튜브 비디오 ID

  return (
    <section className="relative py-16 md:py-24 bg-black overflow-hidden">
      {/* 배경 이미지 - 반투명하게 깔리는 불안 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EB%B6%88%EC%95%88%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%A7%88%EC%8B%9D%EA%B0%90')`
        }}
      />
      
      {/* 추가 오버레이 - 텍스트 가독성을 위한 어둠 */}
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col items-center">
          {/* 메인 질문 제시 */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-2">
              가장 높은 확률의 <span className="font-extrabold">위험,</span>
            </h2>
            <h3 className="text-2xl md:text-4xl font-semibold text-white leading-tight mb-3">
              가장 무방비한 대한민국에서의
            </h3>
            <h4 className="text-3xl md:text-5xl font-bold text-white mb-8 md:mb-12">
              창업?
            </h4>
          </div>

          {/* 첫 번째 불안감 조성 텍스트 */}
          <div className="text-center mb-12 md:mb-16 max-w-3xl">
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              너무도 불안한 세상입니다.
            </p>
          </div>

          {/* 유튜브 영상 영역 */}
          <div className="w-full max-w-2xl mb-12 md:mb-16 px-4 mx-auto">
            <div className="aspect-video bg-gray-800 rounded-lg border border-gray-700 overflow-hidden relative group">
              {!isVideoPlaying ? (
                // 유튜브 썸네일 표시
                <div 
                  className="relative w-full h-full cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Image
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="폐업률 통계 영상"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 672px"
                  />
                  {/* 재생 버튼 오버레이 */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  {/* 제목 오버레이 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-semibold text-sm md:text-base">
                      폐업률 통계로 보는 창업 현실
                    </p>
                  </div>
                </div>
              ) : (
                // 유튜브 iframe 재생
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title=""
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>

          {/* 나머지 불안감 조성 텍스트 */}
          <div className="text-center mb-12 md:mb-16 max-w-3xl">
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              실력이 있다고 창업에 성공하는 시대는 지났습니다.
              <br />
              생각지도 못한 위험이 너무 많습니다. 치열한 경쟁 속에서,
              <br />
              <br />
              <span className="text-white font-semibold" style={{fontFamily: 'Garamond, serif'}}>새로 시작하는 우리, 괜찮을까요?</span>
            </p>
          </div>


          {/* 최종 메시지 */}
          <div className="text-center pt-8 md:pt-12 max-w-4xl">
            <p className="text-2xl md:text-4xl font-bold text-gray-400 leading-tight" style={{fontFamily: 'Garamond, serif'}}>
              아무도 당신을 <span className="text-gray-400">지켜주지 않습니다</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
