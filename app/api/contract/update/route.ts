import { NextRequest, NextResponse } from "next/server"

import { getContractQuote, updateContractQuote } from "@/lib/db/repositories/contracts"
import { RepositoryError } from "@/lib/db/repositories/errors"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.contract_id || !body.customer_number || !body.quote) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      )
    }
    const contract = await updateContractQuote(body)

    return NextResponse.json({
      message: "견적 정보가 성공적으로 저장되었습니다.",
      contract,
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Contract Update API] Unexpected error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contract_id = searchParams.get("contract_id")
    const customer_number = searchParams.get("customer_number")

    const contract = await getContractQuote({ contract_id, customer_number })

    return NextResponse.json({ contract })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Contract GET API] Error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
