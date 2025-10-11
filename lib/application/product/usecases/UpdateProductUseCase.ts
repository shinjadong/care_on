// Use Case: Update Product
// Updates an existing product (admin only)

import { Product, IProductRepository, type UpdateProductInput } from '@/lib/domain/product'
import { updateProductSchema } from '@/lib/domain/product/validation/productSchema'

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, input: UpdateProductInput): Promise<Product> {
    // 1. Validate input
    const validated = updateProductSchema.parse(input)

    // 2. Retrieve existing product
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error(`Product not found: ${id}`)
    }

    // 3. Update product (domain logic validates business rules)
    product.update(validated)

    // 4. Persist changes
    await this.productRepository.save(product)

    return product
  }
}
