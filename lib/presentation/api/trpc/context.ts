/**
 * tRPC Context
 * This file creates the context for all tRPC procedures
 */

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

/**
 * User type from Supabase
 */
export interface User {
  id: string
  email: string
  role?: string
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // Create Supabase client for server-side auth
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  )

  // Get authenticated user from Supabase session
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  // Map Supabase user to our User type
  const user: User | null = supabaseUser
    ? {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: supabaseUser.user_metadata?.role || 'user',
      }
    : null

  return {
    req,
    resHeaders,
    prisma,
    supabase,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
