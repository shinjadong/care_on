import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// POST - Submit enrollment application for review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      )
    }

    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the application to validate
    const { data: application, error: fetchError } = await supabase
      .from('enrollment_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      )
    }

    // Validate required fields
    const requiredFields = [
      'agree_terms',
      'agree_privacy',
      'business_type',
      'representative_name',
      'phone_number',
      'birth_date',
      'business_name',
      'business_number',
      'business_address',
      'business_category',
      'monthly_sales',
      'bank_name',
      'account_holder',
      'account_number',
      'business_registration_url',
      'id_card_front_url',
      'id_card_back_url',
      'bankbook_url',
      'sign_photo_url',
      'door_closed_url',
      'door_open_url',
      'interior_url',
      'product_url'
    ]

    // Additional required fields for 법인사업자
    if (application.business_type === '법인사업자') {
      requiredFields.push(
        'corporate_registration_url',
        'shareholder_list_url',
        'seal_certificate_url'
      )
    }

    // Check all required fields
    const missingFields = requiredFields.filter(field => !application[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "필수 항목이 누락되었습니다.",
          missingFields
        },
        { status: 400 }
      )
    }

    // Update status to submitted
    const { data, error } = await supabase
      .from('enrollment_applications')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("Error submitting enrollment:", error)
      return NextResponse.json(
        { error: "Failed to submit enrollment" },
        { status: 500 }
      )
    }

    // Send notification email (if needed)
    // await sendNotificationEmail(data)

    return NextResponse.json({
      data,
      message: "신청서가 성공적으로 제출되었습니다. 검토 후 연락드리겠습니다."
    })
  } catch (error) {
    console.error("Enrollment submit error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}