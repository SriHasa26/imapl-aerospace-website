export const RFQ_BUCKET = "rfq-attachments"
export const MAX_DRAWING_BYTES = 52_428_800
export const ALLOWED_EXTENSIONS = [".pdf", ".step", ".stp", ".dxf", ".iges", ".igs"] as const

const ALLOWED_MIME = new Set([
  "application/pdf",
  "application/octet-stream",
  "application/step",
  "model/step",
  "text/plain",
  "application/dxf",
  "image/vnd.dxf",
  "application/x-dxf",
  "image/vnd.dwg",
  "application/iges",
  "model/iges",
  "application/x-iges",
])

export type AttachmentMeta = {
  originalFilename: string
  storedFilename: string
  fileSizeBytes: number
  mimeType: string | null
  extension: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function sanitizeFilename(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (trimmed.includes("\0")) return null
  const base = trimmed.replace(/\\/g, "/").split("/").pop() ?? ""
  if (!base || base === "." || base === "..") return null
  if (base.includes("..")) return null
  const cleaned = base.replace(/[^\w.\-+() ]+/g, "_").replace(/^\.+/g, "_")
  const clipped = cleaned.slice(0, 180)
  return clipped || null
}

export function fileExtension(filename: string): string | null {
  const lower = filename.toLowerCase()
  const match = ALLOWED_EXTENSIONS.find((ext) => lower.endsWith(ext))
  return match ?? null
}

export function validateAttachmentMeta(
  value: unknown,
): { ok: true; meta: AttachmentMeta } | { ok: false; message: string } | { ok: true; meta: null } {
  if (value === undefined || value === null || value === "") return { ok: true, meta: null }
  if (!isRecord(value)) return { ok: false, message: "Attachment metadata is invalid." }

  if (typeof value.originalFilename !== "string") {
    return { ok: false, message: "Attachment filename is required." }
  }
  const storedFilename = sanitizeFilename(value.originalFilename)
  if (!storedFilename) return { ok: false, message: "Attachment filename is not allowed." }

  const extension = fileExtension(storedFilename)
  if (!extension) {
    return { ok: false, message: `Use a ${ALLOWED_EXTENSIONS.join(", ")} file.` }
  }

  if (typeof value.fileSizeBytes !== "number" || !Number.isFinite(value.fileSizeBytes)) {
    return { ok: false, message: "Attachment size is invalid." }
  }
  const fileSizeBytes = Math.floor(value.fileSizeBytes)
  if (fileSizeBytes < 1) return { ok: false, message: "Attachment is empty." }
  if (fileSizeBytes > MAX_DRAWING_BYTES) return { ok: false, message: "File must be 50 MB or smaller." }

  let mimeType: string | null = null
  if (value.mimeType !== undefined && value.mimeType !== null && value.mimeType !== "") {
    if (typeof value.mimeType !== "string") return { ok: false, message: "Attachment type is invalid." }
    const mime = value.mimeType.trim().toLowerCase().split(";")[0]?.trim() ?? ""
    if (!ALLOWED_MIME.has(mime)) return { ok: false, message: "Attachment type is not allowed." }
    mimeType = mime
  }

  return {
    ok: true,
    meta: {
      originalFilename: value.originalFilename.trim().slice(0, 260),
      storedFilename,
      fileSizeBytes,
      mimeType,
      extension,
    },
  }
}

export function storagePath(submissionId: string, attachmentId: string, storedFilename: string): string {
  return `rfq/${submissionId}/${attachmentId}/${storedFilename}`
}
