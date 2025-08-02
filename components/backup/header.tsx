"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navItems = [
  { name: "스타트케어", href: "/start-care" },
  { name: "온라인 강의", href: "#" },
  {
    name: "1:1 맞춤 교육",
    subItems: [
      { name: "사업자 아카데미", href: "#" },
      { name: "병원 아카데미", href: "#" },
    ],
  },
  {
    name: "단체 교육",
    subItems: [
      { name: "원데이 부트캠프 (오프라인)", href: "#" },
      { name: "마케팅 원데이 부트캠프", href: "#" },
      { name: "AI 마케팅 부트캠프", href: "#" },
    ],
  },
  { name: "케어온이란?", href: "#" },
  { name: "수강생 후기", href: "#" },
  { name: "자주 묻는 질문", href: "#" },
  { name: "나에게 맞는 수업 찾으러 가기", href: "#" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">케어온 : 스타트 케어</span>
              <span className="text-xs text-gray-500">지켜줄게요. 케어온이니까</span>
            </Link>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:070-4507-4427"
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <Phone className="w-4 h-4 mr-2" />
              1866-1845
            </a>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              로그인 / 회원가입
            </Link>
          </div>
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      {item.subItems ? (
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <div className="pl-4 mt-2 space-y-2">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block text-gray-600 hover:text-gray-900"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link href={item.href} className="font-semibold text-gray-600 hover:text-gray-900">
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <a
                      href="tel:070-4507-4427"
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      1866-1845
                    </a>
                    <Link href="#" className="block mt-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                      로그인 / 회원가입
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <nav className="hidden lg:flex items-center justify-center h-12 border-t border-gray-200">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.subItems ? (
                    <>
                      <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                          {item.subItems.map((subItem) => (
                            <ListItem key={subItem.name} href={subItem.href} title={subItem.name} />
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.name}</NavigationMenuLink>
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

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"
