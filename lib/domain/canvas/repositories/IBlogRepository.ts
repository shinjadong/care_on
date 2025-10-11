import type { BlogPost } from '../entities/BlogPost'
import type { BlogStatus } from '../types'

export interface IBlogRepository {
  findById(id: string): Promise<BlogPost | null>
  findByUserId(userId: string, filters?: BlogFilters): Promise<BlogPost[]>
  save(post: BlogPost): Promise<void>
  delete(id: string): Promise<void>
  exists(id: string): Promise<boolean>
}

export interface BlogFilters {
  status?: BlogStatus
  limit?: number
  offset?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}
