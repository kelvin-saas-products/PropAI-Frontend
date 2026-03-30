'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { AnyPropertyCard, BadgeColor, SalePropertyCard, RentPropertyCard } from '@/lib/types'

// ── Constants (kept for any legacy imports) ───────────────────────
export const CARD_HEIGHT = 260
export const CARD_GAP    = 12
export const CARD_STRIDE = CARD_HEIGHT + CARD_GAP

// Card sizing strategy:
//  • Large screens (lg+): card fills ~48 % of viewport height so two cards
//    are visible at once with some breathing room.
//  • Small screens:       card fills ~82 % of viewport height so one card
//    dominates and the next peeks below.
// We achieve this with Tailwind's min-h + a CSS custom property trick.

const BADGE_STYLES: Record<BadgeColor, string> = {
  green:  'bg-green  text-white',
  purple: 'bg-purple text-white',
  orange: 'bg-orange text-white',
  blue:   'bg-blue   text-white',
  teal:   'bg-teal   text-white',
}

function scoreColor(val: number) {
  return val >= 8.5 ? 'text-green' : 'text-orange'
}

// ── Sale right panel ──────────────────────────────────────────────
function SalePanel({ p }: { p: SalePropertyCard }) {
  const METHOD_LABEL: Record<string, string> = {
    auction:               'Auction',
    private_treaty:        'For Sale',
    expressions_of_interest: 'EOI',
    off_market:            'Off-Market',
  }

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top: price + address */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xl font-black text-ink tracking-tight leading-tight">
            {p.priceDisplay}
          </p>
          {/* AI match chip */}
          <span
            className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6)' }}
          >
            ✦ {p.aiMatch}% match
          </span>
        </div>
        <p className="text-xs text-muted leading-snug mb-2">{p.address}</p>

        {/* Features row */}
        <div className="flex items-center gap-4 text-xs text-ink mb-2">
          <span className="flex items-center gap-1 font-semibold">
            <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            {p.beds} bd
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {p.baths} ba
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 6h4l3 5v3H4V8l3-3h6z"/>
            </svg>
            {p.cars} car
          </span>
          <span className="font-semibold text-muted">{p.land}</span>
        </div>

        {/* AI Insight */}
        {p.aiInsight && (
          <p className="text-[11px] text-muted leading-relaxed line-clamp-2 mb-2">
            <span className="font-bold text-orange">✦ AI: </span>{p.aiInsight}
          </p>
        )}
      </div>

      {/* Bottom: scores + event chips */}
      <div>
        {/* Auction / open home */}
        {(p.auctionDate || p.openHome) && (
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {p.auctionDate && (
              <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-[10px] font-semibold px-2 py-0.5 rounded-full">
                🔨 {p.auctionDate.split(' ').slice(0, 3).join(' ')}
              </span>
            )}
            {p.openHome && !p.auctionDate && (
              <span className="inline-flex items-center gap-1 bg-blue/10 text-blue text-[10px] font-semibold px-2 py-0.5 rounded-full">
                🏠 {p.openHome}
              </span>
            )}
            <span className="inline-flex items-center gap-1 bg-surface text-muted text-[10px] font-semibold px-2 py-0.5 rounded-full border border-subtle">
              {METHOD_LABEL[p.saleMethod] ?? p.saleMethod}
            </span>
          </div>
        )}

        {/* Score pills */}
        <div className="flex gap-1.5">
          {[
            { label: 'Schools',   val: p.scores.schools,   isNum: true },
            { label: 'Safety',    val: p.scores.safety,    isNum: true },
            { label: 'Lifestyle', val: p.scores.lifestyle, isNum: true },
            { label: 'Growth',    val: p.scores.growth,    isNum: false },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-subtle rounded-lg px-2 py-1 text-center min-w-[48px]">
              <span className={`block text-xs font-black leading-none mb-0.5 ${
                s.isNum
                  ? scoreColor(s.val as number)
                  : p.scores.growthPos ? 'text-green' : 'text-orange'
              }`}>{s.val}</span>
              <span className="block text-[9px] text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Rent right panel ──────────────────────────────────────────────
function RentPanel({ p }: { p: RentPropertyCard }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xl font-black text-ink tracking-tight">{p.priceDisplay}</p>
          <span
            className="flex-shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6)' }}
          >
            ✦ {p.aiMatch}% match
          </span>
        </div>
        <p className="text-xs text-muted leading-snug mb-2">{p.address}</p>

        <div className="flex items-center gap-4 text-xs text-ink mb-2">
          <span className="font-semibold">{p.beds} bd</span>
          <span className="font-semibold">{p.baths} ba</span>
          <span className="font-semibold">{p.cars} car</span>
          <span className="font-semibold text-muted">{p.land}</span>
        </div>

        {p.aiInsight && (
          <p className="text-[11px] text-muted leading-relaxed line-clamp-2 mb-2">
            <span className="font-bold text-orange">✦ AI: </span>{p.aiInsight}
          </p>
        )}
      </div>

      <div>
        <div className="flex gap-1.5 mb-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-green/10 text-green text-[10px] font-semibold px-2 py-0.5 rounded-full">
            📅 {p.availableFrom}
          </span>
          {p.furnished && (
            <span className="inline-flex items-center gap-1 bg-purple/10 text-purple text-[10px] font-semibold px-2 py-0.5 rounded-full">
              🛋 Furnished
            </span>
          )}
          {p.petsAllowed && (
            <span className="inline-flex items-center gap-1 bg-teal/10 text-teal text-[10px] font-semibold px-2 py-0.5 rounded-full">
              🐾 Pets OK
            </span>
          )}
        </div>

        <div className="flex gap-1.5">
          {[
            { label: 'Schools',   val: p.scores.schools },
            { label: 'Safety',    val: p.scores.safety },
            { label: 'Lifestyle', val: p.scores.lifestyle },
            { label: 'Value',     val: p.scores.valueForMoney },
          ].map(s => (
            <div key={s.label} className="bg-surface border border-subtle rounded-lg px-2 py-1 text-center min-w-[48px]">
              <span className={`block text-xs font-black leading-none mb-0.5 ${scoreColor(s.val)}`}>{s.val}</span>
              <span className="block text-[9px] text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main card ─────────────────────────────────────────────────────
export default function PropertyListingCard({ property: p }: { property: AnyPropertyCard }) {
  const isRent = p.listingType === 'rent'
  // Image height = 60% of CARD_HEIGHT
  const imgH = Math.round(CARD_HEIGHT * 0.6) // 156px

  return (
    <Link
      href={`/property/${p.slug}?id=${p.property_id}`}
      className="group flex bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      style={{ height: 'clamp(280px, 48svh, 520px)' }}
    >
      {/* ── Left: image (fixed 57% width) ─────────────────────── */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: '57%' }}>
        <Image
          src={p.images[0]}
          alt={p.address}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 1200px) 40vw, 28vw"
        />

        {/* Listing type pill */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
          isRent ? 'bg-ink text-white' : 'bg-white text-ink border border-subtle'
        }`}>
          {isRent ? '🔑 FOR RENT' : '🏷 FOR SALE'}
        </span>

        {/* Badge */}
        <span className={`absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${BADGE_STYLES[p.badge.color]}`}>
          {p.badge.label}
        </span>

        {/* Favourite */}
        <button
          onClick={e => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-float hover:scale-110 transition-transform"
          aria-label="Save property"
        >
          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      {/* ── Right: details (remaining width) ──────────────────── */}
      <div className="flex-1 min-w-0 p-4 overflow-hidden">
        {isRent
          ? <RentPanel  p={p as RentPropertyCard} />
          : <SalePanel  p={p as SalePropertyCard} />
        }
      </div>
    </Link>
  )
}
