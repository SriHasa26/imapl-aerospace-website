import { useEffect, useState } from 'react'
import { CONTACT_STATUSES, getContact, updateContactStatus, type ContactRow, type ContactStatus } from './api'
import { adminHref } from './routes'
import { AdminField, AdminLink, StatusBadge, display, fieldClass, formatWhen, labelClass } from './ui'

export default function AdminContactDetail({ id }: { id: string }) {
  const [row, setRow] = useState<ContactRow | null>(null)
  const [missing, setMissing] = useState(false)
  const [status, setStatus] = useState<ContactStatus>('NEW')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setMissing(false)
    setRow(null)
    void getContact(id).then((result) => {
      if (cancelled) return
      if (!result.ok) {
        setMissing(true)
        return
      }
      setRow(result.row)
      setStatus(result.row.status)
    })
    return () => {
      cancelled = true
    }
  }, [id])

  if (missing) {
    return (
      <div>
        <p className="text-steel text-sm mb-4 bg-card border border-border-dark px-5 py-8">This contact record was not found.</p>
        <AdminLink href={adminHref('contact')} className="text-cyan text-sm">Back to contact list</AdminLink>
      </div>
    )
  }

  if (!row) return <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">Loading…</p>

  const save = async () => {
    if (saving) return
    setSaving(true)
    setMessage('')
    const ok = await updateContactStatus(row.id, status)
    setSaving(false)
    if (!ok) {
      setMessage('Could not update status.')
      return
    }
    setRow({ ...row, status, updated_at: new Date().toISOString() })
    setMessage('Status updated.')
  }

  return (
    <div>
      <AdminLink href={adminHref('contact')} className="font-mono text-xs text-cyan uppercase tracking-widest">
        Back to contact
      </AdminLink>
      <div className="flex flex-wrap items-center gap-3 mt-4 mb-8">
        <h1 className="font-display font-bold text-white text-4xl uppercase">{display(row.full_name)}</h1>
        <StatusBadge value={row.status} />
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AdminField label="Full name">{display(row.full_name)}</AdminField>
        <AdminField label="Company">{display(row.company)}</AdminField>
        <AdminField label="Email">{display(row.email)}</AdminField>
        <AdminField label="Phone">{display(row.phone)}</AdminField>
        <AdminField label="Subject">{display(row.subject)}</AdminField>
        <AdminField label="Consent">{row.consent_given ? 'Given' : 'Not recorded'}</AdminField>
        <AdminField label="Created">{formatWhen(row.created_at)}</AdminField>
        <AdminField label="Updated">{formatWhen(row.updated_at)}</AdminField>
      </div>
      <AdminField label="Message">{display(row.message)}</AdminField>
      <div className="mt-10 max-w-sm im-card p-6">
        <label htmlFor="contact-status-update" className={labelClass}>Status</label>
        <select
          id="contact-status-update"
          className={fieldClass}
          value={status}
          onChange={(event) => setStatus(event.target.value as ContactStatus)}
        >
          {CONTACT_STATUSES.map((value) => (
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
