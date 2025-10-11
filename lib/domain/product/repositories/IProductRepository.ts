// Repository Interface: Product
// Defines data access contract for product domain

import { Product } from '../entities/Product'
import { Package } from '../entities/Package'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  available?: boolean
  searchTerm?: string
}

export interface ProductListResult {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PackageFilters {
  available?: boolean
  searchTerm?: string
}

export interface PackageListResult {
  packages: Package[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface IProductRepository {
  // Product CRUD operations
  findById(id: string): Promise<Product | null>
  findAll(filters?: ProductFilters, page?: number, pageSize?: number): Promise<ProductListResult>
  findByCategory(category: string): Promise<Product[]>
  save(product: Product): Promise<void>
  delete(id: string): Promise<void>

  // Package CRUD operations
  findPackageById(id: string): Promise<Package | null>
  findAllPackages(filters?: PackageFilters, page?: number, pageSize?: number): Promise<PackageListResult>
  savePackage(pkg: Package): Promise<void>
  deletePackage(id: string): Promise<void>

  // Utility operations
  getCategories(): Promise<string[]>
  getProductsByIds(ids: string[]): Promise<Product[]>
}
