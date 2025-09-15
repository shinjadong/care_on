import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentHtml, context } = await request.json()

    // Claude API 호출 (실제 구현 시 Claude API 키 필요)
    // 현재는 Mock 응답으로 구현
    const improvedHtml = await generateImprovedHtml(prompt, currentHtml)

    return NextResponse.json({
      success: true,
      html: improvedHtml,
      explanation: `Claude AI가 "${prompt}" 요청에 따라 HTML을 개선했습니다.`
    })

  } catch (error) {
    console.error('Claude AI API 오류:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'AI 서비스에 일시적 문제가 발생했습니다.'
      },
      { status: 500 }
    )
  }
}

// HTML 개선 로직 (Claude API 연동 예정)
async function generateImprovedHtml(prompt: string, currentHtml: string): Promise<string> {
  // 간단한 HTML 개선 규칙들
  let improvedHtml = currentHtml || '<div></div>'

  // 기본적인 개선 로직들
  if (prompt.includes('버튼') && prompt.includes('크게')) {
    improvedHtml = improvedHtml.replace(
      /class="([^"]*btn[^"]*)"/,
      'class="$1 px-8 py-4 text-lg"'
    )
  }

  if (prompt.includes('파란색') || prompt.includes('blue')) {
    improvedHtml = improvedHtml.replace(
      /bg-\w+-\d+/g,
      'bg-blue-500'
    )
    improvedHtml = improvedHtml.replace(
      /text-\w+-\d+/g,
      'text-blue-600'
    )
  }

  if (prompt.includes('반응형')) {
    improvedHtml = improvedHtml.replace(
      /<div([^>]*)>/g,
      '<div$1 class="responsive-container">'
    )
  }

  if (prompt.includes('중앙') || prompt.includes('가운데')) {
    improvedHtml = `<div class="flex justify-center items-center">${improvedHtml}</div>`
  }

  // Tailwind CSS 클래스 자동 추가
  if (!improvedHtml.includes('class=') && improvedHtml.includes('<div')) {
    improvedHtml = improvedHtml.replace(
      /<div>/g,
      '<div class="glass-container p-6 rounded-lg">'
    )
  }

  // 기본 스타일링 적용
  if (prompt.includes('예쁘게') || prompt.includes('스타일')) {
    improvedHtml = `
<div class="glass-card p-8 max-w-4xl mx-auto">
  <div class="space-y-6">
    ${improvedHtml}
  </div>
</div>
    `.trim()
  }

  return improvedHtml
}