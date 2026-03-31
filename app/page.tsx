import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedGrid from '@/components/FeaturedGrid'
import AreaInFocus from '@/components/AreaInFocus'
import Footer from '@/components/Footer'

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
