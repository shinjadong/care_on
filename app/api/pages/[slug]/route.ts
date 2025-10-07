import { NextRequest, NextResponse } from 'next/server'
import { getPageBySlug } from '@/lib/api/pages'

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const page = await getPageBySlug(slug)
    
    if (page) {
      return NextResponse.json({ success: true, data: page })
    } else {
      return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch page' }, { status: 500 })
  }
}
