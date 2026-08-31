import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { allowOrigin, requestOrigin } from "../_shared/cors.ts"
import { RFQ_BUCKET, storagePath, validateAttachmentMeta } from "../_shared/files.ts"
import {
  created,
  forbiddenOrigin,
  methodNotAllowed,
  optionsResponse,
  readJsonBody,
  serverError,
  validationFailed,
} from "../_shared/http.ts"
import { setNotificationStatus } from "../_shared/notification-status.ts"
import { publicNotificationFlag, rfqEmailText, sendNotification } from "../_shared/notify.ts"
import { createServiceClient } from "../_shared/service-client.ts"
import { signUploadGrant } from "../_shared/upload-token.ts"
import { validateRfq } from "../_shared/validate.ts"
import { enforceRateLimit } from "../_shared/rate-limit.ts"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse(req)
  if (req.method !== "POST") return methodNotAllowed(req)
  if (!allowOrigin(requestOrigin(req))) return forbiddenOrigin(req)

  const limited = await enforceRateLimit(req, "submit-rfq")
  if (limited) return limited

  const origin = requestOrigin(req)
  const parsed = await readJsonBody(req)
  if (!parsed.ok) return parsed.response

  const validated = validateRfq(parsed.value)
  if (!validated.ok) return validationFailed(origin, validated.fields)

  const body = isRecord(parsed.value) ? parsed.value : {}
  const attachmentResult = validateAttachmentMeta(body.attachment)
  if (!attachmentResult.ok) {
    return validationFailed(origin, { attachment: attachmentResult.message })
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("rfq_submissions")
      .insert({
        full_name: validated.row.full_name,
        job_title: validated.row.job_title,
        company: validated.row.company,
        country: validated.row.country,
        email: validated.row.email,
        phone: validated.row.phone,
        industry: validated.row.industry,
        program_name: validated.row.program_name,
        platform: validated.row.platform,
        delivery_date: validated.row.delivery_date,
        annual_quantity: validated.row.annual_quantity,
        customer_export_control: validated.row.customer_export_control,
        notes: validated.row.notes,
        part_number: validated.row.part_number,
        part_name: validated.row.part_name,
        material: validated.row.material,
        process: validated.row.process,
        tolerance: validated.row.tolerance,
        finish: validated.row.finish,
        part_quantity: validated.row.part_quantity,
        drawings_available: validated.row.drawings_available,
        consent_given: true,
      })
      .select("id, created_at")
      .single()
    if (error || !data) {
      console.error("rfq insert failed", error?.code)
      return serverError(origin)
    }

    const meta = attachmentResult.meta
    if (!meta) {
      const notifyStatus = await sendNotification(
        "New RFQ submission",
        rfqEmailText({
          ...validated.row,
          id: data.id,
          created_at: data.created_at,
          attachment_count: 0,
        }),
      )
      await setNotificationStatus(supabase, "rfq_submissions", data.id, notifyStatus)
      return created(origin, { notification: publicNotificationFlag(notifyStatus) })
    }

    const attachmentId = crypto.randomUUID()
    const path = storagePath(data.id, attachmentId, meta.storedFilename)
    const signed = await supabase.storage.from(RFQ_BUCKET).createSignedUploadUrl(path, { upsert: false })
    if (signed.error || !signed.data) {
      console.error("signed upload url failed")
      const notifyStatus = await sendNotification(
        "New RFQ submission",
        rfqEmailText({
          ...validated.row,
          id: data.id,
          created_at: data.created_at,
          attachment_count: 0,
        }),
      )
      await setNotificationStatus(supabase, "rfq_submissions", data.id, notifyStatus)
      return created(origin, {
        notification: publicNotificationFlag(notifyStatus),
        uploadError: true,
      })
    }

    const completionToken = await signUploadGrant({
      submissionId: data.id,
      attachmentId,
      storagePath: path,
      originalFilename: meta.originalFilename,
      mimeType: meta.mimeType,
      fileSizeBytes: meta.fileSizeBytes,
    })

    return created(origin, {
      upload: {
        bucket: RFQ_BUCKET,
        path,
        token: signed.data.token,
        completionToken,
      },
    })
  } catch (cause) {
    console.error("rfq submit failed", cause instanceof Error ? cause.name : "error")
    return serverError(origin)
  }
})
