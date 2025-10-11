import Anthropic from '@anthropic-ai/sdk'
import type { IVisionAIService } from '@/lib/domain/canvas/repositories/IVisionAIService'
import type { ImageAnalysisResult } from '@/lib/domain/canvas/types'

/**
 * AnthropicVisionAIService
 *
 * Infrastructure layer implementation of IVisionAIService
 * Uses Anthropic Claude Vision API to analyze uploaded images
 *
 * Capabilities:
 * - Multi-image analysis (up to 10 images)
 * - Business context awareness
 * - Theme and topic extraction
 * - Visual element identification
 */
export class AnthropicVisionAIService implements IVisionAIService {
  private anthropic: Anthropic

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey,
    })
  }

  async analyzeImages(
    images: File[],
    context?: {
      businessName?: string
      businessCategory?: string
      businessType?: string
    }
  ): Promise<ImageAnalysisResult> {
    try {
      // Convert images to base64
      const base64Images = await Promise.all(
        images.map((img) => this.fileToBase64(img))
      )

      // Build context-aware prompt
      const contextPrompt = this.buildContextPrompt(context)

      // Call Anthropic Vision API
      // Using latest Claude Sonnet 4 model
      const response = await this.anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              // Add all images
              ...base64Images.map((base64Data) => ({
                type: 'image' as const,
                source: {
                  type: 'base64' as const,
                  media_type: this.getMediaType(images[0].type),
                  data: base64Data,
                },
              })),
              // Add analysis prompt
              {
                type: 'text' as const,
                text: `${contextPrompt}

이미지들을 분석하여 다음 정보를 JSON 형식으로 제공해주세요:

{
  "themes": ["주제1", "주제2", "주제3"], // 이미지에서 발견된 주요 테마들 (최대 5개)
  "suggestedTopics": ["토픽1", "토픽2", "토픽3"], // 블로그 글감으로 적합한 주제들 (최대 5개)
  "businessRelevance": "이미지가 비즈니스와 어떻게 연관되는지 설명", // 비즈니스 맥락 관련성
  "visualElements": ["요소1", "요소2"], // 주요 시각적 요소들 (색상, 분위기, 대상 등)
  "mood": "분위기 설명", // 이미지의 전체적인 무드/분위기
  "colors": ["#색상1", "#색상2"], // 주요 색상들 (hex code)
  "objects": ["객체1", "객체2"] // 식별된 주요 객체들
}

**중요**: 반드시 유효한 JSON 형식으로만 응답해주세요. 추가 설명 없이 JSON만 제공해주세요.`,
              },
            ],
          },
        ],
      })

      // Parse response
      const analysis = this.parseResponse(response)

      return analysis
    } catch (error) {
      console.error('Anthropic Vision AI error:', error)
      throw new Error(
        `Failed to analyze images: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Convert File to base64 string
   */
  private async fileToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    return buffer.toString('base64')
  }

  /**
   * Get media type for Anthropic API
   */
  private getMediaType(fileType: string): 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' {
    switch (fileType) {
      case 'image/jpeg':
      case 'image/jpg':
        return 'image/jpeg'
      case 'image/png':
        return 'image/png'
      case 'image/gif':
        return 'image/gif'
      case 'image/webp':
        return 'image/webp'
      default:
        return 'image/jpeg' // Default fallback
    }
  }

  /**
   * Build context-aware prompt
   */
  private buildContextPrompt(context?: {
    businessName?: string
    businessCategory?: string
    businessType?: string
  }): string {
    if (!context || (!context.businessName && !context.businessCategory)) {
      return '다음 이미지들을 분석하여 블로그 원고 작성을 위한 인사이트를 제공해주세요.'
    }

    const parts: string[] = []

    if (context.businessName) {
      parts.push(`상호명: ${context.businessName}`)
    }

    if (context.businessCategory) {
      parts.push(`업종: ${context.businessCategory}`)
    }

    if (context.businessType) {
      parts.push(`사업자 유형: ${context.businessType}`)
    }

    return `다음은 "${parts.join(', ')}" 사업체의 이미지입니다.
이 비즈니스의 맥락을 고려하여 이미지들을 분석하고,
해당 비즈니스에 적합한 블로그 원고 작성을 위한 인사이트를 제공해주세요.`
  }

  /**
   * Parse Anthropic API response
   */
  private parseResponse(response: any): ImageAnalysisResult {
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

      // Validate and return
      return {
        themes: parsed.themes || [],
        suggestedTopics: parsed.suggestedTopics || [],
        businessRelevance: parsed.businessRelevance || '',
        visualElements: parsed.visualElements || [],
        mood: parsed.mood,
        colors: parsed.colors,
        objects: parsed.objects,
      }
    } catch (error) {
      console.error('Failed to parse Anthropic response:', error)
      throw new Error('Failed to parse vision AI response')
    }
  }
}
