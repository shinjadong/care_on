/**
 * Submit Enrollment Use Case
 * Submits an enrollment application for review
 */

import {
  EnrollmentApplication,
  DomainError,
  type IEnrollmentRepository
} from '@/lib/domain/enrollment'

export interface SubmitEnrollmentInput {
  id: string
  userId: string // For authorization
}

export class SubmitEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: SubmitEnrollmentInput): Promise<EnrollmentApplication> {
    // Find existing application
    const enrollment = await this.repository.findById(input.id)

    if (!enrollment) {
      throw new DomainError('Enrollment application not found')
    }

    // Authorization check
    if (enrollment.userId !== input.userId) {
      throw new DomainError('You do not have permission to submit this application')
    }

    // Submit (validates business rules: completeness, status, etc.)
    enrollment.submit()

    // Persist changes
    const saved = await this.repository.save(enrollment)

    // TODO: Send notification (SMS/Email) - would call infrastructure service here
    // await this.notificationService.sendApplicationSubmittedNotification(saved)

    return saved
  }
}
