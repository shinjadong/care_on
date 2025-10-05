import "server-only"

import { drizzle } from "drizzle-orm/postgres-js"
import { relations } from "drizzle-orm"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import postgres from "postgres"

const connectionString = process.env.SUPABASE_DB_URL

if (!connectionString) {
  throw new Error("SUPABASE_DB_URL 환경 변수가 설정되어 있지 않습니다.")
}

const globalForDb = globalThis as unknown as {
  __postgresClient?: ReturnType<typeof postgres>
  __db?: ReturnType<typeof drizzle>
}

if (!globalForDb.__postgresClient) {
  globalForDb.__postgresClient = postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  })
}

export const sqlClient = globalForDb.__postgresClient

export const genderEnum = pgEnum("gender", ["male", "female"])

export const products = pgTable("products", {
  productId: uuid("product_id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  provider: text("provider"),
  monthlyFee: integer("monthly_fee"),
  description: text("description"),
  available: boolean("available").default(true),
  closureRefundRate: integer("closure_refund_rate"),
  maxDiscountRate: integer("max_discount_rate"),
  discountTiers: jsonb("discount_tiers"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  category: text("category"),
  business: text("business"),
  content: text("content"),
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  rating: integer("rating"),
  period: text("period"),
  highlight: jsonb("highlight"),
  images: jsonb("images"),
  videos: jsonb("videos"),
  youtubeUrls: jsonb("youtube_urls"),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const customers = pgTable("customers", {
  id: uuid("customer_id").defaultRandom().primaryKey(),
  customerCode: varchar("customer_code", { length: 16 }).notNull(),
  businessName: text("business_name"),
  ownerName: text("owner_name"),
  businessRegistration: text("business_registration"),
  phone: varchar("phone", { length: 32 }),
  email: text("email"),
  address: text("address"),
  status: text("status"),
  careStatus: text("care_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const packages = pgTable("packages", {
  id: uuid("package_id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  monthlyFee: integer("monthly_fee"),
  contractPeriod: integer("contract_period"),
  freePeriod: integer("free_period"),
  closureRefundRate: integer("closure_refund_rate"),
  includedServices: jsonb("included_services"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const contracts = pgTable("contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  customerNumber: varchar("customer_number", { length: 16 }),
  contractNumber: varchar("contract_number", { length: 16 }),
  businessName: text("business_name"),
  ownerName: text("owner_name"),
  phone: varchar("phone", { length: 32 }),
  email: text("email"),
  address: text("address"),
  businessRegistration: text("business_registration"),
  internetPlan: text("internet_plan"),
  internetMonthlyFee: integer("internet_monthly_fee"),
  cctvCount: integer("cctv_count"),
  cctvMonthlyFee: integer("cctv_monthly_fee"),
  installationAddress: text("installation_address"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountHolder: text("account_holder"),
  additionalRequests: text("additional_requests"),
  bankAccountImage: text("bank_account_image"),
  idCardImage: text("id_card_image"),
  businessRegistrationImage: text("business_registration_image"),
  termsAgreed: boolean("terms_agreed").default(false),
  infoAgreed: boolean("info_agreed").default(false),
  status: text("status").default("pending"),
  billingDay: integer("billing_day"),
  remittanceDay: integer("remittance_day"),
  adminNotes: jsonb("admin_notes"),
  contractPeriod: integer("contract_period"),
  freePeriod: integer("free_period"),
  totalMonthlyFee: integer("total_monthly_fee"),
  packageId: uuid("package_id").references(() => packages.id),
  packageName: text("package"),
  customerSignatureAgreed: boolean("customer_signature_agreed"),
  customerSignedAt: timestamp("customer_signed_at", { withTimezone: true }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  processedBy: text("processed_by"),
  processedAt: timestamp("processed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const contractItems = pgTable("contract_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  contractId: uuid("contract_id").references(() => contracts.id),
  productId: uuid("product_id").references(() => products.productId),
  quantity: integer("quantity"),
  fee: integer("fee"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
})

export const customerActivities = pgTable("customer_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  activityType: text("activity_type"),
  title: text("title"),
  description: text("description"),
  activityData: jsonb("activity_data"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const enrollmentApplications = pgTable("enrollment_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  agreeTerms: boolean("agree_terms"),
  agreePrivacy: boolean("agree_privacy"),
  agreeMarketing: boolean("agree_marketing"),
  agreeTosspay: boolean("agree_tosspay"),
  agreedCardCompanies: text("agreed_card_companies"),
  businessType: text("business_type"),
  representativeName: text("representative_name"),
  phoneNumber: text("phone_number"),
  birthDate: text("birth_date"),
  gender: genderEnum("gender"),
  businessName: text("business_name"),
  businessNumber: text("business_number"),
  businessAddress: text("business_address"),
  businessDetailAddress: text("business_detail_address"),
  businessCategory: text("business_category"),
  businessSubcategory: text("business_subcategory"),
  businessKeywords: jsonb("business_keywords"),
  monthlySales: text("monthly_sales"),
  cardSalesRatio: integer("card_sales_ratio"),
  mainProduct: text("main_product"),
  unitPrice: text("unit_price"),
  bankName: text("bank_name"),
  accountHolder: text("account_holder"),
  accountNumber: text("account_number"),
  settlementDate: text("settlement_date"),
  additionalServices: jsonb("additional_services"),
  referralCode: text("referral_code"),
  businessRegistrationUrl: text("business_registration_url"),
  idCardFrontUrl: text("id_card_front_url"),
  idCardBackUrl: text("id_card_back_url"),
  bankbookUrl: text("bankbook_url"),
  businessLicenseUrl: text("business_license_url"),
  signPhotoUrl: text("sign_photo_url"),
  doorClosedUrl: text("door_closed_url"),
  doorOpenUrl: text("door_open_url"),
  interiorUrl: text("interior_url"),
  productUrl: text("product_url"),
  businessCardUrl: text("business_card_url"),
  corporateRegistrationUrl: text("corporate_registration_url"),
  shareholderListUrl: text("shareholder_list_url"),
  sealCertificateUrl: text("seal_certificate_url"),
  sealUsageUrl: text("seal_usage_url"),
  status: text("status"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewerNotes: text("reviewer_notes"),
  userId: uuid("user_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
})

export const enrollmentNotes = pgTable("enrollment_notes", {
  id: uuid("id").defaultRandom().primaryKey(),
  enrollmentId: uuid("enrollment_id").references(() => enrollmentApplications.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  authorId: uuid("author_id"),
  authorName: text("author_name"),
  note: text("note").notNull(),
  isInternal: boolean("is_internal"),
})

export const schema = {
  products,
  reviews,
  customers,
  packages,
  contracts,
  contractItems,
  customerActivities,
  enrollmentApplications,
  enrollmentNotes,
}

export const db = (globalForDb.__db ??= drizzle(sqlClient, { schema }))

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [contracts.customerId],
    references: [customers.id],
  }),
  package: one(packages, {
    fields: [contracts.packageId],
    references: [packages.id],
  }),
  items: many(contractItems),
}))

export const contractItemsRelations = relations(contractItems, ({ one }) => ({
  contract: one(contracts, {
    fields: [contractItems.contractId],
    references: [contracts.id],
  }),
  product: one(products, {
    fields: [contractItems.productId],
    references: [products.productId],
  }),
}))

export const productsRelations = relations(products, ({ many }) => ({
  contractItems: many(contractItems),
}))

export const customersRelations = relations(customers, ({ many }) => ({
  contracts: many(contracts),
  activities: many(customerActivities),
}))

export type Product = InferSelectModel<typeof products>
export type NewProduct = InferInsertModel<typeof products>
export type Review = InferSelectModel<typeof reviews>
export type NewReview = InferInsertModel<typeof reviews>
export type Contract = InferSelectModel<typeof contracts>
export type NewContract = InferInsertModel<typeof contracts>
export type Customer = InferSelectModel<typeof customers>
export type ContractItem = InferSelectModel<typeof contractItems>
export type Package = InferSelectModel<typeof packages>
