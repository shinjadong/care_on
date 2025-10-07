import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // page-builder 버킷 생성
    const { data: bucket, error: bucketError } = await supabase.storage
      .createBucket('page-builder', {
        public: true,
        allowedMimeTypes: ['image/*', 'video/*'],
        fileSizeLimit: 10485760 // 10MB
      })

    if (bucketError && bucketError.message !== 'Bucket already exists') {
      console.error('Error creating bucket:', bucketError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create storage bucket',
        details: bucketError.message
      }, { status: 500 })
    }

    console.log('✅ Storage bucket setup complete:', bucket || 'Already exists')

    return NextResponse.json({
      success: true,
      message: 'Storage bucket created or already exists'
    })

  } catch (error) {
    console.error('Error setting up storage:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to setup storage'
    }, { status: 500 })
  }
}
