'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  const [query, setQuery] = useState('')

  return (
    <section className="bg-bg px-5 lg:px-8 pt-16 pb-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="animate-fadeUp">
          <div className="inline-flex items-center gap-2 bg-white border border-subtle rounded-full px-3.5 py-1.5 text-sm font-medium text-ink mb-8 shadow-sm">
            <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            AI-Powered Property Search
          </div>

          <h1 className="text-5xl lg:text-6xl font-black text-ink leading-[1.05] tracking-tight mb-6">
            Find Your<br />Dream Home<br />With AI<br />Intelligence
          </h1>

          <p className="text-muted text-base leading-relaxed mb-8 max-w-md">
            Discover properties that match your lifestyle, budget, and aspirations. Our AI analyses thousands of data points to find your perfect match.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-white rounded-xl border border-subtle px-4 py-1 shadow-sm max-w-lg mb-4">
            <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Describe your ideal home..."
              className="flex-1 bg-transparent outline-none text-sm text-ink placeholder:text-muted py-3"
            />
            <button className="bg-ink text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-ink/80 transition-colors">
              Search
            </button>
          </div>

          {/* Hint pills */}
          <div className="flex flex-wrap gap-2">
            {[
              '3-bedroom family home near good schools',
              'Modern apartment with city views under $800k',
              'Investment property with high rental yield',
              'Beach house with pool for weekend getaways',
            ].map(h => (
              <button
                key={h}
                onClick={() => setQuery(h)}
                className="bg-white border border-subtle rounded-full px-3 py-1.5 text-xs text-muted hover:text-ink hover:border-ink/30 transition-all duration-200"
              >
                {h}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-10 mt-12 pt-10 border-t border-subtle">
            {[
              { icon: '🏠', val: '50K+', label: 'Properties' },
              { icon: '📈', val: '98%',  label: 'Match Accuracy' },
              { icon: '👥', val: '$2B+', label: 'In Sales' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-bold text-ink leading-none">{s.val}</p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — hero image with floating chips */}
        <div className="relative hidden lg:block">
          <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-card-hover">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=85"
              alt="Dream Home"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          </div>
          {/* Floating chip — AI Match */}
          <div className="absolute top-8 left-0 -translate-x-1/3 bg-white rounded-2xl px-4 py-3 shadow-float flex items-center gap-3">
            <div className="w-8 h-8 bg-green-light rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink leading-none">AI Match</p>
              <p className="text-xs text-muted mt-0.5">98% Accuracy</p>
            </div>
          </div>
          {/* Floating chip — New Listing */}
          <div className="absolute bottom-12 right-0 translate-x-1/4 bg-white rounded-2xl px-4 py-3 shadow-float flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-light rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-ink leading-none">New Listing</p>
              <p className="text-xs text-muted mt-0.5">Just added today</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
