"use client"

import { AuthProvider } from "@/hooks/use-auth"

/**
 * 클라이언트 사이드 인증 프로바이더 래퍼
 * Server Component에서 안전하게 사용할 수 있도록 분리
 */
export function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}










