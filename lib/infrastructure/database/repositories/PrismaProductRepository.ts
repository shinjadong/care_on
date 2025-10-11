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
      where: { product_id: id }
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
        where.monthly_fee = {}
        if (filters.minPrice !== undefined) {
          where.monthly_fee.gte = filters.minPrice
        }
        if (filters.maxPrice !== undefined) {
          where.monthly_fee.lte = filters.maxPrice
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
        orderBy: { created_at: 'desc' }
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
      where: { product_id: product.id },
      create: data,
      update: data
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.product.delete({
      where: { product_id: id }
    })
  }

  // ========================================
  // PACKAGE OPERATIONS
  // ========================================

  async findPackageById(id: string): Promise<Package | null> {
    const result = await this.db.package.findUnique({
      where: { package_id: id },
      include: {
        package_items: {
          select: {
            product_id: true
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
        where.active = filters.available
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
        orderBy: { created_at: 'desc' },
        include: {
          package_items: {
            select: {
              product_id: true
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
        where: { package_id: pkg.id },
        create: data,
        update: data
      })

      // Delete existing package items
      await tx.packageItem.deleteMany({
        where: { package_id: pkg.id }
      })

      // Create new package items
      if (productIds.length > 0) {
        await tx.packageItem.createMany({
          data: productIds.map(productId => ({
            package_id: pkg.id,
            product_id: productId
          }))
        })
      }
    })
  }

  async deletePackage(id: string): Promise<void> {
    await this.db.package.delete({
      where: { package_id: id }
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
      where: { product_id: { in: ids } }
    })

    return products.map(p => this.productToDomain(p))
  }

  // ========================================
  // MAPPING METHODS
  // ========================================

  private productToDomain(data: any): Product {
    // Parse discountTiers from JSON
    let discountTiers: DiscountTier[] | null = null
    if (data.discount_tiers) {
      try {
        discountTiers = JSON.parse(JSON.stringify(data.discount_tiers))
      } catch (e) {
        console.error('Failed to parse discount tiers:', e)
        discountTiers = null
      }
    }

    const props: ProductProps = {
      id: data.product_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      name: data.name,
      description: data.description,
      category: data.category,
      provider: data.provider,
      monthlyFee: data.monthly_fee,
      imageUrl: data.image_url,
      available: data.available,
      closureRefundRate: data.closure_refund_rate,
      maxDiscountRate: data.max_discount_rate,
      discountTiers
    }

    return Product.fromPersistence(props)
  }

  private productToPersistence(product: Product): any {
    return {
      product_id: product.id,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
      name: product.name,
      description: product.description,
      category: product.category,
      provider: product.provider,
      monthly_fee: product.monthlyFee,
      image_url: product.imageUrl,
      available: product.available,
      closure_refund_rate: product.closureRefundRate,
      max_discount_rate: product.maxDiscountRate,
      discount_tiers: product.discountTiers || undefined
    }
  }

  private packageToDomain(data: any): Package {
    const props: PackageProps = {
      id: data.package_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      name: data.name,
      description: data.description,
      totalFee: data.monthly_fee,
      available: data.active,
      productIds: data.package_items?.map((item: any) => item.product_id) || []
    }

    return Package.fromPersistence(props)
  }

  private packageToPersistence(pkg: Package): any {
    return {
      package_id: pkg.id,
      created_at: pkg.createdAt,
      updated_at: pkg.updatedAt,
      name: pkg.name,
      description: pkg.description,
      monthly_fee: pkg.totalFee,
      active: pkg.available
    }
  }
}
