import { FunctionsHttpError } from "@supabase/supabase-js"
import { supabase } from "./supabase"

export type NotificationFlag = "sent" | "failed" | "skipped"

export type SignedUpload = {
  bucket: string
  path: string
  token: string
  completionToken: string
}

export type SubmitOk = {
  ok: true
  notification?: NotificationFlag
  upload?: SignedUpload
  uploadError?: boolean
}

export type SubmitFail = {
  ok: false
  fields?: Record<string, string>
  message: string
  uploadIncomplete?: boolean
}

export type SubmitResult = SubmitOk | SubmitFail

const FAIL = "Your request was not submitted. Please try again."
const UPLOAD_FAIL = "Your request was saved. The drawing was not uploaded. You can retry the upload."

export type ContactSubmitPayload = {
  name: string
  company: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
}

export type RfqSubmitPayload = {
  name: string
  title: string
  company: string
  country: string
  email: string
  phone: string
  industry: string
  program: string
  platform: string
  deliveryDate: string
  quantity: string
  exportControl: string
  notes: string
  partNumber: string
  partName: string
  material: string
  process: string
  tolerance: string
  finish: string
  qty: string
  hasDrawings: "yes" | "no"
  consent: boolean
  attachment?: {
    originalFilename: string
    fileSizeBytes: number
    mimeType: string
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function fieldMap(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) return undefined
  const fields: Record<string, string> = {}
  for (const [key, message] of Object.entries(value)) {
    if (typeof message === "string" && message) fields[key] = message
  }
  return Object.keys(fields).length ? fields : undefined
}

function notificationFlag(value: unknown): NotificationFlag | undefined {
  if (value === "sent" || value === "failed" || value === "skipped") return value
  return undefined
}

function signedUpload(value: unknown): SignedUpload | undefined {
  if (!isRecord(value)) return undefined
  if (typeof value.bucket !== "string" || typeof value.path !== "string") return undefined
  if (typeof value.token !== "string" || typeof value.completionToken !== "string") return undefined
  return {
    bucket: value.bucket,
    path: value.path,
    token: value.token,
    completionToken: value.completionToken,
  }
}

async function parseInvokeError(error: unknown): Promise<SubmitFail> {
  if (error instanceof FunctionsHttpError) {
    const context = error.context as { json?: () => Promise<unknown>; status?: number }
    let body: unknown = null
    try {
      if (typeof context?.json === "function") body = await context.json()
    } catch {
      body = null
    }
    const record = isRecord(body) ? body : null
    const fields = fieldMap(record?.fields)
    if (record?.error === "upload_incomplete" || context?.status === 409) {
      return { ok: false, message: UPLOAD_FAIL, uploadIncomplete: true }
    }
    if (record?.error === "rate_limited" || context?.status === 429) {
      return { ok: false, message: "Too many requests. Please wait a few minutes and try again." }
    }
    if (context?.status === 400 || record?.error === "validation_failed") {
      return {
        ok: false,
        fields,
        message: fields ? "Please correct the highlighted fields." : FAIL,
      }
    }
    return { ok: false, message: FAIL }
  }
  return { ok: false, message: FAIL }
}

function parseOk(data: unknown): SubmitOk | SubmitFail {
  if (!isRecord(data) || data.ok !== true) return { ok: false, message: FAIL }
  return {
    ok: true,
    notification: notificationFlag(data.notification),
    upload: signedUpload(data.upload),
    uploadError: data.uploadError === true,
  }
}

async function invokeJson(name: "submit-contact" | "submit-rfq" | "complete-rfq-upload", body: object): Promise<SubmitResult> {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) return parseInvokeError(error)
  return parseOk(data)
}

export function submitContact(payload: ContactSubmitPayload): Promise<SubmitResult> {
  return invokeJson("submit-contact", payload)
}

export function submitRfq(payload: RfqSubmitPayload): Promise<SubmitResult> {
  return invokeJson("submit-rfq", payload)
}

export function completeRfqUpload(completionToken: string): Promise<SubmitResult> {
  return invokeJson("complete-rfq-upload", { completionToken })
}

export async function uploadToSignedPath(upload: SignedUpload, file: File): Promise<SubmitResult> {
  const { error } = await supabase.storage.from(upload.bucket).uploadToSignedUrl(upload.path, upload.token, file)
  if (error) return { ok: false, message: UPLOAD_FAIL, uploadIncomplete: true }
  return completeRfqUpload(upload.completionToken)
}
