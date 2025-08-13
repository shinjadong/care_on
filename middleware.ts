import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // For now, just add a simple header check
    // In production, implement proper authentication
    const authHeader = request.headers.get("authorization")

    if (!authHeader || authHeader !== "Bearer admin-temp-key") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
