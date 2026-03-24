'use client'
import { useState } from 'react'

// ── Area data ─────────────────────────────────────────────────────
const AREAS = [
  {
    name: 'Thong Lor',
    city: 'Bangkok, Thailand',
    emoji: '🇹🇭',
    tag: 'Expat Favourite',
    tagColor: 'bg-[#E0FAF6] text-teal',
    overview: `Thong Lor (Sukhumvit Soi 55) is Bangkok's most cosmopolitan neighbourhood — a seamless blend of luxury condos, Michelin-starred dining, and a vibrant Japanese expat community. Easily accessible via the Thong Lo BTS station, it offers a walkable, upscale lifestyle that appeals strongly to families and professionals relocating from Japan, Australia, and Europe. Property values have appreciated consistently, and the area is considered one of Bangkok's most liveable for those seeking an international standard of living.`,
    scores: [
      { label: 'Expat friendliness', val: 9.4 },
      { label: 'International schools', val: 8.8 },
      { label: 'Lifestyle & dining', val: 9.7 },
      { label: 'Safety', val: 8.5 },
      { label: 'Transport links', val: 8.9 },
      { label: 'Property growth', val: 7.8 },
    ],
    priceRange: '฿8M – ฿45M',
    rentRange: '฿35,000 – ฿120,000 /mo',
    transport: 'BTS Thong Lo · 2 stops to Asok interchange',
    pois: [
      {
        category: 'International Schools',
        icon: '🎓',
        color: 'bg-blue-light border-blue/10',
        items: [
          { name: 'Bangkok Prep International', detail: 'British curriculum · 0.8km' },
          { name: 'NIST International School', detail: 'IB · 1.2km' },
          { name: 'Shrewsbury International', detail: 'British · 2.1km' },
          { name: 'St Andrews International', detail: 'British/IB · 1.9km' },
        ],
      },
      {
        category: 'Hospitals & Health',
        icon: '🏥',
        color: 'bg-[#FEF2F2] border-red-100',
        items: [
          { name: 'Samitivej Sukhumvit Hospital', detail: 'International · 1.1km' },
          { name: 'Phyathai 1 Hospital', detail: 'Full service · 2.4km' },
          { name: 'The Racquet Club', detail: 'Gym, pool, sports · 0.6km' },
          { name: 'Thong Lor Dental Clinic', detail: 'International standard · 0.3km' },
        ],
      },
      {
        category: 'Cafés & Dining',
        icon: '☕',
        color: 'bg-[#FFF7ED] border-orange/10',
        items: [
          { name: 'The Commons Thonglor', detail: 'Community dining hub · in-area' },
          { name: 'Homeland Grocer', detail: 'Farm-to-table brunch · in-area' },
          { name: 'Dry Wave Cocktail Bar', detail: '#5 Asia\'s Best Bars · in-area' },
          { name: 'R-HAAN', detail: '2 Michelin stars, Thai · in-area' },
        ],
      },
      {
        category: 'Supermarkets & Shopping',
        icon: '🛒',
        color: 'bg-[#F0EEFF] border-violet/10',
        items: [
          { name: 'J Avenue Lifestyle Centre', detail: 'La Villa International Market · in-area' },
          { name: 'Tops Market Thonglor', detail: 'Full supermarket · 0.4km' },
          { name: 'Don Don Donki', detail: 'Japanese superstore · 0.5km' },
          { name: 'Eight Thonglor Mall', detail: 'Boutique shopping · in-area' },
        ],
      },
      {
        category: 'Parks & Recreation',
        icon: '🌿',
        color: 'bg-[#E0FAF6] border-teal/10',
        items: [
          { name: 'Benchakitti Forest Park', detail: 'Cycling, running · 1.8km' },
          { name: 'Benchasiri Park', detail: 'Sculpture garden · 1.3km' },
          { name: 'The Racquet Club', detail: 'Tennis, squash, pool · 0.6km' },
          { name: 'Thong Lor Boxing Stadium', detail: 'Muay Thai · in-area' },
        ],
      },
      {
        category: 'Expat Community',
        icon: '🌍',
        color: 'bg-surface border-subtle',
        items: [
          { name: 'Japanese expat hub', detail: 'Largest concentration in Bangkok' },
          { name: 'Australian & European communities', detail: 'Growing presence' },
          { name: 'Co-working & startup scene', detail: 'Multiple spaces in-area' },
          { name: 'International events & networking', detail: 'Regular community meetups' },
        ],
      },
    ],
    aiInsight: 'Thong Lor scores exceptionally well for families with school-age children — 4 top-ranked international schools are within 2km. The Japanese expat community is the largest in Bangkok, making this ideal for Japanese families relocating for work. The BTS Thong Lo station provides direct access to the CBD in under 20 minutes, and the area\'s walkability score is the highest in Bangkok\'s Sukhumvit corridor.',
  },
  {
    name: 'Ekkamai',
    city: 'Bangkok, Thailand',
    emoji: '🇹🇭',
    tag: 'Up & Coming',
    tagColor: 'bg-purple-light text-purple',
    overview: `Ekkamai (Sukhumvit Soi 63) sits immediately east of Thong Lor and is increasingly favoured by younger expats seeking a slightly quieter, more affordable alternative without sacrificing lifestyle. Known for its creative community, excellent cafés, and the major Ekkamai Bus Terminal, it offers strong transport links and a growing number of international dining options.`,
    scores: [
      { label: 'Expat friendliness', val: 8.6 },
      { label: 'International schools', val: 7.9 },
      { label: 'Lifestyle & dining', val: 9.1 },
      { label: 'Safety', val: 8.7 },
      { label: 'Transport links', val: 9.2 },
      { label: 'Property growth', val: 8.4 },
    ],
    priceRange: '฿6M – ฿28M',
    rentRange: '฿25,000 – ฿80,000 /mo',
    transport: 'BTS Ekkamai · Bus terminal for eastern Thailand',
    pois: [
      { category: 'International Schools', icon: '🎓', color: 'bg-blue-light border-blue/10', items: [
        { name: 'Ekkamai International School', detail: 'IB curriculum · in-area' },
        { name: 'Australian International School', detail: 'Australian curriculum · 1.5km' },
        { name: 'Bangkok International Prep', detail: 'British · 2.3km' },
        { name: 'NIST International School', detail: 'IB · 1.8km' },
      ]},
      { category: 'Cafés & Dining', icon: '☕', color: 'bg-[#FFF7ED] border-orange/10', items: [
        { name: 'Roast Coffee & Eatery', detail: 'Award-winning café · in-area' },
        { name: 'Gallery Drip Coffee', detail: 'Specialty coffee · in-area' },
        { name: 'Rabbit Hole', detail: 'Speakeasy cocktail bar · in-area' },
        { name: 'Soul Food Mahanakorn', detail: 'Thai-Western fusion · in-area' },
      ]},
      { category: 'Hospitals & Health', icon: '🏥', color: 'bg-[#FEF2F2] border-red-100', items: [
        { name: 'Samitivej Sukhumvit', detail: 'International · 1.5km' },
        { name: 'Bangkok Hospital Sukhumvit', detail: 'Full service · 2.1km' },
        { name: 'Absolute You Yoga', detail: 'Yoga & wellness · in-area' },
        { name: 'Virgin Active Gym', detail: 'International fitness · 1.2km' },
      ]},
      { category: 'Parks & Recreation', icon: '🌿', color: 'bg-[#E0FAF6] border-teal/10', items: [
        { name: 'Ekkamai Sports Complex', detail: 'Pool, courts · in-area' },
        { name: 'Benchakitti Forest Park', detail: 'Cycling, running · 2.2km' },
        { name: 'Pridi Banomyong Park', detail: 'Quiet green space · 1.1km' },
        { name: 'W District Walking Street', detail: 'Weekend market · in-area' },
      ]},
      { category: 'Supermarkets & Shopping', icon: '🛒', color: 'bg-[#F0EEFF] border-violet/10', items: [
        { name: 'Gateway Ekamai Mall', detail: 'Japanese theme mall · in-area' },
        { name: 'Tops Market', detail: 'Full supermarket · 0.5km' },
        { name: 'Big C Extra', detail: 'Hypermarket · 1.2km' },
        { name: 'Donki Mall Thonglor', detail: 'Japanese mega-store · 1.0km' },
      ]},
      { category: 'Expat Community', icon: '🌍', color: 'bg-surface border-subtle', items: [
        { name: 'Creative & digital nomad community', detail: 'Co-working spaces throughout' },
        { name: 'Korean expat presence', detail: 'Growing community' },
        { name: 'Weekend markets & events', detail: 'Strong local culture' },
        { name: 'Startup ecosystem', detail: 'Tech and creative hubs' },
      ]},
    ],
    aiInsight: 'Ekkamai offers 15-25% lower property prices than adjacent Thong Lor while sharing most of the same amenities. The area is seeing above-average capital growth as young professionals and families seek more space for their budget. Excellent transport links including the BTS and the Eastern Bus Terminal make regional travel easy.',
  },
]

function ScoreBar({ label, val }: { label: string; val: number }) {
  const pct = (val / 10) * 100
  const color = val >= 9 ? '#20D3B3' : val >= 8 ? '#3B82F6' : '#8B5CF6'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-ink2">{label}</span>
        <span className="text-xs font-bold text-ink" style={{ color }}>{val}</span>
      </div>
      <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}CC)` }}/>
      </div>
    </div>
  )
}

export default function AreaInFocus() {
  const [activeArea, setActiveArea] = useState(0)
  const area = AREAS[activeArea]

  return (
    <section className="py-20 px-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">✦ AI-Powered</p>
          <h2 className="text-3xl font-bold text-ink tracking-tight">Area in Focus</h2>
          <p className="text-sm text-ink2 mt-2 max-w-xl">
            PropAI analyses each neighbourhood across schools, lifestyle, safety, transport and expat-friendliness — so you can choose where to live with confidence.
          </p>
        </div>

        {/* Area switcher */}
        <div className="flex gap-2 flex-shrink-0">
          {AREAS.map((a, i) => (
            <button key={a.name} onClick={() => setActiveArea(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeArea === i
                  ? 'text-white border-transparent shadow-glow'
                  : 'bg-white border-subtle text-ink2 hover:border-blue/30'
              }`}
              style={activeArea === i ? { background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' } : {}}>
              <span>{a.emoji}</span>
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-3xl border border-subtle shadow-card overflow-hidden">

        {/* Top band */}
        <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#20D3B3,#3B82F6,#8B5CF6)' }}/>

        <div className="p-6 lg:p-8">
          {/* Area title row */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl font-bold text-ink">{area.emoji} {area.name}</h3>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${area.tagColor}`}>{area.tag}</span>
              </div>
              <p className="text-sm text-ink2 mt-1">{area.city}</p>
            </div>
            <div className="flex gap-6 text-right flex-wrap">
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Buy</p>
                <p className="text-sm font-bold text-ink mt-0.5">{area.priceRange}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Rent</p>
                <p className="text-sm font-bold text-ink mt-0.5">{area.rentRange}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wider">Transport</p>
                <p className="text-sm font-bold text-ink mt-0.5">{area.transport}</p>
              </div>
            </div>
          </div>

          {/* Two-col: overview + scores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <p className="text-sm text-ink2 leading-relaxed">{area.overview}</p>

              {/* AI Insight */}
              <div className="mt-5 bg-ink rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10 blur-2xl"
                  style={{ background: 'radial-gradient(circle,#20D3B3,#3B82F6)' }}/>
                <div className="relative">
                  <p className="text-xs font-bold uppercase tracking-widest text-teal mb-2">✦ AI Insight</p>
                  <p className="text-sm text-white/70 leading-relaxed">{area.aiInsight}</p>
                </div>
              </div>
            </div>

            {/* Scores */}
            <div className="bg-surface rounded-2xl p-5 border border-subtle space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Area scores</p>
              {area.scores.map(s => (
                <ScoreBar key={s.label} label={s.label} val={s.val}/>
              ))}
            </div>
          </div>

          {/* Places of interest grid */}
          <div>
            <p className="text-sm font-bold text-ink mb-4">Places of interest</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {area.pois.map(poi => (
                <div key={poi.category} className={`rounded-2xl border p-4 ${poi.color}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{poi.icon}</span>
                    <p className="text-xs font-bold text-ink uppercase tracking-wider">{poi.category}</p>
                  </div>
                  <ul className="space-y-2">
                    {poi.items.map(item => (
                      <li key={item.name} className="flex items-start gap-2">
                        <svg className="w-3 h-3 text-teal flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        <div>
                          <p className="text-xs font-semibold text-ink leading-tight">{item.name}</p>
                          <p className="text-[10px] text-muted mt-0.5">{item.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 pt-6 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-ink2">
              <span className="font-semibold text-ink">{area.name}</span> has{' '}
              <span className="gradient-text font-bold">47 active listings</span> right now
            </p>
            <div className="flex gap-3">
              <button className="text-sm font-semibold text-ink2 border border-subtle bg-white px-5 py-2.5 rounded-xl hover:border-blue/30 hover:text-ink transition-all">
                Full area report
              </button>
              <button className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-card"
                style={{ background: 'linear-gradient(135deg,#20D3B3,#3B82F6,#8B5CF6)' }}>
                Browse listings →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
