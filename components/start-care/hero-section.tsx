"use client"

import { useScrollVideo } from "@/hooks/use-scroll-video"
import { useScrollOpacity } from "@/hooks/use-scroll-opacity"
import { useEffect, useState } from "react"

export function HeroSection() {
  
  const { 
    videoRef, 
    containerRef, 
    isLoading, 
    error, 
    scrollHeight 
  } = useScrollVideo({
    videoUrl: "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/hero-start-care",
    scrollHeight: 300, // 3페이지 높이로 설정
    throttleDelay: 32 // 60fps
  })

  // 타이틀 - 처음에 보임, 위로 사라짐
  const titleText = useScrollOpacity({
    fadeStart: 80,
    fadeEnd: 100,
    translateY: true,
    translateScale: -0.5  // 음수로 변경하여 위로 이동
  })

  // 서브텍스트 - 아래에서 올라오며 나타남, 중앙 고정 후 위로 사라짐
  const subText = useScrollOpacity({
    fadeStart: 30,
    fadeEnd: 100,  // 타이틀과 같은 지점에서 완전히 나타남
    fadeIn: true,
    translateY: true,
    translateScale: -0.5  // 아래에서 위로
  })
  
  // 서브텍스트 사라짐 효과
  const subTextOut = useScrollOpacity({
    fadeStart: 200,
    fadeEnd: 250,
    fadeIn: false,
    translateY: true,
    translateScale: -0.5  // 위로 사라짐
  })

  // 하단 정보바는 항상 표시 (스크롤 애니메이션 제거)
  
  // 전체 콘텐츠 페이드 아웃 효과 제거 - 항상 보이도록

  // 스크롤 위치에 따라 fixed 상태 관리 - 제거 (항상 fixed 유지)
  // 대신 300vh 이후 transform으로 자연스럽게 위로 이동
  const [videoTransform, setVideoTransform] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const triggerHeight = window.innerHeight * 3 // 300vh
      
      if (scrollY > triggerHeight) {
        // 300vh 이후 스크롤량만큼 위로 이동
        const overflow = scrollY - triggerHeight
        setVideoTransform(-overflow)
      } else {
        setVideoTransform(0)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // 초기 상태 설정

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* 보이지 않는 스크롤 트리거 - 300vh 공간 확보 */}
      <div 
        ref={containerRef}
        className="absolute w-full pointer-events-none"
        style={{ height: '300vh', top: 0, left: 0, zIndex: -1 }}
        aria-hidden="true"
      />

      {/* 실제 보이는 컨테이너 - 100vh 고정 */}
      <div className="relative h-screen overflow-hidden">
        {/* 비디오와 콘텐츠 - 항상 fixed, transform으로 이동 */}
        <div 
          className="fixed inset-0 w-full h-screen"
          style={{ transform: `translateY(${videoTransform}px)` }}>
          {/* 비디오 백그라운드 */}
          <div className="absolute inset-0 w-full h-full">
            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-sm">불러오는 중...</p>
                </div>
              </div>
            )}
            
            {/* 에러 메시지 */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
                <div className="text-white text-center px-4">
                  <p className="text-xl mb-2">⚠️</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* 스크롤 드리븐 비디오 */}
            <video 
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="auto"
            />
            
            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          {/* 콘텐츠 레이어 - 비디오 위에 오버레이 */}
          <div className="absolute inset-0 flex flex-col justify-center text-white z-10">
            
            {/* 메인 콘텐츠 영역 */}
            <div className="container mx-auto px-4">
              <div className="max-w-2xl text-left">
                
                {/* 타이틀 섹션 - 처음에 보이고 서서히 사라짐 */}
                <div style={{ 
                  opacity: titleText.opacity,
                  transform: titleText.transform 
                }}>
                  <span className="text-lg font-semibold">세이프 스타트 패키지</span>
                  <h1 className="text-4xl md:text-6xl font-extrabold my-4 leading-tight">
                    예비창업자를 위한
                    <br />
                    1:1 맞춤 세팅
                  </h1>
                </div>
                
                {/* 서브텍스트 - 아래에서 올라오며 나타남, 중앙 고정 후 위로 사라짐 */}
                <div style={{ 
                  opacity: Math.min(subText.opacity, subTextOut.opacity),
                  transform: `translateY(${
                    // 복합 애니메이션: 나타날 때와 사라질 때의 움직임 결합
                    (1 - subText.opacity) * 100 + // 아래에서 올라옴
                    (1 - subTextOut.opacity) * -100 // 위로 사라짐
                  }px)`
                }}>
                  <p className="text-2xl md:text-3xl text-gray-300 leading-tight mt-8">
                    떨리는 첫 사업,
                    <br />
                    실패하지 않게
                    <br />
                    다 케어해드릴게요
                  </p>
                </div>
              </div>
            </div>
            
            {/* 하단 정보 바 - 항상 고정 표시 */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm">
              <div className="container mx-auto px-4">
                <ul className="grid grid-cols-2 md:grid-cols-4 text-center py-6 gap-4">
                  <li>
                    <span className="block text-sm text-gray-300">모집 마감</span>
                    <strong className="block text-lg font-bold">
                      8/20(수) <br className="sm:hidden" />
                      자정까지
                    </strong>
                  </li>
                  <li>
                    <span className="block text-sm text-gray-300">진행 일정</span>
                    <strong className="block text-lg font-bold">
                      08/18(월) <br className="sm:hidden" />
                      오픈 예정
                    </strong>
                  </li>
                  <li>
                    <span className="block text-sm text-gray-300">견적 시간</span>
                    <strong className="block text-lg font-bold">
                      월~금 <br className="sm:hidden" />약 1~2시간
                    </strong>
                  </li>
                  <li>
                    <span className="block text-sm text-gray-300">진행 방식</span>
                    <strong className="block text-lg font-bold">
                      1:1 맞춤 <br className="sm:hidden" />
                      무료견적
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스페이서 - 다음 섹션이 300vh 후에 나타나도록 */}
      <div style={{ height: '300vh' }} aria-hidden="true" />
    </>
  )
}