import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth/admin-auth'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  // 관리자 인증 확인
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { filename, content } = await request.json()
    
    // 허용된 파일만 수정 가능
    const allowedFiles = ['privacy-policy.md', 'terms-of-service.md']
    if (!allowedFiles.includes(filename)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    // 파일 경로
    const filePath = path.join(process.cwd(), 'content', filename)
    
    // 백업 생성 (선택사항)
    const backupDir = path.join(process.cwd(), 'content', 'backups')
    await fs.mkdir(backupDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]
    const backupPath = path.join(backupDir, `${filename}.${timestamp}.backup`)
    
    try {
      const originalContent = await fs.readFile(filePath, 'utf8')
      await fs.writeFile(backupPath, originalContent)
    } catch (e) {
      // 원본 파일이 없으면 백업 생략
    }
    
    // 파일 저장
    await fs.writeFile(filePath, content, 'utf8')
    
    return NextResponse.json({ 
      success: true, 
      message: '저장되었습니다.',
      backup: `${filename}.${timestamp}.backup`
    })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ 
      error: '파일 저장 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}