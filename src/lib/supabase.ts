import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Browser-safe Supabase client.
 *
 * CLIENT-SAFE (Vite public env):
 * - VITE_SUPABASE_URL
 * - VITE_SUPABASE_PUBLISHABLE_KEY
 *
 * SERVER-ONLY (never VITE_*, never this module):
 * - secret / service-role keys
 * - database password
 * - email provider credentials
 *
 * P2.5: persistSession stores the Supabase Auth session (not passwords, not
 * service-role keys) so administrators stay signed in. Enquiry form data is
 * still not written to localStorage by this app.
 */

const URL_ENV = "VITE_SUPABASE_URL"
const KEY_ENV = "VITE_SUPABASE_PUBLISHABLE_KEY"

function readRequiredEnv(name: typeof URL_ENV | typeof KEY_ENV): string {
  const value = import.meta.env[name]
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(
      `[supabase] Missing ${name}. Add it to .env.local (see docs/supabase-setup.md). The app will not invent fallback credentials.`,
    )
  }
  return value.trim()
}

function normalizeProjectUrl(url: string): string {
  const withoutTrailingSlash = url.replace(/\/+$/, "")
  return withoutTrailingSlash.replace(/\/rest\/v1$/i, "")
}

function isForbiddenBrowserKey(key: string): boolean {
  if (key.startsWith("sb_secret_")) return true
  if (/service_role/i.test(key)) return true

  const parts = key.split(".")
  if (parts.length === 3) {
    try {
      const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      const payload = JSON.parse(payloadJson) as { role?: unknown }
      if (payload.role === "service_role") return true
    } catch {
      return false
    }
  }

  return false
}

function assertHttpsProjectUrl(url: string): void {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(
      `[supabase] ${URL_ENV} is not a valid URL. Use the project API URL from the Supabase Connect panel (https://<project-ref>.supabase.co), not the /rest/v1 Data API path.`,
    )
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(`[supabase] ${URL_ENV} must be an http(s) project URL.`)
  }
}

const supabaseUrl = normalizeProjectUrl(readRequiredEnv(URL_ENV))
const supabasePublishableKey = readRequiredEnv(KEY_ENV)

assertHttpsProjectUrl(supabaseUrl)

if (isForbiddenBrowserKey(supabasePublishableKey)) {
  throw new Error(
    `[supabase] Refusing to initialize: ${KEY_ENV} looks like a secret or service-role key. Use the publishable (browser) key only. Do not put secret keys in VITE_* variables.`,
  )
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
})
