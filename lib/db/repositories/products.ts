import { asc, and, eq } from "drizzle-orm"

import { db, products, type NewProduct, type Product } from "@/lib/db"

import { RepositoryError } from "./errors"

type ProductFilters = {
  category?: string | null
  available?: boolean | null
}

type CreateProductPayload = {
  name: string
  category: string
  provider?: string | null
  monthly_fee?: number | string | null
  description?: string | null
  available?: boolean | null
  closure_refund_rate?: number | string | null
  max_discount_rate?: number | string | null
  discount_tiers?: unknown
}

type UpdateProductPayload = CreateProductPayload & {
  max_discount_rate?: number | string | null
  discount_tiers?: unknown
}

function coerceNumber(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function buildCreateValues(payload: CreateProductPayload): NewProduct {
  return {
    name: payload.name,
    category: payload.category,
    provider: payload.provider ?? null,
    monthlyFee: coerceNumber(payload.monthly_fee),
    description: payload.description ?? null,
    available: payload.available ?? true,
    closureRefundRate: coerceNumber(payload.closure_refund_rate),
    maxDiscountRate: coerceNumber(payload.max_discount_rate ?? null),
    discountTiers: payload.discount_tiers ?? null,
  }
}

function buildUpdateValues(payload: UpdateProductPayload): Partial<NewProduct> {
  const values: Partial<NewProduct> = {
    updatedAt: new Date(),
  }

  if (payload.name !== undefined) {
    values.name = payload.name
  }

  if (payload.category !== undefined) {
    values.category = payload.category
  }

  if (payload.provider !== undefined) {
    values.provider = payload.provider ?? null
  }

  if (payload.monthly_fee !== undefined) {
    values.monthlyFee = coerceNumber(payload.monthly_fee)
  }

  if (payload.description !== undefined) {
    values.description = payload.description ?? null
  }

  if (payload.available !== undefined) {
    values.available = payload.available
  }

  if (payload.closure_refund_rate !== undefined) {
    values.closureRefundRate = coerceNumber(payload.closure_refund_rate)
  }

  if (payload.max_discount_rate !== undefined) {
    values.maxDiscountRate = coerceNumber(payload.max_discount_rate)
  }

  if (payload.discount_tiers !== undefined) {
    values.discountTiers = payload.discount_tiers ?? null
  }

  return values
}

export async function fetchProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const { category, available } = filters

  const conditions = [] as ReturnType<typeof eq>[]

  if (category && category !== "all") {
    conditions.push(eq(products.category, category))
  }

  if (available !== undefined && available !== null) {
    conditions.push(eq(products.available, available))
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  return db
    .select()
    .from(products)
    .where(where)
    .orderBy(asc(products.category), asc(products.name))
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  if (!payload.name || !payload.category) {
    throw new RepositoryError("상품명과 카테고리는 필수입니다.", 400)
  }

  const values = buildCreateValues(payload)

  const [product] = await db
    .insert(products)
    .values(values)
    .returning()

  if (!product) {
    throw new RepositoryError("상품 생성 결과를 가져오지 못했습니다.")
  }

  return product
}

export async function updateProduct(productId: string, payload: UpdateProductPayload): Promise<Product> {
  if (!productId) {
    throw new RepositoryError("상품 ID가 필요합니다.", 400)
  }

  const [product] = await db
    .update(products)
    .set(buildUpdateValues(payload))
    .where(eq(products.productId, productId))
    .returning()

  if (!product) {
    throw new RepositoryError("상품을 찾을 수 없습니다.", 404)
  }

  return product
}
