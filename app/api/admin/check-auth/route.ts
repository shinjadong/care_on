import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated()
  
  if (authenticated) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
