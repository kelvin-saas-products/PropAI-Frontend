'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { AnyPropertyCard, BadgeColor, SalePropertyCard, RentPropertyCard } from '@/lib/types'
import { useAuth } from '@/context/AuthContext'
import { saveProperty, unsaveProperty } from '@/lib/auth'

// ── Constants (kept for legacy imports) ──────────────────────────
export const CARD_HEIGHT = 260
export const CARD_GAP    = 12
export const CARD_STRIDE = CARD_HEIGHT + CARD_GAP

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

// ── Login prompt dialog ──────────────────────────────────────────
function LoginPromptDialog({ onClose, onGoLogin }: { onClose: () => void; onGoLogin: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-float w-full max-w-sm p-6 flex flex-col gap-4 animate-fadeIn"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto"
          style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
        >
          🔖
        </div>

        <div className="text-center">
          <h2 className="text-lg font-black text-ink">Save this property</h2>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            Sign in to save properties and access them from your dashboard anytime.
          </p>
        </div>

        <button
          onClick={onGoLogin}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-glow"
          style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
        >
          Sign in to save
        </button>

        <div className="flex items-center gap-2 text-xs text-muted justify-center">
          <span>No account?</span>
          <button
            onClick={() => { onClose(); }}
            className="text-teal font-semibold hover:underline"
            onClickCapture={() => { onClose(); setTimeout(() => window.location.href = '/auth/register', 50) }}
          >
            Join free →
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Image carousel ────────────────────────────────────────────────
interface CarouselProps {
  images: string[]
  address: string
  listingType: 'sale' | 'rent'
  badgeLabel: string
  badgeColor: BadgeColor
  propertyId: string
  isSaved: boolean
}

function ImageCarousel({ images, address, listingType, badgeLabel, badgeColor, propertyId, isSaved }: CarouselProps) {
  const total  = images.length
  const isRent = listingType === 'rent'

  // Committed slide index — drives dot rendering
  const [index, setIndex] = useState(0)
  // Live fractional index during scrub/swipe — drives dot morph without re-rendering strip
  const [liveIndex, setLiveIndex] = useState<number | null>(null)

  const stripRef    = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotBarRef   = useRef<HTMLDivElement>(null)

  // Swipe state (image area)
  const swipeStartX   = useRef(0)
  const swipeStartIdx = useRef(0)
  const isSwiping     = useRef(false)
  const swipeMoved    = useRef(false) // true once finger moved >6px — used to block link click

  // Dot-scrub state
  const dotDragStartX   = useRef(0)
  const dotDragBaseIdx  = useRef(0)
  const isDotDragging   = useRef(false)

  // ── Imperative translate (no React re-render on every frame) ────
  const translateTo = useCallback((fractional: number, animate = false) => {
    const el = stripRef.current
    if (!el) return
    const clamped = Math.max(0, Math.min(total - 1, fractional))
    // Strip is total*containerWidth wide; shift by (clamped * containerWidth)
    // expressed as a percentage of the strip: (clamped / total) * 100%
    el.style.transition = animate ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' : 'none'
    el.style.transform  = `translateX(-${(clamped / total) * 100}%)`
  }, [total])

  const commitIndex = useCallback((raw: number) => {
    const snapped = Math.max(0, Math.min(total - 1, Math.round(raw)))
    setIndex(snapped)
    setLiveIndex(null)
    translateTo(snapped, true)
  }, [total, translateTo])

  // ── Image-area swipe ────────────────────────────────────────────
  const onImgPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    swipeStartX.current   = e.clientX
    swipeStartIdx.current = index
    isSwiping.current     = true
    swipeMoved.current    = false
    translateTo(index) // lock off animation for live drag
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onImgPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current || total <= 1) return
    const delta = e.clientX - swipeStartX.current
    if (Math.abs(delta) > 6) swipeMoved.current = true
    if (!swipeMoved.current) return
    // Container width — use containerRef so we measure the visible panel, not the full strip
    const containerW = containerRef.current?.getBoundingClientRect().width ?? 1
    const raw = swipeStartIdx.current - delta / containerW
    setLiveIndex(Math.max(0, Math.min(total - 1, raw)))
    translateTo(raw)
  }

  const onImgPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return
    isSwiping.current = false
    if (!swipeMoved.current) return
    // Block the subsequent click event so the Link doesn't navigate
    e.currentTarget.addEventListener('click', ev => ev.preventDefault(), { once: true })
    const delta      = e.clientX - swipeStartX.current
    const containerW = containerRef.current?.getBoundingClientRect().width ?? 1
    const raw        = swipeStartIdx.current - delta / containerW
    commitIndex(raw)
    swipeMoved.current = false
  }

  // ── Dot-bar scrub ───────────────────────────────────────────────
  const onDotBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    e.preventDefault(); e.stopPropagation()
    dotDragStartX.current  = e.clientX
    dotDragBaseIdx.current = index
    isDotDragging.current  = true
    translateTo(index) // disable animation for live scrub
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onDotBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDotDragging.current || total <= 1) return
    e.preventDefault(); e.stopPropagation()
    const barW  = dotBarRef.current?.getBoundingClientRect().width ?? 60
    const delta = e.clientX - dotDragStartX.current
    // Map bar width → full slide range
    const raw   = dotDragBaseIdx.current + (delta / barW) * (total - 1)
    const clamped = Math.max(0, Math.min(total - 1, raw))
    setLiveIndex(clamped)
    translateTo(clamped)
  }

  const onDotBarPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDotDragging.current) return
    e.preventDefault(); e.stopPropagation()
    isDotDragging.current = false
    const barW  = dotBarRef.current?.getBoundingClientRect().width ?? 60
    const delta = e.clientX - dotDragStartX.current
    const raw   = dotDragBaseIdx.current + (delta / barW) * (total - 1)
    commitIndex(raw)
  }

  // Dot tap — navigate directly to that slide
  const onDotClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault(); e.stopPropagation()
    // Only treat as a tap if we weren't scrubbing
    if (isDotDragging.current) return
    commitIndex(i)
  }

  const displayIndex = liveIndex ?? index

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 overflow-hidden select-none"
      style={{ width: '57%', height: '100%' }}
    >
      {/* ── Sliding strip ──────────────────────────────────── */}
      <div
        ref={stripRef}
        className="absolute inset-0 flex"
        style={{ width: `${total * 100}%`, willChange: 'transform' }}
        onPointerDown={onImgPointerDown}
        onPointerMove={onImgPointerMove}
        onPointerUp={onImgPointerUp}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="relative flex-shrink-0"
            style={{ width: `${100 / total}%`, height: '100%' }}
          >
            <Image
              src={src}
              alt={`${address} — photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 40vw, 28vw"
              priority={i === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* ── Overlays ──────────────────────────────────────── */}

      {/* Listing type pill */}
      <span className={`absolute top-3 left-3 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${
        isRent ? 'bg-ink text-white' : 'bg-white text-ink border border-subtle'
      }`}>
        {isRent ? '🔑 FOR RENT' : '🏷 FOR SALE'}
      </span>

      {/* Badge */}
      <span className={`absolute left-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${BADGE_STYLES[badgeColor]}`}
        style={{ bottom: '15px' }}>
        {badgeLabel}
      </span>

      {/* Save button */}
      <SaveButton propertyId={propertyId} initialSaved={isSaved} />

      {/* ── Dot scrubber ───────────────────────────────────── */}
      {total > 1 && (
        <>
          {/* Tight scrim — sits only behind the dot row */}
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[9] rounded-full"
            style={{
              bottom: '21px',
              height: '13px',
              width: `${images.length * 16 + 16}px`,
              background: 'rgba(0,0,0,0.25)',
              filter: 'blur(4px)',
            }}
          />
          {/* Dot bar — centered horizontally at bottom */}
          <div
            ref={dotBarRef}
            className="absolute left-0 right-0 z-10 flex justify-center items-center gap-[5px] cursor-grab active:cursor-grabbing touch-none"
            style={{ bottom: '25px' }}
            onPointerDown={onDotBarPointerDown}
            onPointerMove={onDotBarPointerMove}
            onPointerUp={onDotBarPointerUp}
          >
            {images.map((_, i) => {
              const dist    = Math.abs(displayIndex - i)
              const active  = dist < 0.5
              const near    = dist < 1.5
              const w       = active ? 18 : near ? 7 : 5
              const opacity = active ? 1 : near ? 0.65 : 0.4

              return (
                <button
                  key={i}
                  onClick={e => onDotClick(e, i)}
                  style={{
                    width:        w,
                    height:       5,
                    opacity,
                    borderRadius: 9999,
                    background:   'white',
                    flexShrink:   0,
                    border:       'none',
                    padding:      0,
                    cursor:       'inherit',
                    transition:   'width 0.12s ease, opacity 0.12s ease',
                  }}
                  aria-label={`Photo ${i + 1}`}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

interface SaveButtonProps {
  propertyId: string
  initialSaved?: boolean
}

function SaveButton({ propertyId, initialSaved = false }: SaveButtonProps) {
  const { user, accessToken } = useAuth()
  const router = useRouter()
  const [saved,       setSaved]       = useState(initialSaved)
  const [loading,     setLoading]     = useState(false)
  const [showDialog,  setShowDialog]  = useState(false)

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user || !accessToken) {
      setShowDialog(true)
      return
    }

    if (loading) return
    setLoading(true)
    try {
      if (saved) {
        await unsaveProperty(accessToken, propertyId)
        setSaved(false)
      } else {
        await saveProperty(accessToken, propertyId)
        setSaved(true)
      }
    } catch {
      // silently ignore — optimistic update reverted
    } finally {
      setLoading(false)
    }
  }, [user, accessToken, saved, loading, propertyId])

  return (
    <>
      <button
        onClick={handleClick}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-float transition-all duration-200 ${
          saved
            ? 'bg-red-500 hover:bg-red-600 scale-110'
            : 'bg-white hover:scale-110'
        } ${loading ? 'opacity-60 cursor-wait' : ''}`}
        aria-label={saved ? 'Unsave property' : 'Save property'}
      >
        <svg
          className={`w-4 h-4 transition-colors ${saved ? 'text-white' : 'text-muted'}`}
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {showDialog && (
        <LoginPromptDialog
          onClose={() => setShowDialog(false)}
          onGoLogin={() => { setShowDialog(false); router.push('/auth/sign-in') }}
        />
      )}
    </>
  )
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
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-xl font-black text-ink tracking-tight leading-tight">
            {p.priceDisplay}
          </p>
        </div>
        <p className="text-xs text-muted leading-snug mb-2">{p.address}</p>

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

        {p.aiInsight && (
          <p className="text-[11px] text-muted leading-relaxed line-clamp-2 mb-2">
            <span className="font-bold text-orange">✦ AI: </span>{p.aiInsight}
          </p>
        )}
      </div>

      <div>
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
interface Props {
  property: AnyPropertyCard
  isSaved?: boolean
}

export default function PropertyListingCard({ property: p, isSaved = false }: Props) {
  const isRent = p.listingType === 'rent'
  const href   = `/property/${p.slug}?id=${p.property_id}`

  return (
    <div
      className="group relative flex bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      style={{ height: 'clamp(280px, 48svh, 520px)' }}
    >
      {/* ── Left: image carousel (no navigation) ─────────────── */}
      <ImageCarousel
        images={p.images}
        address={p.address}
        listingType={p.listingType}
        badgeLabel={p.badge.label}
        badgeColor={p.badge.color}
        propertyId={p.property_id}
        isSaved={isSaved}
      />

      {/* ── Right: details (click navigates) ─────────────────── */}
      <Link
        href={href}
        className="flex-1 min-w-0 p-4 overflow-hidden block"
      >
        {isRent
          ? <RentPanel  p={p as RentPropertyCard} />
          : <SalePanel  p={p as SalePropertyCard} />
        }
      </Link>
    </div>
  )
}
