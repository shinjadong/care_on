require('dotenv').config({ path: '.env.local' })

async function test() {
  const { createClient } = require('../lib/supabase/server.js')
  console.log('Testing product fetch...')

  try {
    const supabase = await createClient()
    console.log('Supabase client created')

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5)

    if (error) {
      console.error('Error:', error)
    } else {
      console.log('Found products:', data ? data.length : 0)
      if (data && data.length > 0) {
        console.log('Sample product:', data[0])
      }
    }
  } catch (err) {
    console.error('Test error:', err)
  }
}

test()
