import Link from 'next/link'
import Image from 'next/image'
import type { AnyPropertyCard, BadgeColor, SalePropertyCard, RentPropertyCard } from '@/lib/types'

const BADGE_STYLES: Record<BadgeColor, string> = {
  green: 'bg-green text-white', purple: 'bg-purple text-white',
  orange: 'bg-orange text-white', blue: 'bg-blue text-white', teal: 'bg-teal text-white',
}

function scoreColor(val: number) { return val >= 8.5 ? 'text-green' : 'text-orange' }

// ── Sale-specific footer ──────────────────────────────────────────
function SaleFooter({ p }: { p: SalePropertyCard }) {
  const METHOD_LABEL: Record<string, string> = {
    auction: 'Auction', private_treaty: 'For Sale',
    expressions_of_interest: 'EOI', off_market: 'Off-Market',
  }
  return (
    <>
      {/* Auction / open home strip */}
      {(p.auctionDate || p.openHome) && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {p.auctionDate && (
            <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-[11px] font-semibold px-2.5 py-1 rounded-full">
              🔨 Auction {p.auctionDate.split(' ').slice(0,3).join(' ')}
            </span>
          )}
          {p.openHome && !p.auctionDate && (
            <span className="inline-flex items-center gap-1 bg-blue/10 text-blue text-[11px] font-semibold px-2.5 py-1 rounded-full">
              🏠 {p.openHome}
            </span>
          )}
        </div>
      )}
      {/* Scores */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Schools',   val: p.scores.schools,   isNum: true },
          { label: 'Safety',    val: p.scores.safety,    isNum: true },
          { label: 'Lifestyle', val: p.scores.lifestyle, isNum: true },
          { label: 'Growth',    val: p.scores.growth,    isNum: false },
        ].map(s => (
          <div key={s.label} className="bg-bg rounded-xl py-2 text-center">
            <span className={`block text-sm font-black leading-none mb-1 ${
              s.isNum ? scoreColor(s.val as number) : p.scores.growthPos ? 'text-green' : 'text-orange'
            }`}>{s.val}</span>
            <span className="block text-[10px] text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Rent-specific footer ──────────────────────────────────────────
function RentFooter({ p }: { p: RentPropertyCard }) {
  return (
    <>
      {/* Available + badges row */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="inline-flex items-center gap-1 bg-green/10 text-green text-[11px] font-semibold px-2.5 py-1 rounded-full">
          📅 {p.availableFrom}
        </span>
        {p.furnished && (
          <span className="inline-flex items-center gap-1 bg-purple/10 text-purple text-[11px] font-semibold px-2.5 py-1 rounded-full">
            🛋 Furnished
          </span>
        )}
        {p.petsAllowed === true && (
          <span className="inline-flex items-center gap-1 bg-teal/10 text-teal text-[11px] font-semibold px-2.5 py-1 rounded-full">
            🐾 Pets OK
          </span>
        )}
      </div>
      {/* Scores */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Schools',   val: p.scores.schools },
          { label: 'Safety',    val: p.scores.safety },
          { label: 'Lifestyle', val: p.scores.lifestyle },
          { label: 'Value',     val: p.scores.valueForMoney },
        ].map(s => (
          <div key={s.label} className="bg-bg rounded-xl py-2 text-center">
            <span className={`block text-sm font-black leading-none mb-1 ${scoreColor(s.val)}`}>{s.val}</span>
            <span className="block text-[10px] text-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── Main card ─────────────────────────────────────────────────────
export default function PropertyCard({ property: p }: { property: AnyPropertyCard }) {
  const isRent = p.listingType === 'rent'

  return (
    <Link
      href={`/property/${p.slug}?id=${p.property_id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={p.images[0]} alt={p.address} fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        {/* Listing type pill */}
        <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
          isRent ? 'bg-ink text-white' : 'bg-white text-ink border border-subtle'
        }`}>
          {isRent ? '🔑 FOR RENT' : '🏷 FOR SALE'}
        </span>
        {/* Badge */}
        <span className={`absolute top-10 left-3 mt-0.5 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${BADGE_STYLES[p.badge.color]}`}>
          {p.badge.label}
        </span>
        {/* Favourite */}
        <button
          onClick={e => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-float hover:scale-110 transition-transform"
        >
          <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Price */}
        <p className="text-2xl font-black text-ink tracking-tight mb-0.5">{p.priceDisplay}</p>

        {/* Address */}
        <p className="text-sm text-muted mb-3">{p.address}</p>

        {/* Features */}
        <div className="flex items-center gap-5 text-xs mb-4">
          {[
            { d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', v: p.beds },
            { d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', v: p.baths },
            { d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 6h4l3 5v3H4V8l3-3h6z', v: p.cars },
          ].map((f, i) => (
            <span key={i} className="flex items-center gap-1 font-medium text-ink">
              <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.d}/>
              </svg>
              {f.v}
            </span>
          ))}
          <span className="font-medium text-ink">{p.land}</span>
        </div>

        <div className="border-t border-subtle mb-4" />

        {/* AI Insight */}
        {p.aiInsight && (
          <div className="bg-bg border border-subtle rounded-xl p-3.5 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange mb-1.5">✦ AI Insight</p>
            <p className="text-xs leading-relaxed text-muted">{p.aiInsight}</p>
          </div>
        )}

        {/* Type-specific footer */}
        {isRent
          ? <RentFooter p={p as RentPropertyCard} />
          : <SaleFooter p={p as SalePropertyCard} />
        }
      </div>
    </Link>
  )
}
