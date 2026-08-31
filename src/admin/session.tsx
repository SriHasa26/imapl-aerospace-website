import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type SignInResult =
  | { ok: true }
  | { ok: false; code: 'invalid' | 'unauthorized' | 'network' }

type AdminSessionValue = {
  ready: boolean
  session: Session | null
  isAdmin: boolean
  email: string | null
  signIn: (email: string, password: string) => Promise<SignInResult>
  signOut: () => Promise<void>
}

const AdminSessionContext = createContext<AdminSessionValue | null>(null)

async function membershipIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.from('admin_users').select('role').maybeSingle()
  if (error || !data) return false
  return data.role === 'ADMIN'
}

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false

    const apply = async (next: Session | null) => {
      if (cancelled) return
      setSession(next)
      if (!next) {
        setIsAdmin(false)
        setReady(true)
        return
      }
      const admin = await membershipIsAdmin()
      if (cancelled) return
      setIsAdmin(admin)
      setReady(true)
    }

    supabase.auth.getSession().then(({ data }) => {
      void apply(data.session)
    }).catch(() => {
      if (!cancelled) {
        setSession(null)
        setIsAdmin(false)
        setReady(true)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setReady(false)
      void apply(next)
    })

    return () => {
      cancelled = true
      listener.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AdminSessionValue>(() => ({
    ready,
    session,
    isAdmin,
    email: session?.user.email ?? null,
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error || !data.user) return { ok: false, code: 'invalid' }
        const admin = await membershipIsAdmin()
        if (!admin) {
          await supabase.auth.signOut()
          return { ok: false, code: 'unauthorized' }
        }
        return { ok: true }
      } catch {
        return { ok: false, code: 'network' }
      }
    },
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }), [ready, session, isAdmin])

  return createElement(AdminSessionContext.Provider, { value }, children)
}

export function useAdminSession() {
  const value = useContext(AdminSessionContext)
  if (!value) throw new Error('useAdminSession requires AdminSessionProvider')
  return value
}

export default AdminSessionProvider
