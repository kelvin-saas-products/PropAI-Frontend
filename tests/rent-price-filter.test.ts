import test from 'node:test'
import assert from 'node:assert/strict'
import { filterRentItemsByPrice } from '../lib/rent-price-filter'
import type { RentPropertyCard } from '../lib/types'

function rentCard(overrides: Partial<RentPropertyCard>): RentPropertyCard {
  return {
    property_id: overrides.property_id ?? 'p1',
    slug: overrides.slug ?? 'demo',
    listingType: 'rent',
    title: overrides.title ?? 'Demo',
    address: overrides.address ?? '1 Demo St',
    suburb: overrides.suburb ?? 'Demo',
    state: overrides.state ?? 'NSW',
    postcode: overrides.postcode ?? '2000',
    country: overrides.country ?? 'Australia',
    beds: overrides.beds ?? 1,
    baths: overrides.baths ?? 1,
    cars: overrides.cars ?? 0,
    land: overrides.land ?? '',
    badge: overrides.badge ?? { label: 'New', color: 'teal' },
    aiMatch: overrides.aiMatch ?? 80,
    aiInsight: overrides.aiInsight ?? 'Insight',
    images: overrides.images ?? [],
    featured: overrides.featured ?? false,
    priceDisplay: overrides.priceDisplay ?? '$0/wk',
    priceSort: overrides.priceSort ?? 0,
    weeklyRent: overrides.weeklyRent ?? '$0/wk',
    weeklyRentRaw: overrides.weeklyRentRaw ?? 0,
    availableFrom: overrides.availableFrom ?? '2026-01-01',
    furnished: overrides.furnished ?? false,
    petsAllowed: overrides.petsAllowed ?? null,
    scores: overrides.scores ?? { schools: 80, safety: 80, lifestyle: 80, valueForMoney: 80 },
  }
}

test('applies min weekly rent filter correctly', () => {
  const items: RentPropertyCard[] = [
    rentCard({ property_id: 'a', weeklyRentRaw: 650, weeklyRent: '$650/wk' }),
    rentCard({ property_id: 'b', weeklyRentRaw: 420, weeklyRent: '$420/wk' }),
    rentCard({ property_id: 'c', weeklyRentRaw: 780, weeklyRent: '$780/wk' }),
    rentCard({ property_id: 'd', weeklyRentRaw: 950, weeklyRent: '$950/wk' }),
  ]

  const filtered = filterRentItemsByPrice(items, 800, 0)
  assert.deepEqual(
    filtered.map(i => i.property_id),
    ['d']
  )
})

test('excludes items with no usable weekly rent when a filter is active', () => {
  const items: RentPropertyCard[] = [
    rentCard({ property_id: 'usable', weeklyRentRaw: 900, weeklyRent: '$900/wk' }),
    rentCard({ property_id: 'annual', weeklyRentRaw: undefined as unknown as number, weeklyRent: '', priceSort: 33800 }),
  ]

  const filtered = filterRentItemsByPrice(items, 800, 0)
  assert.deepEqual(
    filtered.map(i => i.property_id),
    ['usable']
  )
})

