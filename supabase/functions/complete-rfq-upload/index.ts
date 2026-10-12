import "jsr:@supabase/functions-js/edge-runtime.d.ts"
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
import { setNotificationStatus } from "../_shared/notification-status.ts"
import { publicNotificationFlag, rfqEmailText, sendNotification } from "../_shared/notify.ts"
import { createServiceClient } from "../_shared/service-client.ts"
import { verifyUploadGrant } from "../_shared/upload-token.ts"
import { enforceRateLimit } from "../_shared/rate-limit.ts"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse(req)
  if (req.method !== "POST") return methodNotAllowed(req)
  if (!allowOrigin(requestOrigin(req))) return forbiddenOrigin(req)

  const limited = await enforceRateLimit(req, "complete-rfq-upload")
  if (limited) return limited

  const origin = requestOrigin(req)
  const parsed = await readJsonBody(req)
  if (!parsed.ok) return parsed.response
  if (!isRecord(parsed.value)) {
    return jsonResponse(origin, 400, { ok: false, error: "validation_failed", fields: { _form: "Request body must be a JSON object." } })
  }

  const grant = await verifyUploadGrant(parsed.value.completionToken)
  if (!grant) {
    return jsonResponse(origin, 400, { ok: false, error: "upload_token_invalid" })
  }

  try {
    const supabase = createServiceClient()

    const existing = await supabase
      .from("rfq_attachments")
      .select("id")
      .eq("id", grant.attachmentId)
      .maybeSingle()
    if (existing.data) {
      const current = await supabase
        .from("rfq_submissions")
        .select("notification_status")
        .eq("id", grant.submissionId)
        .maybeSingle()
      const flag = current.data?.notification_status === "SENT"
        ? "sent"
        : current.data?.notification_status === "SKIPPED"
        ? "skipped"
        : "failed"
      return ok(origin, { notification: flag, alreadyCompleted: true })
    }

    const listed = await supabase.storage.from(RFQ_BUCKET).list(`rfq/${grant.submissionId}/${grant.attachmentId}`, {
      limit: 10,
    })
    if (listed.error) {
      console.error("storage list failed", listed.error.name)
      return serverError(origin)
    }
    const object = listed.data?.find((item) => `rfq/${grant.submissionId}/${grant.attachmentId}/${item.name}` === grant.storagePath)
    if (!object) {
      return jsonResponse(origin, 409, { ok: false, error: "upload_incomplete" })
    }
    const size = typeof object.metadata?.size === "number" ? object.metadata.size : grant.fileSizeBytes
    if (size > grant.fileSizeBytes * 1.05 + 1024) {
      await supabase.storage.from(RFQ_BUCKET).remove([grant.storagePath])
      return jsonResponse(origin, 400, { ok: false, error: "validation_failed", fields: { attachment: "File must be 50 MB or smaller." } })
    }

    const { error: metaError } = await supabase.from("rfq_attachments").insert({
      id: grant.attachmentId,
      rfq_submission_id: grant.submissionId,
      original_filename: grant.originalFilename,
      storage_path: grant.storagePath,
      mime_type: grant.mimeType,
      file_size_bytes: size,
    })
    if (metaError) {
      console.error("attachment metadata insert failed", metaError.code)
      await supabase.storage.from(RFQ_BUCKET).remove([grant.storagePath])
      return serverError(origin)
    }

    const rfq = await supabase
      .from("rfq_submissions")
      .select(
        "id, created_at, full_name, job_title, company, country, email, phone, industry, program_name, platform, delivery_date, annual_quantity, customer_export_control, notes, part_number, part_name, material, process, tolerance, finish, part_quantity",
      )
      .eq("id", grant.submissionId)
      .single()
    if (rfq.error || !rfq.data) {
      return ok(origin, { notification: "failed" })
    }

    const notifyStatus = await sendNotification(
      "New RFQ submission",
      rfqEmailText({
        ...rfq.data,
        attachment_count: 1,
      }),
    )
    await setNotificationStatus(supabase, "rfq_submissions", grant.submissionId, notifyStatus)
    return ok(origin, { notification: publicNotificationFlag(notifyStatus) })
  } catch (cause) {
    console.error("complete rfq upload failed", cause instanceof Error ? cause.name : "error")
    return serverError(origin)
  }
})
