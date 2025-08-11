"use client"

import React, { useEffect, useRef, useState } from "react"

/**
 * WhenVisible
 * 목적: 뷰포트(화면)에 들어올 때만 자식 컴포넌트를 마운트/렌더링하여 초기 JS 실행과 번들 로드를 줄입니다.
 * 사용법: <WhenVisible threshold={0.2}><HeavySection /></WhenVisible>
 * 제한사항: SSR 시엔 플레이스홀더만 렌더되고, 클라이언트에서 교체됩니다. SEO가 중요한 콘텐츠는 너무 늦게 렌더하지 마세요.
 *
 * 교육자 모드 비유: 공연 무대 대기실에 배우를 대기시켜 두고, 관객이 그 배우가 필요한 장면에 도달했을 때만 무대에 올립니다.
 * 이렇게 하면 무대(페이지) 시작부터 모든 배우(컴포넌트)가 동시에 움직이지 않아 체력(성능)을 아낄 수 있습니다.
 */
export interface WhenVisibleProps {
  /** 교차 임계값. 0은 한 픽셀만 보여도, 1은 전부 보여야 true */
  threshold?: number
  /** 관찰 여유 영역. 예: "200px 0px" → 미리 로딩 유도 */
  rootMargin?: string
  /** 플레이스홀더 최소 높이. 스켈레톤이나 레이아웃 시프트 방지 용도 */
  minHeight?: number
  className?: string
  children: React.ReactNode
}

export function WhenVisible({
  threshold = 0,
  rootMargin = "200px 0px",
  minHeight,
  className,
  children,
}: WhenVisibleProps) {
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) return
    const target = placeholderRef.current
    if (!target) return

    // 교차 관찰자로 뷰포트 진입 여부를 관찰
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [isVisible, threshold, rootMargin])

  if (isVisible) return <>{children}</>

  return (
    <div
      ref={placeholderRef}
      className={className}
      style={minHeight ? { minHeight } : undefined}
      aria-hidden
    />
  )
}

export default WhenVisible

