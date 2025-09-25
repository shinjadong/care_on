import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const supabase = await createClient()

  try {
    let query = supabase
      .from('enrollment_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`
        business_name.ilike.%${search}%,
        representative_name.ilike.%${search}%,
        phone_number.ilike.%${search}%,
        business_number.ilike.%${search}%
      `)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    // Calculate statistics
    const statsQuery = await supabase
      .from('enrollment_applications')
      .select('status')

    const stats = {
      total: statsQuery.data?.length || 0,
      draft: statsQuery.data?.filter(a => a.status === 'draft').length || 0,
      submitted: statsQuery.data?.filter(a => a.status === 'submitted').length || 0,
      reviewing: statsQuery.data?.filter(a => a.status === 'reviewing').length || 0,
      approved: statsQuery.data?.filter(a => a.status === 'approved').length || 0,
      rejected: statsQuery.data?.filter(a => a.status === 'rejected').length || 0,
    }

    return NextResponse.json({
      data,
      count,
      stats,
      success: true
    })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments', success: false },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, status, reviewer_notes } = body

  if (!id || !status) {
    return NextResponse.json(
      { error: 'ID and status are required', success: false },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'reviewing' || status === 'approved' || status === 'rejected') {
      updateData.reviewed_at = new Date().toISOString()
    }

    if (reviewer_notes !== undefined) {
      updateData.reviewer_notes = reviewer_notes
    }

    const { data, error } = await supabase
      .from('enrollment_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // If approved, create customer record and initial contract
    if (status === 'approved') {
      // 1. Create customer record
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: data.business_name,
          business_number: data.business_number,
          representative: data.representative_name,
          phone: data.phone_number,
          address: data.business_address,
          status: 'active',
          enrollment_id: id,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer:', customerError)
      }

      // 2. Create initial contract from enrollment data
      const contractData = {
        business_name: data.business_name,
        owner_name: data.representative_name,
        phone: data.phone_number,
        email: data.email,
        address: data.business_address,
        business_registration: data.business_number,

        // Settlement info from enrollment
        bank_name: data.settlement_bank || '',
        account_number: data.settlement_account || '',
        account_holder: data.settlement_holder || data.representative_name,

        // Document images from enrollment
        bank_account_image: data.bankbook_url,
        id_card_image: data.id_card_front_url,
        business_registration_image: data.business_registration_url,

        // Service needs from enrollment
        pos_needed: data.has_pos || false,
        cctv_count: data.has_cctv ? '미정' : '0',

        // Agreement status
        terms_agreed: true, // Already agreed during enrollment
        info_agreed: true,

        // Initial status
        status: 'pending',

        // Additional info
        additional_requests: data.additional_requests || '',
        manager_notes: `자동 생성됨 - Enrollment ID: ${id}\n검토 노트: ${reviewer_notes || '없음'}`,

        created_at: new Date().toISOString()
      }

      const { error: contractError } = await supabase
        .from('contracts')
        .insert(contractData)

      if (contractError) {
        console.error('Error creating contract:', contractError)
      } else {
        console.log('Contract created successfully for enrollment:', id)
      }
    }

    return NextResponse.json({
      data,
      success: true,
      message: `Application ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`
    })
  } catch (error) {
    console.error('Error updating enrollment:', error)
    return NextResponse.json(
      { error: 'Failed to update enrollment', success: false },
      { status: 500 }
    )
  }
}