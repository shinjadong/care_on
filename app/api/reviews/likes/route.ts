import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { reviewId } = await request.json()
    const userIdentifier = request.ip || 'anonymous'

    const supabase = createClient()

    // Check if user already liked this review
    const { data: existingLike } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_identifier', userIdentifier)
      .single()

    if (existingLike) {
      // Unlike - remove the like
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_identifier', userIdentifier)

      if (error) throw error

      return NextResponse.json({ liked: false })
    } else {
      // Like - add the like
      const { error } = await supabase
        .from('review_likes')
        .insert({
          review_id: reviewId,
          user_identifier: userIdentifier
        })

      if (error) throw error

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')
    const userIdentifier = request.ip || 'anonymous'

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Check if user liked this review
    const { data: existingLike } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_identifier', userIdentifier)
      .single()

    // Get total likes count
    const { data: review } = await supabase
      .from('reviews')
      .select('likes_count')
      .eq('id', reviewId)
      .single()

    return NextResponse.json({
      liked: !!existingLike,
      count: review?.likes_count || 0
    })
  } catch (error) {
    console.error('Get like status error:', error)
    return NextResponse.json(
      { error: 'Failed to get like status' },
      { status: 500 }
    )
  }
}
