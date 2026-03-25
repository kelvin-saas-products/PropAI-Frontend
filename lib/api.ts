import type { AnyProperty, AnyPropertyCard } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export const getFeaturedProperties  = () => apiFetch<AnyPropertyCard[]>('/properties/featured')
export const getFeaturedSale        = () => apiFetch<AnyPropertyCard[]>('/properties/featured?listingType=sale')
export const getFeaturedRent        = () => apiFetch<AnyPropertyCard[]>('/properties/featured?listingType=rent')
export const getPropertyBySlug      = (slug: string) => apiFetch<AnyProperty>(`/properties/${slug}`)
export const getPropertyById        = (id: string) => apiFetch<AnyProperty>(`/properties/id/${id}`)

export function getPropertiesForSale(country?: string): Promise<AnyPropertyCard[]> {
  const params = new URLSearchParams({ listingType: 'sale' })
  if (country) params.set('country', country)
  return apiFetch<AnyPropertyCard[]>(`/properties?${params.toString()}`)
}
