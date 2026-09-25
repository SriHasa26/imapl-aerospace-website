import { validateAttachmentMeta, sanitizeFilename } from "../supabase/functions/_shared/files.ts"
import { validateContact, validateRfq } from "../supabase/functions/_shared/validate.ts"

let failed = 0

function assert(name: string, condition: boolean) {
  if (!condition) {
    failed += 1
    console.error("FAIL", name)
  }
}

const validContact = {
  name: "Test User",
  company: "P23 Test Co",
  email: "p23-test@example.com",
  phone: "",
  subject: "General Enquiry",
  message: "This is a validation-only test message.",
  consent: true,
}

assert("contact missing name", !validateContact({ ...validContact, name: "" }).ok)
assert("contact invalid email", !validateContact({ ...validContact, email: "not-an-email" }).ok)
assert("contact invalid phone", !validateContact({ ...validContact, phone: "abc" }).ok)
assert("contact consent", !validateContact({ ...validContact, consent: false }).ok)
assert("contact long message", !validateContact({ ...validContact, message: "x".repeat(2001) }).ok)

const contactOk = validateContact(validContact)
assert("contact valid empty phone is null", contactOk.ok && contactOk.row.phone === null)

const validRfq = {
  name: "Test User",
  title: "Engineer",
  company: "P23 Test Co",
  country: "India",
  email: "p23-test@example.com",
  phone: "",
  industry: "Commercial Aviation",
  program: "P23 Validation",
  platform: "",
  deliveryDate: "",
  quantity: "",
  exportControl: "",
  notes: "",
  partNumber: "",
  partName: "Bracket",
  material: "",
  process: "CNC Machining",
  tolerance: "",
  finish: "",
  qty: "12 pcs",
  hasDrawings: "no",
  consent: true,
}

assert("rfq missing part name", !validateRfq({ ...validRfq, partName: "" }).ok)
assert("rfq invalid industry", !validateRfq({ ...validRfq, industry: "Not a real sector" }).ok)
assert("rfq invalid date", !validateRfq({ ...validRfq, deliveryDate: "not-a-date" }).ok)
assert("rfq consent", !validateRfq({ ...validRfq, consent: false }).ok)
assert("rfq rejects ITAR-ready rewrite", !validateRfq({ ...validRfq, exportControl: "ITAR ready" }).ok)

const rfqOk = validateRfq(validRfq)
assert(
  "rfq empty optionals are null",
  rfqOk.ok &&
    rfqOk.row.phone === null &&
    rfqOk.row.platform === null &&
    rfqOk.row.delivery_date === null &&
    rfqOk.row.customer_export_control === null &&
    rfqOk.row.notes === null &&
    rfqOk.row.drawings_available === false,
)

const rfqExport = validateRfq({ ...validRfq, exportControl: "ITAR Controlled" })
assert(
  "rfq stores visitor export control as selected",
  rfqExport.ok && rfqExport.row.customer_export_control === "ITAR Controlled",
)

assert("path traversal filename rejected", sanitizeFilename("../secret.pdf") === "secret.pdf" || sanitizeFilename("../secret.pdf") === null)
assert("dot-dot rejected as name", sanitizeFilename("..") === null)
assert("exe rejected", !validateAttachmentMeta({ originalFilename: "payload.exe", fileSizeBytes: 10 }).ok)
assert("oversize rejected", !validateAttachmentMeta({ originalFilename: "part.pdf", fileSizeBytes: 60 * 1024 * 1024 }).ok)
assert(
  "pdf accepted",
  validateAttachmentMeta({ originalFilename: "bracket.pdf", fileSizeBytes: 2048, mimeType: "application/pdf" }).ok,
)
assert("empty attachment omitted", validateAttachmentMeta(undefined).ok && validateAttachmentMeta(undefined).ok)

if (failed > 0) {
  console.error(`${failed} validation check(s) failed`)
  process.exit(1)
}
console.log("P2.3/P2.4 validation checks passed")
