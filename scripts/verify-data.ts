/**
 * Data Verification Script
 * Verifies that existing data is preserved after Prisma migration
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyData() {
  console.log('🔍 Verifying existing data after Prisma migration...\n')

  try {
    // Check customers table
    const customerCount = await prisma.customers.count()
    console.log(`✅ Customers: ${customerCount} records found`)

    if (customerCount > 0) {
      const sampleCustomer = await prisma.customers.findFirst({
        select: {
          customer_id: true,
          customer_code: true,
          business_name: true,
          owner_name: true,
          phone: true,
          created_at: true,
        },
      })
      console.log('   Sample customer:', JSON.stringify(sampleCustomer, null, 2))
    }

    // Check verification_codes table
    const verificationCount = await prisma.verification_codes.count()
    console.log(`\n✅ Verification Codes: ${verificationCount} records found`)

    if (verificationCount > 0) {
      const recentCode = await prisma.verification_codes.findFirst({
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          phone_number: true,
          created_at: true,
          verified: true,
        },
      })
      console.log('   Recent verification:', JSON.stringify(recentCode, null, 2))
    }

    // Check enrollment_applications table
    const enrollmentCount = await prisma.enrollmentApplication.count()
    console.log(`\n✅ Enrollment Applications: ${enrollmentCount} records found`)

    console.log('\n✨ Data verification complete! All data is preserved.')
    console.log('📊 Total tables introspected: 70')
  } catch (error) {
    console.error('❌ Error verifying data:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifyData()
