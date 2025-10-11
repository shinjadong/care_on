// Domain Entity: Product
// Encapsulates business logic and rules for products

export interface DiscountTier {
  rate: number // Discount rate (0-1)
  condition: string // Human-readable condition (e.g., "3개월 이상")
  minQuantity: number // Minimum quantity for this tier
}

export interface ProductProps {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  category: string
  provider: string
  monthlyFee: number
  imageUrl: string | null
  available: boolean
  closureRefundRate: number
  maxDiscountRate: number
  discountTiers: DiscountTier[] | null
}

export interface CreateProductInput {
  name: string
  description?: string | null
  category: string
  provider: string
  monthlyFee: number
  imageUrl?: string | null
  available?: boolean
  closureRefundRate?: number
  maxDiscountRate?: number
  discountTiers?: DiscountTier[] | null
}

export interface UpdateProductInput {
  name?: string
  description?: string | null
  category?: string
  provider?: string
  monthlyFee?: number
  imageUrl?: string | null
  available?: boolean
  closureRefundRate?: number
  maxDiscountRate?: number
  discountTiers?: DiscountTier[] | null
}

export class Product {
  private constructor(private props: ProductProps) {}

  // Factory method: Create new product
  static create(input: CreateProductInput): Product {
    // Business Rule: Monthly fee must be positive
    if (input.monthlyFee < 0) {
      throw new Error('Monthly fee must be positive')
    }

    // Business Rule: Discount rates must be between 0 and 1
    if (input.closureRefundRate !== undefined && (input.closureRefundRate < 0 || input.closureRefundRate > 1)) {
      throw new Error('Closure refund rate must be between 0 and 1')
    }
    if (input.maxDiscountRate !== undefined && (input.maxDiscountRate < 0 || input.maxDiscountRate > 1)) {
      throw new Error('Max discount rate must be between 0 and 1')
    }

    // Business Rule: Validate discount tiers
    if (input.discountTiers) {
      input.discountTiers.forEach((tier, index) => {
        if (tier.rate < 0 || tier.rate > 1) {
          throw new Error(`Discount tier ${index}: rate must be between 0 and 1`)
        }
        if (tier.minQuantity < 1) {
          throw new Error(`Discount tier ${index}: minQuantity must be at least 1`)
        }
      })
    }

    return new Product({
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: input.name,
      description: input.description ?? null,
      category: input.category,
      provider: input.provider,
      monthlyFee: input.monthlyFee,
      imageUrl: input.imageUrl ?? null,
      available: input.available ?? true,
      closureRefundRate: input.closureRefundRate ?? 0,
      maxDiscountRate: input.maxDiscountRate ?? 0,
      discountTiers: input.discountTiers ?? null
    })
  }

  // Factory method: Reconstitute from database
  static fromPersistence(props: ProductProps): Product {
    return new Product(props)
  }

  // Business Logic: Update product details
  update(input: UpdateProductInput): void {
    if (input.name !== undefined) {
      this.props.name = input.name
    }
    if (input.description !== undefined) {
      this.props.description = input.description
    }
    if (input.category !== undefined) {
      this.props.category = input.category
    }
    if (input.provider !== undefined) {
      this.props.provider = input.provider
    }
    if (input.monthlyFee !== undefined) {
      // Business Rule: Monthly fee must be positive
      if (input.monthlyFee < 0) {
        throw new Error('Monthly fee must be positive')
      }
      this.props.monthlyFee = input.monthlyFee
    }
    if (input.imageUrl !== undefined) {
      this.props.imageUrl = input.imageUrl
    }
    if (input.available !== undefined) {
      this.props.available = input.available
    }
    if (input.closureRefundRate !== undefined) {
      // Business Rule: Discount rates must be between 0 and 1
      if (input.closureRefundRate < 0 || input.closureRefundRate > 1) {
        throw new Error('Closure refund rate must be between 0 and 1')
      }
      this.props.closureRefundRate = input.closureRefundRate
    }
    if (input.maxDiscountRate !== undefined) {
      if (input.maxDiscountRate < 0 || input.maxDiscountRate > 1) {
        throw new Error('Max discount rate must be between 0 and 1')
      }
      this.props.maxDiscountRate = input.maxDiscountRate
    }
    if (input.discountTiers !== undefined) {
      // Business Rule: Validate discount tiers
      if (input.discountTiers) {
        input.discountTiers.forEach((tier, index) => {
          if (tier.rate < 0 || tier.rate > 1) {
            throw new Error(`Discount tier ${index}: rate must be between 0 and 1`)
          }
          if (tier.minQuantity < 1) {
            throw new Error(`Discount tier ${index}: minQuantity must be at least 1`)
          }
        })
      }
      this.props.discountTiers = input.discountTiers
    }

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

  // Business Logic: Calculate discounted price for quantity
  calculateDiscountedPrice(quantity: number): number {
    if (!this.props.discountTiers || this.props.discountTiers.length === 0) {
      return this.props.monthlyFee * quantity
    }

    // Find applicable discount tier (highest quantity threshold met)
    const applicableTier = this.props.discountTiers
      .filter(tier => quantity >= tier.minQuantity)
      .sort((a, b) => b.minQuantity - a.minQuantity)[0]

    if (!applicableTier) {
      return this.props.monthlyFee * quantity
    }

    const discountedFee = this.props.monthlyFee * (1 - applicableTier.rate)
    return discountedFee * quantity
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

  get category(): string {
    return this.props.category
  }

  get provider(): string {
    return this.props.provider
  }

  get monthlyFee(): number {
    return this.props.monthlyFee
  }

  get imageUrl(): string | null {
    return this.props.imageUrl
  }

  get available(): boolean {
    return this.props.available
  }

  get closureRefundRate(): number {
    return this.props.closureRefundRate
  }

  get maxDiscountRate(): number {
    return this.props.maxDiscountRate
  }

  get discountTiers(): DiscountTier[] | null {
    return this.props.discountTiers
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  // For serialization (e.g., JSON response)
  toJSON(): ProductProps {
    return { ...this.props }
  }
}
