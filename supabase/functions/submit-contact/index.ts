import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { allowOrigin, requestOrigin } from "../_shared/cors.ts"
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
import { contactEmailText, publicNotificationFlag, sendNotification } from "../_shared/notify.ts"
import { createServiceClient } from "../_shared/service-client.ts"
import { validateContact } from "../_shared/validate.ts"
import { enforceRateLimit } from "../_shared/rate-limit.ts"

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return optionsResponse(req)
  if (req.method !== "POST") return methodNotAllowed(req)
  if (!allowOrigin(requestOrigin(req))) return forbiddenOrigin(req)

  const limited = await enforceRateLimit(req, "submit-contact")
  if (limited) return limited

  const origin = requestOrigin(req)
  const parsed = await readJsonBody(req)
  if (!parsed.ok) return parsed.response

  const validated = validateContact(parsed.value)
  if (!validated.ok) return validationFailed(origin, validated.fields)

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        full_name: validated.row.full_name,
        company: validated.row.company,
        email: validated.row.email,
        phone: validated.row.phone,
        subject: validated.row.subject,
        message: validated.row.message,
        consent_given: true,
      })
      .select("id, created_at")
      .single()
    if (error || !data) {
      console.error("contact insert failed", error?.code)
      return serverError(origin)
    }

    const notifyStatus = await sendNotification(
      "New contact enquiry",
      contactEmailText({
        id: data.id,
        created_at: data.created_at,
        ...validated.row,
      }),
    )
    await setNotificationStatus(supabase, "contact_submissions", data.id, notifyStatus)
    return created(origin, { notification: publicNotificationFlag(notifyStatus) })
  } catch (cause) {
    console.error("contact submit failed", cause instanceof Error ? cause.name : "error")
    return serverError(origin)
  }
})
