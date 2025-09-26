import { ReactNode } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Ticket,
  DollarSign,
  Settings,
  LogOut,
  UserPlus,
  MessageSquare
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: '대시보드', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: '가입 신청', href: '/admin/enrollments', icon: UserPlus },
  { name: '고객 관리', href: '/admin/customers', icon: Users },
  { name: '메시지 발송', href: '/admin/messages', icon: MessageSquare },
  { name: '계약 관리', href: '/manager/contracts', icon: FileText },
  { name: '견적 관리', href: '/admin/quotes', icon: FileText },
  { name: '상품 관리', href: '/admin/products', icon: Package },
  { name: 'CS 티켓', href: '/admin/cs-tickets', icon: Ticket },
  { name: '청구/정산', href: '/admin/billing', icon: DollarSign },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex h-full flex-col">
          {/* 로고/제목 */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">CareOn</h1>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* 하단 사용자 정보 */}
          <div className="border-t border-gray-200 p-6 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">admin@careon.co.kr</p>
              </div>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <LogOut className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        {/* 상단 헤더 */}
        <Card className="m-4 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  CareOn 관리 시스템
                </h2>
                <p className="text-sm text-gray-600">
                  최적화된 데이터베이스 구조로 효율적인 관리를 지원합니다
                </p>
              </div>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* 페이지 콘텐츠 */}
        <main className="min-h-[calc(100vh-8rem)] px-4 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}