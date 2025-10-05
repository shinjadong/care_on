import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // Use service role client for admin operations
    const supabase = await createClient(true) // true를 전달하여 service role 사용
    const body = await request.json()
    const { fileData, fileName, fileType, productId } = body

    console.log('[Upload Image] Received request:', {
      hasFileData: !!fileData,
      fileName,
      fileType,
      productId,
      dataLength: fileData?.length
    })

    if (!fileData || !fileName || !fileType) {
      return NextResponse.json(
        { error: '파일 데이터, 파일명, 파일 타입이 필요합니다.' },
        { status: 400 }
      )
    }

    // 파일 유효성 검사
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)' },
        { status: 400 }
      )
    }

    // Base64 디코딩
    const base64Data = fileData.split(',')[1] || fileData
    const buffer = Buffer.from(base64Data, 'base64')

    // 파일 크기 검사
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (buffer.length > maxSize) {
      return NextResponse.json(
        { error: '파일 크기는 5MB 이하여야 합니다.' },
        { status: 400 }
      )
    }

    // 파일명 생성 (타임스탬프 + 원본 파일명)
    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const newFileName = `${timestamp}_${sanitizedFileName}`
    const filePath = productId ? `${productId}/${newFileName}` : newFileName

    console.log('[Upload Image] File path:', filePath)

    // 먼저 버킷이 존재하는지 확인
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error('[Upload Image] Error listing buckets:', bucketsError)
    } else {
      const productsBucket = buckets?.find(b => b.id === 'products')
      if (!productsBucket) {
        console.log('[Upload Image] Products bucket not found. Creating...')
        // 버킷 생성 시도
        const { error: createError } = await supabase.storage.createBucket('products', {
          public: true
        })
        if (createError) {
          console.error('[Upload Image] Error creating bucket:', createError)
        }
      }
    }

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, buffer, {
        contentType: fileType,
        upsert: false
      })

    if (uploadError) {
      console.error('[Upload Image] Storage upload error:', {
        message: uploadError.message,
        name: uploadError.name,
        cause: uploadError.cause,
        stack: uploadError.stack
      })

      // 더 자세한 에러 메시지 반환
      let errorMessage = '이미지 업로드에 실패했습니다.'
      if (uploadError.message?.includes('bucket')) {
        errorMessage = '스토리지 버킷 설정에 문제가 있습니다. 관리자에게 문의해주세요.'
      } else if (uploadError.message?.includes('policy')) {
        errorMessage = '스토리지 권한 설정에 문제가 있습니다.'
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: uploadError.message,
          hint: 'Supabase 대시보드에서 products 버킷이 생성되어 있고 public으로 설정되어 있는지 확인하세요.'
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
    // Use service role client for admin operations
    const supabase = await createClient(true) // true를 전달하여 service role 사용
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
