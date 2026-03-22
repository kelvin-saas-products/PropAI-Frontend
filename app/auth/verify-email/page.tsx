'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthCard from '@/components/auth/AuthCard'
import { verifyEmail } from '@/lib/auth'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('No verification token found.'); return }
    verifyEmail(token)
      .then(res => { setStatus('success'); setMessage(res.message) })
      .catch(err => { setStatus('error'); setMessage(err.message ?? 'Verification failed.') })
  }, [token])

  return (
    <AuthCard title={
      status === 'loading' ? 'Verifying your email…' :
      status === 'success' ? 'Email verified!' :
      'Verification failed'
    }>
      <div className="text-center py-2">
        {status === 'loading' && (
          <div className="w-12 h-12 border-4 border-subtle border-t-violet rounded-full animate-spin mx-auto mb-4"/>
        )}
        {status === 'success' && (
          <div className="w-14 h-14 bg-purple-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
            </svg>
          </div>
        )}
        {status === 'error' && (
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
        )}

        <p className="text-sm text-muted mb-6">{message}</p>

        {status === 'success' && (
          <Link href="/auth/sign-in" className="block w-full text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-all text-sm" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}>
            Sign in to your account →
          </Link>
        )}
        {status === 'error' && (
          <Link href="/auth/resend-verification" className="block w-full text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-all text-sm" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}>
            Resend verification email
          </Link>
        )}
      </div>
    </AuthCard>
  )
}
