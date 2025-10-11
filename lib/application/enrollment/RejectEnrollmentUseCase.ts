/**
 * Reject Enrollment Use Case
 * Admin rejects an enrollment application
 */

import {
  EnrollmentApplication,
  DomainError,
  type IEnrollmentRepository
} from '@/lib/domain/enrollment'

export interface RejectEnrollmentInput {
  id: string
  reason: string
  adminUserId: string // For audit trail
}

export class RejectEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: RejectEnrollmentInput): Promise<EnrollmentApplication> {
    // Find existing application
    const enrollment = await this.repository.findById(input.id)

    if (!enrollment) {
      throw new DomainError('Enrollment application not found')
    }

    // Reject (validates business rules: reason required, status must be submitted/reviewing)
    enrollment.reject(input.reason)

    // Persist changes
    const saved = await this.repository.save(enrollment)

    // TODO: Send rejection notification with reason
    // await this.notificationService.sendApplicationRejectedNotification(saved, input.reason)

    return saved
  }
}
