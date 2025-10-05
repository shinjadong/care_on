import { and, desc, eq, like } from "drizzle-orm"

import { contracts, customerActivities, customers, db } from "@/lib/db"

import { RepositoryError } from "./errors"

type ContractDetail = any

type ContractSubmissionPayload = {
  business_name?: string | null
  owner_name?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  business_registration?: string | null
  internet_plan?: string | null
  cctv_count?: number | string | null
  installation_address?: string | null
  bank_name?: string | null
  account_number?: string | null
  account_holder?: string | null
  additional_requests?: string | null
  terms_agreed?: boolean | null
  info_agreed?: boolean | null
  bank_account_image?: string | null
  id_card_image?: string | null
  business_registration_image?: string | null
}

type ContractQuotePayload = {
  contract_id: string
  customer_number: string
  quote: Record<string, any>
  total_monthly_fee?: number | string | null
  manager_name?: string | null
}

function normalizePhone(phone?: string | null): string {
  return phone ? phone.replace(/[^0-9]/g, "") : ""
}

function ensurePhoneValidity(phone: string) {
  if (phone.length < 10 || phone.length > 11) {
    throw new RepositoryError("올바른 전화번호를 입력해주세요.", 400)
  }
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null
  }
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function toIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === "string") {
    return value
  }
  return null
}

async function generateSequentialCode(
  tx: any,
  table: typeof customers | typeof contracts,
  column: typeof customers.customerCode | typeof contracts.customerNumber,
  prefix: string,
) {
  const [result] = await tx
    .select({ value: column })
    .from(table)
    .where(like(column, `${prefix}%`))
    .orderBy(desc(column))
    .limit(1)

  const lastValue = result?.value ?? null
  const lastNumber = lastValue ? Number.parseInt(String(lastValue).slice(prefix.length), 10) || 0 : 0
  const nextNumber = lastNumber + 1
  return `${prefix}${String(nextNumber).padStart(6, "0")}`
}

function mapContractDetail(contract: ContractDetail) {
  const customerInfo = contract.customer
    ? {
        customer_code: contract.customer.customerCode,
        business_name: contract.customer.businessName,
        owner_name: contract.customer.ownerName,
        phone: contract.customer.phone,
        care_status: contract.customer.careStatus,
      }
    : null

  const packageInfo = contract.package
    ? {
        name: contract.package.name,
        monthly_fee: contract.package.monthlyFee,
        contract_period: contract.package.contractPeriod,
        free_period: contract.package.freePeriod,
        closure_refund_rate: contract.package.closureRefundRate,
        included_services: contract.package.includedServices,
      }
    : contract.packageName
      ? { name: contract.packageName }
      : null

  return {
    id: contract.id,
    customer_number: contract.customerNumber,
    contract_number: contract.contractNumber ?? (contract.customerNumber ? `CT${contract.customerNumber.slice(2)}` : null),
    name: contract.ownerName,
    phone: contract.phone,
    business_name: contract.businessName,
    address: contract.address,
    email: contract.email,
    business_registration: contract.businessRegistration,
    bank_name: contract.bankName,
    account_number: contract.accountNumber,
    account_holder: contract.accountHolder,
    additional_requests: contract.additionalRequests,
    documents: {
      bank_account_image: contract.bankAccountImage ? "업로드됨" : "미업로드",
      id_card_image: contract.idCardImage ? "업로드됨" : "미업로드",
      business_registration_image: contract.businessRegistrationImage ? "업로드됨" : "미업로드",
    },
    customer: customerInfo,
    status: contract.status,
    created_at: toIsoString(contract.createdAt),
    internet_plan: contract.internetPlan,
    internet_monthly_fee: contract.internetMonthlyFee,
    cctv_count: contract.cctvCount,
    cctv_monthly_fee: contract.cctvMonthlyFee,
    installation_address: contract.installationAddress,
    total_monthly_fee: contract.totalMonthlyFee,
    package: packageInfo,
    contract_items: contract.items?.map((item: any) => ({
      quantity: item.quantity,
      fee: item.fee,
      product: item.product
        ? {
            product_id: item.product.productId,
            name: item.product.name,
            category: item.product.category,
            provider: item.product.provider,
            description: item.product.description,
          }
        : null,
    })) ?? [],
    contract_period: contract.contractPeriod,
    free_period: contract.freePeriod,
    start_date: toIsoString(contract.startDate),
    end_date: toIsoString(contract.endDate),
  }
}

async function getContractDetailBy(predicate: any, orderBy?: any) {
  const contract = await (db as any).query.contracts.findFirst({
    where: predicate,
    orderBy,
    with: {
      customer: true,
      package: true,
      items: {
        with: {
          product: true,
        },
      },
    },
  })

  return contract ? mapContractDetail(contract) : null
}

export async function createContractSubmission(payload: ContractSubmissionPayload) {
  const missingFields = [] as string[]
  if (!payload.business_name) missingFields.push("사업체명")
  if (!payload.owner_name) missingFields.push("대표자명")
  if (!payload.phone) missingFields.push("전화번호")
  if (!payload.address) missingFields.push("주소")
  if (!payload.bank_name) missingFields.push("은행명")
  if (!payload.account_number) missingFields.push("계좌번호")
  if (!payload.account_holder) missingFields.push("예금주명")
  if (!payload.terms_agreed) missingFields.push("이용약관 동의")
  if (!payload.info_agreed) missingFields.push("개인정보 동의")

  if (missingFields.length > 0) {
    throw new RepositoryError(`다음 필수 정보가 누락되었습니다: ${missingFields.join(", ")}`, 400)
  }

  const normalizedPhone = normalizePhone(payload.phone)
  ensurePhoneValidity(normalizedPhone)

  const contractId = await db.transaction(async (tx) => {
    const existingCustomer = await (tx as any).query.customers.findFirst({
      where: ((customers: any, { and, eq }: any) =>
        and(eq(customers.phone, normalizedPhone), eq(customers.businessName, payload.business_name!))) as any,
    })

    let customerId = existingCustomer?.id ?? null

    if (!existingCustomer) {
      const customerCode = await generateSequentialCode(tx, customers, customers.customerCode, "CO")

      const [createdCustomer] = await tx
        .insert(customers)
        .values({
          customerCode,
          businessName: payload.business_name,
          ownerName: payload.owner_name,
          businessRegistration: payload.business_registration ?? null,
          phone: normalizedPhone,
          email: payload.email ?? null,
          address: payload.address ?? null,
          status: "active",
        })
        .returning({ id: customers.id })

      customerId = createdCustomer?.id ?? null

      if (!customerId) {
        throw new RepositoryError("고객 정보를 생성하지 못했습니다.")
      }
    }

    const customerNumber = await generateSequentialCode(tx, contracts, contracts.customerNumber, "CO")
    const contractNumber = `CT${customerNumber.slice(2)}`

    const [contract] = await tx
      .insert(contracts)
      .values({
        customerId,
        customerNumber,
        contractNumber,
        businessName: payload.business_name,
        ownerName: payload.owner_name,
        phone: normalizedPhone,
        email: payload.email ?? null,
        address: payload.address ?? null,
        businessRegistration: payload.business_registration ?? null,
        internetPlan: payload.internet_plan ?? null,
        cctvCount: toNumber(payload.cctv_count),
        installationAddress: payload.installation_address ?? null,
        bankName: payload.bank_name ?? null,
        accountNumber: payload.account_number ?? null,
        accountHolder: payload.account_holder ?? null,
        additionalRequests: payload.additional_requests ?? null,
        bankAccountImage: payload.bank_account_image ?? null,
        idCardImage: payload.id_card_image ?? null,
        businessRegistrationImage: payload.business_registration_image ?? null,
        termsAgreed: payload.terms_agreed ?? false,
        infoAgreed: payload.info_agreed ?? false,
        status: "pending",
        billingDay: 1,
        remittanceDay: 25,
      })
      .returning({ id: contracts.id })

    const newContractId = contract?.id

    if (!newContractId) {
      throw new RepositoryError("계약 정보를 저장하지 못했습니다.")
    }

    return newContractId
  })

  const detail = await getContractDetailBy(((contracts: any, { eq }: any) => eq(contracts.id, contractId)) as any)

  if (!detail) {
    throw new RepositoryError("저장된 계약 정보를 조회하지 못했습니다.")
  }

  return detail
}

export async function findContractByNumber(params: { customer_number?: string | null; contract_number?: string | null }) {
  if (!params.customer_number && !params.contract_number) {
    throw new RepositoryError("계약 조회를 위한 식별자가 필요합니다.", 400)
  }

  const detail = await getContractDetailBy(((contracts: any, { eq }: any) => {
    if (params.customer_number) {
      return eq(contracts.customerNumber, params.customer_number)
    }

    return eq(contracts.contractNumber, params.contract_number!)
  }) as any)

  return detail
}

export async function findLatestContractByOwner(params: { name?: string | null; phone?: string | null }) {
  if (!params.name || !params.phone) {
    throw new RepositoryError("이름과 전화번호가 필요합니다.", 400)
  }

  const normalizedPhone = normalizePhone(params.phone)
  ensurePhoneValidity(normalizedPhone)

  const detail = await getContractDetailBy(
    ((contracts: any, { and, eq }: any) => and(eq(contracts.ownerName, params.name!), eq(contracts.phone, normalizedPhone))) as any,
    ((contracts: any, { desc }: any) => desc(contracts.createdAt)) as any,
  )

  return detail
}

export async function updateContractQuote(payload: ContractQuotePayload) {
  const { contract_id, customer_number, quote, total_monthly_fee, manager_name } = payload

  const [updated] = await db
    .update(contracts)
    .set({
      internetPlan: quote.internet_plan ?? null,
      internetMonthlyFee: toNumber(quote.internet_monthly_fee),
      cctvCount: toNumber(quote.cctv_count),
      cctvMonthlyFee: toNumber(quote.cctv_monthly_fee),
      installationAddress: quote.installation_address ?? null,
      adminNotes: {
        pos_needed: quote.pos_needed,
        pos_monthly_fee: quote.pos_monthly_fee,
        tv_needed: quote.tv_needed,
        tv_monthly_fee: quote.tv_monthly_fee,
        insurance_needed: quote.insurance_needed,
        insurance_monthly_fee: quote.insurance_monthly_fee,
        discount_rate: quote.discount_rate,
        special_conditions: quote.special_conditions,
        manager_notes: quote.manager_notes,
        manager_name: manager_name ?? "매니저",
      },
      freePeriod: toNumber(quote.free_period) ?? 12,
      contractPeriod: toNumber(quote.contract_period) ?? 36,
      totalMonthlyFee: toNumber(total_monthly_fee) ?? 0,
      status: "quoted",
      processedBy: manager_name ?? "매니저",
      processedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(contracts.id, contract_id), eq(contracts.customerNumber, customer_number)))
    .returning({ id: contracts.id })

  if (!updated) {
    throw new RepositoryError("견적 정보를 업데이트할 계약을 찾을 수 없습니다.", 404)
  }

  const detail = await getContractDetailBy(((contracts: any, { eq }: any) => eq(contracts.id, updated.id)) as any)

  if (!detail) {
    throw new RepositoryError("업데이트된 계약 정보를 조회하지 못했습니다.")
  }

  return detail
}

export async function getContractQuote(params: { contract_id?: string | null; customer_number?: string | null }) {
  if (!params.contract_id && !params.customer_number) {
    throw new RepositoryError("계약 ID 또는 고객번호가 필요합니다.", 400)
  }

  const contract = await (db as any).query.contracts.findFirst({
    where: ((contracts: any, { eq }: any) => {
      if (params.contract_id) {
        return eq(contracts.id, params.contract_id)
      }
      return eq(contracts.customerNumber, params.customer_number!)
    }) as any,
  })

  if (!contract) {
    throw new RepositoryError("계약 정보를 찾을 수 없습니다.", 404)
  }

  const adminNotes = contract.adminNotes ?? null

  return {
    id: contract.id,
    customer_id: contract.customerId,
    customer_number: contract.customerNumber,
    contract_number: contract.contractNumber,
    business_name: contract.businessName,
    owner_name: contract.ownerName,
    phone: contract.phone,
    email: contract.email,
    address: contract.address,
    status: contract.status,
    internet_plan: contract.internetPlan,
    internet_monthly_fee: contract.internetMonthlyFee,
    cctv_count: contract.cctvCount,
    cctv_monthly_fee: contract.cctvMonthlyFee,
    installation_address: contract.installationAddress,
    total_monthly_fee: contract.totalMonthlyFee,
    admin_notes: adminNotes,
    quote_details: adminNotes,
    processed_by: contract.processedBy,
    processed_at: toIsoString(contract.processedAt),
    created_at: toIsoString(contract.createdAt),
    updated_at: toIsoString(contract.updatedAt),
  }
}

export async function completeContractSignature(params: { contract_id: string; signed_at?: string | null }) {
  if (!params.contract_id) {
    throw new RepositoryError("계약 ID가 필요합니다.", 400)
  }

  const signedAt = params.signed_at ? new Date(params.signed_at) : new Date()

  const updatedId = await db.transaction(async (tx) => {
    const [contract] = await tx
      .update(contracts)
      .set({
        status: "approved",
        customerSignatureAgreed: true,
        customerSignedAt: signedAt,
        updatedAt: new Date(),
      })
      .where(eq(contracts.id, params.contract_id))
      .returning({ id: contracts.id, customerId: contracts.customerId, contractNumber: contracts.contractNumber })

    if (!contract) {
      throw new RepositoryError("계약을 찾을 수 없습니다.", 404)
    }

    await tx.insert(customerActivities).values({
      customerId: contract.customerId!,
      activityType: "contract_signed",
      title: "계약서 전자서명 완료",
      description: `계약번호 ${contract.contractNumber ?? ""} 전자서명 완료`,
      activityData: {
        contract_id: params.contract_id,
        signed_at: signedAt.toISOString(),
        signature_method: "electronic",
      },
    })

    return contract.id
  })

  const detail = await getContractDetailBy(((contracts: any, { eq }: any) => eq(contracts.id, updatedId)) as any)

  if (!detail) {
    throw new RepositoryError("업데이트된 계약 정보를 조회하지 못했습니다.")
  }

  return detail
}
