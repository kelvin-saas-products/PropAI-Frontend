export type BadgeColor = 'green' | 'purple' | 'orange' | 'blue' | 'teal'
export type ListingType = 'sale' | 'rent'
export type SaleMethod = 'private_treaty' | 'auction' | 'expressions_of_interest' | 'off_market'

export interface Badge { label: string; color: BadgeColor }
export interface Agent { name: string; role: string; phone: string }

export interface SaleScores {
  schools: number; safety: number; lifestyle: number
  growth: string; growthPos: boolean
}

export interface RentScores {
  schools: number; safety: number; lifestyle: number
  valueForMoney: number
}

interface PropertyCardBase {
  property_id: string
  slug: string
  title: string
  address: string; suburb: string; state: string; postcode: string; country: string
  beds: number; baths: number; cars: number; land: string
  badge: Badge
  aiMatch: number
  aiInsight: string
  images: string[]
  featured: boolean
  priceDisplay: string
  priceSort: number
}

export interface SalePropertyCard extends PropertyCardBase {
  listingType: 'sale'
  salePrice: string
  salePriceRaw: number
  saleMethod: SaleMethod
  auctionDate: string | null
  openHome: string | null
  scores: SaleScores
}

export interface RentPropertyCard extends PropertyCardBase {
  listingType: 'rent'
  weeklyRent: string
  weeklyRentRaw: number
  availableFrom: string
  furnished: boolean
  petsAllowed: boolean | null
  scores: RentScores
}

export type AnyPropertyCard = SalePropertyCard | RentPropertyCard

interface PropertyBase extends PropertyCardBase {
  built: number
  propertyType: string
  description: string
  features: string[]
  agent: Agent
}

export interface SaleProperty extends PropertyBase {
  listingType: 'sale'
  salePrice: string; salePriceRaw: number
  saleMethod: SaleMethod
  auctionDate: string | null
  openHome: string | null
  scores: SaleScores
}

export interface RentProperty extends PropertyBase {
  listingType: 'rent'
  weeklyRent: string; weeklyRentRaw: number
  bondAmount: string | null
  availableFrom: string
  leaseTerms: string
  furnished: boolean
  petsAllowed: boolean | null
  utilitiesIncluded: string[]
  inspectionTimes: string[]
  scores: RentScores
}

export type AnyProperty = SaleProperty | RentProperty
