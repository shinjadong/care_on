"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface UseScrollVideoOptions {
  videoUrl: string
  scrollHeight?: number // 스크롤 컨테이너 높이 (기본값: 300vh)
  throttleDelay?: number // 스크롤 이벤트 throttle 지연 시간 (ms)
}

export function useScrollVideo({ 
  videoUrl, 
  scrollHeight = 300,
  throttleDelay = 16 // 약 60fps
}: UseScrollVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()
  const lastScrollY = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)

  // 스크롤 위치를 비디오 시간으로 변환
  const calculateVideoTime = useCallback((scrollY: number, maxScroll: number, duration: number) => {
    // 스크롤 위치를 0~1 사이의 비율로 변환
    const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1)
    // 비디오 시간으로 변환
    return scrollProgress * duration
  }, [])

  // 스크롤 이벤트 핸들러 (RAF를 사용한 최적화)
  const handleScroll = useCallback(() => {
    if (!videoRef.current || !containerRef.current || !videoDuration) return

    const scrollY = window.scrollY
    const containerRect = containerRef.current.getBoundingClientRect()
    const containerTop = containerRef.current.offsetTop
    const containerHeight = containerRef.current.offsetHeight
    const windowHeight = window.innerHeight
    
    // 컨테이너 범위 체크
    const containerStart = containerTop
    const containerEnd = containerTop + containerHeight
    const isInContainer = scrollY >= containerStart && scrollY <= containerEnd
    
    // 컨테이너 내에서만 비디오 업데이트
    if (!isInContainer) return
    
    // 컨테이너 내 상대적 스크롤 위치 계산
    const relativeScrollY = scrollY - containerStart
    const maxScroll = containerHeight - windowHeight

    // RequestAnimationFrame을 사용하여 부드러운 애니메이션
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
    }

    requestRef.current = requestAnimationFrame(() => {
      if (videoRef.current) {
        const targetTime = calculateVideoTime(relativeScrollY, maxScroll, videoDuration)
        
        // 부드러운 전환을 위해 현재 시간과 목표 시간의 차이를 보간
        const currentTime = videoRef.current.currentTime
        const timeDiff = targetTime - currentTime
        
        // 시간 차이가 크지 않을 때만 부드럽게 전환
        if (Math.abs(timeDiff) < 0.5) {
          videoRef.current.currentTime = currentTime + timeDiff * 0.2
        } else {
          // 큰 차이는 즉시 적용
          videoRef.current.currentTime = targetTime
        }
      }
    })

    lastScrollY.current = scrollY
  }, [videoDuration, calculateVideoTime])

  // 스로틀링된 스크롤 핸들러
  const throttledHandleScroll = useCallback(() => {
    let isThrottled = false
    
    return () => {
      if (isThrottled) return
      
      isThrottled = true
      handleScroll()
      
      setTimeout(() => {
        isThrottled = false
      }, throttleDelay)
    }
  }, [handleScroll, throttleDelay])

  // 비디오 메타데이터 로드 핸들러
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration)
      setIsLoading(false)
      
      // 초기 위치 설정
      const scrollY = window.scrollY
      const containerHeight = containerRef.current?.offsetHeight || 0
      const windowHeight = window.innerHeight
      const maxScroll = containerHeight - windowHeight
      
      if (maxScroll > 0) {
        videoRef.current.currentTime = calculateVideoTime(
          scrollY, 
          maxScroll, 
          videoRef.current.duration
        )
      }
    }
  }, [calculateVideoTime])

  // 에러 핸들러
  const handleError = useCallback((e: Event) => {
    console.error("비디오 로딩 에러:", e)
    setError("비디오를 로드할 수 없습니다. 네트워크 연결을 확인해주세요.")
    setIsLoading(false)
  }, [])

  // 비디오 엘리먼트 생성 및 이벤트 리스너 설정
  useEffect(() => {
    if (!videoRef.current) return

    const video = videoRef.current
    const throttled = throttledHandleScroll()

    // 비디오 설정
    video.src = videoUrl
    video.preload = "auto"
    video.muted = true
    video.playsInline = true
    video.loop = false
    
    // 자동 재생 방지
    video.pause()
    
    // 이벤트 리스너 등록
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("error", handleError)
    
    // 비디오가 로드된 후 스크롤 이벤트 활성화
    if (!isLoading && videoDuration > 0) {
      window.addEventListener("scroll", throttled, { passive: true })
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("error", handleError)
      window.removeEventListener("scroll", throttled)
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [videoUrl, isLoading, videoDuration, handleLoadedMetadata, handleError, throttledHandleScroll])

  // 스크롤 이벤트 리스너 (비디오 로드 완료 후)
  useEffect(() => {
    if (isLoading || !videoDuration) return

    const throttled = throttledHandleScroll()
    
    window.addEventListener("scroll", throttled, { passive: true })
    
    // 초기 스크롤 위치 적용
    handleScroll()

    return () => {
      window.removeEventListener("scroll", throttled)
    }
  }, [isLoading, videoDuration, throttledHandleScroll, handleScroll])

  return {
    videoRef,
    containerRef,
    isLoading,
    error,
    scrollHeight,
    videoDuration
  }
}