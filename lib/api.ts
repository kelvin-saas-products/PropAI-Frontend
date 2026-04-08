import type { AnyProperty, AnyPropertyCard } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 }, ...options })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

// ── Paginated envelope ──────────────────────────────────────────────────────
export interface PaginatedProperties {
  items: AnyPropertyCard[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PropertyFilters {
  listingType?: 'sale' | 'rent'
  country?: string
  state?: string
  beds?: number
  beds_match?: 'min' | 'exact'
  min_price?: number
  max_price?: number
  min_weekly_rent?: number
  max_weekly_rent?: number
  sort_by?: 'newest' | 'price_asc' | 'price_desc'
  page?: number
  page_size?: number
}

// ── Geo ─────────────────────────────────────────────────────────────────────
export interface GeoCountryResponse {
  country: string        // "Australia" | "Thailand" | "Philippines"
  country_code: string   // "AU" | "TH" | "PH"
}

export async function getCountryFromIp(): Promise<GeoCountryResponse> {
  return apiFetch<GeoCountryResponse>('/properties/geo/country', { next: { revalidate: 3600 } })
}

// ── Properties ───────────────────────────────────────────────────────────────
export const getFeaturedProperties = (country?: string) => {
  const params = new URLSearchParams()
  if (country) params.set('country', country)
  return apiFetch<AnyPropertyCard[]>(`/properties/featured?${params.toString()}`)
}
export const getFeaturedSale = (country?: string) => {
  const params = new URLSearchParams({ listingType: 'sale' })
  if (country) params.set('country', country)
  return apiFetch<AnyPropertyCard[]>(`/properties/featured?${params.toString()}`)
}
export const getFeaturedRent = (country?: string) => {
  const params = new URLSearchParams({ listingType: 'rent' })
  if (country) params.set('country', country)
  return apiFetch<AnyPropertyCard[]>(`/properties/featured?${params.toString()}`)
}
export const getPropertyBySlug = (slug: string) => apiFetch<AnyProperty>(`/properties/${slug}`)
export const getPropertyById   = (id: string)   => apiFetch<AnyProperty>(`/properties/id/${id}`)

export async function getPropertyCardById(id: string): Promise<AnyPropertyCard | null> {
  const params = new URLSearchParams({ property_id: id, page: '1', page_size: '50' })
  const result = await apiFetch<PaginatedProperties>(`/properties?${params.toString()}`, { cache: 'no-store' })
  return result.items.find(item => item.property_id === id) ?? null
}

export async function getPropertyCardBySlug(slug: string): Promise<AnyPropertyCard | null> {
  const params = new URLSearchParams({ slug, page: '1', page_size: '50' })
  const result = await apiFetch<PaginatedProperties>(`/properties?${params.toString()}`, { cache: 'no-store' })
  return result.items.find(item => item.slug === slug) ?? null
}

/**
 * Paginated property list. Country is ALWAYS sent to the backend so
 * server-side filtering prevents cross-country leakage.
 */
export function getProperties(filters: PropertyFilters): Promise<PaginatedProperties> {
  const params = new URLSearchParams()
  if (filters.listingType)   params.set('listingType',     filters.listingType)
  if (filters.country)       params.set('country',         filters.country)
  if (filters.state)         params.set('state',           filters.state)
  if (filters.beds)          params.set('beds',            String(filters.beds))
  if (filters.beds_match)    params.set('beds_match',      filters.beds_match)
  if (filters.min_price)     params.set('min_price',       String(filters.min_price))
  if (filters.max_price)     params.set('max_price',       String(filters.max_price))
  if (filters.min_weekly_rent) params.set('min_weekly_rent', String(filters.min_weekly_rent))
  if (filters.max_weekly_rent) params.set('max_weekly_rent', String(filters.max_weekly_rent))
  if (filters.sort_by)       params.set('sort_by',        filters.sort_by)
  params.set('page', String(filters.page ?? 1))
  params.set('page_size', String(filters.page_size ?? 25))

  return apiFetch<PaginatedProperties>(`/properties?${params.toString()}`, { cache: 'no-store' })
}

/** @deprecated Use getProperties() with filters instead */
export function getPropertiesForSale(country?: string): Promise<AnyPropertyCard[]> {
  const params = new URLSearchParams({ listingType: 'sale', limit: '200' })
  if (country) params.set('country', country)
  return apiFetch<AnyPropertyCard[]>(`/properties?${params.toString()}`)
}
