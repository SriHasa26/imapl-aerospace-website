import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2.112.4"

export function createServiceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL") ?? ""
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  if (!url || !key) {
    throw new Error("Missing server database configuration")
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
