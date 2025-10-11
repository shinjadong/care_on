/**
 * Prisma Enrollment Repository Implementation
 * Implements IEnrollmentRepository using Prisma
 *
 * Infrastructure layer:
 * - Knows about Prisma and database details
 * - Maps between Prisma models and Domain entities
 * - Implements domain repository interfaces
 */

import { PrismaClient, EnrollmentApplication as PrismaEnrollmentApplication } from '@prisma/client'
import {
  EnrollmentApplication,
  type IEnrollmentRepository,
  type EnrollmentFilters,
  type EnrollmentListResult,
  type EnrollmentApplicationProps
} from '@/lib/domain/enrollment'
import { prisma } from '../prisma/client'

export class PrismaEnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  async findById(id: string): Promise<EnrollmentApplication | null> {
    const result = await this.db.enrollmentApplication.findUnique({
      where: { id }
    })

    if (!result) {
      return null
    }

    return this.toDomain(result)
  }

  async findByBusinessNumber(businessNumber: string): Promise<EnrollmentApplication | null> {
    const result = await this.db.enrollmentApplication.findUnique({
      where: { business_number: businessNumber }
    })

    if (!result) {
      return null
    }

    return this.toDomain(result)
  }

  async findByUserId(userId: string): Promise<EnrollmentApplication[]> {
    const results = await this.db.enrollmentApplication.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' }
    })

    return results.map(this.toDomain)
  }

  async findAll(filters?: EnrollmentFilters): Promise<EnrollmentListResult> {
    const page = filters?.page || 1
    const pageSize = filters?.pageSize || 20
    const skip = (page - 1) * pageSize

    // Build where clause
    const where: any = {}

    if (filters?.status) {
      where.status = filters.status
    }

    if (filters?.userId) {
      where.userId = filters.userId
    }

    if (filters?.search) {
      where.OR = [
        { representativeName: { contains: filters.search, mode: 'insensitive' } },
        { businessName: { contains: filters.search, mode: 'insensitive' } },
        { businessNumber: { contains: filters.search } }
      ]
    }

    // Execute query with pagination
    const [results, total] = await Promise.all([
      this.db.enrollmentApplication.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { created_at: 'desc' }
      }),
      this.db.enrollmentApplication.count({ where })
    ])

    return {
      applications: results.map(this.toDomain),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  async save(application: EnrollmentApplication): Promise<EnrollmentApplication> {
    const data = this.toPersistence(application)

    // If ID is empty, create new. Otherwise update.
    let result
    if (!data.id) {
      // Create new - let Prisma generate ID
      const { id, ...createData } = data
      result = await this.db.enrollmentApplication.create({
        data: createData
      })
    } else {
      // Update existing
      result = await this.db.enrollmentApplication.update({
        where: { id: data.id },
        data
      })
    }

    return this.toDomain(result)
  }

  async delete(id: string): Promise<void> {
    await this.db.enrollmentApplication.delete({
      where: { id }
    })
  }

  async existsByBusinessNumber(businessNumber: string): Promise<boolean> {
    const count = await this.db.enrollmentApplication.count({
      where: { business_number: businessNumber }
    })

    return count > 0
  }

  /**
   * Map Prisma model to Domain entity
   */
  private toDomain(prismaModel: PrismaEnrollmentApplication): EnrollmentApplication {
    const props: EnrollmentApplicationProps = {
      id: prismaModel.id,
      createdAt: prismaModel.created_at,
      updatedAt: prismaModel.updated_at,

      // Agreements
      agreeTerms: prismaModel.agree_terms || false,
      agreePrivacy: prismaModel.agree_privacy || false,
      agreeMarketing: prismaModel.agree_marketing || false,
      agreeTosspay: prismaModel.agree_tosspay || false,
      agreedCardCompanies: prismaModel.agreed_card_companies || undefined,

      // Business Type
      businessType: prismaModel.business_type as '개인사업자' | '법인사업자',

      // Representative Info
      representativeName: prismaModel.representative_name || "",
      phoneNumber: prismaModel.phone_number || "",
      birthDate: prismaModel.birth_date || "",
      gender: (prismaModel.gender || "male") as 'male' | 'female',

      // Business Info
      businessName: prismaModel.business_name || undefined,
      businessNumber: prismaModel.business_number || undefined,
      businessAddress: prismaModel.business_address || undefined,
      businessCategory: prismaModel.business_category || undefined,
      businessStartDate: undefined,

      // Store Info
      storeName: undefined,
      storeAddress: undefined,
      storePhone: undefined,

      // Financial Info
      monthlyRevenue: undefined,
      settlementAccount: undefined,
      bankName: prismaModel.bank_name || undefined,
      accountHolder: prismaModel.account_holder || undefined,

      // Document URLs
      businessRegistrationUrl: prismaModel.business_registration_url || undefined,
      idCardFrontUrl: prismaModel.id_card_front_url || undefined,
      idCardBackUrl: prismaModel.id_card_back_url || undefined,
      bankbookUrl: prismaModel.bankbook_url || undefined,
      businessLicenseUrl: prismaModel.business_license_url || undefined,
      signPhotoUrl: prismaModel.sign_photo_url || undefined,
      doorClosedUrl: prismaModel.door_closed_url || undefined,
      doorOpenUrl: prismaModel.door_open_url || undefined,
      interiorUrl: prismaModel.interior_url || undefined,
      productUrl: prismaModel.product_url || undefined,
      businessCardUrl: prismaModel.business_card_url || undefined,
      corporateRegistrationUrl: prismaModel.corporate_registration_url || undefined,
      shareholderListUrl: prismaModel.shareholder_list_url || undefined,
      sealCertificateUrl: prismaModel.seal_certificate_url || undefined,
      sealUsageUrl: prismaModel.seal_usage_url || undefined,

      // Status
      status: prismaModel.status as any,
      submittedAt: prismaModel.submitted_at || undefined,
      reviewedAt: prismaModel.reviewed_at || undefined,
      reviewerNotes: prismaModel.reviewer_notes || undefined,

      // Relations
      userId: prismaModel.user_id || undefined
    }

    return EnrollmentApplication.fromPersistence(props)
  }

  /**
   * Map Domain entity to Prisma model
   */
  private toPersistence(entity: EnrollmentApplication): any {
    const props = entity.toObject()

    return {
      id: props.id || undefined, // Let Prisma generate ID if empty
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,

      agreeTerms: props.agreeTerms,
      agreePrivacy: props.agreePrivacy,
      agreeMarketing: props.agreeMarketing,
      agreeTosspay: props.agreeTosspay,
      agreedCardCompanies: props.agreedCardCompanies || null,

      businessType: props.businessType,

      representativeName: props.representativeName,
      phoneNumber: props.phoneNumber,
      birthDate: props.birthDate,
      gender: props.gender,

      businessName: props.businessName || null,
      businessNumber: props.businessNumber || null,
      businessAddress: props.businessAddress || null,
      businessCategory: props.businessCategory || null,
      businessStartDate: undefined,

      storeName: undefined,
      storeAddress: undefined,
      storePhone: undefined,

      monthlyRevenue: undefined,
      settlementAccount: undefined,
      bankName: props.bankName || null,
      accountHolder: props.accountHolder || null,

      businessRegistrationUrl: props.businessRegistrationUrl || null,
      idCardFrontUrl: props.idCardFrontUrl || null,
      idCardBackUrl: props.idCardBackUrl || null,
      bankbookUrl: props.bankbookUrl || null,
      businessLicenseUrl: props.businessLicenseUrl || null,
      signPhotoUrl: props.signPhotoUrl || null,
      doorClosedUrl: props.doorClosedUrl || null,
      doorOpenUrl: props.doorOpenUrl || null,
      interiorUrl: props.interiorUrl || null,
      productUrl: props.productUrl || null,
      businessCardUrl: props.businessCardUrl || null,
      corporateRegistrationUrl: props.corporateRegistrationUrl || null,
      shareholderListUrl: props.shareholderListUrl || null,
      sealCertificateUrl: props.sealCertificateUrl || null,
      sealUsageUrl: props.sealUsageUrl || null,

      status: props.status,
      submittedAt: props.submittedAt || null,
      reviewedAt: props.reviewedAt || null,
      reviewerNotes: props.reviewerNotes || null,

      userId: props.userId || null
    }
  }
}
