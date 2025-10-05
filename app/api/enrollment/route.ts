import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"

type EnrollmentApplication = Database['public']['Tables']['enrollment_applications']

// GET - Fetch user's enrollment applications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch user's applications
    const { data, error } = await supabase
      .from('enrollment_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching enrollments:", error)
      return NextResponse.json(
        { error: "Failed to fetch enrollments" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Enrollment GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create new enrollment application
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    console.log("Enrollment POST - Request body received:", Object.keys(body))

    // Get current user (optional - can work without auth)
    const { data: { user } } = await supabase.auth.getUser()
    console.log("Current user:", user?.id || "anonymous")

    // Get client info
    const ip_address = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Prepare enrollment data
    const enrollmentData: EnrollmentApplication['Insert'] = {
      ...body,
      user_id: user?.id || null,
      ip_address,
      user_agent,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("Inserting enrollment with fields:", Object.keys(enrollmentData))

    // Insert enrollment application
    const { data, error } = await supabase
      .from('enrollment_applications')
      .insert(enrollmentData)
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })

      // Check for unique constraint violation
      if (error.code === '23505' && error.message.includes('business_number')) {
        return NextResponse.json(
          { error: "사업자등록번호가 이미 등록되어 있습니다." },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { error: "Failed to create enrollment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: "신청서가 성공적으로 저장되었습니다."
    }, { status: 201 })
  } catch (error) {
    console.error("Enrollment POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update existing enrollment application
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      )
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Update only user's own draft applications
    const { data, error } = await supabase
      .from('enrollment_applications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .select()
      .single()

    if (error) {
      console.error("Error updating enrollment:", error)
      return NextResponse.json(
        { error: "Failed to update enrollment" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "Application not found or cannot be updated" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data,
      message: "신청서가 성공적으로 수정되었습니다."
    })
  } catch (error) {
    console.error("Enrollment PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}