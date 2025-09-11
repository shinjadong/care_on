import { ReactNode } from 'react'
import Link from 'next/link'
import { 
  Building, 
  FileText, 
  Settings,
  Phone,
  Home
} from 'lucide-react'

interface MyLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: '홈', href: '/my', icon: Home },
  { name: '내 견적서', href: '/my/quotes', icon: FileText },
  { name: '서비스 현황', href: '/my/services', icon: Settings },
  { name: '고객센터', href: 'tel:1588-1234', icon: Phone },
]

export default function MyLayout({ children }: MyLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 모바일 친화적 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/my" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">CareOn</span>
            </Link>
            
            <div className="text-right">
              <p className="text-xs text-gray-500">고객 포털</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* 모바일 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
        <div className="flex justify-around">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5 text-gray-600" />
              <span className="text-xs text-gray-600">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}