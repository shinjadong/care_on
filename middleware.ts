import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Development environment check
    if (process.env.NODE_ENV === "development") {
      // Allow access in development
      return NextResponse.next()
    }
    
    // Production authentication check
    const authHeader = request.headers.get("authorization")
    
    // Check for admin cookie as alternative auth method
    const adminCookie = request.cookies.get("admin-auth")
    
    if (!authHeader && !adminCookie) {
      // Redirect to login or home
      return NextResponse.redirect(new URL("/", request.url))
    }
    
    if (authHeader !== "Bearer admin-temp-key" && adminCookie?.value !== "admin-authenticated") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
