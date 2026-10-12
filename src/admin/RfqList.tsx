import { useEffect, useState, type FormEvent } from 'react'
import { PAGE_SIZE, RFQ_STATUSES, listRfqs, type RfqRow } from './api'
import { adminHref } from './routes'
import { AdminLink, AdminPager, StatusBadge, display, fieldClass, formatWhen, labelClass } from './ui'

type ListRow = RfqRow & { attachment_count: number }

export default function AdminRfqList() {
  const [qInput, setQInput] = useState('')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [error, setError] = useState('')
  const [rows, setRows] = useState<ListRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    void listRfqs({ q, status, page }).then((result) => {
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
      <h1 className="font-display font-bold text-white text-4xl uppercase mb-6">RFQ</h1>
      <form onSubmit={applySearch} className="im-card p-5 flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="rfq-search" className={labelClass}>Search company, contact, part, program</label>
          <input
            id="rfq-search"
            className={fieldClass}
            value={qInput}
            onChange={(event) => setQInput(event.target.value)}
          />
        </div>
        <div className="sm:w-56">
          <label htmlFor="rfq-status" className={labelClass}>Status</label>
          <select
            id="rfq-status"
            className={fieldClass}
            value={status}
            onChange={(event) => {
              setPage(0)
              setStatus(event.target.value)
            }}
          >
            <option value="">All</option>
            {RFQ_STATUSES.map((value) => (
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
        <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">No RFQ submissions match these filters.</p>
      ) : (
        <>
          <p className="font-mono text-xs text-steel uppercase tracking-widest mb-3">{total} record{total === 1 ? '' : 's'}</p>
          <div className="im-card overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[960px]">
              <caption className="sr-only">RFQ submissions</caption>
              <thead className="bg-navy-mid font-mono text-xs uppercase tracking-widest text-steel">
                <tr>
                  <th className="px-4 py-3 font-medium">RFQ ID</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Part</th>
                  <th className="px-4 py-3 font-medium">Process</th>
                  <th className="px-4 py-3 font-medium">Qty</th>
                  <th className="px-4 py-3 font-medium">Files</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-card-hover">
                    <td className="px-4 py-3 font-mono text-[11px]">
                      <AdminLink href={adminHref('rfq', row.id)} className="text-cyan hover:text-white">
                        {row.id.slice(0, 8)}
                      </AdminLink>
                    </td>
                    <td className="px-4 py-3 text-steel">{display(row.company)}</td>
                    <td className="px-4 py-3 text-steel">{display(row.full_name)}</td>
                    <td className="px-4 py-3 text-steel">{display(row.industry)}</td>
                    <td className="px-4 py-3 text-steel">
                      {display(row.part_number)} · {display(row.part_name)}
                    </td>
                    <td className="px-4 py-3 text-steel">{display(row.process)}</td>
                    <td className="px-4 py-3 text-steel">{display(row.part_quantity)}</td>
                    <td className="px-4 py-3 text-steel">{row.attachment_count}</td>
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
