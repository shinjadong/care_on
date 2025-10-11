/**
 * Create Enrollment Use Case
 * Orchestrates the creation of a new enrollment application
 *
 * Application layer:
 * - Coordinates domain and infrastructure
 * - Handles workflows and business processes
 * - No UI concerns, no database details
 */

import {
  EnrollmentApplication,
  type IEnrollmentRepository
} from '@/lib/domain/enrollment'

export interface CreateEnrollmentInput {
  agreeTerms: boolean
  agreePrivacy: boolean
  agreeMarketing?: boolean
  agreeTosspay: boolean
  agreedCardCompanies?: string
  businessType: '개인사업자' | '법인사업자'
  representativeName: string
  phoneNumber: string
  birthDate: string
  gender: 'male' | 'female'
  userId?: string
}

export class CreateEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: CreateEnrollmentInput): Promise<EnrollmentApplication> {
    // Business Rule: Check for duplicate business number if provided
    // (This would happen on update, not on initial create)

    // Create domain entity (validates business rules)
    const enrollment = EnrollmentApplication.createDraft({
      agreeTerms: input.agreeTerms,
      agreePrivacy: input.agreePrivacy,
      agreeTosspay: input.agreeTosspay,
      businessType: input.businessType,
      representativeName: input.representativeName,
      phoneNumber: input.phoneNumber,
      birthDate: input.birthDate,
      gender: input.gender,
      userId: input.userId,
    })

    // Persist via repository
    const saved = await this.repository.save(enrollment)

    return saved
  }
}
