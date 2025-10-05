"use client"

import { useEffect, useState } from "react"

interface UseScrollOpacityOptions {
  fadeStart?: number // 페이드 시작 지점 (vh 단위)
  fadeEnd?: number // 페이드 끝 지점 (vh 단위)
  fadeIn?: boolean // 페이드 인 효과 (기본값: false = 페이드 아웃)
  translateY?: boolean // Y축 이동 효과 사용 여부
  translateScale?: number // 이동 거리 배율
  containerSelector?: string // 컨테이너 선택자 (기본값: 전역 스크롤)
}

export function useScrollOpacity({
  fadeStart = 0,
  fadeEnd = 50,
  fadeIn = false,
  translateY = true,
  translateScale = 0.3,
  containerSelector
}: UseScrollOpacityOptions = {}) {
  const [opacity, setOpacity] = useState(fadeIn ? 0 : 1)
  const [transform, setTransform] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      // 컨테이너가 지정된 경우 해당 컨테이너 기준으로 계산
      let relativeScrollY = scrollY
      if (containerSelector) {
        const container = document.querySelector(containerSelector) as HTMLElement
        if (container) {
          const containerTop = container.offsetTop
          const containerHeight = container.offsetHeight
          const containerEnd = containerTop + containerHeight
          
          // 컨테이너 범위를 벗어난 경우 스킵
          if (scrollY < containerTop || scrollY > containerEnd) {
            return
          }
          
          relativeScrollY = scrollY - containerTop
        }
      }
      
      // 페이드 시작/끝 지점을 픽셀로 변환
      const fadeStartPx = (fadeStart / 100) * windowHeight
      const fadeEndPx = (fadeEnd / 100) * windowHeight
      
      // Opacity 계산
      let newOpacity = fadeIn ? 0 : 1 // 페이드 인이면 0에서 시작, 아니면 1에서 시작
      
      if (relativeScrollY > fadeStartPx && relativeScrollY < fadeEndPx) {
        const fadeRange = fadeEndPx - fadeStartPx
        const scrollInRange = relativeScrollY - fadeStartPx
        const progress = scrollInRange / fadeRange
        
        if (fadeIn) {
          // 페이드 인: 0 -> 1
          newOpacity = Math.min(1, progress)
        } else {
          // 페이드 아웃: 1 -> 0
          newOpacity = Math.max(0, 1 - progress)
        }
      } else if (relativeScrollY >= fadeEndPx) {
        newOpacity = fadeIn ? 1 : 0
      } else if (relativeScrollY <= fadeStartPx) {
        newOpacity = fadeIn ? 0 : 1
      }
      
      setOpacity(newOpacity)
      
      // Transform 계산
      if (translateY) {
        setTransform(relativeScrollY * translateScale)
      }
    }

    // 초기 값 설정
    handleScroll()
    
    // 스크롤 이벤트 리스너
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [fadeStart, fadeEnd, fadeIn, translateY, translateScale, containerSelector])

  return {
    opacity,
    transform: translateY ? `translateY(${transform}px)` : undefined
  }
}