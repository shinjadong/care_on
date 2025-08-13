import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export async function GET() {
  try {
    const healthCheck = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      supabaseConfigured: isSupabaseConfigured,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    }

    if (!isSupabaseConfigured) {
      return Response.json(
        {
          ...healthCheck,
          status: "error",
          message: "Supabase not configured",
        },
        { status: 500 },
      )
    }

    // Test database connection
    const supabase = createClient()
    const { data, error } = await supabase.from("reviews").select("count(*)").limit(1)

    if (error) {
      return Response.json(
        {
          ...healthCheck,
          status: "error",
          message: "Database connection failed",
          dbError: error.message,
        },
        { status: 500 },
      )
    }

    return Response.json({
      ...healthCheck,
      status: "ok",
      message: "All systems operational",
      dbConnection: "ok",
    })
  } catch (error) {
    return Response.json(
      {
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
