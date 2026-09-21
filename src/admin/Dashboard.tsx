import { useEffect, useState } from 'react'
import { loadDashboard, type RecentContact, type RecentRfq } from './api'
import { adminHref } from './routes'
import { AdminLink, StatusBadge, display, formatWhen } from './ui'

export default function AdminDashboard() {
  const [error, setError] = useState(false)
  const [data, setData] = useState<{
    newContacts: number
    openRfqs: number
    rfqsReviewing: number
    recentContacts: RecentContact[]
    recentRfqs: RecentRfq[]
  } | null>(null)

  useEffect(() => {
    let cancelled = false
    void loadDashboard().then((result) => {
      if (cancelled) return
      if (!result.ok) {
        setError(true)
        setData(null)
        return
      }
      setError(false)
      setData(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return (
      <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8" role="alert">
        Could not load dashboard figures.
      </p>
    )
  }

  if (!data) {
    return (
      <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">Loading…</p>
    )
  }

  return (
    <div>
      <p className="font-mono text-xs text-cyan uppercase tracking-[0.2em] mb-3">Operations</p>
      <h1 className="font-display font-bold text-white text-4xl uppercase mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        <Stat label="New contact enquiries" value={data.newContacts} href={adminHref('contact')} />
        <Stat label="Open RFQs" value={data.openRfqs} href={adminHref('rfq')} />
        <Stat label="RFQs requiring review" value={data.rfqsReviewing} href={adminHref('rfq')} />
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <section>
          <h2 className="font-display font-bold text-white text-2xl uppercase mb-4">Recent contact</h2>
          {data.recentContacts.length === 0 ? (
            <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">No contact submissions.</p>
          ) : (
            <ul className="im-card divide-y divide-border-dark overflow-hidden">
              {data.recentContacts.map((row) => (
                <li key={row.id}>
                  <AdminLink href={adminHref('contact', row.id)} className="block p-4 hover:bg-card-hover">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-white text-sm">{display(row.full_name)}</span>
                      <StatusBadge value={row.status} />
                    </div>
                    <p className="text-steel text-sm">{display(row.company)} · {display(row.subject)}</p>
                    <p className="font-mono text-xs text-steel mt-1">{formatWhen(row.created_at)}</p>
                  </AdminLink>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="font-display font-bold text-white text-2xl uppercase mb-4">Recent RFQ</h2>
          {data.recentRfqs.length === 0 ? (
            <p className="text-steel text-sm bg-card border border-border-dark px-5 py-8">No RFQ submissions.</p>
          ) : (
            <ul className="im-card divide-y divide-border-dark overflow-hidden">
              {data.recentRfqs.map((row) => (
                <li key={row.id}>
                  <AdminLink href={adminHref('rfq', row.id)} className="block p-4 hover:bg-card-hover">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-white text-sm">{display(row.company)}</span>
                      <StatusBadge value={row.status} />
                    </div>
                    <p className="text-steel text-sm">{display(row.full_name)} · {display(row.part_name)}</p>
                    <p className="font-mono text-xs text-steel mt-1">{formatWhen(row.created_at)}</p>
                  </AdminLink>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <AdminLink href={href} className="im-card im-card-hover p-5 block">
      <div className="font-mono text-xs text-steel uppercase tracking-widest mb-2">{label}</div>
      <div className="font-display font-bold text-white text-4xl">{value}</div>
    </AdminLink>
  )
}
