import { Suspense } from 'react'
import AuthCard from '@/components/auth/AuthCard'
import ResetPasswordClient from './reset-password-client'

function ResetPasswordFallback() {
  return (
    <AuthCard title="Set a new password" subtitle="Loading your reset link...">
      <div className="text-center py-2">
        <div className="w-12 h-12 border-4 border-subtle border-t-violet rounded-full animate-spin mx-auto mb-4" />
      </div>
    </AuthCard>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordClient />
    </Suspense>
  )
}
