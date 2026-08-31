import type { SupabaseClient } from "npm:@supabase/supabase-js@2.112.4"
import type { NotificationStatus } from "./notify.ts"

export async function setNotificationStatus(
  supabase: SupabaseClient,
  table: "contact_submissions" | "rfq_submissions",
  id: string,
  status: NotificationStatus,
): Promise<void> {
  const patch: Record<string, unknown> = { notification_status: status }
  if (status === "SENT") patch.notified_at = new Date().toISOString()
  const { error } = await supabase.from(table).update(patch).eq("id", id)
  if (error) console.error("notification status update failed", error.code)
}
