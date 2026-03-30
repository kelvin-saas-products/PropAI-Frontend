'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useI18n, Country } from '@/lib/i18n'

// ── Shared helpers ──────────────────────────────────────────────────

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, cb: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, cb])
}

interface DropdownProps {
  label: string
  active?: boolean
  children: React.ReactNode
  width?: string
}

function FilterDropdown({ label, active, children, width = 'w-64' }: DropdownProps) {
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
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''} text-muted`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className={`absolute top-full left-0 mt-2 ${width} bg-white border border-subtle rounded-2xl shadow-float p-4 z-50 animate-fadeIn`}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Price options ───────────────────────────────────────────────────

const PRICE_RANGES = [
  { label: 'Any price', min: '', max: '' },
  { label: 'Under $500k', min: '', max: '500000' },
  { label: '$500k – $750k', min: '500000', max: '750000' },
  { label: '$750k – $1M', min: '750000', max: '1000000' },
  { label: '$1M – $1.5M', min: '1000000', max: '1500000' },
  { label: '$1.5M – $2M', min: '1500000', max: '2000000' },
  { label: '$2M – $3M', min: '2000000', max: '3000000' },
  { label: 'Over $3M', min: '3000000', max: '' },
]

const BED_OPTIONS = ['Any', '1+', '2+', '3+', '4+', '5+']

const PROPERTY_TYPES = ['House', 'Apartment', 'Townhouse', 'Villa', 'Condo', 'Penthouse', 'Acreage', 'Unit']

// ── Main component ──────────────────────────────────────────────────

export default function BuyNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { country, setCountry, t } = useI18n()
  const countries: Country[] = ['Australia', 'Thailand', 'Philippines']
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  useOutsideClick(userMenuRef, () => setUserMenuOpen(false))
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : ''

  // Read current filter values from URL
  const currentMinPrice = searchParams.get('minPrice') || ''
  const currentMaxPrice = searchParams.get('maxPrice') || ''
  const currentBeds     = searchParams.get('beds') || ''
  const currentTypes    = searchParams.get('types') ? searchParams.get('types')!.split(',') : []

  const pushFilter = useCallback((updates: Record<string, string>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    router.push(`/buy?${p.toString()}`)
  }, [searchParams, router])

  // Build active labels
  const priceActive  = !!(currentMinPrice || currentMaxPrice)
  const bedsActive   = !!currentBeds
  const typesActive  = currentTypes.length > 0

  const priceLabel = priceActive
    ? PRICE_RANGES.find(r => r.min === currentMinPrice && r.max === currentMaxPrice)?.label ?? 'Price'
    : 'Price'

  const bedsLabel  = bedsActive ? `${currentBeds} beds` : 'Beds'
  const typesLabel = typesActive
    ? (currentTypes.length === 1 ? currentTypes[0] : `${currentTypes.length} types`)
    : 'Property types'

  function toggleType(type: string) {
    const next = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]
    pushFilter({ types: next.join(',') })
  }

  // When user picks a country: persist to i18n (→ localStorage), push to URL
  function handleCountryChange(newCountry: Country) {
    setCountry(newCountry)
    const p = new URLSearchParams(searchParams.toString())
    p.set('country', newCountry)
    p.set('page', '1')          // reset to first page on country switch
    router.push(`/buy?${p.toString()}`)
  }

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-subtle">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/logo.svg" alt="Prop.AI" width={110} height={32} priority />
        </Link>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-1 justify-center flex-wrap">

          {/* Search icon button */}
          <button
            onClick={() => router.push('/buy')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6)' }}
            title="Search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </button>

          {/* Filters icon */}
          <button
            className="w-9 h-9 rounded-full border border-subtle flex items-center justify-center text-muted hover:text-ink hover:border-ink/40 transition-colors flex-shrink-0"
            title="All filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4"/>
            </svg>
          </button>

          {/* Buy dropdown – always active/selected */}
          <FilterDropdown label="Buy" active width="w-48">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Listing type</p>
            {['Buy', 'Rent'].map(opt => (
              <Link
                key={opt}
                href={opt === 'Buy' ? '/buy' : '/rent'}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  opt === 'Buy' ? 'bg-ink text-white' : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {opt === 'Buy' ? '🏷' : '🔑'} {opt}
              </Link>
            ))}
          </FilterDropdown>

          {/* Price */}
          <FilterDropdown label={priceLabel} active={priceActive} width="w-56">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Price range</p>
            <div className="space-y-1">
              {PRICE_RANGES.map(r => {
                const isSelected = r.min === currentMinPrice && r.max === currentMaxPrice
                return (
                  <button
                    key={r.label}
                    onClick={() => pushFilter({ minPrice: r.min, maxPrice: r.max })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      isSelected ? 'bg-ink text-white font-semibold' : 'text-muted hover:text-ink hover:bg-surface'
                    }`}
                  >
                    {r.label}
                  </button>
                )
              })}
            </div>
          </FilterDropdown>

          {/* Beds */}
          <FilterDropdown label={bedsLabel} active={bedsActive} width="w-48">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Bedrooms</p>
            <div className="grid grid-cols-3 gap-1.5">
              {BED_OPTIONS.map(opt => {
                const val = opt === 'Any' ? '' : opt.replace('+', '')
                const isSelected = opt === 'Any' ? !currentBeds : currentBeds === val
                return (
                  <button
                    key={opt}
                    onClick={() => pushFilter({ beds: val })}
                    className={`px-2 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isSelected ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </FilterDropdown>

          {/* Property types */}
          <FilterDropdown label={typesLabel} active={typesActive} width="w-64">
            <p className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Property type</p>
            <div className="grid grid-cols-2 gap-1.5">
              {PROPERTY_TYPES.map(type => {
                const isSelected = currentTypes.includes(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold text-left transition-colors ${
                      isSelected ? 'bg-ink text-white' : 'bg-surface text-muted hover:text-ink'
                    }`}
                  >
                    {isSelected ? '✓ ' : ''}{type}
                  </button>
                )
              })}
            </div>
            {typesActive && (
              <button
                onClick={() => pushFilter({ types: '' })}
                className="mt-3 w-full text-xs text-muted hover:text-red-500 transition-colors text-center"
              >
                Clear types
              </button>
            )}
          </FilterDropdown>
        </div>

        {/* Right: auth + country */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">

          {/* Country selector */}
          <select
            value={country}
            onChange={e => handleCountryChange(e.target.value as Country)}
            className="text-sm bg-bg border border-subtle rounded-md px-2 py-1 text-ink outline-none"
          >
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 hover:bg-surface px-3 py-1.5 rounded-xl transition-colors border border-transparent hover:border-subtle"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
                >
                  {initials}
                </div>
                <span className="text-sm font-semibold text-ink">{user.first_name}</span>
                <svg className="w-3.5 h-3.5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
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
              <Link href="/auth/sign-in"
                className="text-sm font-semibold text-ink2 hover:text-ink transition-colors">
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
    </header>
  )
}
