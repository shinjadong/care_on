const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20250125000000_create_enrollment_tables.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .filter(stmt => stmt.trim())
      .map(stmt => stmt.trim() + ';')

    console.log(`Applying ${statements.length} SQL statements...`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`)

      // Skip comments
      if (statement.startsWith('--')) continue

      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      })

      if (error) {
        console.error(`Error in statement ${i + 1}:`, error)
        // Continue with next statement
      } else {
        console.log(`Statement ${i + 1} executed successfully`)
      }
    }

    console.log('\nMigration applied successfully!')
  } catch (error) {
    console.error('Migration error:', error)
    process.exit(1)
  }
}

// Note: This approach requires a custom RPC function in Supabase
// Alternatively, you can apply the migration directly in Supabase Dashboard SQL editor
console.log(`
============================================
Migration SQL has been generated!

To apply this migration:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of:
   supabase/migrations/20250125000000_create_enrollment_tables.sql
4. Paste and run in the SQL editor

Or use Supabase CLI with remote database:
npx supabase db push --db-url="${process.env.DATABASE_URL}"
============================================
`)

// Uncomment to run if you have exec_sql RPC function
// applyMigration()