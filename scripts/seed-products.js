/**
 * Seed script to populate products table with sample data
 * Run with: node scripts/seed-products.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample products data mapped to database schema
const products = [
  {
    name: '케어온 올인원 패키지',
    category: '종합솔루션',
    provider: '케어온',
    monthly_fee: 299000,
    description: '창업부터 운영까지 모든 것을 한 번에 해결하는 통합 솔루션. CCTV 보안, POS 시스템, 계약 관리, 고객 리뷰 관리까지 사업 운영에 필요한 모든 기능을 하나의 패키지로 제공합니다.',
    available: true,
    closure_refund_rate: 80,
    max_discount_rate: 25,
    discount_tiers: [
      { rate: 10, condition: '6개월 계약', min_quantity: 1 },
      { rate: 20, condition: '12개월 계약', min_quantity: 1 },
      { rate: 25, condition: '24개월 계약', min_quantity: 1 }
    ]
  },
  {
    name: 'AI CCTV 보안 시스템',
    category: '보안',
    provider: '케어온',
    monthly_fee: 89000,
    description: 'AI가 24시간 감시하는 스마트 보안 시스템. 실시간 객체 인식, 이상 행동 감지, 침입 알림 등 고급 보안 기능을 제공합니다.',
    available: true,
    closure_refund_rate: 70,
    max_discount_rate: 15,
    discount_tiers: [
      { rate: 5, condition: '3개월 계약', min_quantity: 1 },
      { rate: 10, condition: '6개월 계약', min_quantity: 1 },
      { rate: 15, condition: '12개월 계약', min_quantity: 1 }
    ]
  },
  {
    name: '토스페이 POS 시스템',
    category: '결제',
    provider: '토스페이',
    monthly_fee: 49900,
    description: '토스페이와 완벽하게 연동되는 차세대 POS 시스템. QR 결제, 카드 결제, 현금 결제를 모두 지원하며, 실시간 매출 분석과 재고 관리 기능을 제공합니다.',
    available: true,
    closure_refund_rate: 60,
    max_discount_rate: 20,
    discount_tiers: [
      { rate: 10, condition: '연간 계약', min_quantity: 1 },
      { rate: 20, condition: '2년 계약', min_quantity: 1 }
    ]
  },
  {
    name: '전자 계약 시스템',
    category: '계약관리',
    provider: '케어온',
    monthly_fee: 39000,
    description: '전자서명 기반의 스마트 계약 관리 시스템. 법적 효력이 있는 전자계약서를 쉽고 빠르게 작성하고 관리할 수 있습니다.',
    available: true,
    closure_refund_rate: 90,
    max_discount_rate: 35,
    discount_tiers: [
      { rate: 15, condition: '6개월 계약', min_quantity: 1 },
      { rate: 25, condition: '12개월 계약', min_quantity: 1 },
      { rate: 35, condition: '무제한 이용권', min_quantity: 1 }
    ]
  },
  {
    name: '고객 리뷰 관리 시스템',
    category: '마케팅',
    provider: '케어온',
    monthly_fee: 29000,
    description: '네이버, 구글, 인스타그램 등 모든 채널의 리뷰를 한 곳에서 관리. AI 감정 분석과 자동 답변 기능으로 효율적인 고객 소통이 가능합니다.',
    available: true,
    closure_refund_rate: 100,
    max_discount_rate: 30,
    discount_tiers: [
      { rate: 10, condition: '분기 결제', min_quantity: 1 },
      { rate: 20, condition: '반기 결제', min_quantity: 1 },
      { rate: 30, condition: '연간 결제', min_quantity: 1 }
    ]
  },
  {
    name: '창업 컨설팅 패키지',
    category: '컨설팅',
    provider: '케어온',
    monthly_fee: 150000,
    description: '전문 컨설턴트의 1:1 맞춤 창업 컨설팅. 사업 계획서 작성, 입지 선정, 인테리어, 마케팅 전략까지 창업의 모든 과정을 함께합니다.',
    available: true,
    closure_refund_rate: 50,
    max_discount_rate: 10,
    discount_tiers: [
      { rate: 5, condition: '3개월 패키지', min_quantity: 1 },
      { rate: 10, condition: '6개월 패키지', min_quantity: 1 }
    ]
  },
  {
    name: '재고 관리 시스템',
    category: '운영관리',
    provider: '케어온',
    monthly_fee: 35000,
    description: '실시간 재고 추적과 자동 발주 시스템. 재고 부족 알림, 유통기한 관리, 입출고 기록 등 체계적인 재고 관리가 가능합니다.',
    available: true,
    closure_refund_rate: 85,
    max_discount_rate: 25,
    discount_tiers: [
      { rate: 10, condition: '6개월 계약', min_quantity: 1 },
      { rate: 20, condition: '연간 계약', min_quantity: 1 },
      { rate: 25, condition: '2년 계약', min_quantity: 1 }
    ]
  },
  {
    name: '직원 관리 솔루션',
    category: '인사관리',
    provider: '케어온',
    monthly_fee: 45000,
    description: '근태 관리, 급여 계산, 스케줄 관리를 한 번에. 모바일 출퇴근 체크와 자동 급여 계산으로 인사 업무를 간소화합니다.',
    available: true,
    closure_refund_rate: 75,
    max_discount_rate: 20,
    discount_tiers: [
      { rate: 5, condition: '5인 이상', min_quantity: 5 },
      { rate: 10, condition: '10인 이상', min_quantity: 10 },
      { rate: 20, condition: '20인 이상', min_quantity: 20 }
    ]
  },
  {
    name: '마케팅 자동화 플랫폼',
    category: '마케팅',
    provider: '케어온',
    monthly_fee: 59000,
    description: 'SMS, 카카오톡, 이메일 마케팅을 자동화. 고객 세그먼트별 타겟 마케팅과 캠페인 성과 분석을 지원합니다.',
    available: true,
    closure_refund_rate: 70,
    max_discount_rate: 30,
    discount_tiers: [
      { rate: 15, condition: '분기 결제', min_quantity: 1 },
      { rate: 25, condition: '반기 결제', min_quantity: 1 },
      { rate: 30, condition: '연간 결제', min_quantity: 1 }
    ]
  },
  {
    name: '배달 통합 관리',
    category: '배달',
    provider: '배달의민족',
    monthly_fee: 69000,
    description: '배민, 요기요, 쿠팡이츠 주문을 한 화면에서 관리. 통합 주문 접수와 배달 추적으로 효율적인 배달 운영이 가능합니다.',
    available: true,
    closure_refund_rate: 60,
    max_discount_rate: 15,
    discount_tiers: [
      { rate: 5, condition: '월 100건 이상', min_quantity: 100 },
      { rate: 10, condition: '월 300건 이상', min_quantity: 300 },
      { rate: 15, condition: '월 500건 이상', min_quantity: 500 }
    ]
  },
  {
    name: '회계 자동화 시스템',
    category: '회계',
    provider: '케어온',
    monthly_fee: 79000,
    description: '매출, 매입, 비용을 자동으로 기록하고 관리. 세금계산서 발행과 부가세 신고까지 회계 업무를 자동화합니다.',
    available: true,
    closure_refund_rate: 65,
    max_discount_rate: 20,
    discount_tiers: [
      { rate: 10, condition: '6개월 계약', min_quantity: 1 },
      { rate: 15, condition: '연간 계약', min_quantity: 1 },
      { rate: 20, condition: '2년 계약', min_quantity: 1 }
    ]
  },
  {
    name: '예약 관리 시스템',
    category: '예약관리',
    provider: '케어온',
    monthly_fee: 25000,
    description: '온라인 예약 접수와 관리를 간편하게. 네이버 예약, 자체 예약 시스템 연동으로 모든 예약을 통합 관리합니다.',
    available: true,
    closure_refund_rate: 95,
    max_discount_rate: 40,
    discount_tiers: [
      { rate: 20, condition: '분기 결제', min_quantity: 1 },
      { rate: 30, condition: '반기 결제', min_quantity: 1 },
      { rate: 40, condition: '연간 결제', min_quantity: 1 }
    ]
  }
]

async function seedProducts() {
  console.log('🌱 Starting product seeding...')

  try {
    // First, check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('product_id, name')
      .limit(1)

    if (checkError) {
      console.error('❌ Error checking existing products:', checkError)
      return
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Products table already has data. Skipping seed to avoid duplicates.')
      console.log('   To reseed, delete existing products first.')
      return
    }

    // Insert products
    console.log(`📝 Inserting ${products.length} products...`)

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (error) {
      console.error('❌ Error inserting products:', error)
      return
    }

    console.log(`✅ Successfully inserted ${data.length} products!`)

    // Display inserted products
    console.log('\n📦 Inserted products:')
    data.forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ₩${product.monthly_fee.toLocaleString('ko-KR')}/월`)
    })

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  } finally {
    console.log('\n🎉 Product seeding complete!')
  }
}

// Run the seed function
seedProducts()
