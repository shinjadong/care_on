"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FloatingBanner } from "@/components/floating-banner"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

// 헤더/푸터를 제외할 페이지 경로 목록
const EXCLUDED_PAGES = ["/what", "/enrollment", "/enroll"]

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // 현재 경로가 예외 페이지인지 확인
  const isExcludedPage = EXCLUDED_PAGES.some(page => pathname.startsWith(page))

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* 예외 페이지가 아닐 때만 헤더 표시 */}
      {!isExcludedPage && <Header />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* 예외 페이지가 아닐 때만 푸터와 플로팅 배너 표시 */}
      {!isExcludedPage && (
        <>
          <Footer />
          <FloatingBanner />
        </>
      )}
    </div>
  )
}

