import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.112.4"
import { allowOrigin, requestOrigin } from "../_shared/cors.ts"
import { RFQ_BUCKET } from "../_shared/files.ts"
import {
  forbiddenOrigin,
  jsonResponse,
  methodNotAllowed,
  ok,
  optionsResponse,
  readJsonBody,
  serverError,
} from "../_shared/http.ts"
import { createServiceClient } from "../_shared/service-client.ts"
import { enforceRateLimit } from "../_shared/rate-limit.ts"

const SIGNED_SECONDS = 60

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse(req)
  if (req.method !== "POST") return methodNotAllowed(req)
  if (!allowOrigin(requestOrigin(req))) return forbiddenOrigin(req)

  const origin = requestOrigin(req)
  const authHeader = req.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse(origin, 401, { ok: false, error: "unauthorized" })
  }

  const parsed = await readJsonBody(req)
  if (!parsed.ok) return parsed.response
  if (!isRecord(parsed.value) || !isUuid(parsed.value.attachmentId) || !isUuid(parsed.value.rfqId)) {
    return jsonResponse(origin, 400, { ok: false, error: "validation_failed" })
  }

  const url = Deno.env.get("SUPABASE_URL") ?? ""
  const anon = Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  if (!url || !anon) return serverError(origin)

  try {
    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: userData, error: userError } = await userClient.auth.getUser()
    if (userError || !userData.user) {
      return jsonResponse(origin, 401, { ok: false, error: "unauthorized" })
    }

    const service = createServiceClient()
    const admin = await service
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .eq("role", "ADMIN")
      .maybeSingle()
    if (admin.error || !admin.data) {
      return jsonResponse(origin, 403, { ok: false, error: "forbidden" })
    }

    const limited = await enforceRateLimit(req, "admin-download-attachment", userData.user.id)
    if (limited) return limited

    const attachment = await service
      .from("rfq_attachments")
      .select("id, original_filename, storage_path")
      .eq("id", parsed.value.attachmentId)
      .eq("rfq_submission_id", parsed.value.rfqId)
      .maybeSingle()
    if (attachment.error) {
      console.error("admin download lookup failed", attachment.error.code)
      return serverError(origin)
    }
    if (!attachment.data) {
      return jsonResponse(origin, 404, { ok: false, error: "not_found" })
    }

    const signed = await service.storage
      .from(RFQ_BUCKET)
      .createSignedUrl(attachment.data.storage_path, SIGNED_SECONDS)
    if (signed.error || !signed.data?.signedUrl) {
      console.error("admin signed url failed")
      return serverError(origin)
    }

    return ok(origin, {
      url: signed.data.signedUrl,
      expiresIn: SIGNED_SECONDS,
      filename: attachment.data.original_filename,
    })
  } catch (cause) {
    console.error("admin download failed", cause instanceof Error ? cause.name : "error")
    return serverError(origin)
  }
})
