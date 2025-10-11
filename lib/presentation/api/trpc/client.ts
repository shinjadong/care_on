/**
 * tRPC Client for React Components
 * Use this in your React components with tRPC React Query hooks
 */

import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from './routers/_app'

export const trpc = createTRPCReact<AppRouter>()
