import type { ImageAnalysisResult } from '../types'

// Vision AI 서비스 인터페이스 (Infrastructure Layer에서 구현)
export interface IVisionAIService {
  analyzeImages(
    images: File[],
    context?: {
      businessName?: string
      businessCategory?: string
      businessType?: string
    }
  ): Promise<ImageAnalysisResult>
}

// AI 블로그 생성 서비스 인터페이스
export interface IAIBlogService {
  generate(input: {
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
  }>
}
