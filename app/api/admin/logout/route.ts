import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  await logout()
  return NextResponse.json({ success: true })
}
