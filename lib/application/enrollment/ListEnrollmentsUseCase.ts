/**
 * List Enrollments Use Case
 * Lists enrollment applications with filters
 */

import {
  type IEnrollmentRepository,
  type EnrollmentFilters,
  type EnrollmentListResult
} from '@/lib/domain/enrollment'

export interface ListEnrollmentsInput extends EnrollmentFilters {
  // Additional application-level filters can go here
}

export class ListEnrollmentsUseCase {
  constructor(private readonly repository: IEnrollmentRepository) {}

  async execute(input: ListEnrollmentsInput): Promise<EnrollmentListResult> {
    // Simply delegate to repository
    // Could add additional business logic here if needed
    // (e.g., filtering based on user permissions, data transformation, etc.)

    const result = await this.repository.findAll(input)

    return result
  }
}
