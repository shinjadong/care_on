// Canvas Domain Types
// 블로그 포스트 및 AI 분석 관련 타입 정의

export interface BlogPost {
  id: string
  userId: string // Enrollment.userId 참조
  title: string
  content: string // Markdown 형식
  images: BlogImage[]
  metadata?: BlogMetadata
  status: BlogStatus
  createdAt: Date
  updatedAt: Date
}

export interface BlogImage {
  id: string
  url: string // Vercel Blob URL
  filename: string
  size: number
  type: string
  uploadedAt: Date
  analysis?: ImageAnalysisResult
}

export interface BlogMetadata {
  seoTitle?: string
  tags?: string[]
  category?: string
  coverImageUrl?: string
  estimatedReadingTime?: number
}

export type BlogStatus = 'draft' | 'published' | 'archived'

// Vision AI Analysis Types
export interface ImageAnalysisResult {
  themes: string[]
  suggestedTopics: string[]
  businessRelevance: string
  visualElements: string[]
  mood?: string
  colors?: string[]
  objects?: string[]
}

export interface AnalyzeImagesInput {
  images: File[]
  userId: string // Enrollment 맥락 가져오기용
}

export interface GenerateBlogInput {
  userId: string
  imageAnalysis: ImageAnalysisResult
  businessContext: BusinessContext
  userPreferences?: UserPreferences
}

export interface BusinessContext {
  businessName: string
  businessCategory: string
  businessType: string
  representativeName: string
  businessAddress?: string
  businessDescription?: string
}

export interface UserPreferences {
  tone?: 'formal' | 'casual' | 'professional' | 'friendly'
  length?: 'short' | 'medium' | 'long'
  style?: 'informative' | 'storytelling' | 'promotional'
  targetAudience?: string
}

// AI Generation Types
export interface GenerateBlogResult {
  title: string
  content: string // Markdown
  suggestedTags: string[]
  seoTitle: string
}

// Streaming Types
export interface StreamingUpdate {
  type: 'title' | 'content' | 'tags' | 'complete'
  data: string
  progress: number
}
