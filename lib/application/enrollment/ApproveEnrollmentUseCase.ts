/**
 * Approve Enrollment Use Case
 * Admin approves an enrollment application
 */

import {
  EnrollmentApplication,
  DomainError,
  type IEnrollmentRepository
} from '@/lib/domain/enrollment'

export interface ApproveEnrollmentInput {
  id: string
  reviewerNotes?: string
  adminUserId: string // For audit trail
}

export class ApproveEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: ApproveEnrollmentInput): Promise<EnrollmentApplication> {
    // Find existing application
    const enrollment = await this.repository.findById(input.id)

    if (!enrollment) {
      throw new DomainError('Enrollment application not found')
    }

    // Approve (validates business rules: status must be submitted/reviewing)
    enrollment.approve(input.reviewerNotes)

    // Persist changes
    const saved = await this.repository.save(enrollment)

    // TODO: Create customer account
    // await this.customerService.createFromEnrollment(saved)

    // TODO: Send approval notification
    // await this.notificationService.sendApplicationApprovedNotification(saved)

    return saved
  }
}
