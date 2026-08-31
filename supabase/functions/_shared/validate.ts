const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+?[\d\s().-]{7,20}$/
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export const CONTACT_SUBJECTS = [
  "General Enquiry",
  "Request for Quotation (RFQ)",
  "Supplier Qualification / Audit",
  "Capability Enquiry",
  "Facility Visit Request",
  "Partnership / Collaboration",
  "Career / Employment",
  "Other",
] as const

export const RFQ_COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "France",
  "Germany",
  "Japan",
  "Singapore",
  "UAE",
  "Canada",
  "Australia",
  "Other",
] as const

export const RFQ_INDUSTRIES = [
  "Commercial Aviation",
  "Defense & Military",
  "Space & Satellites",
  "Helicopter & Rotorcraft",
  "UAV & Autonomous",
  "MRO & Aftermarket",
  "Other",
] as const

export const RFQ_PROCESSES = [
  "CNC Machining",
  "Tooling",
  "Jigs & Fixtures",
  "Assembly",
  "Inspection",
  "Load Testing",
  "Part Marking",
  "Multiple Processes",
  "Other",
] as const

export const CUSTOMER_EXPORT_CONTROL = [
  "ITAR Controlled",
  "EAR Controlled",
  "Dual-use (EU)",
  "No export controls",
] as const

export type ContactRow = {
  full_name: string
  company: string
  email: string
  phone: string | null
  subject: string
  message: string
  consent_given: true
}

export type RfqRow = {
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
  drawings_available: boolean
  consent_given: true
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined
}

function requiredText(
  fields: Record<string, string>,
  key: string,
  value: unknown,
  label: string,
  min: number,
  max: number,
): string | null {
  if (typeof value !== "string") {
    fields[key] = `${label} is required.`
    return null
  }
  const text = value.trim()
  if (!text) {
    fields[key] = `${label} is required.`
    return null
  }
  if (text.length < min) {
    fields[key] = `${label} must be at least ${min} characters.`
    return null
  }
  if (text.length > max) {
    fields[key] = `${label} must be ${max} characters or fewer.`
    return null
  }
  return text
}

function optionalText(
  fields: Record<string, string>,
  key: string,
  value: unknown,
  label: string,
  max: number,
): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== "string") {
    fields[key] = `${label} is invalid.`
    return null
  }
  const text = value.trim()
  if (!text) return null
  if (text.length > max) {
    fields[key] = `${label} must be ${max} characters or fewer.`
    return null
  }
  return text
}

function emailValue(
  fields: Record<string, string>,
  key: string,
  value: unknown,
): string | null {
  const text = requiredText(fields, key, value, "Email", 5, 120)
  if (!text) return null
  if (!EMAIL_RE.test(text)) {
    fields[key] = "Enter a valid email address."
    return null
  }
  return text
}

function optionalPhone(
  fields: Record<string, string>,
  key: string,
  value: unknown,
): string | null {
  const text = optionalText(fields, key, value, "Phone", 20)
  if (!text) return null
  if (!PHONE_RE.test(text)) {
    fields[key] = "Enter a valid phone number, including country code."
    return null
  }
  return text
}

function allowedValue(
  fields: Record<string, string>,
  key: string,
  value: unknown,
  label: string,
  allowed: readonly string[],
): string | null {
  const text = requiredText(fields, key, value, label, 1, 160)
  if (!text) return null
  if (!allowed.includes(text)) {
    fields[key] = `${label} is not a recognised option.`
    return null
  }
  return text
}

function optionalAllowed(
  fields: Record<string, string>,
  key: string,
  value: unknown,
  label: string,
  allowed: readonly string[],
): string | null {
  const text = optionalText(fields, key, value, label, 80)
  if (!text) return null
  if (!allowed.includes(text)) {
    fields[key] = `${label} is not a recognised option.`
    return null
  }
  return text
}

function optionalIsoDate(
  fields: Record<string, string>,
  key: string,
  value: unknown,
): string | null {
  const text = optionalText(fields, key, value, "Delivery date", 10)
  if (!text) return null
  if (!ISO_DATE_RE.test(text)) {
    fields[key] = "Enter a valid delivery date."
    return null
  }
  const [year, month, day] = text.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    fields[key] = "Enter a valid delivery date."
    return null
  }
  return text
}

function requireConsent(fields: Record<string, string>, value: unknown, message: string): boolean {
  if (value !== true) {
    fields.consent = message
    return false
  }
  return true
}

export function validateContact(body: unknown): { ok: true; row: ContactRow } | { ok: false; fields: Record<string, string> } {
  const fields: Record<string, string> = {}
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: "Request body must be a JSON object." } }
  }

  const full_name = requiredText(fields, "name", body.name, "Full name", 2, 80)
  const company = requiredText(fields, "company", body.company, "Company", 2, 120)
  const email = emailValue(fields, "email", body.email)
  const phone = optionalPhone(fields, "phone", body.phone)
  const subject = allowedValue(fields, "subject", body.subject, "Subject", CONTACT_SUBJECTS)
  const message = requiredText(fields, "message", body.message, "Message", 10, 2000)
  const consent_given = requireConsent(
    fields,
    body.consent,
    "Confirm that we may use this enquiry to respond to you.",
  )

  if (Object.keys(fields).length > 0 || !full_name || !company || !email || !subject || !message || !consent_given) {
    return { ok: false, fields }
  }

  return {
    ok: true,
    row: {
      full_name,
      company,
      email,
      phone,
      subject,
      message,
      consent_given: true,
    },
  }
}

export function validateRfq(body: unknown): { ok: true; row: RfqRow } | { ok: false; fields: Record<string, string> } {
  const fields: Record<string, string> = {}
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: "Request body must be a JSON object." } }
  }

  const full_name = requiredText(fields, "name", body.name, "Full name", 2, 80)
  const job_title = requiredText(fields, "title", body.title, "Job title", 2, 80)
  const company = requiredText(fields, "company", body.company, "Company", 2, 120)
  const country = allowedValue(fields, "country", body.country, "Country", RFQ_COUNTRIES)
  const email = emailValue(fields, "email", body.email)
  const phone = optionalPhone(fields, "phone", body.phone)
  const industry = allowedValue(fields, "industry", body.industry, "Industry sector", RFQ_INDUSTRIES)
  const program_name = requiredText(fields, "program", body.program, "Program name", 2, 120)
  const platform = optionalText(fields, "platform", body.platform, "Platform", 120)
  const delivery_date = optionalIsoDate(fields, "deliveryDate", body.deliveryDate)
  const annual_quantity = optionalText(fields, "quantity", body.quantity, "Annual quantity", 80)
  const customer_export_control = optionalAllowed(
    fields,
    "exportControl",
    body.exportControl,
    "Export control classification",
    CUSTOMER_EXPORT_CONTROL,
  )
  const notes = optionalText(fields, "notes", body.notes, "Program notes", 2000)
  const part_number = optionalText(fields, "partNumber", body.partNumber, "Part number", 80)
  const part_name = requiredText(fields, "partName", body.partName, "Part name", 2, 160)
  const material = optionalText(fields, "material", body.material, "Material", 120)
  const process = allowedValue(fields, "process", body.process, "Manufacturing process", RFQ_PROCESSES)
  const tolerance = optionalText(fields, "tolerance", body.tolerance, "Critical tolerance", 120)
  const finish = optionalText(fields, "finish", body.finish, "Surface finish", 120)
  const part_quantity = requiredText(fields, "qty", body.qty, "Quantity required", 1, 80)

  let drawings_available = false
  const hasDrawings = asString(body.hasDrawings)
  if (hasDrawings === "yes") drawings_available = true
  else if (hasDrawings === "no") drawings_available = false
  else if (body.hasDrawings === true) drawings_available = true
  else if (body.hasDrawings === false) drawings_available = false
  else if (body.hasDrawings !== undefined && body.hasDrawings !== null && body.hasDrawings !== "") {
    fields.hasDrawings = "Drawings available must be yes or no."
  }

  const consent_given = requireConsent(
    fields,
    body.consent,
    "Confirm the information is accurate before submitting this request.",
  )

  const requiredMissing = !full_name || !job_title || !company || !country || !email || !industry ||
    !program_name || !part_name || !process || !part_quantity || !consent_given

  if (requiredMissing || Object.keys(fields).length > 0) {
    return { ok: false, fields }
  }

  return {
    ok: true,
    row: {
      full_name,
      job_title,
      company,
      country,
      email,
      phone,
      industry,
      program_name,
      platform,
      delivery_date,
      annual_quantity,
      customer_export_control,
      notes,
      part_number,
      part_name,
      material,
      process,
      tolerance,
      finish,
      part_quantity,
      drawings_available,
      consent_given: true,
    },
  }
}
