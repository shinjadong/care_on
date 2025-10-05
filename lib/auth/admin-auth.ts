import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import crypto from 'crypto'

// 환경 변수에서 가져오거나 하드코딩된 값 사용
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'careon-admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'careon11!!'
const SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'careon-admin-secret-key-2025'

// 세션 토큰 생성
export function generateSessionToken(username: string): string {
  const timestamp = Date.now()
  const data = `${username}:${timestamp}`
  const hash = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(data)
    .digest('hex')
  return Buffer.from(`${data}:${hash}`).toString('base64')
}

// 세션 토큰 검증
export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const [username, timestamp, hash] = decoded.split(':')
    
    // 24시간 세션 유효
    const now = Date.now()
    const tokenTime = parseInt(timestamp)
    if (now - tokenTime > 24 * 60 * 60 * 1000) {
      return false
    }
    
    // 해시 검증
    const data = `${username}:${timestamp}`
    const expectedHash = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(data)
      .digest('hex')
    
    return hash === expectedHash && username === ADMIN_USERNAME
  } catch {
    return false
  }
}

// 로그인 검증
export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

// 관리자 인증 체크
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')
  
  if (!token) {
    return false
  }
  
  return verifySessionToken(token.value)
}

// 로그인 처리
export async function login(username: string, password: string): Promise<boolean> {
  if (!verifyCredentials(username, password)) {
    return false
  }
  
  const token = generateSessionToken(username)
  const cookieStore = await cookies()
  
  cookieStore.set('admin-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24시간
    path: '/'
  })
  
  return true
}

// 로그아웃 처리
export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin-token')
}