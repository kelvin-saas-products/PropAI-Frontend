export type BadgeColor = 'green' | 'purple' | 'orange' | 'blue' | 'teal'

export interface Property {
  id: string
  slug: string
  title: string
  price: string
  priceRaw: number
  address: string
  suburb: string
  state: string
  postcode: string
  beds: number
  baths: number
  cars: number
  land: string
  built: number
  type: string
  badge: { label: string; color: BadgeColor }
  aiMatch: number
  aiInsight: string
  images: string[]
  description: string
  features: string[]
  scores: { schools: number; safety: number; lifestyle: number; growth: string; growthPos: boolean }
  agent: { name: string; role: string; avatar?: string; phone: string }
  openHome: string
}

export interface SuburbStat {
  name: string; state: string; region: string
  medianPrice: string; growth: string; growthPos: boolean
  rentalYield: string; safetyScore: number
}

export const PROPERTIES: Property[] = [
  {
    id: '1', slug: '42-park-avenue-mosman',
    title: 'Modern Family Home',
    price: '$1,250,000', priceRaw: 1250000,
    address: '42 Park Avenue, Mosman, Sydney, NSW 2088',
    suburb: 'Mosman', state: 'NSW', postcode: '2088',
    beds: 4, baths: 3, cars: 2, land: '650 m²', built: 2018, type: 'House',
    badge: { label: 'High Growth Potential', color: 'green' },
    aiMatch: 98,
    aiInsight: 'North-facing rear with a large entertainer\'s deck, mature natives providing privacy screening, and solar panels (6.6kW) not mentioned in the listing.',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'This stunning contemporary family home offers the perfect blend of luxury and functionality. Featuring open-plan living spaces, premium finishes, and seamless indoor-outdoor flow, this property is ideal for modern family living.',
    features: [
      'Open plan living and dining area', 'Master suite with walk-in robe and ensuite',
      'Home office/study nook', 'Double garage with internal access',
      'Smart home automation system', 'Gourmet kitchen with Miele appliances',
      'Three additional bedrooms with built-ins', 'Ducted air conditioning throughout',
      'Solar panels (6.6kW system)', 'Security system with CCTV',
    ],
    scores: { schools: 9.1, safety: 8.4, lifestyle: 9.0, growth: '+12.5%', growthPos: true },
    agent: { name: 'Sarah Mitchell', role: 'Ray White Mosman', phone: '0412 345 678' },
    openHome: 'Saturday, 15 Mar · 10:00 – 10:30 AM',
  },
  {
    id: '2', slug: '88-collins-street-melbourne',
    title: 'Luxury Apartment',
    price: '$890,000', priceRaw: 890000,
    address: '88 Collins Street, Melbourne, VIC 3000',
    suburb: 'Melbourne CBD', state: 'VIC', postcode: '3000',
    beds: 2, baths: 2, cars: 1, land: '120 m²', built: 2021, type: 'Apartment',
    badge: { label: 'Investment Hotspot', color: 'purple' },
    aiMatch: 95,
    aiInsight: 'Floor-to-ceiling glazing reveals an unobstructed bay panorama. Rooftop terrace access detected — not referenced in the agent\'s listing description.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'Positioned on the 34th floor of one of Melbourne\'s most prestigious towers, this luxuriously appointed apartment delivers breathtaking city and bay views across a highly refined open-plan layout.',
    features: ['34th floor city views','Premium stone finishes','Floor-to-ceiling glazing','Concierge service','Rooftop terrace access','Secure basement parking','Fully equipped gym','Swimming pool'],
    scores: { schools: 7.8, safety: 8.2, lifestyle: 9.5, growth: '+9.8%', growthPos: true },
    agent: { name: 'James Chen', role: 'McGrath Melbourne', phone: '0413 987 654' },
    openHome: 'Sunday, 16 Mar · 1:00 – 1:30 PM',
  },
  {
    id: '3', slug: '15-surf-parade-gold-coast',
    title: 'Beachside Villa',
    price: '$2,100,000', priceRaw: 2100000,
    address: '15 Surf Parade, Broadbeach, Gold Coast, QLD 4218',
    suburb: 'Broadbeach', state: 'QLD', postcode: '4218',
    beds: 5, baths: 4, cars: 3, land: '980 m²', built: 2019, type: 'House',
    badge: { label: 'Lifestyle Premium', color: 'teal' },
    aiMatch: 97,
    aiInsight: 'Satellite confirms direct beach-track access 50m from the front gate. Outdoor pavilion with built-in BBQ and string lighting — not in the listing photos.',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'A breathtaking beachside villa moments from the surf. Five bedrooms, resort pool, and a seamlessly integrated outdoor living pavilion make this the Gold Coast lifestyle property of the year.',
    features: ['50m from beach access','Resort-style pool & spa','Outdoor pavilion & BBQ','Home theatre','5 oversized bedrooms','Lift access all floors','3-car garage','Solar + battery storage'],
    scores: { schools: 7.5, safety: 8.0, lifestyle: 9.8, growth: '+7.2%', growthPos: true },
    agent: { name: 'Lara Fontaine', role: 'CBRE Gold Coast', phone: '0422 111 333' },
    openHome: 'Saturday, 15 Mar · 11:00 – 11:30 AM',
  },
  {
    id: '4', slug: '7-garden-terrace-brisbane',
    title: 'Suburban Haven',
    price: '$750,000', priceRaw: 750000,
    address: '7 Garden Terrace, Paddington, Brisbane, QLD 4064',
    suburb: 'Paddington', state: 'QLD', postcode: '4064',
    beds: 3, baths: 2, cars: 2, land: '450 m²', built: 2010, type: 'House',
    badge: { label: 'Family Friendly', color: 'orange' },
    aiMatch: 94,
    aiInsight: 'In catchment for a top-ranked public primary. Rear deck faces north with established fig tree — perfect shade canopy not visible in listing photos.',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'A beautifully presented family home in leafy Paddington, walking distance to excellent schools, cafes, and parks. Generous entertaining deck and established gardens make this the ideal family retreat.',
    features: ['Outdoor entertaining deck','Established gardens','Open plan living','Modern kitchen','Master with ensuite','Study nook','Double lockup garage','Close to schools'],
    scores: { schools: 9.2, safety: 8.6, lifestyle: 8.7, growth: '+6.4%', growthPos: true },
    agent: { name: 'Tom Bradley', role: 'Ray White Paddington', phone: '0411 222 333' },
    openHome: 'Saturday, 15 Mar · 2:00 – 2:30 PM',
  },
  {
    id: '5', slug: '1-terrace-road-perth',
    title: 'City Penthouse',
    price: '$1,650,000', priceRaw: 1650000,
    address: '1 Terrace Road, East Perth, WA 6004',
    suburb: 'East Perth', state: 'WA', postcode: '6004',
    beds: 3, baths: 2, cars: 2, land: '310 m²', built: 2022, type: 'Penthouse',
    badge: { label: 'Urban Luxury', color: 'blue' },
    aiMatch: 96,
    aiInsight: '270° river views confirmed by satellite. Private rooftop terrace with spa plumbing stubout detected — not disclosed in the agent\'s floor plan.',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'Perth\'s most coveted penthouse. Spanning the full top floor with 270-degree views over the Swan River and city skyline, every detail has been finished to the highest international standard.',
    features: ['Full-floor penthouse','270° river & city views','Private rooftop terrace','Chef\'s kitchen','Smart home system','Private lift lobby','Wine cellar','2 secure car bays'],
    scores: { schools: 7.9, safety: 9.0, lifestyle: 9.3, growth: '+11.2%', growthPos: true },
    agent: { name: 'Nina Walsh', role: 'Acton Belle Perth', phone: '0433 555 777' },
    openHome: 'Sunday, 16 Mar · 10:00 – 10:30 AM',
  },
  {
    id: '6', slug: '22-vineyards-road-adelaide',
    title: 'Country Estate',
    price: '$1,100,000', priceRaw: 1100000,
    address: '22 Vineyards Road, Stirling, Adelaide, SA 5152',
    suburb: 'Stirling', state: 'SA', postcode: '5152',
    beds: 4, baths: 3, cars: 4, land: '2,200 m²', built: 2005, type: 'Acreage',
    badge: { label: 'Space & Serenity', color: 'green' },
    aiMatch: 93,
    aiInsight: 'Mature orchard with 12+ fruit trees and a separate artist\'s studio detected in the rear garden — not mentioned in the listing description.',
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=85',
      'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=700&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=700&q=80',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=700&q=80',
    ],
    description: 'A rare Adelaide Hills estate on 2,200m² with rolling vineyard views, outdoor entertaining pavilion, and exceptional privacy. A complete tree-change package without sacrificing proximity to the city.',
    features: ['2,200m² allotment','Vineyard views','Outdoor pavilion','Cellar/wine room','4-car workshop garage','Bore water system','Orchard & vegetable garden','Close to Stirling village'],
    scores: { schools: 8.8, safety: 9.2, lifestyle: 8.5, growth: '+5.9%', growthPos: true },
    agent: { name: 'Alex Drummond', role: 'Harcourts Adelaide Hills', phone: '0455 888 999' },
    openHome: 'Saturday, 22 Mar · 11:00 – 11:30 AM',
  },
  {
    id: '7', slug: 'sukhumvit-luxury-condo-bkk',
    title: 'Sukhumvit Luxury Condo',
    price: '฿25,500,000', priceRaw: 25500000,
    address: 'Sukhumvit 55, Thong Lo, Bangkok, 10110',
    suburb: 'Thong Lo', state: 'BKK', postcode: '10110',
    beds: 2, baths: 2, cars: 1, land: '85 m²', built: 2023, type: 'Condo',
    badge: { label: 'High Demand', color: 'purple' },
    aiMatch: 95,
    aiInsight: 'Walking distance to BTS station. Has a hidden Japanese onsen room in the condo facility — rarely advertised.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=700&q=80',
    ],
    description: 'An ultra-modern high-rise condo situated in the heart of Thong Lo. Panoramic city views and premium lifestyle amenities.',
    features: ['Infinity Pool','Skylounge','Fitness center','Close to BTS','Concierge'],
    scores: { schools: 8.0, safety: 8.5, lifestyle: 9.9, growth: '+8.0%', growthPos: true },
    agent: { name: 'Somchai P.', role: 'Bangkok Realtors', phone: '+66 81 234 5678' },
    openHome: 'Sunday, 16 Mar · 2:00 – 3:00 PM',
  },
  {
    id: '8', slug: 'phuket-pool-villa',
    title: 'Tropical Pool Villa',
    price: '฿38,000,000', priceRaw: 38000000,
    address: '12 Laguna Road, Cherngtalay, Phuket, 83110',
    suburb: 'Cherngtalay', state: 'Phuket', postcode: '83110',
    beds: 4, baths: 4, cars: 2, land: '600 m²', built: 2020, type: 'Villa',
    badge: { label: 'Resort Living', color: 'teal' },
    aiMatch: 98,
    aiInsight: 'Comes fully furnished with designer custom wood pieces. A dedicated maid\'s quarters is separated from the main living spaces.',
    images: [
      'https://images.unsplash.com/photo-1613490900233-141c556017b3?w=900&q=85',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&q=80',
    ],
    description: 'A beautiful Balinese-inspired pool villa located near Bang Tao beach. Large outdoor living pavilion, private 12m salt-water pool and lush tropical gardens.',
    features: ['Private 12m Pool','Tropical Garden','Maid quarters','Fully Furnished','Close to beach'],
    scores: { schools: 7.5, safety: 9.0, lifestyle: 9.5, growth: '+10.2%', growthPos: true },
    agent: { name: 'Mali T.', role: 'Phuket Luxury Properties', phone: '+66 89 876 5432' },
    openHome: 'Saturday, 15 Mar · 10:00 – 11:30 AM',
  },
  {
    id: '9', slug: 'bgc-sky-residence',
    title: 'BGC Sky Residence',
    price: '₱45,000,000', priceRaw: 45000000,
    address: '32nd Street, Bonifacio Global City, Taguig, 1634',
    suburb: 'BGC', state: 'Metro Manila', postcode: '1634',
    beds: 3, baths: 3, cars: 2, land: '150 m²', built: 2024, type: 'Condominium',
    badge: { label: 'Prime Location', color: 'blue' },
    aiMatch: 92,
    aiInsight: 'Unobstructed view of the Manila Golf Course. Highly sought-after corner unit configuration.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=700&q=80',
    ],
    description: 'An executive penthouse spanning 150sqm in the highly-coveted BGC. Fully upgraded with smart home appliances and marble flooring.',
    features: ['Golf course view','Smart Home','Maid\'s room','2 parking slots','Premium kitchen'],
    scores: { schools: 8.5, safety: 9.5, lifestyle: 9.8, growth: '+15.0%', growthPos: true },
    agent: { name: 'Juan Cruz', role: 'Manila Elite Realty', phone: '+63 917 123 4567' },
    openHome: 'Sunday, 16 Mar · 1:00 – 3:00 PM',
  },
]

export const SUBURB_STATS: SuburbStat[] = [
  { name: 'Mosman', state: 'NSW', region: 'Lower North Shore', medianPrice: '$3.8M', growth: '+12.5%', growthPos: true, rentalYield: '2.2%', safetyScore: 9.1 },
  { name: 'Toorak', state: 'VIC', region: 'Inner East', medianPrice: '$4.1M', growth: '+9.3%', growthPos: true, rentalYield: '2.0%', safetyScore: 9.4 },
  { name: 'Broadbeach', state: 'QLD', region: 'Gold Coast', medianPrice: '$1.4M', growth: '+7.2%', growthPos: true, rentalYield: '4.1%', safetyScore: 8.0 },
  { name: 'Paddington', state: 'QLD', region: 'Inner Brisbane', medianPrice: '$1.1M', growth: '+6.4%', growthPos: true, rentalYield: '3.5%', safetyScore: 8.6 },
  { name: 'East Perth', state: 'WA', region: 'Inner City', medianPrice: '$1.2M', growth: '+11.2%', growthPos: true, rentalYield: '4.8%', safetyScore: 8.2 },
  { name: 'Stirling', state: 'SA', region: 'Adelaide Hills', medianPrice: '$1.0M', growth: '+5.9%', growthPos: true, rentalYield: '3.2%', safetyScore: 9.2 },
]
