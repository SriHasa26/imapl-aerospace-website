export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "SKIPPED"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function line(label: string, value: string | null | undefined): string {
  const text = value?.trim()
  return `${label}: ${text ? text : "—"}`
}

export function contactEmailText(row: {
  id: string
  full_name: string
  company: string
  email: string
  phone: string | null
  subject: string
  message: string
  created_at: string
}): string {
  return [
    "New contact enquiry (website submission).",
    "",
    line("Reference", row.id),
    line("Submitted", row.created_at),
    line("Name", row.full_name),
    line("Company", row.company),
    line("Email", row.email),
    line("Phone", row.phone),
    line("Subject", row.subject),
    "",
    "Message:",
    row.message,
    "",
    "This message is a notification of stored form data. It is not a certification, quotation, or contractual offer.",
  ].join("\n")
}

export function rfqEmailText(row: {
  id: string
  full_name: string
  job_title: string
  company: string
  country: string
  email: string
  phone: string | null
  industry: string
  program_name: string
  platform: string | null
  delivery_date: string | null
  annual_quantity: string | null
  customer_export_control: string | null
  notes: string | null
  part_number: string | null
  part_name: string
  material: string | null
  process: string
  tolerance: string | null
  finish: string | null
  part_quantity: string
  created_at: string
  attachment_count: number
}): string {
  return [
    "New RFQ submission (website).",
    "",
    line("Reference", row.id),
    line("Submitted", row.created_at),
    line("Attachment count", String(row.attachment_count)),
    "",
    "Contact",
    line("Name", row.full_name),
    line("Job title", row.job_title),
    line("Company", row.company),
    line("Country", row.country),
    line("Email", row.email),
    line("Phone", row.phone),
    "",
    "Program",
    line("Industry", row.industry),
    line("Program", row.program_name),
    line("Platform", row.platform),
    line("Delivery date", row.delivery_date),
    line("Annual quantity", row.annual_quantity),
    line("Visitor export-control selection", row.customer_export_control),
    line("Notes", row.notes),
    "",
    "Part",
    line("Part number", row.part_number),
    line("Part name", row.part_name),
    line("Material", row.material),
    line("Process", row.process),
    line("Tolerance", row.tolerance),
    line("Finish", row.finish),
    line("Quantity", row.part_quantity),
    "",
    "Visitor export-control selection is the submitter's classification of their requirement. It is not an IMAPL certification or ITAR-ready claim.",
    "Engineering files are not attached to this email. Files, if any, are in private Storage for later admin access.",
    "This message is not a quotation, purchase order, or contractual offer.",
  ].join("\n")
}

export async function sendNotification(subject: string, text: string): Promise<NotificationStatus> {
  const apiKey = Deno.env.get("RESEND_API_KEY")?.trim() ?? ""
  const to = Deno.env.get("NOTIFICATION_EMAIL")?.trim() ?? ""
  const from = Deno.env.get("NOTIFICATION_FROM")?.trim() ?? ""
  if (!apiKey || !to || !from) return "SKIPPED"
  if (!EMAIL_RE.test(to) || !from.includes("@")) return "SKIPPED"

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
      }),
    })
    if (!response.ok) {
      console.error("notification provider status", response.status)
      return "FAILED"
    }
    return "SENT"
  } catch {
    console.error("notification provider unreachable")
    return "FAILED"
  }
}

export function publicNotificationFlag(status: NotificationStatus): "sent" | "failed" | "skipped" {
  if (status === "SENT") return "sent"
  if (status === "SKIPPED") return "skipped"
  return "failed"
}
