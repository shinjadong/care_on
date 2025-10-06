#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigration() {
  try {
    console.log('🚀 Reading migration file...')
    
    const migrationPath = path.join(__dirname, '../supabase/migrations/20251006000001_fix_oauth_null_tokens.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('📝 Migration content:')
    console.log('─'.repeat(60))
    console.log(migrationSQL)
    console.log('─'.repeat(60))
    
    console.log('\n🔧 Applying migration to Supabase...')
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('\n❌ Migration failed!')
      console.error('Error:', error)
      
      // Try alternative approach: execute via REST API
      console.log('\n🔄 Trying alternative approach via REST API...')
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sql: migrationSQL })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('REST API error:', errorText)
        process.exit(1)
      }
      
      console.log('✅ Migration applied via REST API!')
    } else {
      console.log('\n✅ Migration applied successfully!')
      console.log('Data:', data)
    }
    
    console.log('\n🎉 OAuth NULL token fix has been deployed!')
    console.log('📋 What was fixed:')
    console.log('  - Created trigger function to convert NULL to empty string')
    console.log('  - Applied to: confirmation_token, email_change, email_change_token_new, recovery_token')
    console.log('  - OAuth users (Kakao, Google) will now work correctly')
    
  } catch (err) {
    console.error('\n❌ Unexpected error:', err)
    process.exit(1)
  }
}

applyMigration()
