import type React from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requireAuth={true} adminOnly={false}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">케어온 관리자</h1>
                <p className="text-sm text-gray-600">후기 및 콘텐츠 관리</p>
              </div>
              <nav className="flex items-center gap-4">
                <a href="/admin/reviews" className="text-sm text-gray-600 hover:text-[#148777] transition-colors">
                  후기 관리
                </a>
                <a href="/review" className="text-sm text-gray-600 hover:text-[#148777] transition-colors">
                  사이트 보기
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
