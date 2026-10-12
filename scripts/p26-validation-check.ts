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
  name: "TEST — DO NOT CONTACT",
  company: "P26 Test Co",
  email: "p26-test@example.com",
  phone: "+91 9000000000",
  subject: "General Enquiry",
  message: "This is a validation-only test message for P2.6.",
  consent: true,
}

assert("contact rejects null body", !validateContact(null).ok)
assert("contact rejects array body", !validateContact([]).ok)
assert("contact rejects missing consent", !validateContact({ ...validContact, consent: undefined }).ok)
assert("contact rejects extra-long name", !validateContact({ ...validContact, name: "x".repeat(81) }).ok)
assert("contact ignores unexpected fields", validateContact({ ...validContact, hack: "yes", role: "ADMIN" }).ok)
assert("contact valid still works", validateContact(validContact).ok)

const validRfq = {
  name: "TEST — DO NOT CONTACT",
  title: "Engineer",
  company: "P26 Test Co",
  country: "India",
  email: "p26-test@example.com",
  phone: "",
  industry: "Commercial Aviation",
  program: "P26 Validation",
  platform: "",
  deliveryDate: "2026-01-32",
  quantity: "",
  exportControl: "",
  notes: "",
  partNumber: "",
  partName: "Bracket",
  material: "",
  process: "CNC Machining",
  tolerance: "",
  finish: "",
  qty: "1",
  hasDrawings: "no",
  consent: true,
}

assert("rfq impossible date rejected", !validateRfq(validRfq).ok)
assert("rfq empty object rejected", !validateRfq({}).ok)
assert("rfq null rejected", !validateRfq(null).ok)

const rfqOk = validateRfq({ ...validRfq, deliveryDate: "2026-02-01" })
assert("rfq valid calendar date accepted", rfqOk.ok)

assert("path null bytes rejected", sanitizeFilename("ok.pdf\0.exe") === null)
assert("nested path stripped or rejected", sanitizeFilename("a/b/c.stp") === "c.stp" || sanitizeFilename("a/b/c.stp") === null)
assert("zip rejected", !validateAttachmentMeta({ originalFilename: "draw.zip", fileSizeBytes: 10 }).ok)
assert("zero size rejected", !validateAttachmentMeta({ originalFilename: "part.pdf", fileSizeBytes: 0 }).ok)
assert("non-number size rejected", !validateAttachmentMeta({ originalFilename: "part.pdf", fileSizeBytes: "10" }).ok)

if (failed > 0) {
  console.error(`${failed} P2.6 validation check(s) failed`)
  process.exit(1)
}
console.log("P2.6 validation checks passed")
