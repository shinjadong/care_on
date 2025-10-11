/**
 * Update Enrollment Use Case
 * Updates an existing enrollment application (draft only)
 */

import {
  EnrollmentApplication,
  DomainError,
  type IEnrollmentRepository,
  type EnrollmentApplicationProps
} from '@/lib/domain/enrollment'

export interface UpdateEnrollmentInput {
  id: string
  userId: string // For authorization
  updates: Partial<Omit<EnrollmentApplicationProps, 'id' | 'createdAt' | 'updatedAt' | 'status'>>
}

export class UpdateEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: UpdateEnrollmentInput): Promise<EnrollmentApplication> {
    // Find existing application
    const enrollment = await this.repository.findById(input.id)

    if (!enrollment) {
      throw new DomainError('Enrollment application not found')
    }

    // Authorization check
    if (!enrollment.canBeUpdatedBy(input.userId)) {
      throw new DomainError('You do not have permission to update this application')
    }

    // Business Rule: Check for duplicate business number
    if (input.updates.businessNumber) {
      const existing = await this.repository.findByBusinessNumber(input.updates.businessNumber)
      if (existing && existing.id !== input.id) {
        throw new DomainError('Business number already registered')
      }
    }

    // Update domain entity (validates business rules)
    enrollment.update(input.updates)

    // Persist changes
    const saved = await this.repository.save(enrollment)

    return saved
  }
}
