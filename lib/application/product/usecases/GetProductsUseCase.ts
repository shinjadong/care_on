// Use Case: Get Products with Filters
// Orchestrates product retrieval with filtering and pagination

import { IProductRepository, type ProductFilters, type ProductListResult } from '@/lib/domain/product'

export class GetProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(filters?: ProductFilters): Promise<ProductListResult> {
    const page = filters?.page ?? 1
    const pageSize = filters?.pageSize ?? 20

    return await this.productRepository.findAll(filters, page, pageSize)
  }
}
