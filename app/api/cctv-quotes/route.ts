import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const payload = await request.json()
  const supabase = createClient()

  try {
    // Basic validation
    if (!payload?.contactName || !payload?.phone) {
      return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 })
    }

    // Map payload to database columns
    const { error } = await supabase.from("cctv_quotes").insert([
      {
        installation_place: payload.installationPlace,
        business_type: payload.businessType,
        business_type_other: payload.businessTypeOther,
        business_size: payload.businessSize,
        installation_locations: payload.installationLocations,
        installation_location_other: payload.installationLocationOther,
        installation_quantities: payload.installationQuantities,
        business_location: payload.businessLocation,
        final_quote_method: payload.finalQuoteMethod,
        contact_method: payload.contactMethod,
        calculated_price: payload.calculatedPrice,
        business_name: payload.businessName,
        contact_name: payload.contactName,
        phone: payload.phone,
        agree_terms: payload.agreeTerms,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true, data: payload }, { status: 200 })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: error?.message ?? "Server error." }, { status: 500 })
  }
}
