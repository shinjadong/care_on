import { NextRequest, NextResponse } from "next/server"

import { completeContractSignature } from "@/lib/db/repositories/contracts"
import { RepositoryError } from "@/lib/db/repositories/errors"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contract_id, customer_signature, signed_at } = body

    if (!contract_id || !customer_signature) {
      return NextResponse.json(
        { error: "필수 정보가 누락되었습니다." },
        { status: 400 },
      )
    }

    const contract = await completeContractSignature({ contract_id, signed_at })

    return NextResponse.json({
      message: "계약서 서명이 성공적으로 완료되었습니다.",
      contract,
      next_step: "설치 일정 조율을 위해 곧 연락드리겠습니다.",
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Contract Sign API] Error:", error)
    return NextResponse.json(
      { error: "서명 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
