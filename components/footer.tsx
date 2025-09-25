"use client"
import Link from "next/link"
import { Phone, MessageCircle, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="glass-container glass-text-secondary py-16 relative overflow-hidden">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* 기업 정보 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-teal-600" />
              <p className="text-2xl font-bold glass-text-primary">케어온</p>
            </div>

            <address className="not-italic text-sm space-y-1.5 glass-text-secondary">
              <p>대표자 : 신예준</p>
              <p>경상남도 창원시 사화로80번길20, 201호 (팔용동)</p>
              <p>이메일 : siwwyy1012@gmail.com | 전화 : 1866-1845</p>
              <p>사업자등록번호 : 609-41-95762</p>
              <p>통신판매업 신고번호 : 2024-창원의창-0453호</p>
            </address>

            <p className="text-xs mt-6 glass-text-muted">
              COPYRIGHT© 2024 케어온. ALL RIGHT RESERVED.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="glass-text-primary font-semibold mb-2">바로가기</h3>
            <Link href="/privacy" className="glass-text-secondary hover:text-teal-600 transition-colors duration-200">
              개인정보 처리방침
            </Link>
            <Link href="/terms" className="glass-text-secondary hover:text-teal-600 transition-colors duration-200">
              이용약관
            </Link>
            <Link href="/review" className="glass-text-secondary hover:text-teal-600 transition-colors duration-200">
              고객 후기
            </Link>
            <Link href="/faq" className="glass-text-secondary hover:text-teal-600 transition-colors duration-200">
              자주 묻는 질문
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}