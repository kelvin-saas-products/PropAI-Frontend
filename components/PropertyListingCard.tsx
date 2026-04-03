'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { CSSProperties, ReactNode } from 'react'
import type { AnyPropertyCard, BadgeColor, SalePropertyCard, RentPropertyCard } from '@/lib/types'
import type { ListingViewportLayout } from '@/lib/listings-layout'
import { DEFAULT_LISTING_VIEWPORT_LAYOUT, getListingCardStyleVars } from '@/lib/listings-layout'
import { useAuth } from '@/context/AuthContext'
import { saveProperty, unsaveProperty } from '@/lib/auth'

export const CARD_HEIGHT = 260
export const CARD_GAP = 12
export const CARD_STRIDE = CARD_HEIGHT + CARD_GAP

const BADGE_STYLES: Record<BadgeColor, string> = {
  green: 'bg-green text-white',
  purple: 'bg-purple text-white',
  orange: 'bg-orange text-white',
  blue: 'bg-blue text-white',
  teal: 'bg-teal text-white',
}

const FALLBACK_LISTING_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ecfeff" />
        <stop offset="100%" stop-color="#dbeafe" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#g)" />
    <path d="M180 560L360 380l150 130 180-190 330 340H180z" fill="#bfdbfe" />
    <rect x="470" y="230" width="260" height="230" rx="28" fill="#ffffff" opacity="0.96" />
    <path d="M530 372v-78l70-48 70 48v78" fill="none" stroke="#1e3a8a" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M575 390v-58h50v58" fill="none" stroke="#1e3a8a" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" />
  </svg>`
)}`

function scoreColor(val: number) {
  return val >= 8.5 ? 'text-green' : 'text-orange'
}

function getCardStyle(layout: ListingViewportLayout): CSSProperties {
  return {
    ...getListingCardStyleVars(layout),
    height: `${layout.cardHeightPx}px`,
  }
}

function getMediaStyle(layout: ListingViewportLayout): CSSProperties {
  if (layout.isDesktop) {
    return {
      width: 'var(--listing-card-image-width)',
      height: '100%',
    }
  }

  return {
    width: '100%',
    height: 'var(--listing-card-image-height)',
  }
}

function getCardShellClass(layout: ListingViewportLayout) {
  return layout.isDesktop
    ? 'flex-row'
    : 'flex-col'
}

function getContentPaddingClass(layout: ListingViewportLayout) {
  return layout.isDesktop ? 'p-3' : 'p-3'
}

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
            onClick={() => {
              onClose()
            }}
            className="text-teal font-semibold hover:underline"
            onClickCapture={() => {
              onClose()
              setTimeout(() => {
                window.location.href = '/auth/register'
              }, 50)
            }}
          >
            Join free →
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface CarouselProps {
  images: string[]
  address: string
  listingType: 'sale' | 'rent'
  badgeLabel: string
  badgeColor: BadgeColor
  propertyId: string
  isSaved: boolean
  layout: ListingViewportLayout
}

function ImageCarousel({
  images,
  address,
  listingType,
  badgeLabel,
  badgeColor,
  propertyId,
  isSaved,
  layout,
}: CarouselProps) {
  const slides = images.length > 0 ? images : [FALLBACK_LISTING_IMAGE]
  const total = slides.length
  const isRent = listingType === 'rent'

  const [index, setIndex] = useState(0)
  const [liveIndex, setLiveIndex] = useState<number | null>(null)

  const stripRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dotBarRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef(0)
  const swipeStartIdx = useRef(0)
  const isSwiping = useRef(false)
  const swipeMoved = useRef(false)
  const dotDragStartX = useRef(0)
  const dotDragBaseIdx = useRef(0)
  const isDotDragging = useRef(false)

  const translateTo = useCallback(
    (fractional: number, animate = false) => {
      const el = stripRef.current
      if (!el) return
      const clamped = Math.max(0, Math.min(total - 1, fractional))
      el.style.transition = animate ? 'transform 0.28s cubic-bezier(0.4,0,0.2,1)' : 'none'
      el.style.transform = `translateX(-${(clamped / total) * 100}%)`
    },
    [total]
  )

  const commitIndex = useCallback(
    (raw: number) => {
      const snapped = Math.max(0, Math.min(total - 1, Math.round(raw)))
      setIndex(snapped)
      setLiveIndex(null)
      translateTo(snapped, true)
    },
    [total, translateTo]
  )

  const onImgPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    swipeStartX.current = e.clientX
    swipeStartIdx.current = index
    isSwiping.current = true
    swipeMoved.current = false
    translateTo(index)
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onImgPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current || total <= 1) return
    const delta = e.clientX - swipeStartX.current
    if (Math.abs(delta) > 6) swipeMoved.current = true
    if (!swipeMoved.current) return
    const containerW = containerRef.current?.getBoundingClientRect().width ?? 1
    const raw = swipeStartIdx.current - delta / containerW
    setLiveIndex(Math.max(0, Math.min(total - 1, raw)))
    translateTo(raw)
  }

  const onImgPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSwiping.current) return
    isSwiping.current = false
    if (!swipeMoved.current) return
    e.currentTarget.addEventListener('click', ev => ev.preventDefault(), { once: true })
    const delta = e.clientX - swipeStartX.current
    const containerW = containerRef.current?.getBoundingClientRect().width ?? 1
    const raw = swipeStartIdx.current - delta / containerW
    commitIndex(raw)
    swipeMoved.current = false
  }

  const onDotBarPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (total <= 1) return
    e.preventDefault()
    e.stopPropagation()
    dotDragStartX.current = e.clientX
    dotDragBaseIdx.current = index
    isDotDragging.current = true
    translateTo(index)
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
  }

  const onDotBarPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDotDragging.current || total <= 1) return
    e.preventDefault()
    e.stopPropagation()
    const barW = dotBarRef.current?.getBoundingClientRect().width ?? 60
    const delta = e.clientX - dotDragStartX.current
    const raw = dotDragBaseIdx.current + (delta / barW) * (total - 1)
    const clamped = Math.max(0, Math.min(total - 1, raw))
    setLiveIndex(clamped)
    translateTo(clamped)
  }

  const onDotBarPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDotDragging.current) return
    e.preventDefault()
    e.stopPropagation()
    isDotDragging.current = false
    const barW = dotBarRef.current?.getBoundingClientRect().width ?? 60
    const delta = e.clientX - dotDragStartX.current
    const raw = dotDragBaseIdx.current + (delta / barW) * (total - 1)
    commitIndex(raw)
  }

  const onDotClick = (e: React.MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (isDotDragging.current) return
    commitIndex(i)
  }

  const displayIndex = liveIndex ?? index
  const mediaStyle = getMediaStyle(layout)

  return (
    <div
      ref={containerRef}
      className="relative flex-shrink-0 overflow-hidden select-none bg-surface"
      style={mediaStyle}
    >
      <div
        ref={stripRef}
        className="absolute inset-0 flex"
        style={{ width: `${total * 100}%`, willChange: 'transform' }}
        onPointerDown={onImgPointerDown}
        onPointerMove={onImgPointerMove}
        onPointerUp={onImgPointerUp}
      >
        {slides.map((src, i) => (
          <div key={`${src}-${i}`} className="relative flex-shrink-0" style={{ width: `${100 / total}%`, height: '100%' }}>
            <Image
              src={src}
              alt={`${address} — photo ${i + 1}`}
              fill
              className="object-cover"
              sizes={layout.isDesktop ? '(max-width: 1439px) 42vw, 36vw' : '100vw'}
              priority={i === 0}
              draggable={false}
              unoptimized={src.startsWith('data:image')}
            />
          </div>
        ))}
      </div>

      <span
        className={`absolute top-2.5 left-2.5 z-10 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${
          isRent ? 'bg-ink text-white' : 'bg-white text-ink border border-subtle'
        }`}
      >
        {isRent ? '🔑 FOR RENT' : '🏷 FOR SALE'}
      </span>

      <span
        className={`absolute left-2.5 z-10 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm pointer-events-none ${BADGE_STYLES[badgeColor]}`}
        style={{ bottom: '14px' }}
      >
        {badgeLabel}
      </span>

      <SaveButton propertyId={propertyId} initialSaved={isSaved} />

      {total > 1 && (
        <>
          <div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-[9] rounded-full"
            style={{
              bottom: '18px',
              height: '13px',
              width: `${slides.length * 16 + 16}px`,
              background: 'rgba(0,0,0,0.25)',
              filter: 'blur(4px)',
            }}
          />
          <div
            ref={dotBarRef}
            className="absolute left-0 right-0 z-10 flex justify-center items-center gap-[5px] cursor-grab active:cursor-grabbing touch-none"
            style={{ bottom: '22px' }}
            onPointerDown={onDotBarPointerDown}
            onPointerMove={onDotBarPointerMove}
            onPointerUp={onDotBarPointerUp}
          >
            {slides.map((_, i) => {
              const dist = Math.abs(displayIndex - i)
              const active = dist < 0.5
              const near = dist < 1.5
              const w = active ? 18 : near ? 7 : 5
              const opacity = active ? 1 : near ? 0.65 : 0.4

              return (
                <button
                  key={i}
                  onClick={e => onDotClick(e, i)}
                  style={{
                    width: w,
                    height: 5,
                    opacity,
                    borderRadius: 9999,
                    background: 'white',
                    flexShrink: 0,
                    border: 'none',
                    padding: 0,
                    cursor: 'inherit',
                    transition: 'width 0.12s ease, opacity 0.12s ease',
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
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
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
      } finally {
        setLoading(false)
      }
    },
    [user, accessToken, saved, loading, propertyId]
  )

  return (
    <>
      <button
        onClick={handleClick}
        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-float transition-all duration-200 ${
          saved ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-white hover:scale-110'
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
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      {showDialog && (
        <LoginPromptDialog
          onClose={() => setShowDialog(false)}
          onGoLogin={() => {
            setShowDialog(false)
            router.push('/auth/sign-in')
          }}
        />
      )}
    </>
  )
}

function DetailMetrics({ p }: { p: AnyPropertyCard }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink">
      <span className="font-semibold">{p.beds} bd</span>
      <span className="font-semibold">{p.baths} ba</span>
      <span className="font-semibold">{p.cars} car</span>
      {p.land && <span className="font-semibold text-muted">{p.land}</span>}
    </div>
  )
}

function ScoreStrip({ children }: { children: ReactNode }) {
  return <div className="flex gap-1.5">{children}</div>
}

function SalePanel({ p }: { p: SalePropertyCard }) {
  const methodLabel: Record<string, string> = {
    auction: 'Auction',
    private_treaty: 'For Sale',
    expressions_of_interest: 'EOI',
    off_market: 'Off-Market',
  }

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="space-y-1.5">
        <p className="text-xl font-black text-ink tracking-tight leading-tight">{p.priceDisplay}</p>
        {p.title && <p className="text-sm font-bold text-ink leading-tight line-clamp-2">{p.title}</p>}
        <p className="text-xs text-muted leading-snug line-clamp-2">{p.address}</p>
        <DetailMetrics p={p} />
        {p.aiInsight && (
          <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
            <span className="font-bold text-orange">✦ AI: </span>
            {p.aiInsight}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        {(p.auctionDate || p.openHome) && (
          <div className="flex flex-wrap gap-1.5">
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
              {methodLabel[p.saleMethod] ?? p.saleMethod}
            </span>
          </div>
        )}

        <ScoreStrip>
          {[
            { label: 'Schools', val: p.scores.schools, isNum: true },
            { label: 'Safety', val: p.scores.safety, isNum: true },
            { label: 'Lifestyle', val: p.scores.lifestyle, isNum: true },
            { label: 'Growth', val: p.scores.growth, isNum: false },
          ].map(score => (
            <div key={score.label} className="bg-surface border border-subtle rounded-lg px-2 py-1 text-center min-w-[48px]">
              <span
                className={`block text-xs font-black leading-none mb-0.5 ${
                  score.isNum
                    ? scoreColor(score.val as number)
                    : p.scores.growthPos
                      ? 'text-green'
                      : 'text-orange'
                }`}
              >
                {score.val}
              </span>
              <span className="block text-[9px] text-muted">{score.label}</span>
            </div>
          ))}
        </ScoreStrip>
      </div>
    </div>
  )
}

function RentPanel({ p }: { p: RentPropertyCard }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="space-y-1.5">
        <p className="text-xl font-black text-ink tracking-tight">{p.priceDisplay}</p>
        {p.title && <p className="text-sm font-bold text-ink leading-tight line-clamp-2">{p.title}</p>}
        <p className="text-xs text-muted leading-snug line-clamp-2">{p.address}</p>
        <DetailMetrics p={p} />
        {p.aiInsight && (
          <p className="text-[11px] text-muted leading-relaxed line-clamp-2">
            <span className="font-bold text-orange">✦ AI: </span>
            {p.aiInsight}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
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

        <ScoreStrip>
          {[
            { label: 'Schools', val: p.scores.schools },
            { label: 'Safety', val: p.scores.safety },
            { label: 'Lifestyle', val: p.scores.lifestyle },
            { label: 'Value', val: p.scores.valueForMoney },
          ].map(score => (
            <div key={score.label} className="bg-surface border border-subtle rounded-lg px-2 py-1 text-center min-w-[48px]">
              <span className={`block text-xs font-black leading-none mb-0.5 ${scoreColor(score.val)}`}>
                {score.val}
              </span>
              <span className="block text-[9px] text-muted">{score.label}</span>
            </div>
          ))}
        </ScoreStrip>
      </div>
    </div>
  )
}

interface Props {
  property: AnyPropertyCard
  isSaved?: boolean
  layout?: ListingViewportLayout
}

export default function PropertyListingCard({
  property: p,
  isSaved = false,
  layout = DEFAULT_LISTING_VIEWPORT_LAYOUT,
}: Props) {
  const isRent = p.listingType === 'rent'
  const href = `/property/${p.slug}?id=${p.property_id}`
  const style = getCardStyle(layout)

  return (
    <div
      className={`group relative flex bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 ${getCardShellClass(layout)}`}
      style={style}
    >
      <ImageCarousel
        images={p.images}
        address={p.address}
        listingType={p.listingType}
        badgeLabel={p.badge.label}
        badgeColor={p.badge.color}
        propertyId={p.property_id}
        isSaved={isSaved}
        layout={layout}
      />

      <Link href={href} className={`flex-1 min-w-0 overflow-hidden block ${getContentPaddingClass(layout)}`}>
        {isRent ? <RentPanel p={p as RentPropertyCard} /> : <SalePanel p={p as SalePropertyCard} />}
      </Link>
    </div>
  )
}
