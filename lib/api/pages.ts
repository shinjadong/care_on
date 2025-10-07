import { createClient } from '@/lib/supabase/server'
import { Page, Block } from '@/types/page-builder'

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      // 페이지가 없는 경우는 정상적인 상황
      if (error.code === 'PGRST116') {
        return null
      }
      // 다른 에러는 로그만 남기고 null 반환
      console.log(`⚠️ 페이지 '${slug}' 조회 중 오류:`, error.message)
      return null
    }

    return data
  } catch (err) {
    console.log(`⚠️ 페이지 '${slug}' 조회 중 예외:`, err)
    return null
  }
}

export async function savePage(slug: string, title: string, blocks: Block[]): Promise<boolean> {
  try {
    console.log('🔧 savePage 함수 시작:', { slug, title, blocksCount: blocks.length })
    
    const supabase = await createClient()
    console.log('✅ Supabase 클라이언트 생성 완료')
    
    console.log('📤 Supabase upsert 시작...')
    const { data, error } = await supabase
      .from('pages')
      .upsert({
        slug,
        title,
        blocks,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'slug'
      })
      .select()

    console.log('📥 Supabase upsert 결과:', { data, error })

    if (error) {
      console.error('❌ Supabase upsert 에러:', error)
      console.error('에러 세부사항:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return false
    }

    console.log('✅ savePage 함수 성공 완료')
    return true
  } catch (error) {
    console.error('❌ savePage 함수 예외 발생:', error)
    return false
  }
}

export async function getAllPages(): Promise<Page[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching pages:', error)
    return []
  }

  return data || []
}

export async function deletePage(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting page:', error)
    return false
  }

  return true
}
