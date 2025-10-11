/**
 * Get Enrollment Use Case
 * Retrieves a single enrollment application
 */

import {
  EnrollmentApplication,
  DomainError,
  type IEnrollmentRepository
} from '@/lib/domain/enrollment'

export interface GetEnrollmentInput {
  id: string
  userId?: string // For authorization (optional - admins don't need)
  isAdmin?: boolean
}

export class GetEnrollmentUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: GetEnrollmentInput): Promise<EnrollmentApplication> {
    // Find enrollment
    const enrollment = await this.repository.findById(input.id)

    if (!enrollment) {
      throw new DomainError('Enrollment application not found')
    }

    // Authorization check (unless admin)
    if (!input.isAdmin && enrollment.userId !== input.userId) {
      throw new DomainError('You do not have permission to view this application')
    }

    return enrollment
  }
}
