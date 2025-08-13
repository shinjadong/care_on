import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Admin endpoint to get all reviews (including unapproved ones)
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status") // 'approved', 'pending', 'all'
    const offset = (page - 1) * limit

    let query = supabase.from("reviews").select("*", { count: "exact" }).order("created_at", { ascending: false })

    // Filter by approval status
    if (status === "approved") {
      query = query.eq("is_approved", true)
    } else if (status === "pending") {
      query = query.eq("is_approved", false)
    }
    // 'all' shows both approved and pending

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
