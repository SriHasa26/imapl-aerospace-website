import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const PAGE_SIZE = 25

export const CONTACT_STATUSES = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const
export const RFQ_STATUSES = ['NEW', 'REVIEWING', 'QUOTING', 'COMPLETED', 'CLOSED'] as const

export type ContactStatus = (typeof CONTACT_STATUSES)[number]
export type RfqStatus = (typeof RFQ_STATUSES)[number]

export type ContactRow = {
  id: string
  full_name: string
  company: string
  email: string
  phone: string | null
  subject: string
  message: string
  consent_given: boolean
  status: ContactStatus
  created_at: string
  updated_at: string
}

export type RfqRow = {
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
  drawings_available: boolean
  consent_given: boolean
  status: RfqStatus
  created_at: string
  updated_at: string
}

export type AttachmentRow = {
  id: string
  rfq_submission_id: string
  original_filename: string
  mime_type: string | null
  file_size_bytes: number | null
  created_at: string
}

type ListResult<T> = { ok: true; rows: T[]; total: number } | { ok: false; message: string }

const FAIL = 'Could not load records.'

function sanitizeSearch(raw: string) {
  return raw.trim().replace(/[%_,()]/g, ' ').replace(/\s+/g, ' ').trim()
}

function isStatus<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value)
}

export async function countByStatus(table: 'contact_submissions' | 'rfq_submissions', status: string) {
  const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true }).eq('status', status)
  if (error) return null
  return count ?? 0
}

export type RecentContact = Pick<ContactRow, 'id' | 'full_name' | 'company' | 'subject' | 'status' | 'created_at'>
export type RecentRfq = Pick<RfqRow, 'id' | 'full_name' | 'company' | 'part_name' | 'status' | 'created_at'>

export async function loadDashboard(): Promise<
  | {
      ok: true
      newContacts: number
      openRfqs: number
      rfqsReviewing: number
      recentContacts: RecentContact[]
      recentRfqs: RecentRfq[]
    }
  | { ok: false }
> {
  const [newContacts, rfqNew, rfqReviewing, contacts, rfqs] = await Promise.all([
    countByStatus('contact_submissions', 'NEW'),
    countByStatus('rfq_submissions', 'NEW'),
    countByStatus('rfq_submissions', 'REVIEWING'),
    supabase
      .from('contact_submissions')
      .select('id, full_name, company, subject, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('rfq_submissions')
      .select('id, full_name, company, part_name, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  if (newContacts === null || rfqNew === null || rfqReviewing === null || contacts.error || rfqs.error) {
    return { ok: false }
  }

  return {
    ok: true,
    newContacts,
    openRfqs: rfqNew + rfqReviewing,
    rfqsReviewing: rfqReviewing,
    recentContacts: (contacts.data ?? []) as RecentContact[],
    recentRfqs: (rfqs.data ?? []) as RecentRfq[],
  }
}

export async function listContacts(params: { q: string; status: string; page: number }): Promise<ListResult<ContactRow>> {
  let query = supabase
    .from('contact_submissions')
    .select('id, full_name, company, email, phone, subject, status, created_at, updated_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(params.page * PAGE_SIZE, params.page * PAGE_SIZE + PAGE_SIZE - 1)

  if (params.status && isStatus(params.status, CONTACT_STATUSES)) query = query.eq('status', params.status)
  const q = sanitizeSearch(params.q)
  if (q) query = query.or(`full_name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`)

  const { data, error, count } = await query
  if (error) return { ok: false, message: FAIL }
  return { ok: true, rows: (data ?? []) as ContactRow[], total: count ?? 0 }
}

export async function getContact(id: string): Promise<{ ok: true; row: ContactRow } | { ok: false }> {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('id, full_name, company, email, phone, subject, message, consent_given, status, created_at, updated_at')
    .eq('id', id)
    .maybeSingle()
  if (error || !data) return { ok: false }
  return { ok: true, row: data as ContactRow }
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
  return !error
}

export async function listRfqs(params: { q: string; status: string; page: number }): Promise<ListResult<RfqRow & { attachment_count: number }>> {
  let query = supabase
    .from('rfq_submissions')
    .select('id, full_name, job_title, company, country, email, phone, industry, program_name, platform, delivery_date, annual_quantity, customer_export_control, notes, part_number, part_name, material, process, tolerance, finish, part_quantity, drawings_available, consent_given, status, created_at, updated_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(params.page * PAGE_SIZE, params.page * PAGE_SIZE + PAGE_SIZE - 1)

  if (params.status && isStatus(params.status, RFQ_STATUSES)) query = query.eq('status', params.status)
  const q = sanitizeSearch(params.q)
  if (q) {
    query = query.or(`full_name.ilike.%${q}%,company.ilike.%${q}%,email.ilike.%${q}%,part_name.ilike.%${q}%,part_number.ilike.%${q}%,program_name.ilike.%${q}%`)
  }

  const { data, error, count } = await query
  if (error) return { ok: false, message: FAIL }
  const rows = (data ?? []) as RfqRow[]
  const ids = rows.map((row) => row.id)
  const counts = new Map<string, number>()
  if (ids.length) {
    const attachments = await supabase.from('rfq_attachments').select('rfq_submission_id').in('rfq_submission_id', ids)
    if (!attachments.error) {
      for (const item of attachments.data ?? []) {
        const key = item.rfq_submission_id as string
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }
  }
  return {
    ok: true,
    total: count ?? 0,
    rows: rows.map((row) => ({ ...row, attachment_count: counts.get(row.id) ?? 0 })),
  }
}

export async function getRfq(id: string): Promise<{ ok: true; row: RfqRow; attachments: AttachmentRow[] } | { ok: false }> {
  const { data, error } = await supabase.from('rfq_submissions').select('*').eq('id', id).maybeSingle()
  if (error || !data) return { ok: false }
  const attachments = await supabase
    .from('rfq_attachments')
    .select('id, rfq_submission_id, original_filename, mime_type, file_size_bytes, created_at')
    .eq('rfq_submission_id', id)
    .order('created_at', { ascending: true })
  return {
    ok: true,
    row: data as RfqRow,
    attachments: (attachments.data ?? []) as AttachmentRow[],
  }
}

export async function updateRfqStatus(id: string, status: RfqStatus) {
  const { error } = await supabase.from('rfq_submissions').update({ status }).eq('id', id)
  return !error
}

export async function requestAttachmentDownload(rfqId: string, attachmentId: string): Promise<{ ok: true; url: string; filename: string } | { ok: false; message: string }> {
  const { data, error } = await supabase.functions.invoke('admin-download-attachment', {
    body: { rfqId, attachmentId },
  })
  if (error) {
    if (error instanceof FunctionsHttpError && error.context.status === 429) {
      return { ok: false, message: 'Too many download requests. Please wait and try again.' }
    }
    if (error instanceof FunctionsHttpError && error.context.status === 404) {
      return { ok: false, message: 'That file was not found for this RFQ.' }
    }
    return { ok: false, message: 'Could not prepare a download.' }
  }
  if (data && typeof data === 'object' && typeof (data as { url?: unknown }).url === 'string') {
    const filename = typeof (data as { filename?: unknown }).filename === 'string'
      ? (data as { filename: string }).filename
      : 'download'
    return { ok: true, url: (data as { url: string }).url, filename }
  }
  return { ok: false, message: 'Could not prepare a download.' }
}
