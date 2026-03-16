import Link from 'next/link'

interface Props {
  title: string
  subtitle?: string
  children: React.ReactNode
  backHref?: string
  backLabel?: string
}

export default function AuthCard({ title, subtitle, children, backHref, backLabel }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-subtle shadow-card p-8 animate-fadeUp">
      {backHref && (
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          {backLabel ?? 'Back'}
        </Link>
      )}
      <h1 className="text-2xl font-black text-ink tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted mt-1.5 mb-7 leading-relaxed">{subtitle}</p>}
      {!subtitle && <div className="mb-6" />}
      {children}
    </div>
  )
}
