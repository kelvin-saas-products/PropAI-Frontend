import { notFound } from 'next/navigation'
import { getPropertyById, getPropertyBySlug, getPropertyCardById, getPropertyCardBySlug } from '@/lib/api'
import type { AnyProperty, AnyPropertyCard, RentProperty, SaleProperty } from '@/lib/types'
import PropertyDetailClient from '@/components/PropertyDetailClient'

export const revalidate = 60

function extractIdCandidatesFromSlug(slug: string): string[] {
  const decoded = decodeURIComponent(slug)
  const candidates: string[] = []
  const suffix = decoded.includes('_') ? decoded.slice(decoded.lastIndexOf('_') + 1) : decoded

  const underscoreIdx = decoded.lastIndexOf('_')
  if (underscoreIdx !== -1 && underscoreIdx < decoded.length - 1) {
    candidates.push(decoded.slice(underscoreIdx + 1))
  }
  candidates.push(suffix)

  const idMarkerParts = suffix.split(/(?:^|[-_])id-/i)
  if (idMarkerParts.length > 1) {
    candidates.push(idMarkerParts[idMarkerParts.length - 1])
  }

  const uuidUlid = decoded.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-[0-9A-HJKMNP-TV-Z]{26}$/i)
  if (uuidUlid) {
    candidates.push(uuidUlid[0])
  }

  const ulid = decoded.match(/[0-9A-HJKMNP-TV-Z]{26}$/)
  if (ulid) {
    candidates.push(ulid[0])
  }

  const uuid = decoded.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
  if (uuid) {
    candidates.push(uuid[0])
  }

  const mongoId = suffix.match(/[0-9a-f]{24}$/i)
  if (mongoId) {
    candidates.push(mongoId[0])
  }

  return [...new Set(candidates.filter(Boolean))]
}

async function loadProperty(slug: string, id?: string) {
  const fallbackAgent = {
    name: 'Listing Agent',
    role: 'PropAI Partner',
    phone: 'Contact via enquiry',
  }

  const asPropertyDetail = (card: AnyPropertyCard): AnyProperty => {
    const common = {
      ...card,
      built: new Date().getFullYear(),
      propertyType: 'Property',
      description: card.aiInsight || 'Detailed information is currently unavailable for this listing.',
      features: ['Contact agent for full property details'],
      agent: fallbackAgent,
    }

    if (card.listingType === 'sale') {
      const sale = card as SaleProperty
      return {
        ...common,
        listingType: 'sale',
        salePrice: sale.salePrice,
        salePriceRaw: sale.salePriceRaw,
        saleMethod: sale.saleMethod,
        auctionDate: sale.auctionDate,
        openHome: sale.openHome,
        scores: sale.scores,
      } as SaleProperty
    }

    const rent = card as RentProperty
    return {
      ...common,
      listingType: 'rent',
      weeklyRent: rent.weeklyRent,
      weeklyRentRaw: rent.weeklyRentRaw,
      bondAmount: null,
      availableFrom: rent.availableFrom,
      leaseTerms: 'Contact agent for lease terms',
      furnished: rent.furnished,
      petsAllowed: rent.petsAllowed,
      utilitiesIncluded: [],
      inspectionTimes: [],
      scores: rent.scores,
    } as RentProperty
  }

  try {
    return await getPropertyBySlug(slug)
  } catch {
    const normalizedSlug = slug.includes('_') ? slug.slice(0, slug.lastIndexOf('_')) : slug

    if (normalizedSlug !== slug) {
      try {
        return await getPropertyBySlug(normalizedSlug)
      } catch {
        // Continue to ID-based fallbacks.
      }
    }

    const idCandidates = [id, ...extractIdCandidatesFromSlug(slug)].filter(
      (value): value is string => Boolean(value)
    )

    for (const candidateId of idCandidates) {
      try {
        return await getPropertyById(candidateId)
      } catch {
        try {
          const card = await getPropertyCardById(candidateId)
          if (card) return asPropertyDetail(card)
        } catch {
          // Try the next extracted candidate.
        }
      }
    }

    const slugCandidates = [...new Set([slug, normalizedSlug])]
    for (const candidateSlug of slugCandidates) {
      try {
        const card = await getPropertyCardBySlug(candidateSlug)
        if (card) return asPropertyDetail(card)
      } catch {
        // Continue fallback attempts.
      }
    }

    return null
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  try {
    const { slug } = await params
    const { id } = await searchParams
    const property = await loadProperty(slug, id)

    if (!property) {
      return { title: 'Property Not Found | PropAI' }
    }

    return {
      title: `${property.title} - ${property.address} | PropAI`,
      description: property.description.slice(0, 155),
    }
  } catch {
    return { title: 'Property Not Found | PropAI' }
  }
}

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
}) {
  const { slug } = await params
  const { id } = await searchParams
  const property = await loadProperty(slug, id)

  if (!property) {
    notFound()
  }

  return <PropertyDetailClient property={property} />
}
