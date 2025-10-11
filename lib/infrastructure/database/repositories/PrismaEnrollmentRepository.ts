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
      where: { businessNumber }
    })

    if (!result) {
      return null
    }

    return this.toDomain(result)
  }

  async findByUserId(userId: string): Promise<EnrollmentApplication[]> {
    const results = await this.db.enrollmentApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
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
        orderBy: { createdAt: 'desc' }
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
      where: { businessNumber }
    })

    return count > 0
  }

  /**
   * Map Prisma model to Domain entity
   */
  private toDomain(prismaModel: PrismaEnrollmentApplication): EnrollmentApplication {
    const props: EnrollmentApplicationProps = {
      id: prismaModel.id,
      createdAt: prismaModel.createdAt,
      updatedAt: prismaModel.updatedAt,

      // Agreements
      agreeTerms: prismaModel.agreeTerms,
      agreePrivacy: prismaModel.agreePrivacy,
      agreeMarketing: prismaModel.agreeMarketing,
      agreeTosspay: prismaModel.agreeTosspay,
      agreedCardCompanies: prismaModel.agreedCardCompanies || undefined,

      // Business Type
      businessType: prismaModel.businessType as '개인사업자' | '법인사업자',

      // Representative Info
      representativeName: prismaModel.representativeName,
      phoneNumber: prismaModel.phoneNumber,
      birthDate: prismaModel.birthDate,
      gender: prismaModel.gender as 'male' | 'female',

      // Business Info
      businessName: prismaModel.businessName || undefined,
      businessNumber: prismaModel.businessNumber || undefined,
      businessAddress: prismaModel.businessAddress || undefined,
      businessCategory: prismaModel.businessCategory || undefined,
      businessStartDate: prismaModel.businessStartDate || undefined,

      // Store Info
      storeName: prismaModel.storeName || undefined,
      storeAddress: prismaModel.storeAddress || undefined,
      storePhone: prismaModel.storePhone || undefined,

      // Financial Info
      monthlyRevenue: prismaModel.monthlyRevenue || undefined,
      settlementAccount: prismaModel.settlementAccount || undefined,
      bankName: prismaModel.bankName || undefined,
      accountHolder: prismaModel.accountHolder || undefined,

      // Document URLs
      businessRegistrationUrl: prismaModel.businessRegistrationUrl || undefined,
      idCardFrontUrl: prismaModel.idCardFrontUrl || undefined,
      idCardBackUrl: prismaModel.idCardBackUrl || undefined,
      bankbookUrl: prismaModel.bankbookUrl || undefined,
      businessLicenseUrl: prismaModel.businessLicenseUrl || undefined,
      signPhotoUrl: prismaModel.signPhotoUrl || undefined,
      doorClosedUrl: prismaModel.doorClosedUrl || undefined,
      doorOpenUrl: prismaModel.doorOpenUrl || undefined,
      interiorUrl: prismaModel.interiorUrl || undefined,
      productUrl: prismaModel.productUrl || undefined,
      businessCardUrl: prismaModel.businessCardUrl || undefined,
      corporateRegistrationUrl: prismaModel.corporateRegistrationUrl || undefined,
      shareholderListUrl: prismaModel.shareholderListUrl || undefined,
      sealCertificateUrl: prismaModel.sealCertificateUrl || undefined,
      sealUsageUrl: prismaModel.sealUsageUrl || undefined,

      // Status
      status: prismaModel.status as any,
      submittedAt: prismaModel.submittedAt || undefined,
      reviewedAt: prismaModel.reviewedAt || undefined,
      reviewerNotes: prismaModel.reviewerNotes || undefined,

      // Relations
      userId: prismaModel.userId || undefined
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
      businessStartDate: props.businessStartDate || null,

      storeName: props.storeName || null,
      storeAddress: props.storeAddress || null,
      storePhone: props.storePhone || null,

      monthlyRevenue: props.monthlyRevenue || null,
      settlementAccount: props.settlementAccount || null,
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
