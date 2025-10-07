const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  console.log('🔧 Applying user_id nullable migration...\n')
  
  // Read the migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20251007000005_make_user_id_nullable.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')
  
  // Split into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'))
  
  console.log(`Found ${statements.length} SQL statements\n`)
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';'
    console.log(`[${i + 1}/${statements.length}] ${statement.substring(0, 80)}...`)
    
    try {
      // Use REST API POST with SQL
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql: statement })
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.log(`  ⚠️  Response: ${error}`)
      } else {
        console.log(`  ✅ Success`)
      }
    } catch (error) {
      console.error(`  ❌ Error:`, error.message)
    }
  }
  
  console.log('\n📝 If exec_sql RPC is not available, copy and paste the following SQL into')
  console.log('   Supabase Dashboard > SQL Editor:\n')
  console.log('=' .repeat(80))
  console.log(sql)
  console.log('=' .repeat(80))
}

applyMigration()
