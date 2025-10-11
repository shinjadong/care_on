import Anthropic from '@anthropic-ai/sdk'
import type { IAIBlogService } from '@/lib/domain/canvas/repositories/IVisionAIService'
import type { ImageAnalysisResult } from '@/lib/domain/canvas/types'

/**
 * AnthropicBlogService
 *
 * Infrastructure layer implementation of IAIBlogService
 * Uses Anthropic Claude to generate contextualized blog posts
 *
 * Features:
 * - Business context-aware generation
 * - Tone and length customization
 * - SEO optimization
 * - Tag suggestions
 */
export class AnthropicBlogService implements IAIBlogService {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey,
    })
  }

  async generate(input: {
    imageAnalysis: ImageAnalysisResult
    businessContext: {
      businessName: string
      businessCategory: string
      businessType: string
      representativeName: string
    }
    userPreferences?: {
      tone?: 'formal' | 'casual' | 'professional' | 'friendly'
      length?: 'short' | 'medium' | 'long'
    }
  }): Promise<{
    title: string
    content: string
    suggestedTags: string[]
    seoTitle: string
  }> {
    try {
      const prompt = this.buildBlogGenerationPrompt(input)

      // Using latest Claude Sonnet 4 model for better blog generation
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: this.getMaxTokens(input.userPreferences?.length),
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      })

      // Parse response
      const result = this.parseResponse(response)

      return result
    } catch (error) {
      console.error('Anthropic Blog Generation error:', error)
      throw new Error(
        `Failed to generate blog: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Build comprehensive blog generation prompt
   */
  private buildBlogGenerationPrompt(input: {
    imageAnalysis: ImageAnalysisResult
    businessContext: {
      businessName: string
      businessCategory: string
      businessType: string
      representativeName: string
    }
    userPreferences?: {
      tone?: 'formal' | 'casual' | 'professional' | 'friendly'
      length?: 'short' | 'medium' | 'long'
    }
  }): string {
    const { imageAnalysis, businessContext, userPreferences } = input

    const tone = userPreferences?.tone || 'professional'
    const length = userPreferences?.length || 'medium'

    const lengthGuide = {
      short: '500-800자 (약 3-5분 읽기 분량)',
      medium: '1000-1500자 (약 5-8분 읽기 분량)',
      long: '2000-3000자 (약 10-15분 읽기 분량)',
    }

    const toneGuide = {
      formal: '격식 있고 전문적인 어조로, 경어 사용',
      casual: '친근하고 편안한 어조로, 반말 또는 가벼운 존댓말',
      professional: '전문적이면서도 접근하기 쉬운 어조',
      friendly: '다정하고 공감하는 어조로, 독자와의 대화처럼',
    }

    return `당신은 ${businessContext.businessCategory} 업종의 전문 블로그 작가입니다.

# 비즈니스 정보
- **상호명**: ${businessContext.businessName}
- **업종**: ${businessContext.businessCategory}
- **사업자 유형**: ${businessContext.businessType}
- **대표자명**: ${businessContext.representativeName}

# 이미지 분석 결과
- **주요 테마**: ${imageAnalysis.themes.join(', ')}
- **추천 주제**: ${imageAnalysis.suggestedTopics.join(', ')}
- **비즈니스 관련성**: ${imageAnalysis.businessRelevance}
- **시각적 요소**: ${imageAnalysis.visualElements.join(', ')}
${imageAnalysis.mood ? `- **분위기**: ${imageAnalysis.mood}` : ''}
${imageAnalysis.objects ? `- **주요 대상**: ${imageAnalysis.objects.join(', ')}` : ''}

# 글 작성 요구사항
- **톤**: ${toneGuide[tone]}
- **길이**: ${lengthGuide[length]}
- **형식**: 마크다운 (Markdown)
- **구조**: 제목, 서론, 본론 (2-3개 소제목), 결론

# 작성 지침
1. ${businessContext.businessName}의 비즈니스 정체성과 브랜드 가치를 반영하세요
2. 이미지에서 발견된 테마와 주제를 자연스럽게 엮어주세요
3. ${businessContext.businessCategory} 업종의 고객들이 관심 가질만한 내용으로 작성하세요
4. 실용적이고 유익한 정보를 제공하세요
5. SEO를 고려한 제목과 내용을 작성하세요

# 응답 형식
다음 JSON 형식으로만 응답해주세요:

{
  "title": "블로그 제목 (30자 이내, 흥미로우면서 정보성)",
  "content": "마크다운 형식의 본문 내용",
  "suggestedTags": ["태그1", "태그2", "태그3", "태그4", "태그5"], // 5-7개의 관련 태그
  "seoTitle": "SEO 최적화 제목 (60자 이내, 키워드 포함)"
}

**중요**: 반드시 유효한 JSON 형식으로만 응답해주세요. 추가 설명 없이 JSON만 제공해주세요.`
  }

  /**
   * Get max tokens based on length preference
   */
  private getMaxTokens(length?: 'short' | 'medium' | 'long'): number {
    switch (length) {
      case 'short':
        return 2048
      case 'long':
        return 8192
      case 'medium':
      default:
        return 4096
    }
  }

  /**
   * Parse Anthropic API response
   */
  private parseResponse(response: any): {
    title: string
    content: string
    suggestedTags: string[]
    seoTitle: string
  } {
    try {
      // Extract text content from response
      const textContent = response.content.find(
        (block: any) => block.type === 'text'
      )

      if (!textContent) {
        throw new Error('No text content in response')
      }

      // Parse JSON from response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])

      // Validate required fields
      if (!parsed.title || !parsed.content) {
        throw new Error('Missing required fields in response')
      }

      return {
        title: parsed.title,
        content: parsed.content,
        suggestedTags: parsed.suggestedTags || [],
        seoTitle: parsed.seoTitle || parsed.title,
      }
    } catch (error) {
      console.error('Failed to parse Anthropic response:', error)
      throw new Error('Failed to parse blog generation response')
    }
  }
}
