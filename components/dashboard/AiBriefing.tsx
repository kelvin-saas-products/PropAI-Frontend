'use client'
import { useAuth } from '@/context/AuthContext'

const CHIPS = [
  'View 3 new matches',
  'McKinnon market report',
  'Prepare for inspection',
  'Compare with Bentleigh East',
]

export default function AiBriefing() {
  const { user } = useAuth()
  const name    = user?.first_name ?? 'there'
  const suburbs = user?.buyer_preferences?.preferred_suburbs?.slice(0, 2) ?? ['McKinnon', 'Bentleigh East']

  return (
    <div className="bg-ink rounded-2xl p-6 mb-6 relative overflow-hidden">
      {/* Subtle green glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-green rounded-full opacity-10 blur-3xl pointer-events-none"/>

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-green text-sm">✦</span>
          <span className="text-xs font-bold uppercase tracking-widest text-green/80">
            PropAI Morning Briefing
          </span>
          <span className="ml-auto text-xs text-white/30">
            {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'short' })}
          </span>
        </div>

        <p className="text-sm text-white/70 leading-relaxed max-w-2xl">
          Good morning, <span className="text-white font-semibold">{name}</span>. Based on your saved searches in{' '}
          <span className="text-white font-semibold">{suburbs[0] ?? 'your suburbs'}</span>
          {suburbs[1] ? <>, <span className="text-white font-semibold">{suburbs[1]}</span></> : null},{' '}
          <span className="text-white font-semibold">3 new properties</span> were listed this morning matching your criteria.
          The median in {suburbs[0] ?? 'your area'} dropped{' '}
          <span className="text-teal font-semibold">2.1%</span> this week — potentially a good buying window.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {CHIPS.map(chip => (
            <button
              key={chip}
              className="bg-white/10 hover:opacity-90 hover:text-white text-white/80 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10 hover:border-green transition-all duration-150"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
