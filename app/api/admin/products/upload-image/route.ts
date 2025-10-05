import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string

    console.log('[Upload Image] Received request:', {
      hasFile: !!file,
      productId,
      fileSize: file?.size,
      fileType: file?.type
    })

    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      )
    }

    // 파일 유효성 검사
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      )
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${sanitizedFileName}`
    const filePath = productId ? `${productId}/${fileName}` : fileName

    console.log('[Upload Image] File path:', filePath)

    // File을 ArrayBuffer로 변환 (Vercel Edge Runtime 호환)
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('[Upload Image] Storage upload error:', uploadError)
      return NextResponse.json(
        {
          error: '이미지 업로드에 실패했습니다.',
          details: uploadError.message
        },
        { status: 500 }
      )
    }

    console.log('[Upload Image] Upload successful:', uploadData)

    // Public URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    console.log('[Upload Image] Public URL:', publicUrl)

    // productId가 있으면 products 테이블 업데이트
    if (productId) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('product_id', productId)

      if (updateError) {
        console.error('Error updating product image_url:', updateError)
        // 이미지는 업로드됐지만 DB 업데이트 실패 - 경고만 로그
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      path: filePath
    })
  } catch (error: any) {
    console.error('[Product Image Upload API] Error:', {
      message: error?.message,
      stack: error?.stack,
      error
    })
    return NextResponse.json(
      {
        error: '이미지 업로드 중 오류가 발생했습니다.',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - 이미지 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    const productId = searchParams.get('productId')

    if (!filePath) {
      return NextResponse.json(
        { error: '파일 경로가 필요합니다.' },
        { status: 400 }
      )
    }

    // Storage에서 파일 삭제
    const { error: deleteError } = await supabase.storage
      .from('products')
      .remove([filePath])

    if (deleteError) {
      console.error('Storage delete error:', deleteError)
      return NextResponse.json(
        { error: '이미지 삭제에 실패했습니다.' },
        { status: 500 }
      )
    }

    // productId가 있으면 products 테이블에서 image_url 제거
    if (productId) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: null })
        .eq('product_id', productId)

      if (updateError) {
        console.error('Error removing product image_url:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      message: '이미지가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('[Product Image Delete API] Error:', error)
    return NextResponse.json(
      { error: '이미지 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
