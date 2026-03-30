'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PropertyListingCard from './PropertyListingCard'
import Breadcrumb from './Breadcrumb'
import { getProperties } from '@/lib/api'
import { getSavedPropertyIds } from '@/lib/auth'
import type { PaginatedProperties } from '@/lib/api'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/context/AuthContext'

// ── Sort options ──────────────────────────────────────────────────
type SortKey = 'price_asc' | 'price_desc' | 'newest'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price_asc',  label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest',     label: 'Newest' },
]

// ── Page-size options ─────────────────────────────────────────────
const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]


// ── Pagination bar ────────────────────────────────────────────────
interface PaginationBarProps {
  page: number
  totalPages: number
  total: number
  pageSize: PageSize
  onPageChange: (p: number) => void
  onPageSizeChange: (s: PageSize) => void
}

function PaginationBar({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationBarProps) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const result: (number | '…')[] = []
    const seen = new Set<number | '…'>()
    const push = (v: number | '…') => { if (!seen.has(v)) { seen.add(v); result.push(v) } }
    push(1)
    if (page > 3) push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i)
    if (page < totalPages - 2) push('…')
    push(totalPages)
    return result
  }, [page, totalPages])

  const btn = 'h-9 min-w-[36px] px-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center'

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-5 border-t border-subtle mt-2">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">{total.toLocaleString()} {total === 1 ? 'result' : 'results'}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Show</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="text-sm bg-bg border border-subtle rounded-xl px-2 py-1.5 text-ink outline-none font-medium"
          >
            {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s} per page</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className={`${btn} gap-1 ${page === 1 ? 'text-muted/40 cursor-not-allowed' : 'text-ink hover:bg-surface'}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Prev
        </button>

        {pages.map((p, i) =>
          p === '…'
            ? <span key={`e${i}`} className="h-9 w-6 flex items-center justify-center text-sm text-muted select-none">…</span>
            : <button key={p} onClick={() => onPageChange(p)}
                className={`${btn} ${p === page ? 'bg-ink text-white' : 'text-ink hover:bg-surface'}`}>{p}</button>
        )}

        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className={`${btn} gap-1 ${page === totalPages ? 'text-muted/40 cursor-not-allowed' : 'text-ink hover:bg-surface'}`}>
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

// ── Footer ────────────────────────────────────────────────────────
function BuyPageFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 border-t border-subtle bg-white">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-black text-ink tracking-tight mb-2">Prop<span className="text-teal">.AI</span></p>
            <p className="text-xs text-muted leading-relaxed max-w-[180px]">
              AI-powered property search for Australia, Thailand and the Philippines.
            </p>
          </div>

          {/* Browse */}
          <div>
            <p className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Browse</p>
            <ul className="space-y-2">
              {[['Buy', '/buy'], ['Rent', '/rent'], ['New Homes', '/new-homes'], ['Sold', '/sold']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-muted hover:text-ink transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Company</p>
            <ul className="space-y-2">
              {[['About', '/about'], ['Careers', '/careers'], ['Press', '/press'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-muted hover:text-ink transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-ink uppercase tracking-wider mb-3">Legal</p>
            <ul className="space-y-2">
              {[['Privacy Policy', '/privacy'], ['Terms of Use', '/terms'], ['Cookie Policy', '/cookies']].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-muted hover:text-ink transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-subtle">
          <p className="text-xs text-muted">© {year} Prop.AI. All rights reserved.</p>
          <p className="text-xs text-muted">
            Listings are for informational purposes only. Always verify details with the listing agent.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── Ad sidebar ────────────────────────────────────────────────────
function AdSidebar() {
  return (
    <aside className="hidden xl:flex flex-col gap-4 w-[300px] flex-shrink-0">
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

      <div className="bg-white rounded-2xl shadow-card border border-subtle p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">Open Homes · This Weekend</p>
        <div className="space-y-2.5">
          {[
            { time: 'Sat 10:00–10:30 AM', address: '42 Park Ave, Mosman'      },
            { time: 'Sat 11:00–11:30 AM', address: '15 Surf Pde, Broadbeach'  },
            { time: 'Sun 1:00–1:30 PM',   address: '88 Collins St, Melbourne' },
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

// ── Mock fallback ─────────────────────────────────────────────────
const MOCK_RESULT: PaginatedProperties = {
  page: 1, page_size: 25, total: 1, total_pages: 1,
  items: [{
    property_id: 'mock-1', slug: '42-park-avenue-mosman', listingType: 'sale',
    title: 'Modern Family Home', address: '42 Park Avenue, Mosman, Sydney NSW 2088',
    suburb: 'Mosman', state: 'NSW', postcode: '2088', country: 'Australia',
    beds: 4, baths: 3, cars: 2, land: '650 m²',
    salePrice: '$1,250,000', salePriceRaw: 1250000, saleMethod: 'private_treaty',
    auctionDate: null, openHome: 'Sat 15 Mar · 10:00–10:30 AM',
    priceDisplay: '$1,250,000', priceSort: 1250000,
    badge: { label: 'High Growth', color: 'green' }, aiMatch: 98,
    aiInsight: 'North-facing rear with a large entertainer\'s deck.',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85'],
    featured: true,
    scores: { schools: 9.1, safety: 8.4, lifestyle: 9.0, growth: '+12.5%', growthPos: true },
  } as SalePropertyCard],
}

// ── Main client component ─────────────────────────────────────────
export default function BuyPageClient() {
  const searchParams = useSearchParams()
  const router       = useRouter()
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
      router.replace(`/buy?${p.toString()}`)
    }
  }, [countryReady, i18nCountry, urlCountry]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeCountry = urlCountry || i18nCountry

  // ── Data fetching ───────────────────────────────────────────────
  const [data,       setData]       = useState<PaginatedProperties | null>(null)
  const [savedIds,   setSavedIds]   = useState<Set<string>>(new Set())
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)

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
        listingType: 'sale',
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
      console.error('Property fetch failed:', err)
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
    router.push(`/buy?${p.toString()}`)
  }, [searchParams, router])

  const handlePageChange     = (p: number)   => pushParams({ page: p })
  const handlePageSizeChange = (s: PageSize) => pushParams({ pageSize: s, page: 1 })
  const handleSortChange     = (s: SortKey)  => pushParams({ sort: s, page: 1 })

  const items = data?.items ?? []

  // ── Breadcrumbs ─────────────────────────────────────────────────
  const anyFiltersActive = !!(minPrice || maxPrice || minBeds)
  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Buy',  href: '/buy' },
      { label: `Properties for Sale in ${activeCountry}` },
    ]
    if (anyFiltersActive) {
      const parts: string[] = []
      if (minBeds) parts.push(`${minBeds}+ beds`)
      if (minPrice && maxPrice) parts.push(`$${(minPrice/1000).toFixed(0)}k – $${(maxPrice/1000).toFixed(0)}k`)
      else if (minPrice) parts.push(`Over $${(minPrice/1_000_000).toFixed(1)}M`)
      else if (maxPrice) parts.push(`Under $${(maxPrice/1000).toFixed(0)}k`)
      if (parts.length) items.push({ label: parts.join(' · ') })
    }
    return items
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
              Properties for sale <span className="text-teal">in {activeCountry}</span>
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
                <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl">🏘</div>
                <p className="text-lg font-bold text-ink">No properties found</p>
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
      <BuyPageFooter />
    </div>
  )
}
