import { getFeaturedSale, getFeaturedRent } from '@/lib/api'
import FeaturedGridClient from './FeaturedGridClient'

export default async function FeaturedGrid() {
  const [saleProps, rentProps] = await Promise.all([
    getFeaturedSale().catch(() => []),
    getFeaturedRent().catch(() => []),
  ])

  if (saleProps.length === 0 && rentProps.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40 text-sm">No featured properties available.</p>
        <p className="text-white/20 text-xs mt-2 font-mono">
          Make sure the API is running: uvicorn app.main:app --reload
        </p>
      </div>
    )
  }

  return <FeaturedGridClient saleProps={saleProps} rentProps={rentProps} />
}
