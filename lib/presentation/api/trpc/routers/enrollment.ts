/**
 * Enrollment tRPC Router
 * Thin adapter layer that connects HTTP requests to Application Use Cases
 *
 * Presentation layer:
 * - Validates input (Zod)
 * - Calls Application Use Cases
 * - Returns results or errors
 * - NO business logic here!
 */

import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../trpc'
import { DomainError } from '@/lib/domain/enrollment'

// Application Use Cases
import {
  CreateEnrollmentUseCase,
  UpdateEnrollmentUseCase,
  SubmitEnrollmentUseCase,
  ApproveEnrollmentUseCase,
  RejectEnrollmentUseCase,
  GetEnrollmentUseCase,
  ListEnrollmentsUseCase
} from '@/lib/application/enrollment'

// Infrastructure
import { PrismaEnrollmentRepository } from '@/lib/infrastructure/database/repositories'

/**
 * Input validation schemas
 */
const createEnrollmentSchema = z.object({
  // Step 1: Agreements
  agreeTerms: z.boolean(),
  agreePrivacy: z.boolean(),
  agreeMarketing: z.boolean().optional(),
  agreeTosspay: z.boolean(),
  agreedCardCompanies: z.string().optional(),

  // Step 2: Business Type
  businessType: z.enum(['개인사업자', '법인사업자']),

  // Step 3: Representative Info
  representativeName: z.string().min(1),
  phoneNumber: z.string().regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/),
  birthDate: z.string(),
  gender: z.enum(['male', 'female']),
})

export const enrollmentRouter = router({
  /**
   * Create a new enrollment application (draft)
   */
  create: publicProcedure
    .input(createEnrollmentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Dependency Injection: Create repository and use case
        const repository = new PrismaEnrollmentRepository()
        const useCase = new CreateEnrollmentUseCase(repository)

        // Extract userId (optional for public procedure)
        const userId = (ctx as any).user?.id as string | undefined

        // Execute use case
        const enrollment = await useCase.execute({
          ...input,
          userId
        })

        // Return domain entity as plain object
        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Get my enrollment applications
   */
  getMyApplications: protectedProcedure.query(async ({ ctx }) => {
    try {
      const repository = new PrismaEnrollmentRepository()
      const useCase = new ListEnrollmentsUseCase(repository)

      const result = await useCase.execute({
        userId: (ctx as any).user.id
      })

      return {
        ...result,
        applications: result.applications.map(app => app.toObject())
      }
    } catch (error) {
      if (error instanceof DomainError) {
        throw new Error(error.message)
      }
      throw error
    }
  }),

  /**
   * Get a single enrollment application by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new GetEnrollmentUseCase(repository)

        const enrollment = await useCase.execute({
          id: input.id,
          userId: (ctx as any).user?.id,
          isAdmin: false // TODO: Check admin role
        })

        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Update an existing enrollment application (draft only)
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      updates: z.object({
        businessName: z.string().optional(),
        businessNumber: z.string().regex(/^\d{3}-\d{2}-\d{5}$/).optional(),
        businessAddress: z.string().optional(),
        storeName: z.string().optional(),
        storeAddress: z.string().optional(),
        // ... add other updatable fields
      })
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new UpdateEnrollmentUseCase(repository)

        const enrollment = await useCase.execute({
          id: input.id,
          userId: (ctx as any).user.id,
          updates: input.updates
        })

        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Submit an enrollment application for review
   */
  submit: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new SubmitEnrollmentUseCase(repository)

        const enrollment = await useCase.execute({
          id: input.id,
          userId: (ctx as any).user.id
        })

        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Admin: List all applications with filters
   */
  adminList: adminProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'submitted', 'reviewing', 'approved', 'rejected']).optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        pageSize: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new ListEnrollmentsUseCase(repository)

        const result = await useCase.execute(input)

        return {
          ...result,
          applications: result.applications.map(app => app.toObject())
        }
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Admin: Approve an enrollment application
   */
  adminApprove: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new ApproveEnrollmentUseCase(repository)

        const enrollment = await useCase.execute({
          id: input.id,
          reviewerNotes: input.notes,
          adminUserId: (ctx as any).user.id
        })

        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),

  /**
   * Admin: Reject an enrollment application
   */
  adminReject: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        reason: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const repository = new PrismaEnrollmentRepository()
        const useCase = new RejectEnrollmentUseCase(repository)

        const enrollment = await useCase.execute({
          id: input.id,
          reason: input.reason,
          adminUserId: (ctx as any).user.id
        })

        return enrollment.toObject()
      } catch (error) {
        if (error instanceof DomainError) {
          throw new Error(error.message)
        }
        throw error
      }
    }),
})
