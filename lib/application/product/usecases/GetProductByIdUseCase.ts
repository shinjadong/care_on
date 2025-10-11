// Use Case: Get Product by ID
// Retrieves a single product with full details

import { Product, IProductRepository } from '@/lib/domain/product'

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id)

    if (!product) {
      throw new Error(`Product not found: ${id}`)
    }

    return product
  }
}
