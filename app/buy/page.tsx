import { Suspense } from 'react'
import BuyNavbar from '@/components/BuyNavbar'
import BuyPageClient from '@/components/BuyPageClient'
import { getPropertiesForSale } from '@/lib/api'
import type { SalePropertyCard } from '@/lib/types'

export const dynamic = 'force-dynamic'

// ── Fallback mock data when the API is unavailable ──────────────────
// These mirror the shape expected by SalePropertyCard.
const MOCK_SALE_PROPERTIES: SalePropertyCard[] = [
  {
    property_id: 'mock-1', slug: '42-park-avenue-mosman',
    listingType: 'sale',
    title: 'Modern Family Home',
    address: '42 Park Avenue, Mosman, Sydney NSW 2088',
    suburb: 'Mosman', state: 'NSW', postcode: '2088', country: 'Australia',
    beds: 4, baths: 3, cars: 2, land: '650 m²',
    salePrice: '$1,250,000', salePriceRaw: 1250000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sat 15 Mar · 10:00–10:30 AM',
    priceDisplay: '$1,250,000', priceSort: 1250000,
    badge: { label: 'High Growth', color: 'green' },
    aiMatch: 98,
    aiInsight: 'North-facing rear with a large entertainer\'s deck and solar panels (6.6kW).',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85'],
    featured: true,
    scores: { schools: 9.1, safety: 8.4, lifestyle: 9.0, growth: '+12.5%', growthPos: true },
  },
  {
    property_id: 'mock-2', slug: '88-collins-street-melbourne',
    listingType: 'sale',
    title: 'Luxury Apartment',
    address: '88 Collins Street, Melbourne VIC 3000',
    suburb: 'Melbourne CBD', state: 'VIC', postcode: '3000', country: 'Australia',
    beds: 2, baths: 2, cars: 1, land: '120 m²',
    salePrice: '$890,000', salePriceRaw: 890000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sun 16 Mar · 1:00–1:30 PM',
    priceDisplay: '$890,000', priceSort: 890000,
    badge: { label: 'Investment Hotspot', color: 'purple' },
    aiMatch: 95,
    aiInsight: 'Floor-to-ceiling glazing reveals an unobstructed bay panorama.',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85'],
    featured: true,
    scores: { schools: 7.8, safety: 8.2, lifestyle: 9.5, growth: '+9.8%', growthPos: true },
  },
  {
    property_id: 'mock-3', slug: '15-surf-parade-gold-coast',
    listingType: 'sale',
    title: 'Beachside Villa',
    address: '15 Surf Parade, Broadbeach, Gold Coast QLD 4218',
    suburb: 'Broadbeach', state: 'QLD', postcode: '4218', country: 'Australia',
    beds: 5, baths: 4, cars: 3, land: '980 m²',
    salePrice: '$2,100,000', salePriceRaw: 2100000,
    saleMethod: 'auction', auctionDate: 'Saturday, 22 Mar 2025 · 11:00 AM',
    openHome: 'Sat 15 Mar · 11:00–11:30 AM',
    priceDisplay: '$2,100,000', priceSort: 2100000,
    badge: { label: 'Lifestyle Premium', color: 'teal' },
    aiMatch: 97,
    aiInsight: 'Satellite confirms direct beach-track access 50m from the front gate.',
    images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&q=85'],
    featured: true,
    scores: { schools: 7.5, safety: 8.0, lifestyle: 9.8, growth: '+7.2%', growthPos: true },
  },
  {
    property_id: 'mock-4', slug: '7-garden-terrace-brisbane',
    listingType: 'sale',
    title: 'Suburban Haven',
    address: '7 Garden Terrace, Paddington, Brisbane QLD 4064',
    suburb: 'Paddington', state: 'QLD', postcode: '4064', country: 'Australia',
    beds: 3, baths: 2, cars: 2, land: '450 m²',
    salePrice: '$750,000', salePriceRaw: 750000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sat 15 Mar · 2:00–2:30 PM',
    priceDisplay: '$750,000', priceSort: 750000,
    badge: { label: 'Family Friendly', color: 'orange' },
    aiMatch: 94,
    aiInsight: 'In catchment for a top-ranked public primary. Rear deck faces north.',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85'],
    featured: false,
    scores: { schools: 9.2, safety: 8.6, lifestyle: 8.7, growth: '+6.4%', growthPos: true },
  },
  {
    property_id: 'mock-5', slug: '1-terrace-road-perth',
    listingType: 'sale',
    title: 'City Penthouse',
    address: '1 Terrace Road, East Perth WA 6004',
    suburb: 'East Perth', state: 'WA', postcode: '6004', country: 'Australia',
    beds: 3, baths: 2, cars: 2, land: '310 m²',
    salePrice: '$1,650,000', salePriceRaw: 1650000,
    saleMethod: 'expressions_of_interest', auctionDate: null,
    openHome: 'Sun 16 Mar · 10:00–10:30 AM',
    priceDisplay: '$1,650,000', priceSort: 1650000,
    badge: { label: 'Urban Luxury', color: 'blue' },
    aiMatch: 96,
    aiInsight: '270° river views confirmed. Private rooftop terrace detected.',
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=85'],
    featured: true,
    scores: { schools: 7.9, safety: 9.0, lifestyle: 9.3, growth: '+11.2%', growthPos: true },
  },
  {
    property_id: 'mock-6', slug: '22-vineyards-road-adelaide',
    listingType: 'sale',
    title: 'Country Estate',
    address: '22 Vineyards Road, Stirling, Adelaide SA 5152',
    suburb: 'Stirling', state: 'SA', postcode: '5152', country: 'Australia',
    beds: 4, baths: 3, cars: 4, land: '2,200 m²',
    salePrice: '$1,100,000', salePriceRaw: 1100000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sat 22 Mar · 11:00–11:30 AM',
    priceDisplay: '$1,100,000', priceSort: 1100000,
    badge: { label: 'Space & Serenity', color: 'green' },
    aiMatch: 93,
    aiInsight: 'Mature orchard with 12+ fruit trees. Separate artist\'s studio detected.',
    images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=85'],
    featured: false,
    scores: { schools: 8.8, safety: 9.2, lifestyle: 8.5, growth: '+5.9%', growthPos: true },
  },
  {
    property_id: 'mock-7', slug: 'sukhumvit-luxury-condo-bkk',
    listingType: 'sale',
    title: 'Sukhumvit Luxury Condo',
    address: 'Sukhumvit 55, Thong Lo, Bangkok 10110',
    suburb: 'Thong Lo', state: 'BKK', postcode: '10110', country: 'Thailand',
    beds: 2, baths: 2, cars: 1, land: '85 m²',
    salePrice: '฿25,500,000', salePriceRaw: 25500000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sun 16 Mar · 2:00–3:00 PM',
    priceDisplay: '฿25,500,000', priceSort: 25500000,
    badge: { label: 'High Demand', color: 'purple' },
    aiMatch: 95,
    aiInsight: 'Walking distance to BTS station. Hidden Japanese onsen room in the condo facility.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85'],
    featured: true,
    scores: { schools: 8.0, safety: 8.5, lifestyle: 9.9, growth: '+8.0%', growthPos: true },
  },
  {
    property_id: 'mock-8', slug: 'phuket-pool-villa',
    listingType: 'sale',
    title: 'Tropical Pool Villa',
    address: '12 Laguna Road, Cherngtalay, Phuket 83110',
    suburb: 'Cherngtalay', state: 'Phuket', postcode: '83110', country: 'Thailand',
    beds: 4, baths: 4, cars: 2, land: '600 m²',
    salePrice: '฿38,000,000', salePriceRaw: 38000000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sat 15 Mar · 10:00–11:30 AM',
    priceDisplay: '฿38,000,000', priceSort: 38000000,
    badge: { label: 'Resort Living', color: 'teal' },
    aiMatch: 98,
    aiInsight: 'Comes fully furnished. Dedicated maid\'s quarters separated from main living.',
    images: ['https://images.unsplash.com/photo-1613490900233-141c556017b3?w=900&q=85'],
    featured: true,
    scores: { schools: 7.5, safety: 9.0, lifestyle: 9.5, growth: '+10.2%', growthPos: true },
  },
  {
    property_id: 'mock-9', slug: 'bgc-sky-residence',
    listingType: 'sale',
    title: 'BGC Sky Residence',
    address: '32nd Street, Bonifacio Global City, Taguig 1634',
    suburb: 'BGC', state: 'Metro Manila', postcode: '1634', country: 'Philippines',
    beds: 3, baths: 3, cars: 2, land: '150 m²',
    salePrice: '₱45,000,000', salePriceRaw: 45000000,
    saleMethod: 'private_treaty', auctionDate: null,
    openHome: 'Sun 16 Mar · 1:00–3:00 PM',
    priceDisplay: '₱45,000,000', priceSort: 45000000,
    badge: { label: 'Prime Location', color: 'blue' },
    aiMatch: 92,
    aiInsight: 'Unobstructed view of the Manila Golf Course. Highly sought-after corner unit.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85'],
    featured: true,
    scores: { schools: 8.5, safety: 9.5, lifestyle: 9.8, growth: '+15.0%', growthPos: true },
  },
]

// ── Server component ────────────────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ country?: string; minPrice?: string; maxPrice?: string; beds?: string; types?: string }>
}

export default async function BuyPage({ searchParams }: PageProps) {
  const params = await searchParams
  const country = params.country

  let properties: SalePropertyCard[] = []

  try {
    const apiData = await getPropertiesForSale(country)
    properties = apiData.filter(p => p.listingType === 'sale') as SalePropertyCard[]
  } catch {
    // API unavailable — use mock data, filtered by country if provided
    properties = country
      ? MOCK_SALE_PROPERTIES.filter(p => p.country === country)
      : MOCK_SALE_PROPERTIES
  }

  return (
    <div className="min-h-screen bg-bg">
      <Suspense>
        <BuyNavbar />
      </Suspense>
      <Suspense>
        <BuyPageClient properties={properties} />
      </Suspense>
    </div>
  )
}
