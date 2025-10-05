import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth/admin-auth'
import { 
  getLegalDocument, 
  updateLegalDocument,
  getLegalDocumentHistory 
} from '@/lib/supabase/legal-documents'

// GET: 문서 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get('type') as 'privacy-policy' | 'terms-of-service'
    const includeHistory = searchParams.get('history') === 'true'
    
    if (!documentType || !['privacy-policy', 'terms-of-service'].includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    
    // 문서 조회
    const document = await getLegalDocument(documentType)
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    
    // 히스토리 포함 여부
    if (includeHistory) {
      const history = await getLegalDocumentHistory(documentType)
      return NextResponse.json({ document, history })
    }
    
    return NextResponse.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ 
      error: '문서를 불러오는 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}

// PUT: 문서 업데이트 (관리자 인증 필요)
export async function PUT(request: NextRequest) {
  // 관리자 인증 확인
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const { documentType, content } = await request.json()
    
    if (!documentType || !['privacy-policy', 'terms-of-service'].includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type' }, { status: 400 })
    }
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }
    
    // 문서 업데이트
    const updatedDocument = await updateLegalDocument(
      documentType as 'privacy-policy' | 'terms-of-service',
      content,
      'admin' // 추후 실제 관리자 ID로 변경 가능
    )
    
    return NextResponse.json({
      success: true,
      document: updatedDocument,
      message: '문서가 성공적으로 업데이트되었습니다.'
    })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ 
      error: '문서 업데이트 중 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}