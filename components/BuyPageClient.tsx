'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PropertyListingCard from './PropertyListingCard'
import VirtualizedPropertyList from './VirtualizedPropertyList'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import PaginationBar, { PAGE_SIZE_OPTIONS, type PageSize } from './PaginationBar'
import { getProperties } from '@/lib/api'
import { getSavedPropertyIds } from '@/lib/auth'
import type { PaginatedProperties } from '@/lib/api'
import type { SalePropertyCard } from '@/lib/types'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/context/AuthContext'
import { getListingCardStyleVars, useListingViewportLayout } from '@/lib/listings-layout'

type SortKey = 'price_asc' | 'price_desc' | 'newest'
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'price_asc', label: 'Price (low to high)' },
  { value: 'price_desc', label: 'Price (high to low)' },
  { value: 'newest', label: 'Newest' },
]

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
    </aside>
  )
}

const MOCK_RESULT: PaginatedProperties = {
  page: 1,
  page_size: 25,
  total: 1,
  total_pages: 1,
  items: [
    {
      property_id: 'mock-1',
      slug: '42-park-avenue-mosman',
      listingType: 'sale',
      title: 'Modern Family Home',
      address: '42 Park Avenue, Mosman, Sydney NSW 2088',
      suburb: 'Mosman',
      state: 'NSW',
      postcode: '2088',
      country: 'Australia',
      beds: 4,
      baths: 3,
      cars: 2,
      land: '650 m²',
      salePrice: '$1,250,000',
      salePriceRaw: 1250000,
      saleMethod: 'private_treaty',
      auctionDate: null,
      openHome: 'Sat 15 Mar · 10:00–10:30 AM',
      priceDisplay: '$1,250,000',
      priceSort: 1250000,
      badge: { label: 'High Growth', color: 'green' },
      aiMatch: 98,
      aiInsight: "North-facing rear with a large entertainer's deck.",
      images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85'],
      featured: true,
      scores: { schools: 9.1, safety: 8.4, lifestyle: 9.0, growth: '+12.5%', growthPos: true },
    } as SalePropertyCard,
  ],
}

export default function BuyPageClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { country: i18nCountry, countryReady } = useI18n()
  const { user, accessToken } = useAuth()
  const layout = useListingViewportLayout()
  const cardStyleVars = getListingCardStyleVars(layout)

  const urlCountry = searchParams.get('country') ?? ''
  const minPrice = Number(searchParams.get('minPrice') || 0)
  const maxPrice = Number(searchParams.get('maxPrice') || 0)
  const minBeds = Number(searchParams.get('beds') || 0)
  const urlPage = Math.max(1, Number(searchParams.get('page') || 1))
  const urlPageSize = (PAGE_SIZE_OPTIONS.includes(Number(searchParams.get('pageSize')) as PageSize)
    ? Number(searchParams.get('pageSize'))
    : 25) as PageSize
  const urlSort = (searchParams.get('sort') as SortKey) || 'newest'

  useEffect(() => {
    if (!countryReady) return
    if (!urlCountry && i18nCountry) {
      const p = new URLSearchParams(searchParams.toString())
      p.set('country', i18nCountry)
      p.set('page', '1')
      router.replace(`/buy?${p.toString()}`)
    }
  }, [countryReady, i18nCountry, router, searchParams, urlCountry])

  const activeCountry = urlCountry || i18nCountry

  const [data, setData] = useState<PaginatedProperties | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedItems, setFeedItems] = useState<SalePropertyCard[]>([])

  useEffect(() => {
    if (!user || !accessToken) {
      setSavedIds(new Set())
      return
    }
    getSavedPropertyIds(accessToken)
      .then(ids => setSavedIds(new Set(ids)))
      .catch(() => {})
  }, [user, accessToken])

  const fetchPage = useCallback(
    async (pageToFetch: number, append = false) => {
      if (!countryReady) return

      if (append) setLoadingMore(true)
      else setLoading(true)
      if (!append) setError(null)

      try {
        const result = await getProperties({
          listingType: 'sale',
          country: activeCountry,
          beds: minBeds || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          sort_by: urlSort,
          page: pageToFetch,
          page_size: urlPageSize,
        })

        setData(result)
        const nextItems = result.items as SalePropertyCard[]
        setFeedItems(prev => {
          if (!append) return nextItems
          const seen = new Set(prev.map(item => item.property_id))
          return [...prev, ...nextItems.filter(item => !seen.has(item.property_id))]
        })
      } catch (err) {
        console.error('Property fetch failed:', err)
        setData(MOCK_RESULT)
        setFeedItems(MOCK_RESULT.items as SalePropertyCard[])
        setError('Could not reach the API — showing sample data.')
      } finally {
        if (append) setLoadingMore(false)
        else setLoading(false)
      }
    },
    [activeCountry, countryReady, maxPrice, minBeds, minPrice, urlPageSize, urlSort]
  )

  useEffect(() => {
    const pageToFetch = layout.usesVirtualScroll ? 1 : urlPage
    void fetchPage(pageToFetch, false)
  }, [fetchPage, layout.usesVirtualScroll, urlPage])

  const pushParams = useCallback(
    (updates: Record<string, string | number>) => {
      const p = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([k, v]) => {
        if (v !== '' && v !== 0) p.set(k, String(v))
        else p.delete(k)
      })
      router.push(`/buy?${p.toString()}`)
    },
    [router, searchParams]
  )

  const handlePageChange = (page: number) => pushParams({ page })
  const handlePageSizeChange = (pageSize: PageSize) => pushParams({ pageSize, page: 1 })
  const handleSortChange = (sort: SortKey) => pushParams({ sort, page: 1 })

  const items = layout.usesVirtualScroll ? feedItems : ((data?.items ?? []) as SalePropertyCard[])

  const handleLoadMore = useCallback(() => {
    if (!layout.usesVirtualScroll || !data || loading || loadingMore) return
    if (feedItems.length >= data.total) return
    const nextPage = Math.floor(feedItems.length / urlPageSize) + 1
    void fetchPage(nextPage, true)
  }, [data, feedItems.length, fetchPage, layout.usesVirtualScroll, loading, loadingMore, urlPageSize])

  const anyFiltersActive = !!(minPrice || maxPrice || minBeds)
  const breadcrumbs = useMemo(() => {
    const items: { label: string; href?: string }[] = [
      { label: 'Home', href: '/' },
      { label: 'Buy', href: '/buy' },
      { label: `Properties for Sale in ${activeCountry}` },
    ]
    if (anyFiltersActive) {
      const parts: string[] = []
      if (minBeds) parts.push(`${minBeds}+ beds`)
      if (minPrice && maxPrice) parts.push(`$${(minPrice / 1000).toFixed(0)}k – $${(maxPrice / 1000).toFixed(0)}k`)
      else if (minPrice) parts.push(`Over $${(minPrice / 1_000_000).toFixed(1)}M`)
      else if (maxPrice) parts.push(`Under $${(maxPrice / 1000).toFixed(0)}k`)
      if (parts.length) items.push({ label: parts.join(' · ') })
    }
    return items
  }, [activeCountry, anyFiltersActive, maxPrice, minBeds, minPrice])

  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-5 lg:px-8 py-2">
        <Breadcrumb items={breadcrumbs} />

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
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0 flex flex-col">
            {loading ? (
              <div className="flex flex-col" style={{ gap: `${layout.gapPx}px` }}>
                {Array.from({ length: layout.visibleCards }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-surface animate-pulse"
                    style={{ ...cardStyleVars, height: layout.cardHeightPx }}
                  />
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
                {layout.usesVirtualScroll ? (
                  <VirtualizedPropertyList
                    items={items}
                    itemHeight={layout.cardHeightPx}
                    gap={layout.gapPx}
                    hasMore={(data?.total ?? 0) > items.length}
                    loadingMore={loadingMore}
                    onEndReached={handleLoadMore}
                    renderItem={property => (
                      <PropertyListingCard
                        property={property}
                        isSaved={savedIds.has(property.property_id)}
                        layout={layout}
                      />
                    )}
                  />
                ) : (
                  <div className="flex flex-col" style={{ gap: `${layout.gapPx}px` }}>
                    {items.map(property => (
                      <PropertyListingCard
                        key={property.property_id}
                        property={property}
                        isSaved={savedIds.has(property.property_id)}
                        layout={layout}
                      />
                    ))}
                  </div>
                )}

                {loadingMore && (
                  <div className="flex flex-col mt-2" style={{ gap: `${layout.gapPx}px` }}>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div
                        key={`buy-loading-${index}`}
                        className="rounded-2xl bg-surface animate-pulse"
                        style={{ ...cardStyleVars, height: layout.cardHeightPx }}
                      />
                    ))}
                  </div>
                )}

                {data && !layout.usesVirtualScroll && (
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

      <Footer />
    </div>
  )
}
