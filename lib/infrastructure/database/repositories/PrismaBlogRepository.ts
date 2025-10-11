import type { PrismaClient } from '@prisma/client'
import type { IBlogRepository, BlogFilters } from '@/lib/domain/canvas/repositories/IBlogRepository'
import { BlogPost } from '@/lib/domain/canvas/entities/BlogPost'
import type { BlogImage, BlogStatus } from '@/lib/domain/canvas/types'

/**
 * PrismaBlogRepository
 *
 * Infrastructure layer implementation of IBlogRepository
 * Handles database persistence for BlogPost entities using Prisma ORM
 *
 * Responsibilities:
 * - Convert domain entities to database records
 * - Convert database records to domain entities
 * - Execute database queries via Prisma Client
 */
export class PrismaBlogRepository implements IBlogRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<BlogPost | null> {
    const row = await this.prisma.blogPost.findUnique({
      where: { id },
    })

    return row ? this.toDomain(row) : null
  }

  async findByUserId(userId: string, filters?: BlogFilters): Promise<BlogPost[]> {
    const rows = await this.prisma.blogPost.findMany({
      where: {
        user_id: userId,
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: {
        [filters?.sortBy === 'createdAt' ? 'created_at' : filters?.sortBy || 'created_at']: filters?.sortOrder || 'desc',
      },
      skip: filters?.offset || 0,
      take: filters?.limit || 50,
    })

    return rows.map((row) => this.toDomain(row))
  }

  async save(post: BlogPost): Promise<void> {
    const data = this.toPersistence(post)

    await this.prisma.blogPost.upsert({
      where: { id: post.id },
      create: data,
      update: data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blogPost.delete({
      where: { id },
    })
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.blogPost.count({
      where: { id },
    })

    return count > 0
  }

  // ========================================
  // MAPPING METHODS
  // ========================================

  /**
   * Convert database row to domain entity
   */
  private toDomain(row: any): BlogPost {
    // Parse JSON fields - image_urls is string array, convert to BlogImage format
    const images = this.parseImages(row.image_urls)
    const metadata = row.meta_description ? { seoTitle: row.meta_description } : undefined

    // Use fromPersistence to reconstruct entity from database
    // This bypasses business rule validation (already validated when created)
    return BlogPost.fromPersistence({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      images,
      metadata,
      status: row.status as BlogStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })
  }

  /**
   * Convert domain entity to database record
   */
  private toPersistence(post: BlogPost) {
    return {
      id: post.id,
      user_id: post.userId,
      title: post.title,
      content: post.content,
      keyword: post.title, // Use title as keyword for now
      image_urls: post.images.map(img => img.url),
      meta_description: post.metadata?.seoTitle || null,
      status: post.status,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
    }
  }

  /**
   * Parse images from database (image_urls is string array)
   */
  private parseImages(imageUrls: any): BlogImage[] {
    if (!imageUrls) return []

    if (!Array.isArray(imageUrls)) return []

    // Convert simple URL array to BlogImage format
    return imageUrls.map((url: string, index: number) => ({
      id: `img-${index}`,
      url,
      filename: url.split('/').pop() || 'image',
      size: 0,
      type: 'image/jpeg',
      uploadedAt: new Date(),
      analysis: undefined,
    }))
  }
}
