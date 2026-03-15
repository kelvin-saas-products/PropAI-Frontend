import { notFound } from 'next/navigation'
import { getPropertyBySlug } from '@/lib/api'
import PropertyDetailClient from '@/components/PropertyDetailClient'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const property = await getPropertyBySlug(slug)
    return {
      title: `${property.title} — ${property.address} | PropAI`,
      description: property.description.slice(0, 155),
    }
  } catch {
    return { title: 'Property Not Found | PropAI' }
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let property
  try {
    property = await getPropertyBySlug(slug)
  } catch {
    notFound()
  }
  return <PropertyDetailClient property={property} />
}
