/**
 * tRPC Server Client for Server Components
 * Use this in Server Components and Server Actions
 */

import { appRouter } from './routers/_app'
import { createContext } from './context'

/**
 * Create a server-side caller
 * This allows you to call tRPC procedures directly from Server Components
 */
export const serverClient = appRouter.createCaller(
  await createContext({
    req: new Request('http://localhost:3000'),
    resHeaders: new Headers(),
    info: undefined as any, // Not used in this context
  })
)
