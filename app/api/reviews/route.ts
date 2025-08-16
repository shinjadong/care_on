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
    const business = searchParams.get("business")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    console.log("📊 Query params:", { category, business, search, page, limit, offset })

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

    if (business && business !== "전체") {
      query = query.eq("business", business)
      console.log("🏢 Business filter applied:", business)
    }

    if (search) {
      query = query.or(`content.ilike.%${search}%,business.ilike.%${search}%,title.ilike.%${search}%`)
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
    console.log("📝 POST /api/reviews - Starting request")
    const supabase = await createClient()
    const body = await request.json()
    console.log("📦 Request body:", JSON.stringify(body, null, 2))

    // Validate required fields
    const {
      category,
      business,
      content,
      author_name,
      author_email,
      rating,
      highlight,
      images,
      videos,
      youtube_urls,
    } = body

    console.log("✅ Extracted fields:", { 
      category, 
      business, 
      content: content?.substring(0, 50) + "...", 
      author_name, 
      author_email,
      rating,
      highlight,
      images: images?.length || 0,
      videos: videos?.length || 0,
      youtube_urls: youtube_urls?.length || 0
    })

    if (!category || !business || !content || !author_name || !author_email) {
      console.error("❌ Missing required fields")
      return NextResponse.json(
        {
          error: "Missing required fields: category, business, content, author_name, author_email",
        },
        { status: 400 },
      )
    }

    // Insert new review (will need approval)
    console.log("🔄 Attempting to insert review into database...")
    const insertData = {
      category,
      business,
      content,
      author_name,
      author_email,
      rating: rating || null,
      period: null, // Explicitly set to null since field removed from form
      highlight: highlight || [],
      images: images || [],
      videos: videos || [],
      youtube_urls: youtube_urls || [],
      is_approved: false, // Reviews need approval by default
    }
    console.log("📋 Insert data:", JSON.stringify(insertData, null, 2))

    const { data: review, error } = await supabase
      .from("reviews")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("❌ Database error:", error)
      console.error("❌ Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: "Failed to create review",
        details: error.message,
        code: error.code 
      }, { status: 500 })
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
