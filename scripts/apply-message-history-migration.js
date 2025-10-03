/**
 * 메시지 이력 테이블 마이그레이션 적용 스크립트
 *
 * 실행: node scripts/apply-message-history-migration.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.')
  console.log('다음 환경 변수가 필요합니다:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    console.log('📦 메시지 이력 테이블 마이그레이션 적용 중...')

    // 마이그레이션 SQL 파일 읽기
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250126_create_message_history.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // SQL을 세미콜론으로 구분하여 개별 쿼리로 분리
    const queries = migrationSQL
      .split(';')
      .filter(q => q.trim())
      .map(q => q.trim() + ';')

    console.log(`📝 ${queries.length}개의 쿼리를 실행합니다...`)

    // 각 쿼리 실행
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i]

      // 주석이나 빈 쿼리 건너뛰기
      if (query.startsWith('--') || !query.trim()) {
        continue
      }

      console.log(`  실행 중 (${i + 1}/${queries.length})...`)

      const { error } = await supabase.rpc('exec_sql', {
        sql: query
      }).single()

      // RPC 함수가 없는 경우 직접 실행 시도
      if (error?.code === 'PGRST202') {
        // Supabase SQL Editor를 통해 실행해야 함
        console.log('⚠️  RPC 함수가 없습니다. Supabase Dashboard에서 직접 SQL을 실행해주세요.')
        console.log('\n다음 SQL을 Supabase SQL Editor에서 실행하세요:')
        console.log('----------------------------------------')
        console.log(migrationSQL)
        console.log('----------------------------------------')
        return
      }

      if (error) {
        console.error(`❌ 쿼리 실행 실패:`, error)
        console.log('실패한 쿼리:', query.substring(0, 100) + '...')
        throw error
      }
    }

    console.log('✅ 마이그레이션이 성공적으로 적용되었습니다!')

    // 생성된 테이블 확인
    console.log('\n📊 생성된 테이블 확인 중...')

    const tables = ['message_history', 'message_templates', 'message_batch_jobs', 'message_batch_recipients']

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`  ❌ ${table}: 접근 실패`)
      } else {
        console.log(`  ✅ ${table}: 생성됨 (${count || 0}개 레코드)`)
      }
    }

    console.log('\n🎉 메시지 이력 시스템이 준비되었습니다!')
    console.log('\n다음 기능을 사용할 수 있습니다:')
    console.log('- 메시지 발송 이력 추적')
    console.log('- 템플릿 관리')
    console.log('- 대량 발송 작업 관리')
    console.log('- 고객별 메시지 이력 조회')

  } catch (error) {
    console.error('❌ 마이그레이션 적용 실패:', error)
    console.log('\n💡 Supabase Dashboard의 SQL Editor에서 직접 마이그레이션을 실행해주세요.')
    console.log('파일 위치: supabase/migrations/20250126_create_message_history.sql')
    process.exit(1)
  }
}

// 실행
applyMigration()