import { jsonResponse } from "./http.ts"
import { requestOrigin } from "./cors.ts"
import { createServiceClient } from "./service-client.ts"

export const RATE_WINDOW_SECONDS = 600

const LIMITS: Record<string, number> = {
  "submit-contact": 8,
  "submit-rfq": 8,
  "complete-rfq-upload": 20,
  "admin-download-attachment": 40,
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  return req.headers.get("cf-connecting-ip")?.trim()
    || req.headers.get("x-real-ip")?.trim()
    || "unknown"
}

async function hashClientKey(raw: string): Promise<string> {
  const salt = (
    Deno.env.get("UPLOAD_TOKEN_SECRET")
    ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    ?? "rate-limit"
  ).trim()
  const bytes = new TextEncoder().encode(`${salt}:${raw}`)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function tooManyRequests(origin: string | null): Response {
  const response = jsonResponse(origin, 429, { ok: false, error: "rate_limited" })
  response.headers.set("Retry-After", String(RATE_WINDOW_SECONDS))
  return response
}

/** Returns a 429/503 response when limited, or null when the request may proceed. */
export async function enforceRateLimit(
  req: Request,
  scope: keyof typeof LIMITS,
  extraKey = "",
): Promise<Response | null> {
  const origin = requestOrigin(req)
  const limit = LIMITS[scope]
  const clientKey = await hashClientKey(`${scope}|${clientIp(req)}|${extraKey}`)

  try {
    const supabase = createServiceClient()
    const since = new Date(Date.now() - RATE_WINDOW_SECONDS * 1000).toISOString()
    const { count, error } = await supabase
      .from("submission_rate_events")
      .select("id", { count: "exact", head: true })
      .eq("scope", scope)
      .eq("client_key", clientKey)
      .gte("created_at", since)

    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") {
        console.error("rate limit table missing")
        return null
      }
      console.error("rate limit lookup failed", error.code)
      return jsonResponse(origin, 503, { ok: false, error: "service_unavailable" })
    }

    if ((count ?? 0) >= limit) return tooManyRequests(origin)

    const inserted = await supabase.from("submission_rate_events").insert({
      scope,
      client_key: clientKey,
    })
    if (inserted.error && inserted.error.code !== "PGRST205" && inserted.error.code !== "42P01") {
      console.error("rate limit insert failed", inserted.error.code)
    }
    return null
  } catch {
    console.error("rate limit unavailable")
    return jsonResponse(origin, 503, { ok: false, error: "service_unavailable" })
  }
}
