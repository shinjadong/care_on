"use client"

import { useEffect, useRef } from "react"

// 🎬 YouTube 쇼츠 영상 플레이어 섹션
// 영상 종료 시 onVideoEnd 콜백 호출

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface WhatHeroSectionProps {
  onVideoEnd: () => void
}

export function WhatHeroSection({ onVideoEnd }: WhatHeroSectionProps) {
  const playerRef = useRef<any>(null)

  useEffect(() => {
    // YouTube IFrame API 로드
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // API 준비 완료 시 플레이어 초기화
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: 'lSNchNDxYG0', // YouTube 쇼츠 ID
        playerVars: {
          autoplay: 0, // 자동 재생 안함
          mute: 0, // 음소거 해제
          controls: 1, // 컨트롤 표시
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          loop: 0,
          fs: 0, // 전체화면 버튼 숨김
          cc_load_policy: 0, // 자막 숨김
          iv_load_policy: 3, // 주석 숨김
          autohide: 1
        },
        events: {
          onReady: (event: any) => {
            // 자동 재생 제거 - 사용자가 직접 재생 버튼 클릭
          },
          onStateChange: (event: any) => {
            // 영상 종료 시 (state 0)
            if (event.data === window.YT.PlayerState.ENDED) {
              onVideoEnd()
            }
          }
        }
      })
    }

    // 이미 API가 로드된 경우 바로 초기화
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady()
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [onVideoEnd])

  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-4">
      <div 
        className="w-full max-w-md bg-black rounded-3xl overflow-hidden"
        style={{ aspectRatio: '9/16' }}
      >
        {/* YouTube 영상 플레이어 */}
        <div id="youtube-player" className="w-full h-full"></div>
      </div>
    </section>
  )
}