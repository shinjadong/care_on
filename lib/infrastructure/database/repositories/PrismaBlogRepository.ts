import type { PrismaClient } from '@prisma/client'
import type { IBlogRepository, BlogFilters } from '@/lib/domain/canvas/repositories/IBlogRepository'
import { BlogPost } from '@/lib/domain/canvas/entities/BlogPost'
import type { BlogImage, BlogMetadata, BlogStatus } from '@/lib/domain/canvas/types'

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
        userId,
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: {
        [filters?.sortBy || 'createdAt']: filters?.sortOrder || 'desc',
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
    // Parse JSON fields
    const images = this.parseImages(row.images)
    const metadata = row.metadata ? this.parseMetadata(row.metadata) : undefined

    // Use fromPersistence to reconstruct entity from database
    // This bypasses business rule validation (already validated when created)
    return BlogPost.fromPersistence({
      id: row.id,
      userId: row.userId,
      title: row.title,
      content: row.content,
      images,
      metadata,
      status: row.status as BlogStatus,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }

  /**
   * Convert domain entity to database record
   */
  private toPersistence(post: BlogPost) {
    return {
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      images: post.images, // Prisma will handle JSON serialization
      metadata: post.metadata || null,
      status: post.status,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }
  }

  /**
   * Parse images JSON from database
   */
  private parseImages(imagesJson: any): BlogImage[] {
    if (!imagesJson) return []

    // Prisma returns Json type, which could be string or object
    const images = typeof imagesJson === 'string'
      ? JSON.parse(imagesJson)
      : imagesJson

    if (!Array.isArray(images)) return []

    return images.map((img: any) => ({
      id: img.id,
      url: img.url,
      filename: img.filename,
      size: img.size,
      type: img.type,
      uploadedAt: new Date(img.uploadedAt),
      analysis: img.analysis,
    }))
  }

  /**
   * Parse metadata JSON from database
   */
  private parseMetadata(metadataJson: any): BlogMetadata {
    if (!metadataJson) return {}

    // Prisma returns Json type
    const metadata = typeof metadataJson === 'string'
      ? JSON.parse(metadataJson)
      : metadataJson

    return {
      seoTitle: metadata.seoTitle,
      tags: metadata.tags,
      category: metadata.category,
      coverImageUrl: metadata.coverImageUrl,
      estimatedReadingTime: metadata.estimatedReadingTime,
    }
  }
}
