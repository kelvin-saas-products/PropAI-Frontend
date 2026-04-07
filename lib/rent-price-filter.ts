import type { RentPropertyCard } from './types'

function parseWeeklyRentText(raw: string | undefined): number | null {
  if (!raw) return null
  const digits = raw.replace(/[^\d]/g, '')
  if (!digits) return null
  const value = Number(digits)
  return Number.isFinite(value) ? value : null
}

function toWeeklyRentValue(item: RentPropertyCard): number | null {
  if (typeof item.weeklyRentRaw === 'number' && Number.isFinite(item.weeklyRentRaw)) {
    return item.weeklyRentRaw
  }
  const parsed = parseWeeklyRentText(item.weeklyRent)
  if (parsed !== null) return parsed

  // Some payloads may only include priceSort; use it only when it looks like weekly rent.
  if (typeof item.priceSort === 'number' && Number.isFinite(item.priceSort) && item.priceSort <= 10_000) {
    return item.priceSort
  }
  return null
}

export function filterRentItemsByPrice(items: RentPropertyCard[], minPrice: number, maxPrice: number) {
  if (!minPrice && !maxPrice) return items
  return items.filter(item => {
    const weekly = toWeeklyRentValue(item)
    if (weekly === null) return false
    if (minPrice && weekly < minPrice) return false
    if (maxPrice && weekly > maxPrice) return false
    return true
  })
}

