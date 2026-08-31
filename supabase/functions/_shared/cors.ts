const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])

function configuredOrigins(): string[] {
  return (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function isLocalDevOrigin(origin: string): boolean {
  try {
    const url = new URL(origin)
    if (url.protocol !== "http:" && url.protocol !== "https:") return false
    return LOCAL_HOSTS.has(url.hostname)
  } catch {
    return false
  }
}

/** Returns the request Origin if it is allowed; otherwise null. Never returns "*". */
export function allowOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null
  const allowlist = configuredOrigins()
  if (allowlist.includes(requestOrigin)) return requestOrigin
  if (allowlist.length === 0 && isLocalDevOrigin(requestOrigin)) return requestOrigin
  return null
}

export function corsHeaders(origin: string | null): Headers {
  const headers = new Headers()
  headers.set("Vary", "Origin")
  headers.set(
    "Access-Control-Allow-Headers",
    "authorization, x-client-info, apikey, content-type, idempotency-key",
  )
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
  const allowed = allowOrigin(origin)
  if (allowed) headers.set("Access-Control-Allow-Origin", allowed)
  return headers
}

export function requestOrigin(req: Request): string | null {
  return req.headers.get("Origin")
}
