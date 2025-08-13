import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting reviews API request")

    const supabase = await createClient()
    console.log("✅ Supabase client created")

    const { searchParams } = new URL(request.url)

    // Query parameters
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("📊 Query params:", { category, search, page, limit, offset })

    console.log("🔗 Testing Supabase connection...")
    const { data: testData, error: testError } = await supabase
      .from("reviews")
      .select("count", { count: "exact", head: true })

    if (testError) {
      console.error("❌ Supabase connection test failed:", testError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: testError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Supabase connection successful, total reviews:", testData)

    // Build query
    let query = supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .eq("is_approved", true)
      .order("created_at", { ascending: false })

    console.log("🔍 Base query built")

    // Apply filters
    if (category && category !== "전체") {
      query = query.eq("category", category)
      console.log("🏷️ Category filter applied:", category)
    }

    if (search) {
      query = query.or(`content.ilike.%${search}%,business.ilike.%${search}%`)
      console.log("🔍 Search filter applied:", search)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    console.log("📄 Pagination applied:", { offset, limit })

    console.log("🚀 Executing query...")
    const { data: reviews, error, count } = await query

    if (error) {
      console.error("❌ Database query error:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch reviews",
          details: error.message,
          code: error.code,
        },
        { status: 500 },
      )
    }

    console.log("✅ Query successful:", { reviewCount: reviews?.length, totalCount: count })

    return NextResponse.json({
      reviews: reviews || [],
      totalCount: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("❌ API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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
