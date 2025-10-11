// Domain Entity: Package
// Represents a bundle of products with special pricing

export interface PackageProps {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  totalFee: number
  available: boolean
  productIds: string[] // IDs of products included in this package
}

export interface CreatePackageInput {
  name: string
  description?: string | null
  totalFee: number
  available?: boolean
  productIds: string[]
}

export interface UpdatePackageInput {
  name?: string
  description?: string | null
  totalFee?: number
  available?: boolean
  productIds?: string[]
}

export class Package {
  private constructor(private props: PackageProps) {}

  // Factory method: Create new package
  static create(input: CreatePackageInput): Package {
    // Business Rule: Total fee must be positive
    if (input.totalFee < 0) {
      throw new Error('Total fee must be positive')
    }

    // Business Rule: Must have at least one product
    if (!input.productIds || input.productIds.length === 0) {
      throw new Error('Package must include at least one product')
    }

    return new Package({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: input.name,
      description: input.description ?? null,
      totalFee: input.totalFee,
      available: input.available ?? true,
      productIds: input.productIds
    })
  }

  // Factory method: Reconstitute from database
  static fromPersistence(props: PackageProps): Package {
    return new Package(props)
  }

  // Business Logic: Update package details
  update(input: UpdatePackageInput): void {
    if (input.name !== undefined) {
      this.props.name = input.name
    }
    if (input.description !== undefined) {
      this.props.description = input.description
    }
    if (input.totalFee !== undefined) {
      // Business Rule: Total fee must be positive
      if (input.totalFee < 0) {
        throw new Error('Total fee must be positive')
      }
      this.props.totalFee = input.totalFee
    }
    if (input.available !== undefined) {
      this.props.available = input.available
    }
    if (input.productIds !== undefined) {
      // Business Rule: Must have at least one product
      if (input.productIds.length === 0) {
        throw new Error('Package must include at least one product')
      }
      this.props.productIds = input.productIds
    }

    this.props.updatedAt = new Date()
  }

  // Business Logic: Add product to package
  addProduct(productId: string): void {
    // Business Rule: No duplicate products
    if (this.props.productIds.includes(productId)) {
      throw new Error('Product already in package')
    }

    this.props.productIds.push(productId)
    this.props.updatedAt = new Date()
  }

  // Business Logic: Remove product from package
  removeProduct(productId: string): void {
    const index = this.props.productIds.indexOf(productId)

    if (index === -1) {
      throw new Error('Product not found in package')
    }

    // Business Rule: Must have at least one product
    if (this.props.productIds.length === 1) {
      throw new Error('Cannot remove last product from package')
    }

    this.props.productIds.splice(index, 1)
    this.props.updatedAt = new Date()
  }

  // Business Logic: Mark as unavailable
  markAsUnavailable(): void {
    this.props.available = false
    this.props.updatedAt = new Date()
  }

  // Business Logic: Mark as available
  markAsAvailable(): void {
    this.props.available = true
    this.props.updatedAt = new Date()
  }

  // Business Logic: Calculate savings compared to individual products
  calculateSavings(individualProductsTotal: number): number {
    return individualProductsTotal - this.props.totalFee
  }

  // Business Logic: Calculate savings percentage
  calculateSavingsPercentage(individualProductsTotal: number): number {
    if (individualProductsTotal === 0) return 0
    return ((individualProductsTotal - this.props.totalFee) / individualProductsTotal) * 100
  }

  // Getters
  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get description(): string | null {
    return this.props.description
  }

  get totalFee(): number {
    return this.props.totalFee
  }

  get available(): boolean {
    return this.props.available
  }

  get productIds(): string[] {
    return [...this.props.productIds] // Return copy to prevent external mutation
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // For serialization
  toJSON(): PackageProps {
    return { ...this.props }
  }
}
