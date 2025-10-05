#!/usr/bin/env node

/**
 * Products 테이블 데이터 확인 스크립트
 * Supabase 로컬 DB에서 products 테이블 데이터를 조회합니다.
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkProductsData() {
  console.log('🔍 Checking products table data...\n')

  // 1. Check if products table exists and has data
  const { data: products, error: productsError, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (productsError) {
    console.error('❌ Error fetching products:', productsError.message)
    return
  }

  console.log(`✅ Found ${count} products in database\n`)

  if (products && products.length > 0) {
    console.log('📦 Products:')
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`)
      console.log(`   - ID: ${product.product_id}`)
      console.log(`   - Category: ${product.category}`)
      console.log(`   - Monthly Fee: ₩${product.monthly_fee?.toLocaleString() || 0}`)
      console.log(`   - Provider: ${product.provider || 'N/A'}`)
      console.log(`   - Available: ${product.available ? '✓' : '✗'}`)
      console.log(`   - Description: ${product.description?.substring(0, 50) || 'N/A'}...`)
      console.log(`   - Max Discount: ${product.max_discount_rate}%`)
      console.log(`   - Discount Tiers: ${JSON.stringify(product.discount_tiers)}`)
    })
  } else {
    console.log('⚠️  No products found in database')
    console.log('\n💡 Tip: Run the seed script to populate sample data:')
    console.log('   node scripts/seed-products.js')
  }

  // 2. Check categories
  console.log('\n\n🏷️  Product Categories:')
  const { data: categoriesData } = await supabase
    .from('products')
    .select('category')

  const categories = [...new Set(categoriesData?.map(p => p.category))]
  categories.forEach((cat, index) => {
    const count = categoriesData?.filter(p => p.category === cat).length
    console.log(`   ${index + 1}. ${cat}: ${count} products`)
  })

  // 3. Check packages if exists
  console.log('\n\n📦 Checking packages table...')
  const { data: packages, error: packagesError } = await supabase
    .from('packages')
    .select('*')

  if (packagesError) {
    console.log('ℹ️  Packages table not found or error:', packagesError.message)
  } else {
    console.log(`✅ Found ${packages?.length || 0} packages`)
  }
}

checkProductsData()
  .then(() => {
    console.log('\n✨ Data check complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })
