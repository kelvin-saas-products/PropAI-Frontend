import Link from 'next/link'

const STATS = [
  { value: '2.4M+', label: 'Properties listed' },
  { value: '98%',   label: 'AI match accuracy' },
  { value: '180K+', label: 'Happy home seekers' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[42%] bg-ink flex-col justify-between p-12 relative overflow-hidden">
        {/* Background grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }}
        />
        {/* Green accent blob */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green rounded-full opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-green rounded-full opacity-5 blur-3xl" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 w-fit">
          <img src="/logo-dark.svg" alt="Prop.AI" style={{height:'32px',width:'auto'}}/>
        </Link>

        {/* Headline */}
        <div className="relative space-y-6">
          <h1 className="text-white text-4xl font-black leading-tight tracking-tight">
            Find your next home<br />
            <span className="gradient-text">powered by AI.</span>
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-sm">
            PropAI analyses thousands of data points to match you with properties that fit your lifestyle, budget, and long-term goals.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="gradient-text text-2xl font-black">{s.value}</p>
                <p className="text-white/40 text-xs mt-1 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-2">
            <p className="text-white/70 text-sm leading-relaxed italic">
              "PropAI's AI Insight spotted details about our property that the agent didn't even mention. We made an offer the same day."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-green text-xs font-bold">SK</div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah K.</p>
                <p className="text-white/30 text-xs">Bought in Mosman, NSW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative text-white/20 text-xs">
          © {new Date().getFullYear()} PropAI. All rights reserved.
        </p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col min-h-screen bg-bg overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 p-5 border-b border-subtle bg-white">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center text-white font-black text-sm">P</span>
            <span className="font-bold text-ink text-lg">PropAI</span>
          </Link>
        </div>

        <div className="flex-1 flex items-start justify-center py-10 px-5">
          <div className="w-full max-w-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
