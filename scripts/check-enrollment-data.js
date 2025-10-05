const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkEnrollmentData() {
  try {
    console.log('🔍 Checking enrollment_applications table...\n')

    // Get the latest 3 enrollment applications
    const { data, error, count } = await supabase
      .from('enrollment_applications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) {
      console.error('❌ Error fetching data:', error)
      return
    }

    console.log(`📊 Total records in table: ${count}\n`)

    if (data && data.length > 0) {
      console.log(`📋 Latest ${data.length} enrollment(s):\n`)

      data.forEach((enrollment, index) => {
        console.log(`\n========== Record ${index + 1} ==========`)
        console.log(`📅 Created: ${new Date(enrollment.created_at).toLocaleString()}`)
        console.log(`🆔 ID: ${enrollment.id}`)
        console.log(`📌 Status: ${enrollment.status}`)

        console.log('\n👤 Representative Info:')
        console.log(`  - Name: ${enrollment.representative_name}`)
        console.log(`  - Phone: ${enrollment.phone_number}`)
        console.log(`  - Birth: ${enrollment.birth_date}`)
        console.log(`  - Gender: ${enrollment.gender}`)

        console.log('\n🏢 Business Info:')
        console.log(`  - Type: ${enrollment.business_type}`)
        console.log(`  - Name: ${enrollment.business_name}`)
        console.log(`  - Number: ${enrollment.business_number}`)
        console.log(`  - Address: ${enrollment.business_address}`)
        console.log(`  - Category: ${enrollment.business_category}`)

        console.log('\n💰 Sales Info:')
        console.log(`  - Monthly Sales: ${enrollment.monthly_sales}`)
        console.log(`  - Card Sales Ratio: ${enrollment.card_sales_ratio}%`)
        console.log(`  - Main Product: ${enrollment.main_product}`)

        console.log('\n🏦 Settlement Info:')
        console.log(`  - Bank: ${enrollment.bank_name}`)
        console.log(`  - Account Holder: ${enrollment.account_holder}`)
        console.log(`  - Account Number: ${enrollment.account_number}`)

        console.log('\n📄 Documents Uploaded:')
        console.log(`  - Business Registration: ${enrollment.business_registration_url ? '✅' : '❌'}`)
        console.log(`  - ID Card Front: ${enrollment.id_card_front_url ? '✅' : '❌'}`)
        console.log(`  - ID Card Back: ${enrollment.id_card_back_url ? '✅' : '❌'}`)
        console.log(`  - Bankbook: ${enrollment.bankbook_url ? '✅' : '❌'}`)
        console.log(`  - Sign Photo: ${enrollment.sign_photo_url ? '✅' : '❌'}`)
        console.log(`  - Interior: ${enrollment.interior_url ? '✅' : '❌'}`)

        console.log('\n✅ Agreements:')
        console.log(`  - Terms: ${enrollment.agree_terms ? '✅' : '❌'}`)
        console.log(`  - Privacy: ${enrollment.agree_privacy ? '✅' : '❌'}`)
        console.log(`  - Marketing: ${enrollment.agree_marketing ? '✅' : '❌'}`)
        console.log(`  - Card Companies: ${enrollment.agreed_card_companies || 'None'}`)

        if (enrollment.business_type === '법인사업자') {
          console.log('\n🏢 Corporate Documents:')
          console.log(`  - Corporate Registration: ${enrollment.corporate_registration_url ? '✅' : '❌'}`)
          console.log(`  - Shareholder List: ${enrollment.shareholder_list_url ? '✅' : '❌'}`)
          console.log(`  - Seal Certificate: ${enrollment.seal_certificate_url ? '✅' : '❌'}`)
        }

        console.log('\n' + '='.repeat(40))
      })
    } else {
      console.log('ℹ️ No enrollment data found in the table')
    }

    // Check for any validation issues
    console.log('\n\n🔍 Checking for validation issues...')

    const { data: invalidData, error: invalidError } = await supabase
      .from('enrollment_applications')
      .select('id, business_type, status')
      .or('business_type.is.null,business_type.not.in.(개인사업자,법인사업자)')

    if (invalidData && invalidData.length > 0) {
      console.log(`\n⚠️ Found ${invalidData.length} records with invalid business_type:`)
      invalidData.forEach(record => {
        console.log(`  - ID: ${record.id}, Type: ${record.business_type}, Status: ${record.status}`)
      })
    } else {
      console.log('✅ All records have valid business_type values')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkEnrollmentData()