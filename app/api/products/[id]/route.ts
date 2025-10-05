import { NextRequest, NextResponse } from 'next/server'
import { getProductById } from '@/lib/supabase/products'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await getProductById(id)

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: '� �| ��$�p �(����.' },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: '�D >D  Ƶ��.' },
        { status: 404 }
      )
    }


    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('[Product Detail API] GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}