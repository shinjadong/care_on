import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: review, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .eq("is_approved", true)
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Basic auth check - in production, implement proper authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== "Bearer admin-temp-key") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const supabase = await createClient()
    const { id } = params
    const body = await request.json()

    // Only allow updating specific fields
    const allowedFields = ["is_approved", "highlight", "rating", "period"]
    const updateData: Record<string, any> = {}

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString()

    const { data: review, error } = await supabase
      .from("reviews")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
    }

    return NextResponse.json({
      message: "Review updated successfully",
      review,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== "Bearer admin-temp-key") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const supabase = createClient()
    const { id } = params

    const { error } = await supabase.from("reviews").delete().eq("id", id)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
    }

    return NextResponse.json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
