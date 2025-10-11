// Use Case: Get Package by ID
// Retrieves a single package with included products

import { Package, IProductRepository } from '@/lib/domain/product'

export class GetPackageByIdUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<Package> {
    const pkg = await this.productRepository.findPackageById(id)

    if (!pkg) {
      throw new Error(`Package not found: ${id}`)
    }

    return pkg
  }
}
