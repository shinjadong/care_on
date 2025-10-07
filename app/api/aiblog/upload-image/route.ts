import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * AI 블로그용 이미지 업로드 API (서버 사이드)
 *
 * POST /api/aiblog/upload-image
 *
 * 클라이언트에서 이미지를 받아서 서버에서 Supabase Storage에 업로드하고
 * 공개 URL을 반환합니다.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 인증 확인 (테스트용 임시 비활성화)
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // TODO: 프로덕션에서는 인증 필수로 되돌려야 함
    // 테스트용 UUID 생성 (crypto.randomUUID() 사용)
    const testUserId = crypto.randomUUID();
    const effectiveUserId = user?.id || testUserId;

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { success: false, error: '인증이 필요합니다.' },
    //     { status: 401 }
    //   );
    // }

    // 2. FormData에서 이미지 파일 추출
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 3. 파일 크기 검증 (30MB 제한)
    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: '이미지 크기는 30MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 4. 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 가능)' },
        { status: 400 }
      );
    }

    // 5. 파일명 생성 (사용자ID/타임스탬프_원본파일명)
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${effectiveUserId}/${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 6. ArrayBuffer를 Uint8Array로 변환
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // 7. Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('aiblog')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Supabase 업로드 오류:', uploadError);
      return NextResponse.json(
        { success: false, error: `이미지 업로드 실패: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 8. 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('aiblog')
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      return NextResponse.json(
        { success: false, error: '이미지 URL 생성 실패' },
        { status: 500 }
      );
    }

    // 9. 성공 응답
    return NextResponse.json({
      success: true,
      data: {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        url: urlData.publicUrl,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('이미지 업로드 중 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '이미지 업로드 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}

/**
 * 이미지 삭제 API
 *
 * DELETE /api/aiblog/upload-image?fileName=...
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. 인증 확인
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // 2. 파일명 추출
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: '파일명이 필요합니다.' },
        { status: 400 }
      );
    }

    // 3. 파일 소유권 확인 (파일명이 사용자ID로 시작하는지)
    if (!fileName.startsWith(`${user.id}/`)) {
      return NextResponse.json(
        { success: false, error: '본인의 이미지만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 4. Supabase Storage에서 삭제
    const { error: deleteError } = await supabase.storage
      .from('aiblog')
      .remove([fileName]);

    if (deleteError) {
      console.error('Supabase 삭제 오류:', deleteError);
      return NextResponse.json(
        { success: false, error: `이미지 삭제 실패: ${deleteError.message}` },
        { status: 500 }
      );
    }

    // 5. 성공 응답
    return NextResponse.json({
      success: true,
      message: '이미지가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('이미지 삭제 중 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '이미지 삭제 중 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
}
