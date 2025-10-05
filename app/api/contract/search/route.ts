import { NextRequest, NextResponse } from "next/server"

import { findContractByNumber, findLatestContractByOwner } from "@/lib/db/repositories/contracts"
import { RepositoryError } from "@/lib/db/repositories/errors"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const customer_number = searchParams.get("customer_number")
    const contract_number = searchParams.get("contract_number")

    if (!customer_number && !contract_number) {
      return NextResponse.json({ customer: null })
    }

    const contract = await findContractByNumber({ customer_number, contract_number })

    return NextResponse.json({ customer: contract })
  } catch (error) {
    if (error instanceof RepositoryError) {
      if (error.status === 404) {
        return NextResponse.json({ customer: null })
      }
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Contract Search GET] Error:", error)
    return NextResponse.json({ customer: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, customer_number } = await request.json()

    if (customer_number) {
      const contract = await findContractByNumber({ customer_number })
      return NextResponse.json({ customer: contract })
    }

    const contract = await findLatestContractByOwner({ name, phone })
    return NextResponse.json({ customer: contract })
  } catch (error) {
    if (error instanceof RepositoryError) {
      if (error.status === 404) {
        return NextResponse.json({ customer: null })
      }
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Manager Search] Error:", error)
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
