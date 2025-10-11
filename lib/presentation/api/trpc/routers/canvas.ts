// tRPC Router: Canvas (Blog Editor)
// API endpoints for AI-powered blog generation and management

import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { BlogGenerationService } from '@/lib/application/services/BlogGenerationService'
import { GetEnrollmentUseCase } from '@/lib/domain/enrollment/usecases/GetEnrollmentUseCase'
import { AnalyzeImagesUseCase } from '@/lib/domain/canvas/usecases/AnalyzeImagesUseCase'
import { GenerateBlogUseCase } from '@/lib/domain/canvas/usecases/GenerateBlogUseCase'
import { PrismaEnrollmentRepository } from '@/lib/infrastructure/database/repositories/PrismaEnrollmentRepository'
import { PrismaBlogRepository } from '@/lib/infrastructure/database/repositories/PrismaBlogRepository'
import { AIServiceFactory, getAIServiceConfig } from '@/lib/infrastructure/ai/AIServiceFactory'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

/**
 * Dependency injection helper
 *
 * Creates BlogGenerationService with proper AI provider configuration
 * Provider selection is based on AI_PROVIDER environment variable:
 * - 'anthropic' (default): Uses Anthropic Claude (requires ANTHROPIC_API_KEY)
 * - 'openai': Uses OpenAI GPT (requires OPENAI_API_KEY)
 */
function getBlogGenerationService() {
  // Get AI provider configuration from environment
  const aiConfig = getAIServiceConfig()

  // Enrollment dependencies
  const enrollmentRepo = new PrismaEnrollmentRepository(prisma)
  const getEnrollment = new GetEnrollmentUseCase(enrollmentRepo)

  // Canvas dependencies - using factory pattern for multi-provider support
  const visionService = AIServiceFactory.createVisionService(aiConfig)
  const analyzeImages = new AnalyzeImagesUseCase(visionService)

  const blogAIService = AIServiceFactory.createBlogService(aiConfig)
  const generateBlog = new GenerateBlogUseCase(blogAIService)

  const blogRepo = new PrismaBlogRepository(prisma)

  // Application service (orchestrates multiple domains)
  return new BlogGenerationService(
    getEnrollment,
    analyzeImages,
    generateBlog,
    blogRepo
  )
}

function getBlogRepository() {
  return new PrismaBlogRepository(prisma)
}

export const canvasRouter = router({
  // ========================================
  // BLOG GENERATION ENDPOINTS
  // ========================================

  /**
   * Generate blog from uploaded images
   * Workflow: Images → Vision AI → Enrollment Context → Blog Generation
   */
  generateBlog: protectedProcedure
    .input(
      z.object({
        images: z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            size: z.number(),
            data: z.string(), // base64 encoded
          })
        ).min(1).max(10),
        preferences: z.object({
          tone: z.enum(['formal', 'casual', 'professional', 'friendly']).optional(),
          length: z.enum(['short', 'medium', 'long']).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Convert base64 to File objects
      const files = input.images.map((img) => {
        const buffer = Buffer.from(img.data, 'base64')
        return new File([buffer], img.name, { type: img.type })
      })

      const service = getBlogGenerationService()

      const blog = await service.generateContextualBlog({
        userId: ctx.user.id,
        images: files,
        userPreferences: input.preferences,
      })

      return blog.toPlainObject()
    }),

  /**
   * Regenerate blog with different preferences
   * Reuses existing image analysis to save API costs
   */
  regenerateBlog: protectedProcedure
    .input(
      z.object({
        blogId: z.string().uuid(),
        preferences: z.object({
          tone: z.enum(['formal', 'casual', 'professional', 'friendly']).optional(),
          length: z.enum(['short', 'medium', 'long']).optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const service = getBlogGenerationService()

      const blog = await service.regenerateWithPreferences({
        userId: ctx.user.id,
        blogId: input.blogId,
        userPreferences: input.preferences,
      })

      return blog.toPlainObject()
    }),

  // ========================================
  // BLOG CRUD ENDPOINTS
  // ========================================

  /**
   * List user's blogs
   */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'published', 'archived']).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      const service = getBlogGenerationService()

      const blogs = await service.getUserBlogs(ctx.user.id, input)

      return blogs.map((blog) => blog.toPlainObject())
    }),

  /**
   * Get blog by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const repository = getBlogRepository()

      const blog = await repository.findById(input.id)

      if (!blog) {
        throw new Error(`Blog not found: ${input.id}`)
      }

      // Verify ownership
      if (blog.userId !== ctx.user.id) {
        throw new Error('Unauthorized: Blog belongs to different user')
      }

      return blog.toPlainObject()
    }),

  /**
   * Update blog content
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(3).optional(),
        content: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const repository = getBlogRepository()

      const blog = await repository.findById(input.id)

      if (!blog) {
        throw new Error(`Blog not found: ${input.id}`)
      }

      // Verify ownership
      if (blog.userId !== ctx.user.id) {
        throw new Error('Unauthorized: Blog belongs to different user')
      }

      // Update fields
      if (input.title) {
        blog.updateTitle(input.title)
      }

      if (input.content) {
        blog.updateContent(input.content)
      }

      await repository.save(blog)

      return blog.toPlainObject()
    }),

  /**
   * Publish blog
   */
  publish: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const service = getBlogGenerationService()

      const blog = await service.publishBlog({
        userId: ctx.user.id,
        blogId: input.id,
      })

      return blog.toPlainObject()
    }),

  /**
   * Archive blog
   */
  archive: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const service = getBlogGenerationService()

      const blog = await service.archiveBlog({
        userId: ctx.user.id,
        blogId: input.id,
      })

      return blog.toPlainObject()
    }),

  /**
   * Delete blog
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const service = getBlogGenerationService()

      await service.deleteBlog({
        userId: ctx.user.id,
        blogId: input.id,
      })

      return { success: true }
    }),

  // ========================================
  // IMAGE MANAGEMENT
  // ========================================

  /**
   * Add images to existing blog
   */
  addImages: protectedProcedure
    .input(
      z.object({
        blogId: z.string().uuid(),
        images: z.array(
          z.object({
            id: z.string(),
            url: z.string().url(),
            filename: z.string(),
            size: z.number(),
            type: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const repository = getBlogRepository()

      const blog = await repository.findById(input.blogId)

      if (!blog) {
        throw new Error(`Blog not found: ${input.blogId}`)
      }

      // Verify ownership
      if (blog.userId !== ctx.user.id) {
        throw new Error('Unauthorized: Blog belongs to different user')
      }

      // Add images
      input.images.forEach((img) => {
        blog.addImage({
          ...img,
          uploadedAt: new Date(),
        })
      })

      await repository.save(blog)

      return blog.toPlainObject()
    }),

  /**
   * Remove image from blog
   */
  removeImage: protectedProcedure
    .input(
      z.object({
        blogId: z.string().uuid(),
        imageId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const repository = getBlogRepository()

      const blog = await repository.findById(input.blogId)

      if (!blog) {
        throw new Error(`Blog not found: ${input.blogId}`)
      }

      // Verify ownership
      if (blog.userId !== ctx.user.id) {
        throw new Error('Unauthorized: Blog belongs to different user')
      }

      blog.removeImage(input.imageId)

      await repository.save(blog)

      return blog.toPlainObject()
    }),
})
