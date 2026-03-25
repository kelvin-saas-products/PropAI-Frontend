'use client'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard from './PropertyCard'
import type { SalePropertyCard } from '@/lib/types'
import { useI18n } from '@/lib/i18n'

interface Props {
  properties: SalePropertyCard[]
}

export default function BuyPageClient({ properties }: Props) {
  const searchParams = useSearchParams()
  const { country } = useI18n()

  const minPrice   = Number(searchParams.get('minPrice') || 0)
  const maxPrice   = Number(searchParams.get('maxPrice') || 0)
  const minBeds    = Number(searchParams.get('beds') || 0)
  const typeFilter = searchParams.get('types')
    ? searchParams.get('types')!.split(',').map(t => t.toLowerCase())
    : []

  const filtered = useMemo(() => {
    return properties.filter(p => {
      // Price filter
      if (minPrice && p.salePriceRaw < minPrice) return false
      if (maxPrice && p.salePriceRaw > maxPrice) return false
      // Beds filter
      if (minBeds && p.beds < minBeds) return false
      // Property type filter
      if (typeFilter.length > 0) {
        // SalePropertyCard doesn't have a propertyType field on the card,
        // so we do a loose check on the badge or address. We match on
        // the title/address with a broad contains check.
        const haystack = [p.address, p.title, p.badge.label].join(' ').toLowerCase()
        const matches = typeFilter.some(t => haystack.includes(t))
        if (!matches) return false
      }
      return true
    })
  }, [properties, minPrice, maxPrice, minBeds, typeFilter])

  const anyFiltersActive = !!(minPrice || maxPrice || minBeds || typeFilter.length)

  return (
    <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-8">

      {/* Results header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight">
            Properties for sale <span className="text-teal">in {country}</span>
          </h1>
          <p className="text-sm text-muted mt-0.5">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {anyFiltersActive && ' · filters applied'}
          </p>
        </div>

        {/* Sort (static for now) */}
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

      {/* Grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl">🏘</div>
          <p className="text-lg font-bold text-ink">No properties found</p>
          <p className="text-sm text-muted text-center max-w-xs">
            Try adjusting your filters or selecting a different country.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <PropertyCard key={p.property_id} property={p} />
          ))}
        </div>
      )}
    </div>
  )
}
