import { BlogPost } from '../entities/BlogPost'
import type { GenerateBlogInput, BlogImage } from '../types'
import type { IAIBlogService } from '../repositories/IVisionAIService'

/**
 * GenerateBlogUseCase
 *
 * Vision AI 분석 결과와 사용자 맥락(Enrollment)을 기반으로 블로그 포스트를 생성합니다.
 *
 * Use Case Flow:
 * 1. 입력 검증 (imageAnalysis, businessContext)
 * 2. AI Blog Service를 통한 원고 생성
 * 3. BlogPost 엔티티 생성 (비즈니스 규칙 적용)
 * 4. 생성된 BlogPost 반환
 *
 * Business Rules:
 * - businessContext는 필수 (businessName, businessCategory, businessType, representativeName)
 * - imageAnalysis는 필수 (themes, suggestedTopics)
 * - 생성된 title은 최소 3자, content는 최소 100자
 */
export class GenerateBlogUseCase {
  constructor(private aiBlogService: IAIBlogService) {}

  async execute(input: GenerateBlogInput): Promise<BlogPost> {
    // Business rule: 필수 입력 검증
    this.validateInput(input)

    // AI Blog Service를 통한 원고 생성
    const generated = await this.aiBlogService.generate({
      imageAnalysis: input.imageAnalysis,
      businessContext: input.businessContext,
      userPreferences: input.userPreferences,
    })

    // Business rule: 생성된 콘텐츠 품질 검증
    if (generated.title.trim().length < 3) {
      throw new Error('Generated title is too short (minimum 3 characters)')
    }

    if (generated.content.trim().length < 100) {
      throw new Error(
        'Generated content is too short (minimum 100 characters for publishing)'
      )
    }

    // BlogImage 배열 생성 (이미지 메타데이터 포함)
    const blogImages: BlogImage[] = []

    // BlogPost 엔티티 생성 (비즈니스 규칙 자동 적용)
    const blogPost = BlogPost.create({
      id: this.generateId(),
      userId: input.userId,
      title: generated.title,
      content: generated.content,
      images: blogImages,
      metadata: {
        seoTitle: generated.seoTitle,
        tags: generated.suggestedTags,
        estimatedReadingTime: this.calculateReadingTime(generated.content),
      },
    })

    return blogPost
  }

  private validateInput(input: GenerateBlogInput): void {
    // imageAnalysis 검증
    if (!input.imageAnalysis) {
      throw new Error('Image analysis is required')
    }

    if (
      !input.imageAnalysis.themes ||
      input.imageAnalysis.themes.length === 0
    ) {
      throw new Error('Image analysis must contain at least one theme')
    }

    if (
      !input.imageAnalysis.suggestedTopics ||
      input.imageAnalysis.suggestedTopics.length === 0
    ) {
      throw new Error('Image analysis must contain at least one suggested topic')
    }

    // businessContext 검증
    if (!input.businessContext) {
      throw new Error('Business context is required')
    }

    const { businessName, businessCategory, businessType, representativeName } =
      input.businessContext

    if (!businessName || businessName.trim().length === 0) {
      throw new Error('Business name is required')
    }

    if (!businessCategory || businessCategory.trim().length === 0) {
      throw new Error('Business category is required')
    }

    if (!businessType || businessType.trim().length === 0) {
      throw new Error('Business type is required')
    }

    if (!representativeName || representativeName.trim().length === 0) {
      throw new Error('Representative name is required')
    }
  }

  private generateId(): string {
    // UUID v4 생성 (실제로는 crypto.randomUUID() 또는 uuid 라이브러리 사용)
    return `blog_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private calculateReadingTime(content: string): number {
    // 평균 읽기 속도: 분당 200단어 (한글 기준)
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }
}
