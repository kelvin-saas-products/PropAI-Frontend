import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturedGrid from '@/components/FeaturedGrid'
import { SUBURB_STATS } from '@/lib/data'
import { T } from '@/lib/i18n'

export const revalidate = 60 // ISR: re-fetch from API every 60s

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* ── HERO (client component for search interactivity) ── */}
      <HeroSection />

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="bg-white px-5 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-black text-ink mb-3"><T k="How PropAI Works" /></h2>
            <p className="text-muted"><T k="Three simple steps to your perfect property" /></p>
            <div className="w-12 h-0.5 bg-ink mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              {
                num: '1',
                iconPath: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
                iconColor: 'text-blue', iconBg: 'bg-blue-light',
                title: 'Describe Your Vision',
                desc: "Tell our AI what you're looking for in natural language. 'A 3-bedroom family home near good schools with a garden.'",
              },
              {
                num: '2',
                iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
                iconColor: 'text-purple', iconBg: 'bg-purple-light',
                title: 'Get AI Matches',
                desc: 'Our algorithm analyses 50+ factors across thousands of properties to find your perfect matches with 98% accuracy.',
              },
              {
                num: '3',
                iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                iconColor: 'text-green', iconBg: 'bg-green-light',
                title: 'Make Informed Decisions',
                desc: 'Access detailed insights on suburbs, schools, growth potential, and market trends to buy with confidence.',
              },
            ].map((step) => (
              <div key={step.num} className="bg-bg rounded-2xl p-6 relative">
                <span className="absolute top-5 right-5 w-7 h-7 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.num}
                </span>
                <div className={`w-14 h-14 ${step.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
                  <svg className={`w-7 h-7 ${step.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.iconPath}/>
                  </svg>
                </div>
                <h3 className="font-bold text-ink text-lg mb-2"><T k={step.title} /></h3>
                <p className="text-sm text-muted leading-relaxed"><T k={step.desc} /></p>
              </div>
            ))}
          </div>

          {/* AI Technology split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-bg border border-subtle rounded-full px-3.5 py-1.5 text-sm font-medium text-ink mb-6">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <T k="AI Technology" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-ink mb-3"><T k="AI-Powered Intelligence" /></h2>
              <p className="text-muted mb-8"><T k="Technology that understands what you need" /></p>
              <div className="space-y-5">
                {[
                  { icon: '💬', title: 'Natural Language Search', desc: "Search like you're talking to a friend. No more complicated filters." },
                  { icon: '⚙️', title: 'Smart Matching Algorithm', desc: "Our AI learns your preferences and finds properties you'll love." },
                  { icon: '📊', title: 'Predictive Analytics', desc: 'Get ahead of the market with AI-driven price and growth forecasts.' },
                  { icon: '🔍', title: 'Vision Analysis', desc: 'AI scans every photo to surface features the seller forgot to mention.' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-bg transition-colors">
                    <div className="w-9 h-9 bg-bg border border-subtle rounded-xl flex items-center justify-center text-lg flex-shrink-0">{f.icon}</div>
                    <div>
                      <p className="font-semibold text-ink text-sm mb-0.5"><T k={f.title} /></p>
                      <p className="text-xs text-muted leading-relaxed"><T k={f.desc} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[420px] rounded-3xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&q=85" alt="AI features" className="w-full h-full object-cover"/>
              </div>
              <div className="absolute top-6 left-0 -translate-x-1/4 bg-white rounded-2xl px-4 py-3 shadow-float min-w-36">
                <p className="text-xs text-muted mb-1"><T k="Price Prediction" /></p>
                <p className="text-2xl font-black text-green leading-none">+12.5%</p>
                <p className="text-xs text-muted mt-0.5"><T k="Growth forecast" /></p>
              </div>
              <div className="absolute bottom-8 right-0 translate-x-1/4 bg-white rounded-2xl px-4 py-3 shadow-float text-right">
                <p className="text-xs text-muted mb-1"><T k="School Rating" /></p>
                <p className="text-2xl font-black text-blue leading-none">9.2<span className="text-sm font-normal text-muted">/10</span></p>
                <p className="text-xs text-muted mt-0.5"><T k="Nearby schools" /></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES (server-fetched from FastAPI + MongoDB) ── */}
      <section className="bg-dark px-5 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-white"><T k="Featured Properties" /></h2>
              <p className="text-white/50 mt-1 text-sm"><T k="Handpicked homes matched by our AI" /></p>
            </div>
            <Link href="#" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              <T k="View All Properties →" />
            </Link>
          </div>

          {/* FeaturedGrid is a server component — fetches from FastAPI */}
          <FeaturedGrid />
        </div>
      </section>

      {/* ── MARKET INSIGHTS ────────────────────────────────────── */}
      <section className="bg-white px-5 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-ink mb-2"><T k="Market Insights" /></h2>
            <p className="text-muted text-sm"><T k="Data-driven intelligence for smarter decisions" /></p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {[
              { icon: '📈', val: '+12.5%', label: 'Avg. Annual Growth',      color: 'text-green',  bg: 'bg-green-light'  },
              { icon: '⚡', val: '847',    label: 'New Listings This Week',  color: 'text-blue',   bg: 'bg-blue-light'   },
              { icon: '🎯', val: '94%',    label: 'AI Match Accuracy',       color: 'text-purple', bg: 'bg-purple-light' },
              { icon: '📍', val: '24',     label: 'Hot Suburbs Identified',  color: 'text-orange', bg: 'bg-orange-light' },
            ].map(m => (
              <div key={m.label} className="bg-bg rounded-2xl p-6 text-center">
                <div className={`w-12 h-12 ${m.bg} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>{m.icon}</div>
                <p className={`text-3xl font-black ${m.color} mb-1`}>{m.val}</p>
                <p className="text-xs text-muted"><T k={m.label} /></p>
              </div>
            ))}
          </div>

          <h3 className="font-bold text-ink text-xl mb-5"><T k="Trending Suburbs" /></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUBURB_STATS.map(s => (
              <div key={s.name} className="bg-bg rounded-xl p-5 hover:bg-subtle/40 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-ink">{s.name}</p>
                    <p className="text-xs text-muted">{s.state} · {s.region}</p>
                  </div>
                  <span className={`text-sm font-bold ${s.growthPos ? 'text-green' : 'text-orange'}`}>{s.growth}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div><p className="text-muted"><T k="Median" /></p><p className="font-semibold text-ink mt-0.5">{s.medianPrice}</p></div>
                  <div><p className="text-muted"><T k="Yield" /></p><p className="font-semibold text-ink mt-0.5">{s.rentalYield}</p></div>
                  <div><p className="text-muted"><T k="Safety" /></p><p className="font-semibold text-ink mt-0.5">{s.safetyScore}/10</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-ink px-5 lg:px-8 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-4"><T k="Ready to find your perfect home?" /></h2>
          <p className="text-white/50 mb-8"><T k="Join 50,000+ Australians who found their home with PropAI" /></p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="#" className="bg-white text-ink font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-sm"><T k="Start AI Search" /></Link>
            <Link href="#" className="border border-white/20 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"><T k="Browse Listings" /></Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark border-t border-white/10 px-5 lg:px-8 py-10">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <span className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-ink text-xs font-bold">P</span>
            PropAI
          </div>
          <nav className="flex flex-wrap gap-6">
            {['Buy','Rent','Sell','Insights','Privacy','Terms'].map(item => (
              <Link key={item} href="#" className="text-sm text-white/40 hover:text-white transition-colors"><T k={item} /></Link>
            ))}
          </nav>
          <p className="text-sm text-white/30">© 2025 PropAI. AI-powered property search.</p>
        </div>
      </footer>
    </div>
  )
}
