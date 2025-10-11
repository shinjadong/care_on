/**
 * Root tRPC Router
 * This is the main router that combines all sub-routers
 */

import { router } from '../trpc'
import { enrollmentRouter } from './enrollment'
import { productRouter } from './product'
import { canvasRouter } from './canvas'

/**
 * Main tRPC router
 * Add your routers here
 */
export const appRouter = router({
  enrollment: enrollmentRouter,
  product: productRouter,
  canvas: canvasRouter,
  // Add more routers here as you build them:
  // customer: customerRouter,
  // contract: contractRouter,
  // review: reviewRouter,
})

export type AppRouter = typeof appRouter
