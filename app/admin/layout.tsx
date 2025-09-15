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
  LogOut
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: '대시보드', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: '고객 관리', href: '/admin/customers', icon: Users },
  { name: '계약 관리', href: '/manager/contracts', icon: FileText },
  { name: '견적 관리', href: '/admin/quotes', icon: FileText },
  { name: '상품 관리', href: '/admin/products', icon: Package },
  { name: 'CS 티켓', href: '/admin/cs-tickets', icon: Ticket },
  { name: '청구/정산', href: '/admin/billing', icon: DollarSign },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen relative">
      {/* 인스타그램 스타일 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 glass-sidebar">
        <div className="flex h-full flex-col">
          {/* 로고/제목 */}
          <div className="flex h-16 items-center justify-center glass-border-light border-b">
            <h1 className="text-xl font-bold glass-text-primary">CareOn</h1>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="glass-sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="glass-sidebar-item"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* 하단 사용자 정보 */}
          <div className="glass-border-light border-t p-6 mt-auto">
            <div className="flex items-center space-x-3">
              <div className="social-profile">
                <svg className="w-6 h-6 glass-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium glass-text-primary">관리자</p>
                <p className="text-xs glass-text-secondary">admin@careon.co.kr</p>
              </div>
              <button className="social-profile w-8 h-8 hover:glass-bg-primary">
                <LogOut className="h-4 w-4 glass-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        {/* 상단 헤더 - glassmorphic */}
        <header className="glass-container m-4 mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold glass-text-primary">
                  CareOn 관리 시스템
                </h2>
                <p className="text-sm glass-text-secondary">
                  최적화된 데이터베이스 구조로 효율적인 관리를 지원합니다
                </p>
              </div>
              <div className="text-sm glass-text-secondary">
                {new Date().toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="min-h-[calc(100vh-8rem)] px-4 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}