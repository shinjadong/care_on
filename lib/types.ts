import type { PutBlobResult } from "@vercel/blob"

export type State = {
  message: string | null
  success: boolean
  data?: PutBlobResult
}
