import type { ImageAnalysisResult, AnalyzeImagesInput } from '../types'
import type { IVisionAIService } from '../repositories/IVisionAIService'

/**
 * AnalyzeImagesUseCase
 *
 * 업로드된 이미지들을 Vision AI로 분석하여 블로그 생성에 필요한 정보를 추출합니다.
 *
 * Use Case Flow:
 * 1. 입력 이미지 검증 (개수, 크기, 타입)
 * 2. Vision AI 서비스를 통한 이미지 분석
 * 3. 분석 결과 반환 (themes, topics, business relevance)
 *
 * Business Rules:
 * - 최소 1개, 최대 10개의 이미지만 허용
 * - 이미지당 최대 5MB 크기 제한
 * - 지원 형식: JPEG, PNG, WebP
 */
export class AnalyzeImagesUseCase {
  constructor(private visionService: IVisionAIService) {}

  async execute(input: AnalyzeImagesInput): Promise<ImageAnalysisResult> {
    // Business rule: 이미지 개수 검증
    if (input.images.length === 0) {
      throw new Error('At least one image is required')
    }

    if (input.images.length > 10) {
      throw new Error('Maximum 10 images allowed')
    }

    // Business rule: 이미지 크기 및 타입 검증
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

    for (const image of input.images) {
      if (image.size > MAX_FILE_SIZE) {
        throw new Error(
          `Image ${image.name} exceeds maximum size of 5MB (${(image.size / 1024 / 1024).toFixed(2)}MB)`
        )
      }

      if (!ALLOWED_TYPES.includes(image.type)) {
        throw new Error(
          `Image ${image.name} has unsupported type: ${image.type}. Allowed types: ${ALLOWED_TYPES.join(', ')}`
        )
      }
    }

    // Vision AI 서비스 호출
    // userId로부터 Enrollment 정보를 가져와 context로 전달하는 것은
    // Application Service Layer(BlogGenerationService)에서 처리
    const analysis = await this.visionService.analyzeImages(input.images)

    return analysis
  }
}
