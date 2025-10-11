// Use Case: Get Packages with Filters
// Retrieves package bundles with filtering and pagination

import { IProductRepository, type PackageFilters, type PackageListResult } from '@/lib/domain/product'

export class GetPackagesUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters?: PackageFilters): Promise<PackageListResult> {
    const page = filters?.page ?? 1
    const pageSize = filters?.pageSize ?? 20

    return await this.productRepository.findAllPackages(filters, page, pageSize)
  }
}
