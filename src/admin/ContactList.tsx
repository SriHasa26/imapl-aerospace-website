import { useEffect, useState, type FormEvent } from 'react'
import { CONTACT_STATUSES, PAGE_SIZE, listContacts, type ContactRow } from './api'
import { adminHref } from './routes'
import { AdminLink, AdminPager, StatusBadge, display, fieldClass, formatWhen, labelClass } from './ui'

export default function AdminContactList() {
  const [qInput, setQInput] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<ContactRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void listContacts({ q, status, page }).then((result) => {
      if (cancelled) return
      setLoading(false)
      if (!result.ok) {
        setError(result.message)
        setRows([])
        setTotal(0)
        return
      }
      setError('')
      setRows(result.rows)
      setTotal(result.total)
    })
    return () => {
      cancelled = true
    }
  }, [q, status, page])

  const applySearch = (event: FormEvent) => {
    event.preventDefault()
    setPage(0)
    setQ(qInput)
  }

  return (
    <div>
      <p className="font-mono text-xs text-cyan uppercase tracking-[0.2em] mb-3">Submissions</p>
      <h1 className="font-display font-bold text-white text-4xl uppercase mb-6">Contact</h1>
      <form onSubmit={applySearch} className="im-card p-5 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="contact-search" className={labelClass}>Search name, company, email, subject</label>
          <input
            id="contact-search"
            className={fieldClass}
            value={qInput}
            onChange={(event) => setQInput(event.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <label htmlFor="contact-status" className={labelClass}>Status</label>
          <select
            id="contact-status"
            className={fieldClass}
            value={status}
            onChange={(event) => {
              setPage(0)
              setStatus(event.target.value)
            }}
          >
            <option value="">All</option>
            {CONTACT_STATUSES.map((value) => (
              <option key={value} value={value}>{value.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="sm:self-end">
          <button type="submit" className="bg-blue hover:bg-blue-light text-white font-medium text-sm min-h-12 px-6">
            Search
          </button>
        </div>
      </form>
      {error && <p className="text-red-400 text-sm mb-4 bg-card border border-red-400/30 px-4 py-3" role="alert">{error}</p>}
      {loading ? (
        <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">No contact submissions match these filters.</p>
      ) : (
        <>
          <p className="font-mono text-xs text-steel uppercase tracking-widest mb-3">{total} record{total === 1 ? '' : 's'}</p>
          <div className="im-card overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[720px]">
              <caption className="sr-only">Contact submissions</caption>
              <thead className="bg-navy-mid font-mono text-xs uppercase tracking-widest text-steel">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-card-hover">
                    <td className="px-4 py-3">
                      <AdminLink href={adminHref('contact', row.id)} className="text-cyan hover:text-white">
                        {display(row.full_name)}
                      </AdminLink>
                    </td>
                    <td className="px-4 py-3 text-steel">{display(row.company)}</td>
                    <td className="px-4 py-3 text-steel break-all">{display(row.email)}</td>
                    <td className="px-4 py-3 text-steel">{display(row.subject)}</td>
                    <td className="px-4 py-3 text-steel">{display(row.phone)}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.status} /></td>
                    <td className="px-4 py-3 text-steel whitespace-nowrap">{formatWhen(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminPager page={page} total={total} pageSize={PAGE_SIZE} onPage={setPage} />
        </>
      )}
    </div>
  )
}
