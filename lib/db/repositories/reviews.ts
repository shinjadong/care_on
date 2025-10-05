import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm"

import { db, reviews, type NewReview, type Review } from "@/lib/db"

import { RepositoryError } from "./errors"

type ReviewFilters = {
  category?: string | null
  business?: string | null
  search?: string | null
  page?: number
  limit?: number
}

type CreateReviewPayload = {
  category?: string | null
  business?: string | null
  content?: string | null
  author_name?: string | null
  author_email?: string | null
  rating?: number | null
  highlight?: unknown
  images?: unknown
  videos?: unknown
  youtube_urls?: unknown
}

export async function fetchApprovedReviews(filters: ReviewFilters) {
  const page = Math.max(filters.page ?? 1, 1)
  const limit = Math.min(filters.limit ?? 20, 100)
  const offset = (page - 1) * limit

  let where: SQL = eq(reviews.isApproved, true)

  if (filters.category && filters.category !== "전체") {
    where = and(where, eq(reviews.category, filters.category))
  }

  if (filters.business && filters.business !== "전체") {
    where = and(where, eq(reviews.business, filters.business))
  }

  if (filters.search) {
    const keyword = `%${filters.search}%`
    where = and(
      where,
      or(
        ilike(reviews.content, keyword),
        ilike(reviews.business, keyword),
        ilike(reviews.title, keyword),
      ),
    )
  }

  const totalResult = await db
    .select({ value: count() })
    .from(reviews)
    .where(where)

  const totalCount = Number(totalResult[0]?.value ?? 0)

  const data = await db
    .select()
    .from(reviews)
    .where(where)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

  return {
    reviews: data,
    totalCount,
    page,
    limit,
  }
}

export async function createReview(payload: CreateReviewPayload): Promise<Review> {
  if (!payload.category || !payload.business || !payload.content || !payload.author_name || !payload.author_email) {
    throw new RepositoryError(
      "category, business, content, author_name, author_email 필드는 필수입니다.",
      400,
    )
  }

  const values: NewReview = {
    category: payload.category,
    business: payload.business,
    content: payload.content,
    authorName: payload.author_name,
    authorEmail: payload.author_email,
    rating: payload.rating ?? null,
    period: null,
    highlight: payload.highlight ?? [],
    images: payload.images ?? [],
    videos: payload.videos ?? [],
    youtubeUrls: payload.youtube_urls ?? [],
    isApproved: false,
  }

  const [review] = await db
    .insert(reviews)
    .values(values)
    .returning()

  if (!review) {
    throw new RepositoryError("리뷰 생성 결과를 가져오지 못했습니다.")
  }

  return review
}
