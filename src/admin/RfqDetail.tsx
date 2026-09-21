import { useEffect, useState, type ReactNode } from 'react'
import { formatFileSize } from '../form'
import {
  RFQ_STATUSES,
  getRfq,
  requestAttachmentDownload,
  updateRfqStatus,
  type AttachmentRow,
  type RfqRow,
  type RfqStatus,
} from './api'
import { adminHref } from './routes'
import { AdminField, AdminLink, StatusBadge, display, fieldClass, formatWhen, labelClass } from './ui'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-mono text-xs text-cyan uppercase tracking-[0.2em] mb-4">{title}</h2>
      <div className="grid md:grid-cols-2 gap-4">{children}</div>
    </section>
  )
}

export default function AdminRfqDetail({ id }: { id: string }) {
  const [row, setRow] = useState<RfqRow | null>(null)
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])
  const [missing, setMissing] = useState(false)
  const [status, setStatus] = useState<RfqStatus>('NEW')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setMissing(false)
    setRow(null)
    void getRfq(id).then((result) => {
      if (cancelled) return
      if (!result.ok) {
        setMissing(true)
        return
      }
      setRow(result.row)
      setStatus(result.row.status)
      setAttachments(result.attachments)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (missing) {
    return (
      <div>
        <p className="text-steel text-sm mb-4 bg-card border border-border-dark px-5 py-8">This RFQ record was not found.</p>
        <AdminLink href={adminHref('rfq')} className="text-cyan text-sm">Back to RFQ list</AdminLink>
      </div>
    )
  }

  if (!row) return <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">Loading…</p>

  const save = async () => {
    if (saving) return
    setSaving(true)
    setMessage('')
    const ok = await updateRfqStatus(row.id, status)
    setSaving(false)
    if (!ok) {
      setMessage('Could not update status.')
      return
    }
    setRow({ ...row, status, updated_at: new Date().toISOString() })
    setMessage('Status updated.')
  }

  const download = async (attachment: AttachmentRow) => {
    setDownloadError('')
    setDownloadingId(attachment.id)
    const result = await requestAttachmentDownload(row.id, attachment.id)
    setDownloadingId(null)
    if (!result.ok) {
      setDownloadError(result.message)
      return
    }
    window.open(result.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <AdminLink href={adminHref('rfq')} className="font-mono text-xs text-cyan uppercase tracking-widest">
        Back to RFQ
      </AdminLink>
      <div className="flex flex-wrap items-center gap-3 mt-4 mb-2">
        <h1 className="font-display font-bold text-white text-4xl uppercase">{display(row.company)}</h1>
        <StatusBadge value={row.status} />
      </div>
      <p className="font-mono text-[11px] text-steel mb-8 break-all">{row.id}</p>

      <Group title="Contact">
        <AdminField label="Full name">{display(row.full_name)}</AdminField>
        <AdminField label="Job title">{display(row.job_title)}</AdminField>
        <AdminField label="Company">{display(row.company)}</AdminField>
        <AdminField label="Country">{display(row.country)}</AdminField>
        <AdminField label="Email">{display(row.email)}</AdminField>
        <AdminField label="Phone">{display(row.phone)}</AdminField>
      </Group>

      <Group title="Program">
        <AdminField label="Industry">{display(row.industry)}</AdminField>
        <AdminField label="Program name">{display(row.program_name)}</AdminField>
        <AdminField label="Platform">{display(row.platform)}</AdminField>
        <AdminField label="Delivery date">{display(row.delivery_date)}</AdminField>
        <AdminField label="Annual quantity">{display(row.annual_quantity)}</AdminField>
        <AdminField label="Visitor export-control selection">{display(row.customer_export_control)}</AdminField>
        <div className="md:col-span-2">
          <AdminField label="Notes">{display(row.notes)}</AdminField>
        </div>
      </Group>

      <Group title="Part">
        <AdminField label="Part number">{display(row.part_number)}</AdminField>
        <AdminField label="Part name">{display(row.part_name)}</AdminField>
        <AdminField label="Material">{display(row.material)}</AdminField>
        <AdminField label="Process">{display(row.process)}</AdminField>
        <AdminField label="Tolerance">{display(row.tolerance)}</AdminField>
        <AdminField label="Finish">{display(row.finish)}</AdminField>
        <AdminField label="Part quantity">{display(row.part_quantity)}</AdminField>
        <AdminField label="Drawings available">{row.drawings_available ? 'Yes' : 'No'}</AdminField>
      </Group>

      <Group title="Workflow">
        <AdminField label="Status">{row.status.replace('_', ' ')}</AdminField>
        <AdminField label="Created">{formatWhen(row.created_at)}</AdminField>
        <AdminField label="Updated">{formatWhen(row.updated_at)}</AdminField>
      </Group>

      <section className="mb-10">
        <h2 className="font-mono text-xs text-cyan uppercase tracking-[0.2em] mb-4">Attachments</h2>
        {attachments.length === 0 ? (
          <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">No files on this RFQ.</p>
        ) : (
          <ul className="im-card divide-y divide-border-dark overflow-hidden">
            {attachments.map((file) => (
              <li key={file.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm break-all">{file.original_filename}</p>
                  <p className="font-mono text-xs text-steel mt-1">
                    {file.file_size_bytes == null ? 'Size unknown' : formatFileSize(file.file_size_bytes)}
                    {file.mime_type ? ` · ${file.mime_type}` : ''}
                    {` · ${formatWhen(file.created_at)}`}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={downloadingId === file.id}
                  onClick={() => { void download(file) }}
                  className="border border-border-dark bg-navy-mid text-cyan hover:text-white font-mono text-xs uppercase tracking-widest px-4 min-h-10 shrink-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-cyan"
                >
                  {downloadingId === file.id ? 'Preparing…' : 'Download'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {downloadError && <p className="mt-3 text-sm text-red-400" role="alert">{downloadError}</p>}
        <p className="mt-3 text-steel text-xs">Downloads use a short-lived signed URL. Files are not stored as public links.</p>
      </section>

      <div className="max-w-sm im-card p-6">
        <label htmlFor="rfq-status-update" className={labelClass}>Status</label>
        <select
          id="rfq-status-update"
          className={fieldClass}
          value={status}
          onChange={(event) => setStatus(event.target.value as RfqStatus)}
        >
          {RFQ_STATUSES.map((value) => (
            <option key={value} value={value}>{value.replace('_', ' ')}</option>
          ))}
        </select>
        <button
          type="button"
          disabled={saving || status === row.status}
          onClick={() => { void save() }}
          className="mt-4 bg-blue hover:bg-blue-light disabled:opacity-60 text-white font-medium text-sm min-h-12 px-6"
        >
          {saving ? 'Saving…' : 'Update status'}
        </button>
        {message && <p className="mt-3 text-sm text-steel" role="status">{message}</p>}
      </div>
    </div>
  )
}
