/**
 * Enrollment Repository Interface
 * Defines the contract for enrollment data persistence
 *
 * This is defined in the DOMAIN layer (not infrastructure)
 * The actual implementation will be in infrastructure layer
 */

import { EnrollmentApplication } from '../entities/EnrollmentApplication'
import type { EnrollmentStatus } from '../entities/EnrollmentApplication'

export interface EnrollmentFilters {
  status?: EnrollmentStatus
  search?: string // Search by name or business number
  userId?: string
  page?: number
  pageSize?: number
}

export interface EnrollmentListResult {
  applications: EnrollmentApplication[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Repository interface for Enrollment domain
 *
 * The domain layer defines WHAT it needs,
 * but doesn't care HOW it's implemented
 */
export interface IEnrollmentRepository {
  /**
   * Find an enrollment application by ID
   */
  findById(id: string): Promise<EnrollmentApplication | null>

  /**
   * Find an enrollment application by business number
   */
  findByBusinessNumber(businessNumber: string): Promise<EnrollmentApplication | null>

  /**
   * Find all applications matching filters
   */
  findAll(filters?: EnrollmentFilters): Promise<EnrollmentListResult>

  /**
   * Find all applications by user ID
   */
  findByUserId(userId: string): Promise<EnrollmentApplication[]>

  /**
   * Save (create or update) an enrollment application
   */
  save(application: EnrollmentApplication): Promise<EnrollmentApplication>

  /**
   * Delete an enrollment application
   */
  delete(id: string): Promise<void>

  /**
   * Check if business number exists
   */
  existsByBusinessNumber(businessNumber: string): Promise<boolean>
}
