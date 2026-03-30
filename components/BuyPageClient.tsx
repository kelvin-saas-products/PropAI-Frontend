'use client'
import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyListingCard, { CARD_HEIGHT, CARD_GAP, CARD_STRIDE } from './PropertyListingCard'
import Breadcrumb from './Breadcrumb'
import type { SalePropertyCard } from '@/lib/types'
import { useI18n } from '@/lib/i18n'

// ── Virtual scroller ──────────────────────────────────────────────
// Renders only the cards currently visible in the viewport plus an
// overscan buffer. A single spacer div keeps the scrollbar correct.

const OVERSCAN = 3

interface VirtualListProps {
  items: SalePropertyCard[]
}

function VirtualPropertyList({ items }: VirtualListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollTop,  setScrollTop]  = useState(0)
  const [viewHeight, setViewHeight] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setViewHeight(entry.contentRect.height)
    })
    ro.observe(el)
    setViewHeight(el.clientHeight)
    return () => ro.disconnect()
  }, [])

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop)
  }, [])

  const { startIndex, endIndex, totalHeight, offsetTop } = useMemo(() => {
    const totalHeight = items.length * CARD_STRIDE - CARD_GAP
    const rawStart    = Math.floor(scrollTop / CARD_STRIDE)
    const rawEnd      = Math.ceil((scrollTop + viewHeight) / CARD_STRIDE)
    const startIndex  = Math.max(0, rawStart - OVERSCAN)
    const endIndex    = Math.min(items.length - 1, rawEnd + OVERSCAN)
    const offsetTop   = startIndex * CARD_STRIDE
    return { startIndex, endIndex, totalHeight, offsetTop }
  }, [scrollTop, viewHeight, items.length])

  const visibleItems = items.slice(startIndex, endIndex + 1)

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto h-full"
      onScroll={onScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetTop, left: 0, right: 0 }}>
          {visibleItems.map((p, i) => (
            <div
              key={p.property_id}
              style={{
                height: CARD_HEIGHT,
                marginBottom: i < visibleItems.length - 1 ? CARD_GAP : 0,
              }}
            >
              <PropertyListingCard property={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Ad / announcement sidebar ─────────────────────────────────────

function AdSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[300px] flex-shrink-0 overflow-y-auto pb-2">

      {/* Sponsored slot */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-subtle">
        <div className="bg-gradient-to-r from-teal to-blue px-4 py-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Sponsored</span>
        </div>
        <div className="p-4">
          <div className="w-full h-32 bg-surface rounded-xl mb-3 flex items-center justify-center text-3xl">🏡</div>
          <p className="text-sm font-bold text-ink mb-1">Your Ad Here</p>
          <p className="text-xs text-muted leading-relaxed">Promote your listing to thousands of qualified buyers.</p>
          <button className="mt-3 w-full text-xs font-semibold text-teal border border-teal/30 rounded-xl py-2 hover:bg-teal/5 transition-colors">
            Advertise with us →
          </button>
        </div>
      </div>

      {/* Suburb spotlight */}
      <div className="bg-white rounded-2xl shadow-card border border-subtle">
        <div className="bg-gradient-to-r from-violet to-blue px-4 py-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Suburb Spotlight</span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { suburb: 'Mosman, NSW',   growth: '+12.5%', median: '$2.4M'  },
            { suburb: 'Thong Lo, BKK', growth: '+8.0%',  median: '฿28M'   },
            { suburb: 'BGC, Manila',   growth: '+15.0%', median: '₱48M'   },
          ].map(s => (
            <div key={s.suburb} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-ink">{s.suburb}</p>
                <p className="text-[11px] text-muted">{s.median} median</p>
              </div>
              <span className="text-xs font-bold text-green">{s.growth}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement */}
      <div
        className="rounded-2xl p-4 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">New Feature</p>
        <p className="text-sm font-black mb-2 leading-snug">AI Property Match is live</p>
        <p className="text-[11px] opacity-80 leading-relaxed mb-3">
          Get personalised property scores based on your lifestyle, budget and goals.
        </p>
        <button className="text-[11px] font-bold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full">
          Try it free →
        </button>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -top-4 -right-8 w-20 h-20 bg-white/10 rounded-full" />
      </div>

      {/* Open homes */}
      <div className="bg-white rounded-2xl shadow-card border border-subtle p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Open Homes · This Weekend</p>
        <div className="space-y-2.5">
          {[
            { time: 'Sat 10:00–10:30 AM', address: '42 Park Ave, Mosman'        },
            { time: 'Sat 11:00–11:30 AM', address: '15 Surf Pde, Broadbeach'    },
            { time: 'Sun 1:00–1:30 PM',   address: '88 Collins St, Melbourne'   },
          ].map((o, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-ink">{o.time}</p>
                <p className="text-[11px] text-muted">{o.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  )
}

// ── Main page client ──────────────────────────────────────────────

interface Props {
  properties: SalePropertyCard[]
}

export default function BuyPageClient({ properties }: Props) {
  const searchParams = useSearchParams()
  const { country }  = useI18n()

  const minPrice   = Number(searchParams.get('minPrice') || 0)
  const maxPrice   = Number(searchParams.get('maxPrice') || 0)
  const minBeds    = Number(searchParams.get('beds') || 0)
  const typeFilter = searchParams.get('types')
    ? searchParams.get('types')!.split(',').map(t => t.toLowerCase())
    : []

  const filtered = useMemo(() => {
    return properties.filter(p => {
      if (minPrice && p.salePriceRaw < minPrice) return false
      if (maxPrice && p.salePriceRaw > maxPrice) return false
      if (minBeds  && p.beds < minBeds)           return false
      if (typeFilter.length > 0) {
        const haystack = [p.address, p.title, p.badge.label].join(' ').toLowerCase()
        if (!typeFilter.some(t => haystack.includes(t))) return false
      }
      return true
    })
  }, [properties, minPrice, maxPrice, minBeds, typeFilter])

  const anyFiltersActive = !!(minPrice || maxPrice || minBeds || typeFilter.length)

  // Breadcrumb
  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Buy',  href: '/buy' },
      { label: `Properties for Sale in ${country}` },
    ]
    if (anyFiltersActive) {
      const parts: string[] = []
      if (minBeds) parts.push(`${minBeds}+ beds`)
      if (minPrice || maxPrice) {
        if (minPrice && maxPrice)
          parts.push(`$${(minPrice / 1000).toFixed(0)}k – $${(maxPrice / 1000).toFixed(0)}k`)
        else if (minPrice)
          parts.push(`Over $${(minPrice / 1_000_000).toFixed(1)}M`)
        else
          parts.push(`Under $${(maxPrice / 1000).toFixed(0)}k`)
      }
      if (typeFilter.length) parts.push(typeFilter.join(', '))
      if (parts.length) items.push({ label: parts.join(' · ') })
    }
    return items
  }, [country, anyFiltersActive, minBeds, minPrice, maxPrice, typeFilter])

  return (
    // Fill the viewport below the sticky navbar (56px)
    <div
      className="max-w-[1400px] mx-auto px-5 lg:px-8 flex flex-col"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbs} />

      {/* Results header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Properties for sale <span className="text-teal">in {country}</span>
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {anyFiltersActive && ' · filters applied'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Sort by</span>
          <select className="text-sm bg-bg border border-subtle rounded-xl px-3 py-2 text-ink outline-none font-medium">
            <option>AI Match</option>
            <option>Price (low to high)</option>
            <option>Price (high to low)</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex gap-6 flex-1 min-h-0 pb-6">

        {/* Virtual property list */}
        <div className="flex-1 min-w-0 min-h-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl">🏘</div>
              <p className="text-lg font-bold text-ink">No properties found</p>
              <p className="text-sm text-muted text-center max-w-xs">
                Try adjusting your filters or selecting a different country.
              </p>
            </div>
          ) : (
            <VirtualPropertyList items={filtered} />
          )}
        </div>

        {/* Ad sidebar */}
        <AdSidebar />
      </div>
    </div>
  )
}
