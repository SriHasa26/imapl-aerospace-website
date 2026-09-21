import AdminRoot from './AdminRoot'
import AdminSessionProvider from './session'
import type { AdminRoute } from './routes'

export default function AdminBranch({ route }: { route: AdminRoute }) {
  return (
    <AdminSessionProvider>
      <AdminRoot route={route} />
    </AdminSessionProvider>
  )
}
