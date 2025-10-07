import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Supabase Storage에서 page-builder 버킷의 미디어 폴더 파일들 가져오기
    const { data: files, error: listError } = await supabase.storage
      .from('page-builder')
      .list('media', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    if (listError) {
      console.error('Error listing files from Supabase Storage:', listError)
      return NextResponse.json({
        success: false,
        error: 'Failed to list files'
      }, { status: 500 })
    }

    if (!files) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => {
      const extension = file.name.toLowerCase().split('.').pop()
      return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')
    })

    // 각 파일의 public URL과 메타데이터 가져오기
    const images = imageFiles.map(file => {
      const { data: urlData } = supabase.storage
        .from('page-builder')
        .getPublicUrl(`media/${file.name}`)

      return {
        url: urlData.publicUrl,
        filename: file.name,
        size: file.metadata?.size || 0,
        uploadedAt: file.created_at || new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      data: images
    })

  } catch (error) {
    console.error('Error listing storage images:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to list images'
    }, { status: 500 })
  }
}
