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
    <div className="min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* 로고/제목 */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">CareOn 관리자</h1>
          </div>

          {/* 네비게이션 메뉴 */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 하단 사용자 정보 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">관리자</p>
                <p className="text-xs text-gray-500">admin@careon.co.kr</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="pl-64">
        {/* 상단 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
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
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}