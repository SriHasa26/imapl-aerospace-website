import { useState, type FormEvent } from 'react'
import { images } from '../content/assets'
import { errorClass, fieldClass, labelClass } from '../form'
import { adminHref, goAdmin } from './routes'
import { useAdminSession } from './session'

export default function AdminLogin() {
  const { signIn } = useAdminSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const result = await signIn(email, password)
      if (result.ok) {
        goAdmin(adminHref('dashboard'), true)
        return
      }
      if (result.code === 'unauthorized') {
        setError('This account is not authorized for administration.')
      } else if (result.code === 'network') {
        setError('Could not reach the sign-in service. Try again.')
      } else {
        setError('Sign in failed. Check your details and try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-navy flex items-center justify-center px-6 py-16">
      <div id="main-content" className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src={images.brandLogo} alt={images.brandLogoAlt} className="h-10 w-auto" />
        </div>
        <p className="font-mono text-xs text-cyan uppercase tracking-[0.2em] text-center mb-3">Internal</p>
        <h1 className="font-display font-bold text-white text-4xl uppercase text-center mb-2">Sign in</h1>
        <p className="text-steel text-sm text-center mb-8">Administration for company staff. Not a public account area.</p>
        <form noValidate onSubmit={handleSubmit} className="space-y-5 im-card p-6 sm:p-8">
          <div>
            <label htmlFor="admin-email" className={labelClass}>Email</label>
            <input
              id="admin-email"
              className={fieldClass}
              type="email"
              autoComplete="username"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className={labelClass}>Password</label>
            <input
              id="admin-password"
              className={fieldClass}
              type="password"
              autoComplete="current-password"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'admin-login-error' : undefined}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error && <p id="admin-login-error" className={errorClass} role="alert">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className="w-full bg-blue hover:bg-blue-light disabled:opacity-60 text-white font-medium text-sm min-h-12 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-cyan"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center mt-6">
          <a href="/" className="text-steel hover:text-cyan text-sm focus-visible:outline-none focus-visible:text-cyan">Return to website</a>
        </p>
      </div>
    </div>
  )
}
