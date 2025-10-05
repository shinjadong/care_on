"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface IProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
  adminOnly?: boolean
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * @param children - 보호할 컴포넌트
 * @param fallback - 로딩 중 표시할 컴포넌트
 * @param requireAuth - 인증이 필요한지 여부 (기본값: true)
 * @param adminOnly - 관리자만 접근 가능한지 여부 (기본값: false)
 */
export function ProtectedRoute({ 
  children, 
  fallback, 
  requireAuth = true,
  adminOnly = false 
}: IProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      // 인증이 필요하지만 로그인하지 않은 경우
      router.push("/login")
    } else if (!isLoading && adminOnly && user) {
      // 관리자 권한이 필요한 경우 (추후 구현)
      const isAdmin = user.user_metadata?.role === "admin"
      if (!isAdmin) {
        router.push("/")
      }
    }
  }, [user, isLoading, requireAuth, adminOnly, router])

  // 로딩 중인 경우
  if (isLoading) {
    return fallback || <AuthLoadingScreen />
  }

  // 인증이 필요하지만 로그인하지 않은 경우
  if (requireAuth && !user) {
    return null // useEffect에서 리다이렉트 처리됨
  }

  // 관리자 권한이 필요하지만 관리자가 아닌 경우
  if (adminOnly && user) {
    const isAdmin = user.user_metadata?.role === "admin"
    if (!isAdmin) {
      return null // useEffect에서 리다이렉트 처리됨
    }
  }

  return <>{children}</>
}

/**
 * 기본 로딩 화면 컴포넌트
 */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#148777] mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  )
}

/**
 * 이미 로그인한 사용자를 홈으로 리다이렉트하는 컴포넌트 (로그인/회원가입 페이지용)
 */
export function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <AuthLoadingScreen />
  }

  if (user) {
    return null // useEffect에서 리다이렉트 처리됨
  }

  return <>{children}</>
}










