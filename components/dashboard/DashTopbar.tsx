'use client'
import { useState } from 'react'

const SUGGESTIONS = [
  '3 bed houses under $900k near good schools in McKinnon',
  'Investment apartments with 5%+ yield in inner Melbourne',
  'What is the median price trend in Bentleigh East?',
  'Rentals under $600/wk with pets allowed near a train station',
]

export default function DashTopbar() {
  const [query, setQuery]     = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => setLoading(false), 1200)
  }

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green text-base leading-none">✦</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder='Ask PropAI anything — "3 bed houses under $900k near good schools in McKinnon"'
          className="w-full bg-white border border-subtle rounded-2xl py-3.5 pl-11 pr-24 text-sm text-ink placeholder:text-muted/60 outline-none focus:border-green focus:ring-2 focus:ring-green/10 shadow-card transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && <div className="w-3.5 h-3.5 border-2 border-subtle border-t-teal rounded-full animate-spin"/>}
          <span className="bg-green/10 text-green text-[10px] font-bold px-2 py-1 rounded-lg border border-teal/20">AI</span>
        </div>

        {/* Dropdown suggestions */}
        {focused && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-subtle shadow-float z-50 overflow-hidden animate-fadeIn">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted px-4 pt-3 pb-2">Try asking…</p>
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-muted hover:text-ink hover:bg-bg transition-colors border-b border-subtle last:border-0"
              >
                <span className="text-green text-xs flex-shrink-0">✦</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}
