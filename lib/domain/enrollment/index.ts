/**
 * Enrollment Domain Exports
 * Central export point for enrollment domain
 */

// Entities
export {
  EnrollmentApplication,
  DomainError,
  type EnrollmentStatus,
  type EnrollmentApplicationProps
} from './entities/EnrollmentApplication'

// Repository Interface
export {
  type IEnrollmentRepository,
  type EnrollmentFilters,
  type EnrollmentListResult
} from './repositories/IEnrollmentRepository'
