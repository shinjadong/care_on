"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone, Shield, MessageCircle, Star, Home } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// 케어온 프로젝트 구조에 맞는 네비게이션 메뉴
// 창업자를 위한 종합 지원 플랫폼의 주요 서비스들을 체계적으로 구성
const navItems = [
  { 
    name: "홈", 
    href: "/", 
    icon: Home,
    description: "케어온 메인 페이지" 
  },
  { 
    name: "스타트케어", 
    href: "/start-care", 
    icon: Shield,
    description: "창업 지원 서비스" 
  },
  {
    name: "서비스",
    subItems: [
      { 
        name: "CCTV 견적 상담", 
        href: "/cctv-quote-chat", 
        description: "AI 기반 CCTV 견적 및 상담 서비스" 
      },
      { 
        name: "성공 사례", 
        href: "/review", 
        description: "실제 창업자들의 성공 후기" 
      },
    ],
  },
  { 
    name: "케어온 소개", 
    href: "#about" 
  },
  { 
    name: "문의하기", 
    href: "#contact" 
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    // 초기 스크롤 위치 확인
    handleScroll()
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 shadow-lg backdrop-blur-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 로고 영역 - 케어온 브랜드 아이덴티티 */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* 로고 이미지 - 스크롤 상태에 따라 다른 이미지 표시 (긴 로고) */}
              <div className="relative h-10 w-32 transition-all duration-300 group-hover:scale-105">
                <Image
                  src={isScrolled 
                    ? "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%BC%80%EC%96%B4%EC%98%A8%EB%A1%9C%EA%B3%A0long-%EC%97%AC%EB%B0%B1%EC%A0%9C%EA%B1%B0-mint.PNG"
                    : "https://aet4p1ka2mfpbmiq.public.blob.vercel-storage.com/%EC%BC%80%EC%96%B4%EC%98%A8%EB%A1%9C%EA%B3%A0long-%EC%97%AC%EB%B0%B1%EC%A0%9C%EA%B1%B0"
                  }
                  alt="케어온 로고"
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
              
              {/* 태그라인 - 로고 우측에 배치 */}
              <div className="flex items-center space-x-2">
                <span className={`text-sm transition-colors duration-300 ${
                  isScrolled ? "text-gray-400" : "text-gray-300"
                }`}>
                  |
                </span>
                <span className={`text-sm transition-colors duration-300 ${
                  isScrolled ? "text-gray-600" : "text-gray-200"
                }`}>
                  창업자의 든든한 파트너
                </span>
              </div>
            </Link>
          </div>

          {/* 우측 액션 버튼들 - 스크롤 상태에 따른 색상 조정 */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:1866-1845"
              className={`flex items-center text-sm font-medium transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-600 hover:text-gray-900" 
                  : "text-gray-200 hover:text-white"
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              1866-1845
            </a>
            
            <Link 
              href="/start-care"
              className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 border ${
                isScrolled 
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600" 
                  : "bg-transparent hover:bg-white/20 text-white border-white/30 hover:border-white/50"
              }`}
            >
              무료 상담 신청
            </Link>
          </div>
          {/* 모바일 메뉴 버튼 - 스크롤 상태에 따른 색상 조정 */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={`transition-colors duration-300 ${
                    isScrolled 
                      ? "text-gray-900 hover:bg-gray-100" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* 모바일 메뉴 헤더 */}
                  <div className="flex flex-col space-y-2 py-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">케어온</h2>
                    <p className="text-sm text-gray-500">창업자의 든든한 파트너</p>
                  </div>

                  {/* 모바일 네비게이션 메뉴 */}
                  <nav className="flex flex-col space-y-4 mt-6 flex-1">
                    {navItems.map((item) => (
                      <div key={item.name}>
                        {item.subItems ? (
                          <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <div className="pl-4 space-y-3">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="flex flex-col space-y-1 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-medium text-gray-900">{subItem.name}</span>
                                  {subItem.description && (
                                    <span className="text-sm text-gray-500">{subItem.description}</span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link 
                            href={item.href} 
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            {item.icon && <item.icon className="w-5 h-5 text-teal-600" />}
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{item.name}</span>
                              {item.description && (
                                <span className="text-sm text-gray-500">{item.description}</span>
                              )}
                            </div>
                          </Link>
                        )}
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
                    
                    <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                      <Link href="/start-care">무료 상담 신청</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 데스크탑 네비게이션 메뉴 - 스크롤 상태에 따른 스타일 조정 */}
        <nav className={`hidden lg:flex items-center justify-center h-12 transition-all duration-300 ${
          isScrolled 
            ? "border-t-2 border-gray-200" 
            : "border-t-2 border-white/20"
        }`}>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.subItems ? (
                    <>
                      <NavigationMenuTrigger 
                        className={`transition-colors duration-300 ${
                          isScrolled 
                            ? "text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gray-100" 
                            : "text-white hover:text-white !bg-transparent hover:!bg-transparent"
                        }`}
                      >
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4 md:w-[250px] md:grid-cols-1 lg:w-[300px]">
                          {item.subItems.map((subItem) => (
                            <ListItem 
                              key={subItem.name} 
                              href={subItem.href} 
                              title={subItem.name}
                            >
                              {subItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={`${navigationMenuTriggerStyle()} transition-colors duration-300 ${
                          isScrolled 
                            ? "text-gray-700 hover:text-gray-900 bg-transparent hover:bg-gray-100"
                            : "text-white hover:text-white !bg-transparent hover:!bg-transparent"
                        }`}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </div>
    </header>
  )
}

// 네비게이션 메뉴의 드롭다운 아이템 컴포넌트
// 마치 레스토랑 메뉴판의 각 요리 설명처럼, 서비스 이름과 설명을 제공
const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className="block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-teal-50 hover:text-teal-900 focus:bg-teal-50 focus:text-teal-900 border border-transparent hover:border-teal-200"
            {...props}
          >
            <div className="text-sm font-semibold leading-none text-gray-900">{title}</div>
            {children && (
              <p className="line-clamp-2 text-sm leading-snug text-gray-600">{children}</p>
            )}
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
