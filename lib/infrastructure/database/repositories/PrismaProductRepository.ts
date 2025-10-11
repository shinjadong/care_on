// Infrastructure: Prisma Product Repository
// Implements IProductRepository using Prisma ORM

import { PrismaClient } from '@prisma/client'
import {
  Product,
  Package,
  type IProductRepository,
  type ProductFilters,
  type ProductListResult,
  type PackageFilters,
  type PackageListResult,
  type ProductProps,
  type PackageProps,
  type DiscountTier
} from '@/lib/domain/product'
import { prisma } from '../prisma/client'

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly db: PrismaClient = prisma) {}

  // ========================================
  // PRODUCT OPERATIONS
  // ========================================

  async findById(id: string): Promise<Product | null> {
    const result = await this.db.product.findUnique({
      where: { id }
    })

    if (!result) {
      return null
    }

    return this.productToDomain(result)
  }

  async findAll(
    filters?: ProductFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ProductListResult> {
    // Build where clause
    const where: any = {}

    if (filters) {
      if (filters.category) {
        where.category = filters.category
      }
      if (filters.available !== undefined) {
        where.available = filters.available
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.monthlyFee = {}
        if (filters.minPrice !== undefined) {
          where.monthlyFee.gte = filters.minPrice
        }
        if (filters.maxPrice !== undefined) {
          where.monthlyFee.lte = filters.maxPrice
        }
      }
      if (filters.searchTerm) {
        where.OR = [
          { name: { contains: filters.searchTerm, mode: 'insensitive' } },
          { description: { contains: filters.searchTerm, mode: 'insensitive' } }
        ]
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * pageSize
    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.db.product.count({ where })
    ])

    return {
      products: products.map(p => this.productToDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.db.product.findMany({
      where: { category, available: true },
      orderBy: { name: 'asc' }
    })

    return products.map(p => this.productToDomain(p))
  }

  async save(product: Product): Promise<void> {
    const data = this.productToPersistence(product)

    await this.db.product.upsert({
      where: { id: product.id },
      create: data,
      update: data
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.product.delete({
      where: { id }
    })
  }

  // ========================================
  // PACKAGE OPERATIONS
  // ========================================

  async findPackageById(id: string): Promise<Package | null> {
    const result = await this.db.package.findUnique({
      where: { id },
      include: {
        items: {
          select: {
            productId: true
          }
        }
      }
    })

    if (!result) {
      return null
    }

    return this.packageToDomain(result)
  }

  async findAllPackages(
    filters?: PackageFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PackageListResult> {
    // Build where clause
    const where: any = {}

    if (filters) {
      if (filters.available !== undefined) {
        where.available = filters.available
      }
      if (filters.searchTerm) {
        where.OR = [
          { name: { contains: filters.searchTerm, mode: 'insensitive' } },
          { description: { contains: filters.searchTerm, mode: 'insensitive' } }
        ]
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * pageSize
    const [packages, total] = await Promise.all([
      this.db.package.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              productId: true
            }
          }
        }
      }),
      this.db.package.count({ where })
    ])

    return {
      packages: packages.map(p => this.packageToDomain(p)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  }

  async savePackage(pkg: Package): Promise<void> {
    const data = this.packageToPersistence(pkg)
    const productIds = pkg.productIds

    await this.db.$transaction(async (tx) => {
      // Upsert package
      await tx.package.upsert({
        where: { id: pkg.id },
        create: data,
        update: data
      })

      // Delete existing package items
      await tx.packageItem.deleteMany({
        where: { packageId: pkg.id }
      })

      // Create new package items
      if (productIds.length > 0) {
        await tx.packageItem.createMany({
          data: productIds.map(productId => ({
            packageId: pkg.id,
            productId
          }))
        })
      }
    })
  }

  async deletePackage(id: string): Promise<void> {
    await this.db.package.delete({
      where: { id }
    })
  }

  // ========================================
  // UTILITY OPERATIONS
  // ========================================

  async getCategories(): Promise<string[]> {
    const products = await this.db.product.findMany({
      where: { available: true },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' }
    })

    return products.map(p => p.category)
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    const products = await this.db.product.findMany({
      where: { id: { in: ids } }
    })

    return products.map(p => this.productToDomain(p))
  }

  // ========================================
  // MAPPING METHODS
  // ========================================

  private productToDomain(data: any): Product {
    // Parse discountTiers from JSON
    let discountTiers: DiscountTier[] | null = null
    if (data.discountTiers) {
      try {
        discountTiers = JSON.parse(JSON.stringify(data.discountTiers))
      } catch (e) {
        console.error('Failed to parse discount tiers:', e)
        discountTiers = null
      }
    }

    const props: ProductProps = {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      description: data.description,
      category: data.category,
      provider: data.provider,
      monthlyFee: data.monthlyFee,
      imageUrl: data.imageUrl,
      available: data.available,
      closureRefundRate: data.closureRefundRate,
      maxDiscountRate: data.maxDiscountRate,
      discountTiers
    }

    return Product.fromPersistence(props)
  }

  private productToPersistence(product: Product): any {
    return {
      id: product.id,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      name: product.name,
      description: product.description,
      category: product.category,
      provider: product.provider,
      monthlyFee: product.monthlyFee,
      imageUrl: product.imageUrl,
      available: product.available,
      closureRefundRate: product.closureRefundRate,
      maxDiscountRate: product.maxDiscountRate,
      discountTiers: product.discountTiers || undefined
    }
  }

  private packageToDomain(data: any): Package {
    const props: PackageProps = {
      id: data.id,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      name: data.name,
      description: data.description,
      totalFee: data.totalFee,
      available: data.available,
      productIds: data.items?.map((item: any) => item.productId) || []
    }

    return Package.fromPersistence(props)
  }

  private packageToPersistence(pkg: Package): any {
    return {
      id: pkg.id,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
      name: pkg.name,
      description: pkg.description,
      totalFee: pkg.totalFee,
      available: pkg.available
    }
  }
}
