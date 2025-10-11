// Validation Schemas: Product Domain
// Using Zod for runtime validation and type inference

import { z } from 'zod'

// ========================================
// PRODUCT SCHEMAS
// ========================================

export const discountTierSchema = z.object({
  rate: z.number().min(0).max(1).describe('Discount rate (0-1)'),
  condition: z.string().min(1).describe('Human-readable condition'),
  minQuantity: z.number().int().min(1).describe('Minimum quantity for this tier')
})

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().nullable().optional(),
  category: z.string().min(1, 'Category is required'),
  provider: z.string().min(1, 'Provider is required'),
  monthlyFee: z.number().int().min(0, 'Monthly fee must be positive'),
  imageUrl: z.string().url('Invalid image URL').nullable().optional(),
  available: z.boolean().optional().default(true),
  closureRefundRate: z.number().min(0).max(1).optional().default(0),
  maxDiscountRate: z.number().min(0).max(1).optional().default(0),
  discountTiers: z.array(discountTierSchema).nullable().optional()
})

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  category: z.string().min(1).optional(),
  provider: z.string().min(1).optional(),
  monthlyFee: z.number().int().min(0).optional(),
  imageUrl: z.string().url().nullable().optional(),
  available: z.boolean().optional(),
  closureRefundRate: z.number().min(0).max(1).optional(),
  maxDiscountRate: z.number().min(0).max(1).optional(),
  discountTiers: z.array(discountTierSchema).nullable().optional()
})

export const productFiltersSchema = z.object({
  category: z.string().optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  available: z.boolean().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20)
})

// ========================================
// PACKAGE SCHEMAS
// ========================================

export const createPackageSchema = z.object({
  name: z.string().min(1, 'Package name is required'),
  description: z.string().nullable().optional(),
  totalFee: z.number().int().min(0, 'Total fee must be positive'),
  available: z.boolean().optional().default(true),
  productIds: z.array(z.string().uuid()).min(1, 'Package must include at least one product')
})

export const updatePackageSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  totalFee: z.number().int().min(0).optional(),
  available: z.boolean().optional(),
  productIds: z.array(z.string().uuid()).min(1).optional()
})

export const packageFiltersSchema = z.object({
  available: z.boolean().optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(20)
})

// ========================================
// TYPE INFERENCE
// ========================================

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductFilters = z.infer<typeof productFiltersSchema>
export type DiscountTier = z.infer<typeof discountTierSchema>

export type CreatePackageInput = z.infer<typeof createPackageSchema>
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>
export type PackageFilters = z.infer<typeof packageFiltersSchema>
