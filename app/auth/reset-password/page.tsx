'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthCard from '@/components/auth/AuthCard'
import FormField from '@/components/auth/FormField'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter'
import { confirmPasswordReset } from '@/lib/auth'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const token        = searchParams.get('token') ?? ''

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  if (!token) {
    return (
      <AuthCard title="Invalid link">
        <p className="text-sm text-muted mb-6">This password reset link is invalid or has expired.</p>
        <Link href="/auth/forgot-password" className="block w-full text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-all text-sm" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}>
          Request a new link
        </Link>
      </AuthCard>
    )
  }

  if (done) {
    return (
      <AuthCard title="Password updated">
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-purple-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <p className="text-sm text-muted mb-6">Your password has been updated. All other sessions have been signed out.</p>
          <Link href="/auth/sign-in" className="block w-full text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-all text-sm" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}>
            Sign in with new password
          </Link>
        </div>
      </AuthCard>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    try {
      await confirmPasswordReset(token, password)
      setDone(true)
    } catch (err: any) {
      setError(err.message ?? 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-ink/70 uppercase tracking-wide">New password</label>
          <input
            type="password" placeholder="Min. 8 characters"
            value={password} onChange={e => setPassword(e.target.value)}
            required autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-subtle bg-bg text-sm text-ink placeholder:text-muted/60 outline-none focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/10 transition-all"
          />
          <PasswordStrengthMeter password={password} />
        </div>
        <FormField
          label="Confirm new password"
          type="password"
          placeholder="Re-enter password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <button
          type="submit" disabled={loading}
          className="w-full text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </AuthCard>
  )
}
