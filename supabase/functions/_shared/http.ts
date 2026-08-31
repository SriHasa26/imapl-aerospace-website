import { allowOrigin, corsHeaders, requestOrigin } from "./cors.ts"

const MAX_JSON_BYTES = 50_000

export type JsonRecord = Record<string, unknown>

export function jsonResponse(
  origin: string | null,
  status: number,
  body: JsonRecord,
): Response {
  const headers = corsHeaders(origin)
  headers.set("Content-Type", "application/json")
  return new Response(JSON.stringify(body), { status, headers })
}

export function optionsResponse(req: Request): Response {
  const origin = requestOrigin(req)
  if (!allowOrigin(origin)) {
    return new Response(null, { status: 403, headers: corsHeaders(null) })
  }
  return new Response(null, { status: 204, headers: corsHeaders(origin) })
}

export function methodNotAllowed(req: Request): Response {
  return jsonResponse(requestOrigin(req), 405, { ok: false, error: "method_not_allowed" })
}

export function forbiddenOrigin(req: Request): Response {
  return jsonResponse(requestOrigin(req), 403, { ok: false, error: "forbidden" })
}

export async function readJsonBody(
  req: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; response: Response }> {
  const origin = requestOrigin(req)
  const raw = await req.text()
  if (raw.length > MAX_JSON_BYTES) {
    return {
      ok: false,
      response: jsonResponse(origin, 413, { ok: false, error: "payload_too_large" }),
    }
  }
  if (!raw.trim()) {
    return {
      ok: false,
      response: jsonResponse(origin, 400, { ok: false, error: "validation_failed", fields: { _form: "Request body is required." } }),
    }
  }
  try {
    return { ok: true, value: JSON.parse(raw) as unknown }
  } catch {
    return {
      ok: false,
      response: jsonResponse(origin, 400, { ok: false, error: "validation_failed", fields: { _form: "Request body must be JSON." } }),
    }
  }
}

export function validationFailed(origin: string | null, fields: Record<string, string>): Response {
  return jsonResponse(origin, 400, { ok: false, error: "validation_failed", fields })
}

export function serverError(origin: string | null): Response {
  return jsonResponse(origin, 500, { ok: false, error: "server_error" })
}

export function created(origin: string | null, extra: JsonRecord = {}): Response {
  return jsonResponse(origin, 201, { ok: true, ...extra })
}

export function ok(origin: string | null, extra: JsonRecord = {}): Response {
  return jsonResponse(origin, 200, { ok: true, ...extra })
}
