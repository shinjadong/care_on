const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRLS() {
  console.log('🔧 Attempting to disable RLS using PostgreSQL REST API...\n')

  // Just try a simple insert first to see what happens
  console.log('Testing insert with Service Role Key...')
  
  const testData = {
    user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
    title: 'Test Blog Post',
    content: '<p>Test content</p>',
    format: 'html',
    keyword: 'test',
    model: 'gpt-4',
    slug: 'test-' + Date.now(),
    seo_keywords: ['test'],
    image_urls: [],
    generation_status: 'completed',
    status: 'draft'
  }

  const { data, error } = await supabase
    .from('ai_blog_posts')
    .insert(testData)
    .select()
    .single()

  if (error) {
    console.error('❌ Insert failed:', error)
    console.log('\n📋 Error details:', JSON.stringify(error, null, 2))
    
    if (error.code === '42501') {
      console.log('\n⚠️  This is a permissions error (42501)')
      console.log('RLS policies are blocking the insert even with Service Role Key')
      console.log('\n📝 To fix this, run the following SQL in Supabase Dashboard > SQL Editor:\n')
      console.log('ALTER TABLE ai_blog_posts DISABLE ROW LEVEL SECURITY;')
      console.log('ALTER TABLE ai_blog_generation_history DISABLE ROW LEVEL SECURITY;')
      console.log('ALTER TABLE ai_blog_templates DISABLE ROW LEVEL SECURITY;')
    }
  } else {
    console.log('✅ Insert succeeded!', data)
    
    // Clean up test data
    await supabase
      .from('ai_blog_posts')
      .delete()
      .eq('id', data.id)
    
    console.log('✅ Test data cleaned up')
    console.log('\n✨ RLS is either disabled or Service Role Key is working correctly!')
  }
}

fixRLS()
