/**
 * tRPC Context
 * This file creates the context for all tRPC procedures
 */

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { prisma } from '@/lib/infrastructure/database/prisma/client'

/**
 * User type (will be replaced with actual Supabase user type)
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
  // TODO: Get user from Supabase session
  // For now, we'll return mock user in development mode
  // In production, you would:
  // 1. Extract session cookie from req
  // 2. Validate with Supabase
  // 3. Return user info

  // TEMPORARY: Mock user for development/testing
  // Remove this when Supabase auth is implemented
  const isDevelopment = process.env.NODE_ENV === 'development'
  const user: User | null = isDevelopment
    ? {
        id: 'dev-user-001',
        email: 'dev@careon.com',
        role: 'user'
      }
    : null // In production, this will come from Supabase

  return {
    req,
    resHeaders,
    prisma,
    user,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
