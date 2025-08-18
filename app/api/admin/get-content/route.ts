import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth/admin-auth'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request: NextRequest) {
  // 관리자 인증 확인
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('file')
    
    // 허용된 파일만 읽기 가능
    const allowedFiles = ['privacy-policy.md', 'terms-of-service.md']
    if (!filename || !allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    // 파일 읽기
    const filePath = path.join(process.cwd(), 'content', filename)
    const content = await fs.readFile(filePath, 'utf8')
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ 
      error: '파일을 읽는 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}