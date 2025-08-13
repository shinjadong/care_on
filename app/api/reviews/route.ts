import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    // Apply filters
    if (category && category !== "전체") {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`content.ilike.%${search}%,business.ilike.%${search}%`)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: reviews, error, count } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({
      reviews: reviews || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    // Validate required fields
    const {
      category,
      business,
      content,
      author_name,
      author_email,
      rating,
      period,
      highlight,
      images,
      videos,
      youtube_urls,
    } = body

    if (!category || !business || !content || !author_name || !author_email) {
      return NextResponse.json(
        {
          error: "Missing required fields: category, business, content, author_name, author_email",
        },
        { status: 400 },
      )
    }

    // Insert new review (will need approval)
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        category,
        business,
        content,
        author_name,
        author_email,
        rating: rating || null,
        period: period || null,
        highlight: highlight || null,
        images: images || [],
        videos: videos || [],
        youtube_urls: youtube_urls || [],
        is_approved: false, // Reviews need approval by default
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Review submitted successfully. It will be published after approval.",
        review,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
