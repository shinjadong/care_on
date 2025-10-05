import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // 관리자 라우트 접근 제한 (임시로 클라이언트 사이드에서 처리)
  // 미들웨어에서 비동기 Supabase 호출로 인한 에러를 방지하기 위해 단순화
  
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 개발 환경에서는 접근 허용
    if (process.env.NODE_ENV === "development") {
      return NextResponse.next()
    }
    
    // 프로덕션에서는 클라이언트 사이드 ProtectedRoute에서 처리
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
