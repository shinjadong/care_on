import { EnrollmentApplication } from '../entities/EnrollmentApplication'
import type { IEnrollmentRepository } from '../repositories/IEnrollmentRepository'

/**
 * GetEnrollmentUseCase
 *
 * 사용자 ID로 승인된 Enrollment 정보를 조회합니다.
 * Canvas 도메인 등 다른 도메인에서 사용자 맥락 정보를 가져올 때 사용됩니다.
 *
 * Use Case Flow:
 * 1. userId로 enrollment 조회
 * 2. 존재 여부 확인
 * 3. 승인된 상태인지 확인 (Canvas 블로그 생성은 승인된 가맹점만 가능)
 * 4. EnrollmentApplication 엔티티 반환
 *
 * Business Rules:
 * - userId는 필수
 * - Enrollment가 존재해야 함
 * - Canvas 블로그 생성을 위해서는 승인된 상태여야 함 (approved)
 */
export interface GetEnrollmentInput {
  userId: string
  requireApproved?: boolean // true면 approved 상태만 허용 (default: true)
}

export class GetEnrollmentUseCase {
  constructor(private repository: IEnrollmentRepository) {}

  async execute(input: GetEnrollmentInput): Promise<EnrollmentApplication> {
    // Input validation
    if (!input.userId || input.userId.trim().length === 0) {
      throw new Error('User ID is required')
    }

    // Default: require approved status
    const requireApproved = input.requireApproved !== false

    // Repository를 통해 enrollment 조회
    const enrollments = await this.repository.findByUserId(input.userId)

    // Business rule: User must have at least one enrollment
    if (!enrollments || enrollments.length === 0) {
      throw new Error(`No enrollment found for user: ${input.userId}`)
    }

    // 가장 최근 enrollment를 사용 (여러 개 있을 수 있음)
    const enrollment = enrollments[0]

    // Business rule: For Canvas blog generation, enrollment must be approved
    if (requireApproved && enrollment.status !== 'approved') {
      throw new Error(
        `Enrollment status must be 'approved' for this operation. Current status: ${enrollment.status}`
      )
    }

    return enrollment
  }

  /**
   * Get enrollment for blog generation context
   * Alias method with explicit purpose
   */
  async getForBlogContext(userId: string): Promise<{
    businessName: string
    businessCategory: string
    businessType: string
    representativeName: string
    businessAddress?: string
  }> {
    const enrollment = await this.execute({
      userId,
      requireApproved: true,
    })

    const props = enrollment.toObject()

    // Business rule: Required fields for blog generation
    if (!props.businessName) {
      throw new Error('Business name is required for blog generation')
    }

    if (!props.businessCategory) {
      throw new Error('Business category is required for blog generation')
    }

    // Return only the fields needed for blog generation
    return {
      businessName: props.businessName,
      businessCategory: props.businessCategory,
      businessType: props.businessType,
      representativeName: props.representativeName,
      businessAddress: props.businessAddress,
    }
  }
}
