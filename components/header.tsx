"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, Phone, Shield, Lightbulb, Star, HelpCircle, X } from "lucide-react"

const CareonApplicationForm = dynamic(() => import("@/components/what/CareonApplicationForm"), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">로딩중...</div>
})
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// 시간대별 다이나믹 메시지 함수 (간소화)
const getTimeBasedMessage = () => {
  return "무료체험단 마감 임박"
}

// 카운트다운 훅
const useCountdown = (targetDate: Date) => {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        setTimeLeft("마감됨")
        return
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

// 실시간 상태 표시 컴포넌트
const LiveStatus = ({ isScrolled }: { isScrolled: boolean }) => {
  const [onlineCount, setOnlineCount] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount((prev) => Math.max(1, Math.min(7, prev + Math.floor(Math.random() * 3) - 1)))
    }, 30000) // 30초마다 변경

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`flex items-center text-xs transition-colors duration-300 ${
        isScrolled ? "text-green-600" : "text-green-300"
      }`}
    >
      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
      <span>지금 {onlineCount}명 상담중</span>
    </div>
  )
}

// 케어온 프로젝트 구조에 맞는 네비게이션 메뉴 (마케팅 최적화)
// 고객 여정 중심으로 재구성하여 감정적 연결과 긴급성 강화
const navItems = [
  {
    name: "오픈 이벤트",
    href: "/what",
    icon: Shield,
    description: "실패가 두렵지 않은 세상",
    badge: "20개 한정",
    urgency: true,
    hasEvent: true,
  },
  {
    name: "스타트케어",
    href: "/start-care",
    icon: Lightbulb,
    description: "시작부터 케어받기",
  },
  {
    name: "리얼 후기",
    href: "/review",
    icon: Star,
    description: "결과를 직접 확인해보세요",
  },
  {
    name: "자주 묻는 질문",
    href: "/faq",
    icon: HelpCircle,
    description: "궁금한 점을 해결해보세요",
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)

  // 스와이프 제스처 처리
  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null) // 이전 터치 종료 지점 초기화
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > 50
    const isRightSwipe = distanceX < -50
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

    // 화면 우측 가장자리(100px 이내)에서 시작하는 좌측 스와이프만 감지
    const isEdgeSwipe = touchStart.x > window.innerWidth - 100

    if (isRightSwipe && isEdgeSwipe && !isVerticalSwipe) {
      setIsSheetOpen(true)
    }

    // 터치 상태 초기화
    setTouchStart(null)
    setTouchEnd(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 스크롤 배경 효과 (10px 이후)
      setIsScrolled(currentScrollY > 10)

      // 헤더 숨김/표시 효과 (100px 이후부터 적용)
      if (currentScrollY > 100) {
        // 스크롤 다운: 헤더 숨김
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false)
        }
        // 스크롤 업: 헤더 표시
        else if (currentScrollY < lastScrollY) {
          setIsVisible(true)
        }
      } else {
        // 상단 100px 이내에서는 항상 표시
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    // 초기 스크롤 위치 확인
    handleScroll()

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // 터치 이벤트 리스너 등록
  useEffect(() => {
    // 모바일에서만 터치 이벤트 등록
    const isMobile = window.innerWidth < 1024
    if (!isMobile) return

    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [touchStart, touchEnd])

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      } ${isVisible ? "top-0" : "-top-full"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 영역 - 케어온 브랜드 아이덴티티 */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* 로고 이미지 - 항상 원래 색상(민트)으로 표시 */}
              <div className="relative h-12 w-12 transition-all duration-300 group-hover:scale-105">
                <Image
                  src="https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%BC%80%EC%96%B4%EC%98%A8%EB%A1%9C%EA%B3%A0-%EC%97%AC%EB%B0%B1%EC%A0%9C%EA%B1%B0-mint.png"
                  alt="케어온 로고"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>

              {/* 브랜드 문구 - PC/모바일 반응형 */}
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm transition-colors duration-300 ${isScrolled ? "text-gray-400" : "text-gray-300"}`}
                >
                  |
                </span>

                {/* 모바일: 간단한 브랜드명만 */}
                <div
                  className={`lg:hidden text-sm font-semibold transition-colors duration-300 ${
                    isScrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  케어온
                </div>

                {/* PC: 상세 정보 */}
                <div
                  className={`hidden lg:block text-xs transition-colors duration-300 ${
                    isScrolled ? "text-gray-600" : "text-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1">
                      <span className="font-semibold">케어온, 창업자의 든든한 파트너</span>
                      <span className="text-xs opacity-75">(2,847명)</span>
                    </span>
                    <span>|</span>
                    <span className="font-semibold">실패가 두렵지 않은 세상</span>
                    <span>|</span>
                    <LiveStatus isScrolled={isScrolled} />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* 우측 액션 버튼들 - 스크롤 상태에 따른 색상 조정 */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:1866-1845"
              className={`flex items-center text-sm font-medium transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-gray-200 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              1866-1845
            </a>

            {/* 스타트 케어 접수 버튼 */}
            <button
              onClick={() => setShowApplicationModal(true)}
              className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-[#148777] to-[#0f6b5c] hover:from-[#0f6b5c] hover:to-[#0a5249] text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-white hover:bg-white/95 text-[#148777] shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              <Shield className="w-4 h-4 mr-2" />
              스타트 케어 접수
            </button>
          </div>
          {/* 모바일 메뉴 버튼 - 스크롤 상태에 따른 색상 조정 */}
          <div className="lg:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`transition-colors duration-300 ${
                    isScrolled 
                      ? "text-[#148777]/50 hover:bg-[#148777]/8 hover:text-[#148777]/70" 
                      : "text-[#148777]/30 hover:bg-[#148777]/15 hover:text-[#148777]/50"
                  }`}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] rounded-l-2xl">
                <SheetHeader className="sr-only">
                  <SheetTitle>메뉴</SheetTitle>
                  <SheetDescription>사이트 네비게이션 메뉴입니다</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  {/* 모바일 메뉴 헤더 */}
                  <div className="flex flex-col space-y-3 py-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">케어온</h2>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">창업자의 든든한 파트너</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <span>2,847명 이용중</span>
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-teal-600">100% 환급보장</span>
                        <span>•</span>
                        <LiveStatus isScrolled={false} />
                      </div>
                    </div>
                  </div>

                  {/* 모바일 네비게이션 메뉴 */}
                  <nav className="flex flex-col space-y-4 mt-6 flex-1">
                    {navItems.map((item) => (
                      <div key={item.name}>
                        <Link
                          href={item.href}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors relative"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          {item.icon && <item.icon className="w-5 h-5 text-teal-600" />}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            {item.description && <span className="text-sm text-gray-500">{item.description}</span>}
                          </div>
                          {item.hasEvent && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-bounce">
                              +event
                            </span>
                          )}
                        </Link>
                      </div>
                    ))}
                  </nav>

                  {/* 모바일 하단 액션 */}
                  <div className="pt-6 border-t space-y-4">
                    <a
                      href="tel:1866-1845"
                      className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-teal-600" />
                      <span className="font-medium text-gray-900">1866-1845</span>
                    </a>

                    {/* 모바일 스타트 케어 접수 버튼 */}
                    <Button 
                      onClick={() => {
                        setIsSheetOpen(false)
                        setShowApplicationModal(true)
                      }}
                      className="w-full bg-gradient-to-r from-[#148777] to-[#0f6b5c] hover:from-[#0f6b5c] hover:to-[#0a5249] text-white font-semibold"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      스타트 케어 접수
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 데스크탑 네비게이션 메뉴 - 스크롤 상태에 따른 스타일 조정 */}
        <nav
          className={`hidden lg:flex items-center justify-center h-10 transition-all duration-300 ${
            isScrolled ? "border-t-2 border-gray-200" : "border-t-2 border-white/20"
          }`}
        >
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`${navigationMenuTriggerStyle()} transition-colors duration-300 relative ${
                        isScrolled
                          ? "text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gray-100"
                          : "text-white hover:text-white !bg-transparent hover:!bg-transparent"
                      }`}
                    >
                      {item.name}
                      {item.hasEvent && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold animate-bounce">
                          +event
                        </span>
                      )}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>

      {/* 신청 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowApplicationModal(false)}
          />
          
          {/* 모달 컨텐츠 - 모바일 최적화 */}
          <div className="relative w-full max-w-[95vw] sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-xl">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setShowApplicationModal(false)}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 backdrop-blur hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
            
            {/* 폼 - 모바일에서 패딩 조정 */}
            <div className="p-4 sm:p-6">
              <CareonApplicationForm 
                useGrid={true}
                onSuccess={() => {
                  setTimeout(() => setShowApplicationModal(false), 2000)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
