import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Starting filters API request")

    const supabase = await createClient()
    console.log("✅ Supabase client created")

    // 전체 승인된 리뷰 수 조회
    const { count: totalCount, error: totalError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true)

    if (totalError) {
      console.error("❌ Error fetching total count:", totalError)
      return NextResponse.json(
        {
          error: "Failed to fetch total count",
          details: totalError.message,
        },
        { status: 500 },
      )
    }

    // 카테고리별 리뷰 수 조회
    const { data: categoryData, error: categoryError } = await supabase
      .from("reviews")
      .select("category")
      .eq("is_approved", true)

    if (categoryError) {
      console.error("❌ Error fetching categories:", categoryError)
      return NextResponse.json(
        {
          error: "Failed to fetch categories",
          details: categoryError.message,
        },
        { status: 500 },
      )
    }

    // 업종별 리뷰 수 조회
    const { data: businessData, error: businessError } = await supabase
      .from("reviews")
      .select("business")
      .eq("is_approved", true)

    if (businessError) {
      console.error("❌ Error fetching businesses:", businessError)
      return NextResponse.json(
        {
          error: "Failed to fetch businesses",
          details: businessError.message,
        },
        { status: 500 },
      )
    }

    // 카테고리별 개수 계산
    const categoryCounts = categoryData?.reduce((acc: Record<string, number>, review) => {
      const category = review.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {}) || {}

    // 업종별 개수 계산
    const businessCounts = businessData?.reduce((acc: Record<string, number>, review) => {
      const business = review.business
      acc[business] = (acc[business] || 0) + 1
      return acc
    }, {}) || {}

    // 카테고리 목록 생성 (개수 순으로 정렬)
    const categories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count
      }))
      .sort((a, b) => b.count - a.count)

    // 업종 목록 생성 (개수 순으로 정렬)
    const businesses = Object.entries(businessCounts)
      .map(([business, count]) => ({
        business,
        count
      }))
      .sort((a, b) => b.count - a.count)

    console.log("✅ Filters processed:", { 
      categoriesCount: categories.length, 
      businessesCount: businesses.length 
    })

    return NextResponse.json({
      categories,
      businesses,
      totalCount: totalCount || 0,
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


