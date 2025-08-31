import { NextRequest, NextResponse } from 'next/server'
import { savePage, getAllPages } from '@/lib/api/pages'

export async function GET() {
  try {
    const pages = await getAllPages()
    return NextResponse.json({ success: true, data: pages })
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/pages - 페이지 저장 요청 받음')
    
    const body = await request.json()
    const { slug, title, blocks } = body

    console.log('📊 요청 데이터:', { 
      slug, 
      title, 
      blocksCount: blocks?.length || 0,
      firstBlockType: blocks?.[0]?.type 
    })

    if (!slug || !title || !blocks) {
      console.error('❌ 필수 필드 누락:', { slug: !!slug, title: !!title, blocks: !!blocks })
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    console.log('💾 savePage 함수 호출 시작...')
    const success = await savePage(slug, title, blocks)
    console.log('💾 savePage 함수 결과:', success)
    
    if (success) {
      console.log('✅ 페이지 저장 성공')
      return NextResponse.json({ success: true })
    } else {
      console.error('❌ savePage 함수에서 false 반환')
      return NextResponse.json({ success: false, error: 'Failed to save page' }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ POST /api/pages 에러:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save page',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}