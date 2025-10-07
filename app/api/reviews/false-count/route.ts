import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", false)

    if (error) {
      console.error("Error fetching false review count:", error)
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    console.error("Error in false-count API:", error)
    return NextResponse.json({ count: 0 })
  }
}
