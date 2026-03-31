import { Suspense } from 'react'
import RentNavbar from '@/components/RentNavbar'
import RentPageClient from '@/components/RentPageClient'

export const dynamic = 'force-dynamic'

/**
 * Rent page — thin server shell.
 *
 * All data fetching (with country, pagination, filters) is done client-side in
 * RentPageClient so that:
 *  1. The country is correctly derived from the user's IP / saved preference
 *     before the first fetch (no stale server-side country guess).
 *  2. Page changes, filter changes, and country changes all trigger real
 *     backend pagination requests — no client-side virtual scrolling over a
 *     large flat payload.
 */
export default function RentPage() {
  return (
    <div className="min-h-screen bg-bg">
      <Suspense>
        <RentNavbar />
      </Suspense>
      <Suspense>
        <RentPageClient />
      </Suspense>
    </div>
  )
}
