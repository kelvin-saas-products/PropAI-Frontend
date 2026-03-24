import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedGrid from '@/components/FeaturedGrid'
import AreaInFocus from '@/components/AreaInFocus'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />      
      <AreaInFocus />
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-ink mt-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-14">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Image src="/logo-dark.svg" alt="Prop.AI" width={110} height={32} className="mb-4"/>
            <p className="text-sm text-white/40 leading-relaxed">
              AI-powered property search.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {[
              { title: 'Search', links: ['Buy', 'Rent', 'Sold', 'New Homes'] },
              { title: 'Discover', links: ['Find Agents', 'Area Guides', 'School Finder', 'Investment'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <Link href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} Prop.AI. All rights reserved.</p>
          <p className="text-xs text-white/25">Built for expats · families · investors</p>
        </div>
      </div>
    </footer>
  )
}
