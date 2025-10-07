import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    
    // 모든 페이지 조회
    const { data: pages, error: fetchError } = await supabase
      .from('pages')
      .select('*')

    if (fetchError) {
      console.error('Error fetching pages:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch pages'
      }, { status: 500 })
    }

    let repairedCount = 0
    
    for (const page of pages || []) {
      try {
        let needsRepair = false
        const repairedBlocks = page.blocks.map((block: any) => {
          if (!block || !block.id || !block.type || !block.content) {
            needsRepair = true
            return null
          }

          let cleanContent = { ...block.content }

          // 각 블록 타입별 데이터 정제
          switch (block.type) {
            case 'text':
              if (typeof block.content.text !== 'string') {
                needsRepair = true
                cleanContent = {
                  text: '',
                  format: 'plain'
                }
              }
              break
            case 'image':
              if (!Array.isArray(block.content.images)) {
                needsRepair = true
                // 레거시 구조 변환
                if (block.content.src) {
                  cleanContent = {
                    images: [{
                      id: 'repaired-img',
                      src: block.content.src,
                      alt: block.content.alt || '',
                      caption: block.content.caption || '',
                      width: block.content.width,
                      height: block.content.height
                    }],
                    displayMode: 'single'
                  }
                } else {
                  cleanContent = {
                    images: [],
                    displayMode: 'single'
                  }
                }
              }
              break
            case 'button':
              if (!block.content.text) {
                needsRepair = true
                cleanContent = {
                  text: '버튼',
                  link: '#',
                  variant: 'default',
                  size: 'default',
                  alignment: 'left'
                }
              }
              break
          }

          return {
            id: block.id,
            type: block.type,
            content: cleanContent,
            settings: block.settings || {}
          }
        }).filter(Boolean)

        if (needsRepair) {
          console.log(`🔧 페이지 복구 중: ${page.slug}`)
          
          const { error: updateError } = await supabase
            .from('pages')
            .update({
              blocks: repairedBlocks,
              updated_at: new Date().toISOString()
            })
            .eq('id', page.id)

          if (updateError) {
            console.error('Error repairing page:', updateError)
          } else {
            repairedCount++
          }
        }
      } catch (error) {
        console.error('Error processing page:', page.slug, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${repairedCount}개 페이지 복구 완료`
    })

  } catch (error) {
    console.error('Error repairing pages:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to repair pages'
    }, { status: 500 })
  }
}
