import { type NextRequest, NextResponse } from "next/server"

import type { Review } from "@/lib/db"
import { createReview, fetchApprovedReviews } from "@/lib/db/repositories/reviews"
import { RepositoryError } from "@/lib/db/repositories/errors"

function toIso(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString()
  }
  return value ?? null
}

function serializeReview(review: Review) {
  return {
    id: review.id,
    title: review.title,
    category: review.category,
    business: review.business,
    content: review.content,
    author_name: review.authorName,
    author_email: review.authorEmail,
    rating: review.rating,
    period: review.period,
    highlight: review.highlight,
    images: review.images,
    videos: review.videos,
    youtube_urls: review.youtubeUrls,
    is_approved: review.isApproved,
    created_at: toIso(review.createdAt),
    updated_at: toIso(review.updatedAt),
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category")
    const business = searchParams.get("business")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)

    const result = await fetchApprovedReviews({
      category,
      business,
      search,
      page,
      limit,
    })

    return NextResponse.json({
      reviews: result.reviews.map(serializeReview),
      totalCount: result.totalCount,
      totalPages: Math.ceil(result.totalCount / result.limit),
      currentPage: result.page,
    })
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.status },
      )
    }

    console.error("[Reviews API] Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const review = await createReview(body)

    return NextResponse.json(
      {
        message: "Review submitted successfully. It will be published after approval.",
        review: serializeReview(review),
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof RepositoryError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("[Reviews API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
