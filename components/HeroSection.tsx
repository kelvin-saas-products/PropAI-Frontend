'use client'
import { useState } from 'react'

const HINTS = [
  'Family of 4, budget $1.2M, near good schools',
  'Expat relocating to Bangkok, near BTS, pet friendly',
  'Investment property, high rental yield, inner city',
  'Near international schools, quiet streets, garden',
  'First home buyer, under $700K, good transport links',
  'Retiring couple, low maintenance, coastal area',
]

export default function HeroSection() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-5 overflow-hidden">
      {/* Gradient background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0FAF6]/40 via-white to-[#F0EEFF]/40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #20D3B3 0%, #3B82F6 50%, #8B5CF6 100%)' }}/>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#0F172A 1px,transparent 1px),linear-gradient(90deg,#0F172A 1px,transparent 1px)', backgroundSize: '48px 48px' }}/>
      </div>

      <div className="relative w-full max-w-3xl mx-auto text-center animate-fadeUp">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 border border-subtle bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-semibold text-ink2 mb-8 shadow-card">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          AI-Powered Property Search
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-5">
          Find your next home<br />
          <span className="gradient-text">powered by AI.</span>
        </h1>

        <p className="text-lg text-ink2 leading-relaxed mb-10 max-w-xl mx-auto">
          Describe your life — family, schools, lifestyle, budget. PropAI understands what matters to you and finds properties that truly fit.
        </p>

        {/* AI Search bar */}
        <div className="relative mb-5">
          <div className={`flex items-center gap-3 bg-white rounded-2xl px-5 py-2 shadow-float border-2 transition-all duration-200 ${
            focused ? 'border-blue/40 shadow-glow' : 'border-subtle'
          }`}>
            <span className="text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>✦</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder='e.g. "Family relocating to Bangkok, near international schools, budget ฿25M"'
              className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-ink2/40 py-3.5"
            />
            <button
              className="flex-shrink-0 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all hover:opacity-90 hover:shadow-glow whitespace-nowrap flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
            >
              ✦ Search
            </button>
          </div>

          {/* Suggestion dropdown */}
          {focused && !query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-subtle shadow-float z-50 overflow-hidden animate-fadeIn">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted px-4 pt-3 pb-1.5">Try asking PropAI…</p>
              {HINTS.map(h => (
                <button key={h} onMouseDown={() => setQuery(h)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-ink2 hover:text-ink hover:bg-surface transition-colors border-b border-subtle last:border-0">
                  <span className="text-teal text-xs flex-shrink-0">✦</span>
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hint pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {HINTS.slice(0, 4).map(h => (
            <button key={h} onClick={() => setQuery(h)}
              className="bg-white border border-subtle rounded-full px-3.5 py-1.5 text-xs text-ink2 hover:border-blue/40 hover:text-ink hover:bg-surface transition-all duration-150 shadow-sm">
              {h}
            </button>
          ))}
        </div>
      </div>      
    </section>
  )
}
