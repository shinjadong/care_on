/**
 * Enrollment Validation Schemas
 * Zod schemas for runtime validation of enrollment inputs
 */

import { z } from 'zod'

/**
 * Korean phone number validation
 * Formats: 010-1234-5678 or 01012345678
 */
const phoneNumberSchema = z
  .string()
  .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, 'Invalid phone number format')

/**
 * Korean business number validation
 * Format: 123-45-67890
 */
const businessNumberSchema = z
  .string()
  .regex(/^\d{3}-\d{2}-\d{5}$/, 'Invalid business number format (required: XXX-XX-XXXXX)')

/**
 * Schema for creating a new draft enrollment
 */
export const createEnrollmentSchema = z.object({
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'Must agree to terms of service',
  }),
  agreePrivacy: z.boolean().refine((val) => val === true, {
    message: 'Must agree to privacy policy',
  }),
  agreeMarketing: z.boolean().optional(),
  agreeTosspay: z.boolean().refine((val) => val === true, {
    message: 'Must agree to Tosspay terms',
  }),
  agreedCardCompanies: z.string().optional(),

  businessType: z.enum(['개인사업자', '법인사업자'], {
    required_error: 'Business type is required',
  }),

  representativeName: z.string().min(1, 'Representative name is required'),
  phoneNumber: phoneNumberSchema,
  birthDate: z.string().length(6, 'Birth date must be 6 digits (YYMMDD)'),
  birthGender: z.string().length(1, 'Gender digit must be 1 character'),
  gender: z.enum(['male', 'female']).optional(),

  carrier: z.string().optional(),
  mvnoCarrier: z.string().optional(),

  userId: z.string().optional(),
})

/**
 * Schema for updating enrollment application
 */
export const updateEnrollmentSchema = z.object({
  // Business Info
  businessName: z.string().min(1).optional(),
  businessNumber: businessNumberSchema.optional(),
  businessAddress: z.string().min(1).optional(),
  businessDetailAddress: z.string().optional(),
  businessCategory: z.string().optional(),
  businessSubcategory: z.string().optional(),
  businessKeywords: z.array(z.string()).optional(),
  businessStartDate: z.string().optional(),

  // Store Info
  storeName: z.string().min(1).optional(),
  storeAddress: z.string().min(1).optional(),
  storePostcode: z.string().optional(),
  storeArea: z.string().optional(),
  storePhone: z.string().optional(),
  needLocalData: z.boolean().optional(),

  // Application Type
  applicationType: z.string().optional(),

  // Delivery App
  needDeliveryApp: z.union([z.string(), z.boolean()]).optional(),

  // Ownership Type
  ownershipType: z.string().optional(),

  // License Type
  licenseType: z.string().optional(),

  // Internet/CCTV
  hasInternet: z.union([z.string(), z.boolean()]).optional(),
  hasCCTV: z.union([z.string(), z.boolean()]).optional(),

  // Free Service
  wantFreeService: z.union([z.string(), z.boolean()]).optional(),

  // Sales Info
  monthlyRevenue: z.string().optional(),
  monthlySales: z.string().optional(),
  cardSalesRatio: z.number().min(0).max(100).optional(),
  mainProduct: z.string().optional(),
  unitPrice: z.string().optional(),

  // Settlement Info
  bankName: z.string().optional(),
  accountHolder: z.string().optional(),
  accountNumber: z.string().optional(),
  settlementAccount: z.string().optional(),

  // Additional Services
  additionalServices: z.array(z.string()).optional(),
  referralCode: z.string().optional(),

  // Document URLs
  businessRegistrationUrl: z.string().url().nullable().optional(),
  idCardFrontUrl: z.string().url().nullable().optional(),
  idCardBackUrl: z.string().url().nullable().optional(),
  bankbookUrl: z.string().url().nullable().optional(),
  businessLicenseUrl: z.string().url().nullable().optional(),
  signPhotoUrl: z.string().url().nullable().optional(),
  doorClosedUrl: z.string().url().nullable().optional(),
  doorOpenUrl: z.string().url().nullable().optional(),
  interiorUrl: z.string().url().nullable().optional(),
  productUrl: z.string().url().nullable().optional(),
  businessCardUrl: z.string().url().nullable().optional(),

  // Corporate Documents (법인사업자 only)
  corporateRegistrationUrl: z.string().url().nullable().optional(),
  shareholderListUrl: z.string().url().nullable().optional(),
  sealCertificateUrl: z.string().url().nullable().optional(),
  sealUsageUrl: z.string().url().nullable().optional(),
})

/**
 * Schema for enrollment filters
 */
export const enrollmentFiltersSchema = z.object({
  status: z.enum(['draft', 'submitted', 'reviewing', 'approved', 'rejected']).optional(),
  search: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(100).optional(),
})

/**
 * Schema for approving an enrollment
 */
export const approveEnrollmentSchema = z.object({
  id: z.string().min(1, 'Enrollment ID is required'),
  reviewerNotes: z.string().optional(),
})

/**
 * Schema for rejecting an enrollment
 */
export const rejectEnrollmentSchema = z.object({
  id: z.string().min(1, 'Enrollment ID is required'),
  reason: z.string().min(1, 'Rejection reason is required'),
})

/**
 * Type inference from schemas
 */
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>
export type EnrollmentFiltersInput = z.infer<typeof enrollmentFiltersSchema>
export type ApproveEnrollmentInput = z.infer<typeof approveEnrollmentSchema>
export type RejectEnrollmentInput = z.infer<typeof rejectEnrollmentSchema>
