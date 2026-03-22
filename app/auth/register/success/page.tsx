import Link from 'next/link'
import AuthCard from '@/components/auth/AuthCard'

const NEXT_STEPS = {
  buyer: [
    'Check your inbox and click the verification link',
    'Browse and save your favourite properties',
    'Set up property alerts for new listings',
    'Add your own home to track its estimated value',
  ],
  owner: [
    'Check your inbox and click the verification link',
    'Add your property to start tracking its value',
    'View your estimated equity and growth over time',
    'Advertise your property when you\'re ready to sell',
  ],
  investor: [
    'Check your inbox and click the verification link',
    'Add properties to your portfolio tracker',
    'Monitor rental yields and capital growth',
    'Set up alerts for investment opportunities',
  ],
  agent: [
    'Check your inbox and click the verification link',
    'Your ABN and licence will be verified within 2 business hours',
    'Complete your public agent profile',
    'Upload your first property listing once verified',
  ],
}

export default function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: { role?: string }
}) {
  const role = (searchParams.role ?? 'buyer') as keyof typeof NEXT_STEPS
  const steps = NEXT_STEPS[role] ?? NEXT_STEPS.buyer
  const isAgent = role === 'agent'

  return (
    <AuthCard title="">
      <div className="text-center py-2">
        {/* Icon */}
        <div className="w-16 h-16 bg-purple-light rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black text-ink mb-2">
          {isAgent ? 'Trial activated!' : "You're in!"}
        </h1>
        <p className="text-sm text-muted leading-relaxed max-w-sm mx-auto mb-8">
          {isAgent
            ? 'Your 14-day free trial has started. We\'ll verify your licence and ABN within 2 business hours and notify you by email.'
            : 'Your PropAI account is ready. We\'ve sent a verification email — check your inbox to activate your account.'}
        </p>

        {/* What's next */}
        <div className="bg-bg rounded-2xl p-5 text-left mb-6">
          <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-4">What's next</p>
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-muted">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/auth/sign-in"
          className="block w-full text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all text-sm" style={{background:'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)'}}
        >
          Go to sign in →
        </Link>

        <p className="text-xs text-muted mt-4">
          Didn't receive an email?{' '}
          <Link href="/auth/resend-verification" className="text-violet hover:underline font-medium">
            Resend verification
          </Link>
        </p>
      </div>
    </AuthCard>
  )
}
