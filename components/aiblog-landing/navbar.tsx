"use client"

import { Button } from "@/components/ui/button"
import { Bot, Menu, CreditCard, Search } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import type React from "react" 

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="flex items-center justify-between px-6 py-4 backdrop-blur-sm border-b border-white/10"
    >
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="w-8 h-8 text-github-purple" />
        <span className="text-white font-medium text-xl">자동AI 블로그</span>
      </Link>

      <div className="hidden md:flex items-center space-x-8">
        <NavLink href="/aiblog">홈</NavLink>
        <NavLink href="/aiblog/categories">카테고리</NavLink>
        <NavLink href="/aiblog/popular">인기글</NavLink>
        <NavLink href="/aiblog/recent">최신글</NavLink>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-white hover:text-github-purple">
          <Search className="w-5 h-5" />
        </Button>
        <ThemeToggle />
        <Button asChild className="bg-github-purple hover:bg-github-purple/90 text-white">
          <Link href="/payment">
            <CreditCard className="w-4 h-4 mr-2" />
            멤버십 가입
          </Link>
        </Button>
      </div>

      <Button variant="ghost" size="icon" className="md:hidden text-white">
        <Menu className="w-6 h-6" />
      </Button>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:text-white transition-colors relative group">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-github-purple transition-all group-hover:w-full" />
    </Link>
  )
}

