// Domain Layer: Product - Public API
// All domain exports for clean imports

// Entities
export { Product, type ProductProps, type CreateProductInput as CreateProductEntityInput, type UpdateProductInput as UpdateProductEntityInput, type DiscountTier } from './entities/Product'
export { Package, type PackageProps, type CreatePackageInput as CreatePackageEntityInput, type UpdatePackageInput as UpdatePackageEntityInput } from './entities/Package'

// Repository Interface
export type { IProductRepository, ProductFilters as ProductRepoFilters, ProductListResult, PackageFilters as PackageRepoFilters, PackageListResult } from './repositories/IProductRepository'

// Validation Schemas
export {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  discountTierSchema,
  createPackageSchema,
  updatePackageSchema,
  packageFiltersSchema,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductFilters,
  type CreatePackageInput,
  type UpdatePackageInput,
  type PackageFilters
} from './validation/productSchema'
