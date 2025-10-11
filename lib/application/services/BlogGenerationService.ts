import { BlogPost } from '@/lib/domain/canvas/entities/BlogPost'
import { GetEnrollmentUseCase } from '@/lib/domain/enrollment/usecases/GetEnrollmentUseCase'
import { AnalyzeImagesUseCase } from '@/lib/domain/canvas/usecases/AnalyzeImagesUseCase'
import { GenerateBlogUseCase } from '@/lib/domain/canvas/usecases/GenerateBlogUseCase'
import type { IBlogRepository } from '@/lib/domain/canvas/repositories/IBlogRepository'

/**
 * BlogGenerationService
 *
 * Application Service Layer - 여러 도메인을 조율하는 서비스
 *
 * 이 서비스는 Clean Architecture의 Application Layer에 위치하며,
 * 여러 도메인(Enrollment, Canvas)의 Use Case들을 조합하여
 * 복잡한 비즈니스 워크플로우를 구현합니다.
 *
 * Workflow:
 * 1. 사용자가 이미지를 업로드
 * 2. GetEnrollmentUseCase로 사용자의 비즈니스 맥락 정보 조회
 * 3. AnalyzeImagesUseCase로 이미지 분석 (Vision AI)
 * 4. GenerateBlogUseCase로 맥락화된 블로그 생성
 * 5. BlogRepository를 통해 저장
 *
 * Key Design Principles:
 * - Single Source of Truth: Enrollment 엔티티만 사용자 정보 보유
 * - Use Case Reusability: 기존 Enrollment Use Case 재사용
 * - Domain Separation: 각 도메인은 독립적, Service가 조율
 * - No Data Duplication: Canvas는 Enrollment 데이터 참조만
 */

export interface GenerateBlogInput {
  userId: string
  images: File[]
  userPreferences?: {
    tone?: 'formal' | 'casual' | 'professional' | 'friendly'
    length?: 'short' | 'medium' | 'long'
  }
}

export class BlogGenerationService {
  constructor(
    private getEnrollment: GetEnrollmentUseCase,
    private analyzeImages: AnalyzeImagesUseCase,
    private generateBlog: GenerateBlogUseCase,
    private blogRepository: IBlogRepository
  ) {}

  /**
   * Generate a contextualized blog post from uploaded images
   *
   * This method orchestrates multiple domain use cases:
   * - Enrollment domain: Get business context
   * - Canvas domain: Analyze images and generate blog
   */
  async generateContextualBlog(input: GenerateBlogInput): Promise<BlogPost> {
    // Validation
    if (!input.userId || input.userId.trim().length === 0) {
      throw new Error('User ID is required')
    }

    if (!input.images || input.images.length === 0) {
      throw new Error('At least one image is required')
    }

    // Step 1: Get business context from Enrollment domain
    // This demonstrates Use Case reusability across domains
    const businessContext = await this.getEnrollment.getForBlogContext(
      input.userId
    )

    // Step 2: Analyze images with Vision AI
    const imageAnalysis = await this.analyzeImages.execute({
      images: input.images,
      userId: input.userId,
    })

    // Step 3: Generate blog with combined context
    const blog = await this.generateBlog.execute({
      userId: input.userId,
      imageAnalysis,
      businessContext: {
        businessName: businessContext.businessName,
        businessCategory: businessContext.businessCategory,
        businessType: businessContext.businessType,
        representativeName: businessContext.representativeName,
        businessAddress: businessContext.businessAddress,
      },
      userPreferences: input.userPreferences,
    })

    // Step 4: Save to repository
    await this.blogRepository.save(blog)

    return blog
  }

  /**
   * Regenerate blog with different preferences
   * Reuses existing image analysis to save Vision AI cost
   */
  async regenerateWithPreferences(input: {
    userId: string
    blogId: string
    userPreferences: {
      tone?: 'formal' | 'casual' | 'professional' | 'friendly'
      length?: 'short' | 'medium' | 'long'
    }
  }): Promise<BlogPost> {
    // Get existing blog
    const existingBlog = await this.blogRepository.findById(input.blogId)

    if (!existingBlog) {
      throw new Error(`Blog not found: ${input.blogId}`)
    }

    // Verify ownership
    if (existingBlog.userId !== input.userId) {
      throw new Error('Unauthorized: Blog belongs to different user')
    }

    // Get business context
    const businessContext = await this.getEnrollment.getForBlogContext(
      input.userId
    )

    // Reuse image analysis from existing blog
    // Assuming images have analysis stored
    if (
      !existingBlog.images ||
      existingBlog.images.length === 0 ||
      !existingBlog.images[0].analysis
    ) {
      throw new Error('No image analysis found for regeneration')
    }

    const imageAnalysis = existingBlog.images[0].analysis

    // Generate new blog with different preferences
    const newBlog = await this.generateBlog.execute({
      userId: input.userId,
      imageAnalysis,
      businessContext: {
        businessName: businessContext.businessName,
        businessCategory: businessContext.businessCategory,
        businessType: businessContext.businessType,
        representativeName: businessContext.representativeName,
        businessAddress: businessContext.businessAddress,
      },
      userPreferences: input.userPreferences,
    })

    // Update existing blog instead of creating new one
    existingBlog.updateTitle(newBlog.title)
    existingBlog.updateContent(newBlog.content)

    if (newBlog.metadata) {
      existingBlog.updateMetadata(newBlog.metadata)
    }

    await this.blogRepository.save(existingBlog)

    return existingBlog
  }

  /**
   * Get all blogs for a user
   */
  async getUserBlogs(userId: string, filters?: {
    status?: 'draft' | 'published' | 'archived'
    limit?: number
    offset?: number
  }): Promise<BlogPost[]> {
    return await this.blogRepository.findByUserId(userId, filters)
  }

  /**
   * Publish a draft blog
   */
  async publishBlog(input: { userId: string; blogId: string }): Promise<BlogPost> {
    const blog = await this.blogRepository.findById(input.blogId)

    if (!blog) {
      throw new Error(`Blog not found: ${input.blogId}`)
    }

    // Verify ownership
    if (blog.userId !== input.userId) {
      throw new Error('Unauthorized: Blog belongs to different user')
    }

    // Business rule: BlogPost entity handles publish logic
    blog.publish()

    await this.blogRepository.save(blog)

    return blog
  }

  /**
   * Archive a blog
   */
  async archiveBlog(input: { userId: string; blogId: string }): Promise<BlogPost> {
    const blog = await this.blogRepository.findById(input.blogId)

    if (!blog) {
      throw new Error(`Blog not found: ${input.blogId}`)
    }

    // Verify ownership
    if (blog.userId !== input.userId) {
      throw new Error('Unauthorized: Blog belongs to different user')
    }

    // Business rule: BlogPost entity handles archive logic
    blog.archive()

    await this.blogRepository.save(blog)

    return blog
  }

  /**
   * Delete a blog
   */
  async deleteBlog(input: { userId: string; blogId: string }): Promise<void> {
    const blog = await this.blogRepository.findById(input.blogId)

    if (!blog) {
      throw new Error(`Blog not found: ${input.blogId}`)
    }

    // Verify ownership
    if (blog.userId !== input.userId) {
      throw new Error('Unauthorized: Blog belongs to different user')
    }

    await this.blogRepository.delete(input.blogId)
  }
}
