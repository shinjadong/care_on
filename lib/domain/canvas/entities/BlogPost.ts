import type {
  BlogImage,
  BlogMetadata,
  BlogStatus,
} from '../types'

export class BlogPost {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public title: string,
    public content: string,
    public images: BlogImage[],
    public metadata: BlogMetadata | undefined,
    public status: BlogStatus,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(input: {
    id: string
    userId: string
    title: string
    content: string
    images?: BlogImage[]
    metadata?: BlogMetadata
  }): BlogPost {
    // Business rule: Title은 필수이며 최소 3자 이상
    if (!input.title || input.title.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long')
    }

    // Business rule: Content는 비어있을 수 없음
    if (!input.content || input.content.trim().length === 0) {
      throw new Error('Content cannot be empty')
    }

    const now = new Date()
    return new BlogPost(
      input.id,
      input.userId,
      input.title,
      input.content,
      input.images || [],
      input.metadata,
      'draft',
      now,
      now
    )
  }

  /**
   * Reconstruct entity from persistence (database)
   * Used by repository to convert database rows to domain entities
   */
  static fromPersistence(props: {
    id: string
    userId: string
    title: string
    content: string
    images: BlogImage[]
    metadata?: BlogMetadata
    status: BlogStatus
    createdAt: Date
    updatedAt: Date
  }): BlogPost {
    return new BlogPost(
      props.id,
      props.userId,
      props.title,
      props.content,
      props.images,
      props.metadata,
      props.status,
      props.createdAt,
      props.updatedAt
    )
  }

  publish(): void {
    // Business rule: Draft만 publish 가능
    if (this.status !== 'draft') {
      throw new Error('Only draft posts can be published')
    }

    // Business rule: Publish 전 최종 검증
    if (this.content.trim().length < 100) {
      throw new Error('Content must be at least 100 characters to publish')
    }

    this.status = 'published'
    this.updatedAt = new Date()
  }

  archive(): void {
    // Business rule: Published 또는 draft만 archive 가능
    if (this.status === 'archived') {
      throw new Error('Post is already archived')
    }

    this.status = 'archived'
    this.updatedAt = new Date()
  }

  updateContent(newContent: string): void {
    // Business rule: Content는 비어있을 수 없음
    if (!newContent || newContent.trim().length === 0) {
      throw new Error('Content cannot be empty')
    }

    this.content = newContent
    this.updatedAt = new Date()
  }

  updateTitle(newTitle: string): void {
    // Business rule: Title은 최소 3자 이상
    if (!newTitle || newTitle.trim().length < 3) {
      throw new Error('Title must be at least 3 characters long')
    }

    this.title = newTitle
    this.updatedAt = new Date()
  }

  addImage(image: BlogImage): void {
    this.images.push(image)
    this.updatedAt = new Date()
  }

  removeImage(imageId: string): void {
    const index = this.images.findIndex((img) => img.id === imageId)
    if (index === -1) {
      throw new Error('Image not found')
    }

    this.images.splice(index, 1)
    this.updatedAt = new Date()
  }

  updateMetadata(metadata: Partial<BlogMetadata>): void {
    this.metadata = {
      ...this.metadata,
      ...metadata,
    }
    this.updatedAt = new Date()
  }

  calculateReadingTime(): number {
    // 평균 읽기 속도: 분당 200단어 (한글 기준)
    const wordCount = this.content.split(/\s+/).length
    return Math.ceil(wordCount / 200)
  }

  toPlainObject() {
    return {
      id: this.id,
      userId: this.userId,
      title: this.title,
      content: this.content,
      images: this.images,
      metadata: this.metadata,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
