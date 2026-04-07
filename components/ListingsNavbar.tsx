'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n, Country } from '@/lib/i18n'

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
export type ListingType = 'buy' | 'rent' | 'sold' | 'new-homes'
interface Props { listingType: ListingType }

// ─────────────────────────────────────────────────────────────────
// Admin-configurable price stops
// In production these would be fetched from an API / CMS.
// ─────────────────────────────────────────────────────────────────
export interface PriceStop { value: number; label: string }

const SALE_PRICE_STOPS: PriceStop[] = [
  { value: 0,          label: 'Any'   },
  { value: 250_000,    label: '$250k' },
  { value: 500_000,    label: '$500k' },
  { value: 750_000,    label: '$750k' },
  { value: 1_000_000,  label: '$1M'   },
  { value: 2_500_000,  label: '$2.5M' },
  { value: 5_000_000,  label: '$5M'   },
  { value: 10_000_000,  label: '$10M'   },
  { value: 20_000_000,  label: '$20M+'  },
]

const RENT_PRICE_STOPS: PriceStop[] = [
  { value: 0,     label: 'Any'    },
  { value: 250,   label: '$250'   },
  { value: 500,   label: '$500'   },
  { value: 750,   label: '$750'   },
  { value: 1_000, label: '$1k'  },  
  { value: 2_500, label: '$2.5k+' },
  { value: 5_000, label: '$5k+' },  
]

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const LISTING_TYPES: { value: ListingType; label: string; icon: string; href: string }[] = [
  { value: 'buy',       label: 'Buy',       icon: '🏷', href: '/buy'       },
  { value: 'rent',      label: 'Rent',      icon: '🔑', href: '/rent'      },
  { value: 'sold',      label: 'Sold',      icon: '✅', href: '/sold'      },
  { value: 'new-homes', label: 'New Homes', icon: '🏗', href: '/new-homes' },
]

const BED_OPTIONS: { label: string; value: string }[] = [
  { label: 'Any', value: '' },
  { label: '1+',  value: '1' },
  { label: '2+',  value: '2' },
  { label: '3+',  value: '3' },
  { label: '4+',  value: '4' },
  { label: '5+',  value: '5' },
]

type BedsMatchMode = 'min' | 'exact'

function normalizeBedValue(raw: string): string {
  const first = raw.split(',')[0] ?? ''
  return /^[1-9]\d*$/.test(first) ? first : ''
}

function normalizeBedsMatch(raw: string | null): BedsMatchMode {
  return raw === 'exact' ? 'exact' : 'min'
}

const PROPERTY_TYPES = [
  'House', 'Apartment', 'Townhouse', 'Villa',
  'Condo', 'Penthouse', 'Studio', 'Acreage', 'Unit', 'Land',
]

// ─────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────
function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, cb])
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

// ─────────────────────────────────────────────────────────────────
// Dual-handle price range slider
// ─────────────────────────────────────────────────────────────────
interface PriceSliderProps {
  stops: PriceStop[]
  minIdx: number
  maxIdx: number
  onMinIdx: (i: number) => void
  onMaxIdx: (i: number) => void
}

function PriceSlider({ stops, minIdx, maxIdx, onMinIdx, onMaxIdx }: PriceSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging  = useRef<'min' | 'max' | null>(null)
  const lastIdx   = stops.length - 1

  function pixelToIdx(clientX: number) {
    if (!trackRef.current) return 0
    const { left, width } = trackRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (clientX - left) / width))
    return Math.round(ratio * lastIdx)
  }

  function startDrag(handle: 'min' | 'max') {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      dragging.current = handle
      function move(ev: MouseEvent | TouchEvent) {
        const x = 'touches' in ev ? ev.touches[0].clientX : ev.clientX
        const idx = pixelToIdx(x)
        if (dragging.current === 'min') onMinIdx(Math.min(idx, maxIdx))
        else                             onMaxIdx(Math.max(idx, minIdx))
      }
      function up() {
        dragging.current = null
        window.removeEventListener('mousemove', move)
        window.removeEventListener('touchmove', move)
        window.removeEventListener('mouseup', up)
        window.removeEventListener('touchend', up)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('touchmove', move, { passive: false })
      window.addEventListener('mouseup', up)
      window.addEventListener('touchend', up)
    }
  }

  const minPct = (minIdx / lastIdx) * 100
  const maxPct = (maxIdx / lastIdx) * 100

  const thumbCls = [
    'absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-teal',
    'shadow-card cursor-grab active:cursor-grabbing',
    'transition-shadow hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-teal/40',
    'z-10',
  ].join(' ')

  return (
    <div className="px-2 pb-2">
      {/* Range display */}
      <div className="flex items-center justify-between mb-5">
        <div className="bg-surface border border-subtle rounded-xl px-3 py-1.5 text-sm font-bold text-ink min-w-[80px] text-center">
          {minIdx === 0 ? 'Any' : stops[minIdx].label}
        </div>
        <div className="flex-1 h-px bg-subtle mx-3" />
        <div className="bg-surface border border-subtle rounded-xl px-3 py-1.5 text-sm font-bold text-ink min-w-[80px] text-center">
          {maxIdx === lastIdx ? 'Any' : stops[maxIdx].label}
        </div>
      </div>

      {/* Track */}
      <div ref={trackRef} className="relative h-1.5 rounded-full bg-subtle mx-2.5 my-4">
        {/* Filled range */}
        <div
          className="absolute h-full rounded-full"
          style={{
            left:  `${minPct}%`,
            right: `${100 - maxPct}%`,
            background: 'linear-gradient(90deg,#20D3B3,#3B82F6)',
          }}
        />
        {/* Min thumb */}
        <div
          className={thumbCls}
          style={{ left: `${minPct}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={startDrag('min')}
          onTouchStart={startDrag('min')}
          role="slider" aria-label="Minimum price"
          aria-valuemin={0} aria-valuemax={maxIdx} aria-valuenow={minIdx}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft')  onMinIdx(Math.max(0, minIdx - 1))
            if (e.key === 'ArrowRight') onMinIdx(Math.min(maxIdx, minIdx + 1))
          }}
        />
        {/* Max thumb */}
        <div
          className={thumbCls}
          style={{ left: `${maxPct}%`, transform: 'translate(-50%, -50%)' }}
          onMouseDown={startDrag('max')}
          onTouchStart={startDrag('max')}
          role="slider" aria-label="Maximum price"
          aria-valuemin={minIdx} aria-valuemax={lastIdx} aria-valuenow={maxIdx}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowLeft')  onMaxIdx(Math.max(minIdx, maxIdx - 1))
            if (e.key === 'ArrowRight') onMaxIdx(Math.min(lastIdx, maxIdx + 1))
          }}
        />
      </div>

      {/* Stop tick labels — show every other to avoid crowding */}
      <div className="flex justify-between mt-2 px-0">
        {stops.map((s, i) => {
          const showLabel = i === 0 || i === lastIdx || i % 2 === 0
          return (
            <button
              key={i}
              onClick={() => {
                const dMin = Math.abs(i - minIdx)
                const dMax = Math.abs(i - maxIdx)
                if (dMin <= dMax) onMinIdx(Math.min(i, maxIdx))
                else              onMaxIdx(Math.max(i, minIdx))
              }}
              className={`text-[10px] font-semibold transition-colors ${showLabel ? '' : 'opacity-0 pointer-events-none'} ${i >= minIdx && i <= maxIdx ? 'text-teal' : 'text-muted hover:text-ink'}`}
            >
              {s.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Bedroom multi-select button group
// ─────────────────────────────────────────────────────────────────
interface BedsGroupProps {
  selected: string
  mode: BedsMatchMode
  onSelect: (val: string) => void
}

function BedsButtonGroup({ selected, mode, onSelect }: BedsGroupProps) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-subtle">
      {BED_OPTIONS.map((opt, i) => {
        const isAny = opt.value === ''
        const isSelected = isAny ? !selected : selected === opt.value
        const label = isAny ? opt.label : (mode === 'exact' ? opt.value : `${opt.value}+`)
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={[
              'flex-1 py-2.5 text-sm font-bold transition-colors',
              i > 0 ? 'border-l border-subtle' : '',
              isSelected
                ? 'bg-ink text-white'
                : 'bg-white text-muted hover:bg-surface hover:text-ink',
            ].join(' ')}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Filter pill dropdown wrapper
// ─────────────────────────────────────────────────────────────────
interface DropdownProps {
  label: string; active?: boolean
  children: React.ReactNode; width?: string; alignRight?: boolean
}

function FilterDropdown({ label, active, children, width = 'w-64', alignRight = false }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOutsideClick(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 whitespace-nowrap ${
          active
            ? 'border-ink text-ink bg-white shadow-sm'
            : 'border-subtle text-ink hover:border-ink/40 bg-white hover:bg-surface'
        }`}
      >
        {label}
        <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} text-muted`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className={`absolute top-full mt-2 ${width} ${alignRight ? 'right-0' : 'left-0'} bg-white border border-subtle rounded-2xl shadow-float p-4 z-50 animate-fadeIn`}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Full filters panel — rendered via React portal at <body> level
// Bug #1 fix: panel is no longer a child of <header> or any page element
// ─────────────────────────────────────────────────────────────────
interface FiltersPanelProps {
  open: boolean
  onClose: () => void
  listingType: ListingType
  searchParams: ReturnType<typeof useSearchParams>
  onApply: (updates: Record<string, string>) => void
  anchorRef: React.RefObject<HTMLButtonElement>
}

function FiltersPanel({ open, onClose, listingType, searchParams, onApply, anchorRef }: FiltersPanelProps) {
  const priceStops = listingType === 'rent' ? RENT_PRICE_STOPS : SALE_PRICE_STOPS
  const lastIdx    = priceStops.length - 1

  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 420 })
  const [ready, setReady] = useState(false)

  const updatePosition = useCallback(() => {
    if (!anchorRef?.current) return
    const buttonRect = anchorRef.current.getBoundingClientRect()
    const panelWidth = 420

    let left = buttonRect.left
    const rightOverflow = left + panelWidth - window.innerWidth + 12
    if (rightOverflow > 0) left -= rightOverflow
    left = Math.max(12, left)

    let top = buttonRect.bottom + 8
    const availableBelow = window.innerHeight - top
    if (availableBelow < 320) {
      const candidateTop = buttonRect.top - 8 - 440
      top = Math.max(12, candidateTop)
    }

    setPanelPos({ top, left, width: panelWidth })
    setReady(true)
  }, [anchorRef])

  useEffect(() => {
    if (!open) {
      setReady(false)
      return
    }

    const loop = () => {
      updatePosition()
      rafId = requestAnimationFrame(loop)
    }

    let rafId = requestAnimationFrame(loop)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [open, updatePosition])


  // Helpers: convert URL string ↔ stop index
  function urlToMinIdx(raw: string) {
    const val = Number(raw)
    if (!val) return 0
    const i = priceStops.findIndex(s => s.value >= val)
    return i === -1 ? 0 : i
  }
  function urlToMaxIdx(raw: string) {
    const val = Number(raw)
    if (!val) return lastIdx
    for (let i = lastIdx; i >= 0; i--) {
      if (priceStops[i].value <= val) return i
    }
    return lastIdx
  }

  // Draft state — nothing applied until "Apply" is pressed
  const [draftMinIdx,   setDraftMinIdx]   = useState(() => urlToMinIdx(searchParams.get('minPrice') || ''))
  const [draftMaxIdx,   setDraftMaxIdx]   = useState(() => urlToMaxIdx(searchParams.get('maxPrice') || ''))
  const [draftBeds,     setDraftBeds]     = useState<string>(
    () => normalizeBedValue(searchParams.get('beds') || '')
  )
  const [draftBedsMode, setDraftBedsMode] = useState<BedsMatchMode>(
    () => normalizeBedsMatch(searchParams.get('bedsMatch'))
  )
  const [draftTypes,    setDraftTypes]    = useState<string[]>(
    searchParams.get('types') ? searchParams.get('types')!.split(',') : []
  )
  const [nearbySuburbs, setNearbySuburbs] = useState(false)

  // Re-sync draft whenever panel opens
  useEffect(() => {
    if (!open) return
    setDraftMinIdx(urlToMinIdx(searchParams.get('minPrice') || ''))
    setDraftMaxIdx(urlToMaxIdx(searchParams.get('maxPrice') || ''))
    setDraftBeds(normalizeBedValue(searchParams.get('beds') || ''))
    setDraftBedsMode(normalizeBedsMatch(searchParams.get('bedsMatch')))
    setDraftTypes(searchParams.get('types') ? searchParams.get('types')!.split(',') : [])
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function selectBed(val: string) {
    setDraftBeds(val)
  }

  function toggleType(type: string) {
    setDraftTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  function handleApply() {
    onApply({
      minPrice: draftMinIdx === 0       ? '' : String(priceStops[draftMinIdx].value),
      maxPrice: draftMaxIdx === lastIdx ? '' : String(priceStops[draftMaxIdx].value),
      beds: draftBeds,
      bedsMatch: draftBeds && draftBedsMode === 'exact' ? 'exact' : '',
      types:    draftTypes.join(','),
    })
    onClose()
  }

  function handleReset() {
    setDraftMinIdx(0)
    setDraftMaxIdx(lastIdx)
    setDraftBeds('')
    setDraftBedsMode('min')
    setDraftTypes([])
    setNearbySuburbs(false)
  }

  // Outside-click: register only while open; rAF skips the opening click itself
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function handle(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const t = requestAnimationFrame(() =>
      document.addEventListener('pointerdown', handle)
    )
    return () => {
      cancelAnimationFrame(t)
      document.removeEventListener('pointerdown', handle)
    }
  }, [open, onClose])

  if (!open) return null

  const content = (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Property filters"
        className="fixed max-h-[calc(100vh-120px)] overflow-hidden bg-white border border-subtle rounded-2xl shadow-float z-50"
        style={{
          position: 'fixed',
          top: panelPos.top,
          left: panelPos.left,
          width: panelPos.width,
          visibility: ready ? 'visible' : 'hidden',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.15s ease',
          padding: '10px 20px'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-subtle flex-shrink-0">
          <h2 className="text-base font-black text-ink">Filters</h2>
          <div className="flex items-center gap-3">
            <button onClick={handleReset}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-subtle text-ink hover:bg-surface transition-colors"
              style={{ width: '200px'}}>
              Reset
            </button>
            <button onClick={onClose} aria-label="Close filters"
              className="w-8 h-8 rounded-full border border-subtle flex items-center justify-center text-muted hover:text-ink hover:border-ink/40 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-subtle" style={{ padding: '20px 0'}}>
          {/* Bedrooms multi-select — Bug #2 fix */}
          <div className="px-6 py-5" style={{ padding: '10px 0'}}>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12h18M3 18V9a3 3 0 013-3h12a3 3 0 013 3v9" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 18h18" />
              </svg>
              <p className="text-sm font-bold text-ink">Bedrooms</p>
              {draftBeds && (
                <span className="ml-auto text-xs text-teal font-semibold">
                  {draftBedsMode === 'exact' ? `${draftBeds} only` : `${draftBeds}+`}
                </span>
              )}
            </div>
            <div className="mb-2 grid grid-cols-2 gap-1.5">
              {(['min', 'exact'] as BedsMatchMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setDraftBedsMode(mode)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    draftBedsMode === mode ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'
                  }`}
                >
                  {mode === 'min' ? 'Minimum (1+)' : 'Exact only'}
                </button>
              ))}
            </div>
            <BedsButtonGroup selected={draftBeds} mode={draftBedsMode} onSelect={selectBed} />
            <p className="text-xs text-muted mt-2">
              {draftBedsMode === 'exact' ? 'Matches only the exact bedroom count' : 'Matches this count or more'}
            </p>
          </div>
          {/* Property types */}
          <div className="px-6 py-5" style={{ padding: '20px 0'}}>
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} points="9 22 9 12 15 12 15 22" />
              </svg>
              <p className="text-sm font-bold text-ink">Property Types</p>
            </div>
            {/* All */}
            <button onClick={() => setDraftTypes([])}
              className={`flex items-center gap-3 w-full py-2 px-2 rounded-xl mb-0.5 transition-colors ${draftTypes.length === 0 ? 'text-ink' : 'text-muted hover:text-ink hover:bg-surface'}`}>
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${draftTypes.length === 0 ? 'bg-teal border-teal' : 'border-subtle'}`}>
                {draftTypes.length === 0 && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-semibold">All</span>
            </button>
            {PROPERTY_TYPES.map(type => {
              const selected = draftTypes.includes(type)
              return (
                <button key={type} onClick={() => toggleType(type)}
                  className={`flex items-center gap-3 w-full py-2 px-2 rounded-xl transition-colors ${selected ? 'text-ink' : 'text-muted hover:text-ink hover:bg-surface'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'bg-teal border-teal' : 'border-subtle'}`}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold">{type}</span>
                </button>
              )
            })}
          </div>

          {/* Price range slider — Bug #3 fix */}
          <div className="px-6 py-5" style={{ padding: '20px 0 10px 0'}}>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-4 h-4 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={1.8} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v2m0 8v2M9 12h6" />
              </svg>
              <p className="text-sm font-bold text-ink">
                {listingType === 'rent' ? 'Weekly Rent Inputs' : 'Price Inputs'}
              </p>
            </div>
            <PriceSlider
              stops={priceStops}
              minIdx={draftMinIdx}
              maxIdx={draftMaxIdx}
              onMinIdx={setDraftMinIdx}
              onMaxIdx={setDraftMaxIdx}
            />
          </div>          
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-subtle flex-shrink-0" style={{ padding: '20px 0'}}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-subtle text-ink hover:bg-surface transition-colors">
            Cancel
          </button>
          <button onClick={handleApply}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-glow"
            style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
            Apply
          </button>
        </div>
      </div>
    </>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}


// ─────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────
export default function ListingsNavbar({ listingType }: Props) {
  const { user, logout }        = useAuth()
  const router                  = useRouter()
  const searchParams            = useSearchParams()
  const { country, setCountry } = useI18n()
  const countries: Country[]    = ['Australia', 'Thailand', 'Philippines']
  const scrolled                = useScrolled()

  const [userMenuOpen,     setUserMenuOpen]     = useState(false)
  const [filtersPanelOpen, setFiltersPanelOpen] = useState(false)
  const [searchQuery,      setSearchQuery]      = useState(searchParams.get('q') || '')
  const closeFiltersPanel = useCallback(() => setFiltersPanelOpen(false), [])

  const userMenuRef = useRef<HTMLDivElement>(null)
  const allFiltersButtonRef = useRef<HTMLButtonElement>(null)
  useOutsideClick(userMenuRef, () => setUserMenuOpen(false))

  const initials   = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : ''
  const basePath   = `/${listingType}`
  const priceStops = listingType === 'rent' ? RENT_PRICE_STOPS : SALE_PRICE_STOPS

  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentBeds     = normalizeBedValue(searchParams.get('beds') || '')
  const currentBedsMode = normalizeBedsMatch(searchParams.get('bedsMatch'))
  const currentTypes    = useMemo(() =>
    searchParams.get('types') ? searchParams.get('types')!.split(',') : [],
    [searchParams]
  )

  const pushFilter = useCallback((updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    p.set('page', '1')
    router.push(`${basePath}?${p.toString()}`)
  }, [searchParams, router, basePath])

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault()
    const p = new URLSearchParams(searchParams.toString())
    if (searchQuery.trim()) p.set('q', searchQuery.trim()); else p.delete('q')
    p.set('page', '1')
    router.push(`${basePath}?${p.toString()}`)
  }

  function handleCountryChange(newCountry: Country) {
    setCountry(newCountry)
    const p = new URLSearchParams(searchParams.toString())
    p.set('country', newCountry)
    p.set('page', '1')
    router.push(`${basePath}?${p.toString()}`)
  }

  async function handleLogout() { await logout(); router.push('/') }

  // Active labels
  const priceActive = !!(currentMinPrice || currentMaxPrice)
  const bedsActive  = !!currentBeds
  const typesActive = currentTypes.length > 0

  const priceLabel = useMemo(() => {
    if (!priceActive) return 'Price'
    const min = priceStops.find(s => String(s.value) === currentMinPrice)?.label
    const max = priceStops.find(s => String(s.value) === currentMaxPrice)?.label
    if (min && max) return `${min} – ${max}`
    if (min) return `From ${min}`
    if (max) return `Up to ${max}`
    return 'Price'
  }, [priceActive, currentMinPrice, currentMaxPrice, priceStops])

  const bedsLabel = bedsActive
    ? currentBedsMode === 'exact'
      ? `${currentBeds} only`
      : `${currentBeds}+ beds`
    : 'Beds'

  const typesLabel = typesActive
    ? (currentTypes.length === 1 ? currentTypes[0] : `${currentTypes.length} types`)
    : 'Property types'

  const currentListing = LISTING_TYPES.find(l => l.value === listingType)!

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-subtle">

        {/* ── Level 1: Logo + auth (collapses on scroll) ─────── */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: scrolled ? '0px' : '68px', opacity: scrolled ? 0 : 1 }}
          aria-hidden={scrolled}
        >
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 flex items-center justify-between h-[68px]">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.svg" alt="Prop.AI" width={180} height={53} priority />
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <select value={country} onChange={e => handleCountryChange(e.target.value as Country)}
                className="text-sm bg-bg border border-subtle rounded-xl px-3 py-1.5 text-ink outline-none font-medium hover:border-ink/40 transition-colors">
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 hover:bg-surface px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-subtle">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                      {initials}
                    </div>
                    <span className="text-sm font-semibold text-ink">{user.first_name}</span>
                    <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-subtle shadow-float py-1.5 animate-fadeIn">
                      <div className="px-4 py-2.5 border-b border-subtle">
                        <p className="text-xs font-bold text-ink">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-muted truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-ink hover:bg-surface transition-colors">
                        My dashboard
                      </Link>
                      <div className="border-t border-subtle mt-1 pt-1">
                        <button onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/sign-in" className="text-sm font-semibold text-ink2 hover:text-ink transition-colors">
                    Sign in
                  </Link>
                  <Link href="/auth/register"
                    className="text-sm font-semibold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 hover:shadow-glow"
                    style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                    Join free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Divider — fades out when scrolled */}
        <div className="border-t border-subtle transition-opacity duration-300"
          style={{ opacity: scrolled ? 0 : 1 }} />

        {/* ── Level 2: Search + filter pills (always visible) ── */}
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-14 flex items-center gap-3">

          {/* Natural language search */}
          <form onSubmit={handleSearch}
            className="flex items-center flex-1 min-w-0 max-w-md bg-surface border border-subtle rounded-full overflow-hidden transition-all focus-within:border-ink/40 focus-within:shadow-card">
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Try a location, suburb or school…"
              className="flex-1 min-w-0 px-4 py-2 text-sm text-ink bg-transparent outline-none placeholder:text-muted/60" />
            <button type="submit"
              className="flex-shrink-0 w-9 h-9 m-0.5 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 hover:shadow-glow"
              style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6)' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>

          {/* All-filters trigger */}
          <button ref={allFiltersButtonRef} onClick={e => { e.stopPropagation(); setFiltersPanelOpen(true) }}
            className="w-9 h-9 flex-shrink-0 rounded-full border border-subtle flex items-center justify-center text-muted hover:text-ink hover:border-ink/40 transition-colors"
            title="All filters">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
            </svg>
          </button>

          <div className="h-6 w-px bg-subtle flex-shrink-0" />

          {/* Listing type */}
          <FilterDropdown label={currentListing.label} active width="w-52">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Listing type</p>
            <div className="space-y-1">
              {LISTING_TYPES.map(lt => (
                <Link key={lt.value} href={lt.href}
                  className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    lt.value === listingType ? 'bg-ink text-white' : 'text-muted hover:text-ink hover:bg-surface'
                  }`}>
                  <span>{lt.icon}</span> {lt.label}
                </Link>
              ))}
            </div>
          </FilterDropdown>

          {/* Price */}
          <FilterDropdown label={priceLabel} active={priceActive} width="w-72">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">
              {listingType === 'rent' ? 'Weekly rent inputs' : 'Price inputs'}
            </p>
            <PriceSlider
              stops={priceStops}
              minIdx={(() => {
                const v = Number(currentMinPrice)
                if (!v) return 0
                const i = priceStops.findIndex(s => s.value >= v)
                return i === -1 ? 0 : i
              })()}
              maxIdx={(() => {
                const v = Number(currentMaxPrice)
                if (!v) return priceStops.length - 1
                for (let i = priceStops.length - 1; i >= 0; i--) {
                  if (priceStops[i].value <= v) return i
                }
                return priceStops.length - 1
              })()}
              onMinIdx={idx => pushFilter({ minPrice: idx === 0 ? '' : String(priceStops[idx].value) })}
              onMaxIdx={idx => pushFilter({ maxPrice: idx === priceStops.length - 1 ? '' : String(priceStops[idx].value) })}
            />
          </FilterDropdown>

          {/* Beds */}
          <FilterDropdown label={bedsLabel} active={bedsActive} width="w-64">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Bedrooms</p>
            <div className="mb-2 grid grid-cols-2 gap-1.5">
              {(['min', 'exact'] as BedsMatchMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => {
                    if (!currentBeds) return
                    pushFilter({ bedsMatch: mode === 'exact' ? 'exact' : '' })
                  }}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    currentBedsMode === mode ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'
                  }`}
                >
                  {mode === 'min' ? 'Minimum (1+)' : 'Exact only'}
                </button>
              ))}
            </div>
            <BedsButtonGroup
              selected={currentBeds}
              mode={currentBedsMode}
              onSelect={val => {
                if (val === '') {
                  pushFilter({ beds: '', bedsMatch: '' })
                  return
                }
                pushFilter({
                  beds: val,
                  bedsMatch: currentBedsMode === 'exact' ? 'exact' : '',
                })
              }}
            />
            <p className="text-xs text-muted mt-2">
              {currentBedsMode === 'exact' ? 'Matches only the exact bedroom count' : 'Matches this count or more'}
            </p>
          </FilterDropdown>

          {/* Property types */}
          <FilterDropdown label={typesLabel} active={typesActive} width="w-64" alignRight>
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Property type</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PROPERTY_TYPES.map(type => {
                const selected = currentTypes.includes(type)
                return (
                  <button key={type}
                    onClick={() => {
                      const next = selected
                        ? currentTypes.filter(t => t !== type)
                        : [...currentTypes, type]
                      pushFilter({ types: next.join(',') })
                    }}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold text-left transition-colors ${
                      selected ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'
                    }`}>
                    {selected ? '✓ ' : ''}{type}
                  </button>
                )
              })}
            </div>
            {typesActive && (
              <button onClick={() => pushFilter({ types: '' })}
                className="mt-3 w-full text-xs text-muted hover:text-red-500 transition-colors text-center">
                Clear types
              </button>
            )}
          </FilterDropdown>
        </div>
      </header>

      {/* Portal-rendered filter panel — lives at <body>, not inside <header> */}
      <FiltersPanel
        open={filtersPanelOpen}
        onClose={closeFiltersPanel}
        listingType={listingType}
        searchParams={searchParams}
        onApply={pushFilter}
        anchorRef={allFiltersButtonRef}
      />
    </>
  )
}
