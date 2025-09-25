"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function EnrollmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isButtonFixed, setIsButtonFixed] = useState(false)

  useEffect(() => {
    // enrollment 페이지에서 footer를 숨기기
    const footer = document.querySelector('footer') as HTMLElement
    const floatingBanner = document.querySelector('.floating-banner') as HTMLElement

    if (footer) {
      footer.style.display = 'none'
    }
    if (floatingBanner) {
      floatingBanner.style.display = 'none'
    }

    // cleanup: 다른 페이지로 이동할 때 footer를 다시 보이게 하기
    return () => {
      if (footer) {
        footer.style.display = ''
      }
      if (floatingBanner) {
        floatingBanner.style.display = ''
      }
    }
  }, [])

  useEffect(() => {
    // 스크롤 이벤트 핸들러
    const handleScroll = () => {
      const scrollY = window.scrollY

      // 스크롤이 일정 이상 되면 버튼 고정
      if (scrollY > 100) {
        setIsButtonFixed(true)
      } else {
        setIsButtonFixed(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // 초기 상태 체크

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  return (
    <div className="enrollment-layout-wrapper">
      {/* 메인 컨텐츠 영역 */}
      <div className="enrollment-content">
        {children}
      </div>

      {/* 스타일 인젝션 - 버튼 영역 제어 */}
      <style jsx global>{`
        .enrollment-layout-wrapper {
          position: relative;
          min-height: 100vh;
        }

        .enrollment-content {
          position: relative;
        }

        /* 버튼 영역 기본 스타일 */
        .enrollment-content .p-6.pt-0:last-child {
          transition: all 0.3s ease;
        }

        /* 고정 모드일 때 버튼 영역 스타일 */
        ${isButtonFixed ? `
          .enrollment-content .p-6.pt-0:last-child {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 28rem; /* max-w-md */
            background: linear-gradient(to top, #fbfbfb 80%, transparent);
            padding-top: 1rem;
            z-index: 40;
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          @media (min-width: 768px) {
            .enrollment-content .p-6.pt-0:last-child {
              max-width: 28rem;
            }
          }

          /* 컨텐츠에 패딩 추가하여 버튼과 겹치지 않도록 */
          .enrollment-content {
            padding-bottom: 120px;
          }
        ` : `
          /* 유동 모드 - 기본 상태 유지 */
          .enrollment-content {
            padding-bottom: 0;
          }
        `}

        /* 모바일 최적화 */
        @media (max-width: 640px) {
          .enrollment-content .p-6.pt-0:last-child {
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        /* 스크롤 트랜지션 부드럽게 */
        .enrollment-content {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}