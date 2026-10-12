import { useEffect } from 'react'
import AdminContactDetail from './ContactDetail'
import AdminContactList from './ContactList'
import AdminDashboard from './Dashboard'
import AdminLogin from './Login'
import AdminRfqDetail from './RfqDetail'
import AdminRfqList from './RfqList'
import { adminHref, goAdmin, type AdminRoute } from './routes'
import { useAdminSession } from './session'
import { AdminShell } from './ui'

export default function AdminRoot({ route }: { route: AdminRoute }) {
  const { ready, session, isAdmin, signOut } = useAdminSession()

  useEffect(() => {
    if (!ready) return
    if (route.section === 'login' && session && isAdmin) {
      goAdmin(adminHref('dashboard'), true)
      return
    }
    if (route.section !== 'login' && !session) {
      goAdmin(adminHref('login'), true)
    }
  }, [ready, route.section, session, isAdmin])

  useEffect(() => {
    if (ready && session && !isAdmin) {
      void signOut()
    }
  }, [ready, session, isAdmin, signOut])

  if (!ready) {
    return (
      <div className="min-h-dvh bg-navy flex items-center justify-center">
        <p className="text-steel text-sm">Loading…</p>
      </div>
    )
  }

  if (route.section === 'login') {
    if (session && isAdmin) {
      return (
        <div className="min-h-dvh bg-navy flex items-center justify-center">
          <p className="text-steel text-sm">Loading…</p>
        </div>
      )
    }
    return <AdminLogin />
  }

  if (!session) {
    return <AdminLogin />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-dvh bg-navy flex items-center justify-center px-6">
        <p className="text-steel text-sm text-center">This account is not authorized for administration.</p>
      </div>
    )
  }

  let page = <AdminDashboard />
  if (route.section === 'contact' && route.id) page = <AdminContactDetail id={route.id} />
  else if (route.section === 'contact') page = <AdminContactList />
  else if (route.section === 'rfq' && route.id) page = <AdminRfqDetail id={route.id} />
  else if (route.section === 'rfq') page = <AdminRfqList />

  return <AdminShell route={route}>{page}</AdminShell>
}
