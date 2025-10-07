import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 파일 확장자 확인
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large. Maximum 10MB allowed.' }, { status: 400 })
    }

    // 고유한 파일명 생성
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const filename = `${timestamp}-${randomString}.${fileExtension}`

    // Supabase Storage에 파일 업로드
    const supabase = await createClient()
    
    // 파일을 ArrayBuffer로 변환
    const fileArrayBuffer = await file.arrayBuffer()
    
    // Supabase Storage의 page-builder 버킷에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('page-builder')
      .upload(`media/${filename}`, fileArrayBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // 업로드된 파일의 public URL 가져오기
    const { data: urlData } = supabase.storage
      .from('page-builder')
      .getPublicUrl(`media/${filename}`)

    // Supabase media 테이블에 메타데이터 저장
    const { data, error } = await supabase
      .from('media')
      .insert([
        {
          filename,
          original_filename: file.name,
          file_path: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error saving media info:', error)
      // 업로드된 파일 삭제 (cleanup)
      await supabase.storage.from('page-builder').remove([`media/${filename}`])
      return NextResponse.json({ error: 'Failed to save media info' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        url: urlData.publicUrl,
        filename: data.filename,
        originalFilename: data.original_filename,
        mimeType: data.mime_type,
        fileSize: data.file_size,
      }
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
