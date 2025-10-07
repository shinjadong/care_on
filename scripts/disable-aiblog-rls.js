const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function disableRLS() {
  console.log('🔧 Disabling RLS for AI blog tables...\n')

  const statements = [
    'ALTER TABLE ai_blog_posts DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE ai_blog_generation_history DISABLE ROW LEVEL SECURITY;',
    'ALTER TABLE ai_blog_templates DISABLE ROW LEVEL SECURITY;',
    'DROP POLICY IF EXISTS "Users can view their own blog posts" ON ai_blog_posts;',
    'DROP POLICY IF EXISTS "Users can create their own blog posts" ON ai_blog_posts;',
    'DROP POLICY IF EXISTS "Users can update their own blog posts" ON ai_blog_posts;',
    'DROP POLICY IF EXISTS "Users can delete their own blog posts" ON ai_blog_posts;',
    'DROP POLICY IF EXISTS "Users can view their own generation history" ON ai_blog_generation_history;',
    'DROP POLICY IF EXISTS "Users can create their own generation history" ON ai_blog_generation_history;',
    'DROP POLICY IF EXISTS "Users can view public templates and their own" ON ai_blog_templates;',
    'DROP POLICY IF EXISTS "Users can create their own templates" ON ai_blog_templates;',
    'DROP POLICY IF EXISTS "Users can update their own templates" ON ai_blog_templates;',
    'DROP POLICY IF EXISTS "Users can delete their own templates" ON ai_blog_templates;'
  ]

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]
    console.log(`[${i + 1}/${statements.length}] ${statement}`)
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        console.error(`  ❌ Error:`, error.message)
      } else {
        console.log(`  ✅ Success`)
      }
    } catch (error) {
      console.error(`  ❌ Exception:`, error.message)
    }
  }

  console.log('\n✅ RLS disable migration completed!')
}

disableRLS()
