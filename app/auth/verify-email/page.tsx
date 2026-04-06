import { Suspense } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import VerifyEmailClient from './verify-email-client'

function VerifyEmailFallback() {
  return (
    <AuthCard title="Verifying your email...">
      <div className="text-center py-2">
        <div className="w-12 h-12 border-4 border-subtle border-t-violet rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted mb-6">Checking your verification link...</p>
      </div>
    </AuthCard>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClient />
    </Suspense>
  )
}
