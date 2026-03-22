'use client'
import { useState } from 'react'
import PropertyCard from './PropertyCard'
import type { AnyPropertyCard } from '@/lib/types'
import { useI18n } from '@/lib/i18n'

type Tab = 'all' | 'sale' | 'rent'

export default function FeaturedGridClient({
  saleProps,
  rentProps,
}: {
  saleProps: AnyPropertyCard[]
  rentProps: AnyPropertyCard[]
}) {
  const [tab, setTab] = useState<Tab>('all')
  const { t } = useI18n()

  const allProps = [...saleProps, ...rentProps]
  const displayed = tab === 'all' ? allProps : tab === 'sale' ? saleProps : rentProps

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'all',  label: t('All'),       count: allProps.length },
    { id: 'sale', label: '🏷 ' + t('Buy'),    count: saleProps.length },
    { id: 'rent', label: '🔑 ' + t('Rent'),   count: rentProps.length },
  ]

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-8">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              tab === t.id
                ? 'bg-white text-ink shadow-card'
                : 'bg-white/10 text-white/60 hover:bg-white/15 hover:text-white'
            }`}
          >
            {t.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === t.id ? 'bg-ink text-white' : 'bg-white/20 text-white/70'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-10">{t('No properties in this category.')}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map(p => (
            <PropertyCard key={p.property_id} property={p} />
          ))}
        </div>
      )}
    </div>
  )
}
