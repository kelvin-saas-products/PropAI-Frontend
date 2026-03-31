'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PropertyListingCard from './PropertyListingCard'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import PaginationBar, { PAGE_SIZE_OPTIONS, type PageSize } from './PaginationBar'
import { getProperties } from '@/lib/api'
import { getSavedPropertyIds } from '@/lib/auth'
import type { PaginatedProperties } from '@/lib/api'
import type { RentPropertyCard } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/context/AuthContext'

// ── Sort options ──────────────────────────────────────────────────
type SortKey = 'price_asc' | 'price_desc' | 'newest'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price_asc',  label: 'Rent (low to high)' },
  { value: 'price_desc', label: 'Rent (high to low)' },
  { value: 'newest',     label: 'Newest' },
]

// ── Ad sidebar ────────────────────────────────────────────────────
function AdSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[300px] flex-shrink-0">
      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-subtle">
        <div className="bg-gradient-to-r from-teal to-blue px-4 py-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Sponsored</span>
        </div>
        <div className="p-4">
          <div className="w-full h-32 bg-surface rounded-xl mb-3 flex items-center justify-center text-3xl">🔑</div>
          <p className="text-sm font-bold text-ink mb-1">Your Ad Here</p>
          <p className="text-xs text-muted leading-relaxed">Promote your rental to thousands of qualified tenants.</p>
          <button className="mt-3 w-full text-xs font-semibold text-teal border border-teal/30 rounded-xl py-2 hover:bg-teal/5 transition-colors">
            Advertise with us →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-subtle">
        <div className="bg-gradient-to-r from-violet to-blue px-4 py-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">Suburb Spotlight</span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { suburb: 'Newtown, NSW',      rent: '$650/wk',  trend: '↑ High demand' },
            { suburb: 'Sukhumvit, BKK',    rent: '฿18,000/mo', trend: '↑ Popular expat' },
            { suburb: 'Makati, Manila',    rent: '₱32,000/mo', trend: '↑ Prime CBD'   },
          ].map(s => (
            <div key={s.suburb} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-ink">{s.suburb}</p>
                <p className="text-[11px] text-muted">{s.rent} median</p>
              </div>
              <span className="text-[11px] font-bold text-teal">{s.trend}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-2xl p-4 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}
      >
        <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">New Feature</p>
        <p className="text-sm font-black mb-2 leading-snug">AI Rental Match is live</p>
        <p className="text-[11px] opacity-80 leading-relaxed mb-3">
          Get personalised rental scores based on your commute, lifestyle and budget.
        </p>
        <button className="text-[11px] font-bold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full">
          Try it free →
        </button>
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -top-4 -right-8 w-20 h-20 bg-white/10 rounded-full" />
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-subtle p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Open Inspections · This Weekend</p>
        <div className="space-y-2.5">
          {[
            { time: 'Sat 10:00–10:30 AM', address: '12 King St, Newtown'         },
            { time: 'Sat 11:00–11:30 AM', address: '8/34 Oxford St, Paddington'  },
            { time: 'Sun 1:00–1:30 PM',   address: '203 Flinders Ln, Melbourne'  },
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

// ── Mock fallback (rent) ──────────────────────────────────────────
const MOCK_RENT_CARD: RentPropertyCard = {
  property_id: 'mock-rent-1',
  slug: '12-king-street-newtown',
  listingType: 'rent',
  title: 'Stylish Inner-City Apartment',
  address: '12 King Street, Newtown, Sydney NSW 2042',
  suburb: 'Newtown', state: 'NSW', postcode: '2042', country: 'Australia',
  beds: 2, baths: 1, cars: 1, land: '',
  weeklyRent: '$650/wk', weeklyRentRaw: 650,
  availableFrom: '2025-02-01',
  furnished: false,
  petsAllowed: null,
  badge: { label: 'New listing', color: 'teal' },
  aiMatch: 87,
  aiInsight: 'Great value in a highly walkable suburb with excellent transport links.',
  images: [],
  featured: false,
  priceDisplay: '$650/wk',
  priceSort: 650,
  scores: { schools: 78, safety: 72, lifestyle: 92, valueForMoney: 85 },
}

const MOCK_RESULT: PaginatedProperties = {
  page: 1, page_size: 25, total: 1, total_pages: 1,
  items: [MOCK_RENT_CARD],
}

// ── Main component ────────────────────────────────────────────────
export default function RentPageClient() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { country: i18nCountry, countryReady } = useI18n()
  const { user, accessToken } = useAuth()

  // URL-driven state
  const urlCountry  = searchParams.get('country') ?? ''
  const minPrice    = Number(searchParams.get('minPrice')  || 0)
  const maxPrice    = Number(searchParams.get('maxPrice')  || 0)
  const minBeds     = Number(searchParams.get('beds')      || 0)
  const urlPage     = Math.max(1, Number(searchParams.get('page') || 1))
  const urlPageSize = (PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('pageSize')) as PageSize)
    ? Number(searchParams.get('pageSize'))
    : 25) as PageSize
  const urlSort     = (searchParams.get('sort') as SortKey) || 'newest'

  // Sync IP/saved country into URL on first load
  useEffect(() => {
    if (!countryReady) return
    if (!urlCountry && i18nCountry) {
      const p = new URLSearchParams(searchParams.toString())
      p.set('country', i18nCountry)
      p.set('page', '1')
      router.replace(`/rent?${p.toString()}`)
    }
  }, [countryReady, i18nCountry, urlCountry]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeCountry = urlCountry || i18nCountry

  // ── Data fetching ───────────────────────────────────────────────
  const [data,     setData]     = useState<PaginatedProperties | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  // Fetch saved IDs when user logs in
  useEffect(() => {
    if (!user || !accessToken) { setSavedIds(new Set()); return }
    getSavedPropertyIds(accessToken)
      .then(ids => setSavedIds(new Set(ids)))
      .catch(() => {})
  }, [user, accessToken])

  const fetchPage = useCallback(async () => {
    if (!countryReady) return
    setLoading(true)
    setError(null)
    try {
      const result = await getProperties({
        listingType: 'rent',
        country:    activeCountry,
        beds:       minBeds   || undefined,
        min_price:  minPrice  || undefined,
        max_price:  maxPrice  || undefined,
        sort_by:    urlSort,
        page:       urlPage,
        page_size:  urlPageSize,
      })
      setData(result)
    } catch (err) {
      console.error('Rent fetch failed:', err)
      setData(MOCK_RESULT)
      setError('Could not reach the API — showing sample data.')
    } finally {
      setLoading(false)
    }
  }, [activeCountry, minBeds, minPrice, maxPrice, urlPage, urlPageSize, urlSort, countryReady])

  useEffect(() => { fetchPage() }, [fetchPage])

  // ── URL helpers ─────────────────────────────────────────────────
  const pushParams = useCallback((updates: Record<string, string | number>) => {
    const p = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => {
      if (v !== '' && v !== 0) p.set(k, String(v)); else p.delete(k)
    })
    router.push(`/rent?${p.toString()}`)
  }, [searchParams, router])

  const handlePageChange     = (p: number)   => pushParams({ page: p })
  const handlePageSizeChange = (s: PageSize) => pushParams({ pageSize: s, page: 1 })
  const handleSortChange     = (s: SortKey)  => pushParams({ sort: s, page: 1 })

  const items = data?.items ?? []

  // ── Breadcrumbs ─────────────────────────────────────────────────
  const anyFiltersActive = !!(minPrice || maxPrice || minBeds)
  const breadcrumbs = useMemo(() => {
    const crumbs: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Rent', href: '/rent' },
      { label: `Properties for Rent in ${activeCountry}` },
    ]
    if (anyFiltersActive) {
      const parts: string[] = []
      if (minBeds) parts.push(`${minBeds}+ beds`)
      if (minPrice && maxPrice) parts.push(`$${minPrice}/wk – $${maxPrice}/wk`)
      else if (minPrice) parts.push(`Over $${minPrice}/wk`)
      else if (maxPrice) parts.push(`Under $${maxPrice}/wk`)
      if (parts.length) crumbs.push({ label: parts.join(' · ') })
    }
    return crumbs
  }, [activeCountry, anyFiltersActive, minBeds, minPrice, maxPrice])

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      {/* ── Main content ─────────────────────────────────────── */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-5 lg:px-8 py-2">
        <Breadcrumb items={breadcrumbs} />

        {/* Results header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-ink tracking-tight">
              Properties for rent <span className="text-teal">in {activeCountry}</span>
            </h1>
            {error && <p className="text-xs text-orange mt-0.5">⚠ {error}</p>}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted">Sort by</span>
            <select
              value={urlSort}
              onChange={e => handleSortChange(e.target.value as SortKey)}
              className="text-sm bg-white border border-subtle rounded-xl px-3 py-2 text-ink outline-none font-medium cursor-pointer hover:border-ink/40 transition-colors"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Two-column body */}
        <div className="flex gap-6">
          {/* Property list */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-surface animate-pulse"
                    style={{ height: 'clamp(280px, 48svh, 520px)' }} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl">🔑</div>
                <p className="text-lg font-bold text-ink">No rentals found</p>
                <p className="text-sm text-muted text-center max-w-xs">
                  Try adjusting your filters or selecting a different country.
                </p>
              </div>
            ) : (
              <>
                {items.map(p => (
                  <PropertyListingCard
                    key={p.property_id}
                    property={p}
                    isSaved={savedIds.has(p.property_id)}
                  />
                ))}

                {data && (
                  <PaginationBar
                    page={data.page}
                    totalPages={data.total_pages}
                    total={data.total}
                    pageSize={urlPageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </>
            )}
          </div>

          <AdSidebar />
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
