import { createClient } from '@/lib/supabase/server'

export interface LegalDocument {
  id: string
  document_type: 'privacy-policy' | 'terms-of-service'
  title: string
  content: string
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface LegalDocumentHistory {
  id: string
  document_id: string
  document_type: string
  title: string
  content: string
  version: number
  created_at: string
  created_by?: string
}

// 문서 타입별 조회
export async function getLegalDocument(documentType: 'privacy-policy' | 'terms-of-service') {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('legal_documents')
    .select('*')
    .eq('document_type', documentType)
    .eq('is_active', true)
    .single()
  
  if (error) {
    console.error('Error fetching legal document:', error)
    return null
  }
  
  return data as LegalDocument
}

// 문서 업데이트
export async function updateLegalDocument(
  documentType: 'privacy-policy' | 'terms-of-service',
  content: string,
  updatedBy: string = 'admin'
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('legal_documents')
    .update({ 
      content,
      updated_by: updatedBy
    })
    .eq('document_type', documentType)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating legal document:', error)
    throw error
  }
  
  return data as LegalDocument
}

// 문서 히스토리 조회
export async function getLegalDocumentHistory(documentType: 'privacy-policy' | 'terms-of-service') {
  const supabase = await createClient()
  
  // 먼저 현재 문서의 ID를 가져옴
  const { data: doc } = await supabase
    .from('legal_documents')
    .select('id')
    .eq('document_type', documentType)
    .single()
  
  if (!doc) return []
  
  // 히스토리 조회
  const { data, error } = await supabase
    .from('legal_documents_history')
    .select('*')
    .eq('document_id', doc.id)
    .order('version', { ascending: false })
  
  if (error) {
    console.error('Error fetching document history:', error)
    return []
  }
  
  return data as LegalDocumentHistory[]
}

// 특정 버전으로 복원
export async function restoreLegalDocumentVersion(
  documentType: 'privacy-policy' | 'terms-of-service',
  historyId: string,
  restoredBy: string = 'admin'
) {
  const supabase = await createClient()
  
  // 히스토리에서 해당 버전 가져오기
  const { data: historyData, error: historyError } = await supabase
    .from('legal_documents_history')
    .select('*')
    .eq('id', historyId)
    .single()
  
  if (historyError || !historyData) {
    throw new Error('Version not found')
  }
  
  // 현재 문서 업데이트
  const { data, error } = await supabase
    .from('legal_documents')
    .update({
      content: historyData.content,
      updated_by: restoredBy
    })
    .eq('document_type', documentType)
    .select()
    .single()
  
  if (error) {
    throw error
  }
  
  return data as LegalDocument
}
