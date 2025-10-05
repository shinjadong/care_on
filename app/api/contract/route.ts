import { NextRequest, NextResponse } from "next/server"

import { createContractSubmission } from "@/lib/db/repositories/contracts"
import { RepositoryError } from "@/lib/db/repositories/errors"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const contract = await createContractSubmission(body)

    return NextResponse.json({
      message: "계약 정보가 성공적으로 접수되었습니다.",
      customer_number: contract.customer_number,
      contract_number: contract.contract_number,
      id: contract.id,
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Contract API] Unexpected error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
