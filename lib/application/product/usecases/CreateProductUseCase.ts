// Use Case: Create Product
// Creates a new product (admin only)

import { Product, IProductRepository, type CreateProductInput } from '@/lib/domain/product'
import { createProductSchema } from '@/lib/domain/product/validation/productSchema'

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    // 1. Validate input
    const validated = createProductSchema.parse(input)

    // 2. Create domain entity (encapsulates business logic)
    const product = Product.create(validated)

    // 3. Persist via repository
    await this.productRepository.save(product)

    return product
  }
}
