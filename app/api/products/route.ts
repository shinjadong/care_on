import { NextRequest, NextResponse } from "next/server"

import type { Product } from "@/lib/db"
import { createProduct, fetchProducts, updateProduct } from "@/lib/db/repositories/products"
import { RepositoryError } from "@/lib/db/repositories/errors"

function toIso(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }
  return value ?? null
}

function serializeProduct(product: Product) {
  return {
    product_id: product.productId,
    name: product.name,
    category: product.category,
    provider: product.provider,
    monthly_fee: product.monthlyFee,
    description: product.description,
    available: product.available,
    closure_refund_rate: product.closureRefundRate,
    max_discount_rate: product.maxDiscountRate,
    discount_tiers: product.discountTiers,
    created_at: toIso(product.createdAt),
    updated_at: toIso(product.updatedAt),
  }
}

function parseBoolean(value: string | null) {
  if (value === null) return undefined
  if (value === "true") return true
  if (value === "false") return false
  return undefined
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const available = parseBoolean(searchParams.get("available"))

    const records = await fetchProducts({ category, available })
    const products = records.map(serializeProduct)

    const grouped = products.reduce<Record<string, typeof products>>((acc, product) => {
      const key = product.category || "기타"
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(product)
      return acc
    }, {})

    return NextResponse.json({
      products,
      grouped,
      categories: Object.keys(grouped),
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Products API] GET error:", error)
    return NextResponse.json(
      { error: "상품 목록을 불러오는데 실패했습니다." },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await createProduct(body)

    return NextResponse.json({
      message: "상품이 성공적으로 생성되었습니다.",
      product: serializeProduct(product),
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Products API] POST error:", error)
    return NextResponse.json(
      { error: "상품 생성에 실패했습니다." },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, ...updateData } = body

    if (!product_id) {
      return NextResponse.json(
        { error: "상품 ID가 필요합니다." },
        { status: 400 },
      )
    }

    const product = await updateProduct(product_id, updateData)

    return NextResponse.json({
      message: "상품이 성공적으로 업데이트되었습니다.",
      product: serializeProduct(product),
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Products API] PUT error:", error)
    return NextResponse.json(
      { error: "상품 업데이트에 실패했습니다." },
      { status: 500 },
    )
  }
}
