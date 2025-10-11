// tRPC Router: Product
// API endpoints for product and package operations

import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import {
  Package,
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  createPackageSchema,
  updatePackageSchema,
  packageFiltersSchema
} from '@/lib/domain/product'
import {
  GetProductsUseCase,
  GetProductByIdUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  GetPackagesUseCase,
  GetPackageByIdUseCase
} from '@/lib/application/product'
import { PrismaProductRepository } from '@/lib/infrastructure/database/repositories/PrismaProductRepository'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

// Dependency injection helper
function getProductRepository() {
  return new PrismaProductRepository(prisma)
}

export const productRouter = router({
  // ========================================
  // PRODUCT ENDPOINTS
  // ========================================

  // List products with filters (public)
  list: publicProcedure
    .input(productFiltersSchema.optional())
    .query(async ({ input }) => {
      const repository = getProductRepository()
      const useCase = new GetProductsUseCase(repository)

      return await useCase.execute(input)
    }),

  // Get product by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const repository = getProductRepository()
      const useCase = new GetProductByIdUseCase(repository)

      const product = await useCase.execute(input.id)
      return product.toJSON()
    }),

  // Get product categories (public)
  categories: publicProcedure
    .query(async () => {
      const repository = getProductRepository()
      return await repository.getCategories()
    }),

  // Create product (admin only)
  create: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ input }) => {
      // TODO: Add admin role check
      // if (ctx.user.role !== 'admin') {
      //   throw new Error('Unauthorized: Admin access required')
      // }

      const repository = getProductRepository()
      const useCase = new CreateProductUseCase(repository)

      const product = await useCase.execute(input)
      return product.toJSON()
    }),

  // Update product (admin only)
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      updates: updateProductSchema
    }))
    .mutation(async ({ input }) => {
      // TODO: Add admin role check
      // if (ctx.user.role !== 'admin') {
      //   throw new Error('Unauthorized: Admin access required')
      // }

      const repository = getProductRepository()
      const useCase = new UpdateProductUseCase(repository)

      const product = await useCase.execute(input.id, input.updates)
      return product.toJSON()
    }),

  // Delete product (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // TODO: Add admin role check
      // if (ctx.user.role !== 'admin') {
      //   throw new Error('Unauthorized: Admin access required')
      // }

      const repository = getProductRepository()
      await repository.delete(input.id)

      return { success: true }
    }),

  // ========================================
  // PACKAGE ENDPOINTS
  // ========================================

  // List packages (public)
  listPackages: publicProcedure
    .input(packageFiltersSchema.optional())
    .query(async ({ input }) => {
      const repository = getProductRepository()
      const useCase = new GetPackagesUseCase(repository)

      return await useCase.execute(input)
    }),

  // Get package by ID (public)
  getPackageById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const repository = getProductRepository()
      const useCase = new GetPackageByIdUseCase(repository)

      const pkg = await useCase.execute(input.id)
      return pkg.toJSON()
    }),

  // Get package with product details (public)
  getPackageWithProducts: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const repository = getProductRepository()

      // Get package
      const useCase = new GetPackageByIdUseCase(repository)
      const pkg = await useCase.execute(input.id)

      // Get products in package
      const products = await repository.getProductsByIds(pkg.productIds)

      return {
        package: pkg.toJSON(),
        products: products.map(p => p.toJSON())
      }
    }),

  // Create package (admin only)
  createPackage: protectedProcedure
    .input(createPackageSchema)
    .mutation(async ({ input }) => {
      // TODO: Add admin role check

      const repository = getProductRepository()
      const pkg = Package.create(input)

      await repository.savePackage(pkg)
      return pkg.toJSON()
    }),

  // Update package (admin only)
  updatePackage: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      updates: updatePackageSchema
    }))
    .mutation(async ({ input }) => {
      // TODO: Add admin role check

      const repository = getProductRepository()
      const pkg = await repository.findPackageById(input.id)

      if (!pkg) {
        throw new Error(`Package not found: ${input.id}`)
      }

      pkg.update(input.updates)
      await repository.savePackage(pkg)

      return pkg.toJSON()
    }),

  // Delete package (admin only)
  deletePackage: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input }) => {
      // TODO: Add admin role check

      const repository = getProductRepository()
      await repository.deletePackage(input.id)

      return { success: true }
    })
})
