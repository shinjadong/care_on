import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient(useServiceRole = false) {
  try {
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL

    // useServiceRole이 true면 service role key 사용, 아니면 anon key 사용
    const supabaseKey = useServiceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY!
      : (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables:", {
        url: !!supabaseUrl,
        key: !!supabaseKey,
        useServiceRole,
        availableEnvVars: Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
      })
      throw new Error("Supabase URL and Key are required")
    }

    console.log("🔧 Creating Supabase client with:", {
      url: supabaseUrl,
      hasKey: !!supabaseKey,
      keyType: useServiceRole ? 'service_role' : 'anon',
    })

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value
          } catch (error) {
            console.warn("Cookie get error:", error)
            return undefined
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn("Cookie set error:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn("Cookie remove error:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("❌ Failed to create Supabase client:", error)
    throw error
  }
}
