import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentHtml, context } = await request.json()

    console.log('🤖 Claude AI HTML 어시스턴트 요청:', { prompt, context })

    // Claude API 호출
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      temperature: 0.1,
      system: `당신은 HTML/CSS 전문가입니다. 사용자의 요청에 따라 HTML 코드를 개선해주세요.

규칙:
1. CareOn 프로젝트의 glassmorphic 디자인 시스템을 우선 사용하세요
2. 사용 가능한 CSS 클래스들:
   - glass-container, glass-container-strong, glass-container-soft
   - glass-text-primary, glass-text-secondary, glass-text-muted
   - glass-bg-primary, glass-bg-secondary, glass-bg-accent
   - social-card, social-button, social-profile
   - thread-card (인스타그램 스타일)
3. 응답은 개선된 HTML 코드만 반환하세요 (설명 없이)
4. 반응형 디자인을 고려하세요
5. 접근성을 고려하세요`,
      messages: [
        {
          role: 'user',
          content: `현재 HTML 코드:
\`\`\`html
${currentHtml || '<div>빈 HTML 블록</div>'}
\`\`\`

사용자 요청: ${prompt}

위 HTML 코드를 사용자 요청에 따라 개선해주세요.`
        }
      ]
    })

    const improvedHtml = message.content[0]?.type === 'text'
      ? message.content[0].text
      : currentHtml

    // HTML 태그만 추출 (설명 텍스트 제거)
    const htmlMatch = improvedHtml.match(/```html\n([\s\S]*?)\n```/) ||
                     improvedHtml.match(/<[^>]+>[\s\S]*<\/[^>]+>/) ||
                     [null, improvedHtml]

    const cleanHtml = htmlMatch[1] || htmlMatch[0] || improvedHtml

    console.log('✅ Claude AI 응답 완료')

    return NextResponse.json({
      success: true,
      html: cleanHtml.trim(),
      explanation: `Claude AI가 "${prompt}" 요청에 따라 HTML을 개선했습니다.`
    })

  } catch (error) {
    console.error('❌ Claude AI API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'AI 서비스에 일시적 문제가 발생했습니다. ' + (error as Error).message
      },
      { status: 500 }
    )
  }
}
