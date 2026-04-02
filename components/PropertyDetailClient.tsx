'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import type { AnyProperty, BadgeColor, SaleProperty, RentProperty } from '@/lib/types'
import ListingsNavbar from './ListingsNavbar'
import Footer from './Footer'
import Breadcrumb from './Breadcrumb'
import PropertyHeroGallery from './PropertyHeroGallery'

const BADGE_STYLES: Record<BadgeColor, string> = {
  green: 'bg-green text-white',
  purple: 'bg-purple text-white',
  orange: 'bg-orange text-white',
  blue: 'bg-blue text-white',
  teal: 'bg-teal text-white',
}

function TabBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${active ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
      {label}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-ink mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-subtle rounded-2xl p-5 ${className}`}>{children}</div>
}

function HeroMedia({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`absolute inset-0 object-cover ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      unoptimized
    />
  )
}

function OverviewTab({ property }: { property: AnyProperty }) {
  return (
    <div>
      <Section title="Description">
        <p className="text-sm text-muted leading-relaxed">{property.description}</p>
      </Section>

      <div className="bg-ink rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">AI Vision Analysis</span>
        </div>
        <p className="text-white/70 text-sm leading-relaxed mb-4">Our AI has analysed all listing photos and cross-referenced satellite imagery to surface features not mentioned in the listing.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'Palm', title: 'Outdoor Verandah w/ Palm Garden', body: 'Deep rear verandah with established Bangalow palms, perfect for year-round entertaining.' },
            { icon: 'Sun', title: 'North-Facing Rear Aspect', body: 'Satellite confirms north-northwest orientation, flooding the living area with afternoon light.' },
            { icon: 'Solar', title: 'Solar Panels Detected (6.6kW)', body: '18 panels on the north roof plane with strong feed-in tariff potential.' },
            { icon: 'Pool', title: 'Pool Preparation Slab', body: 'Concrete slab with plumbing stubouts in rear garden suggests a planned pool installation.' },
          ].map(obs => (
            <div key={obs.title} className="bg-white/8 rounded-xl p-3.5 flex gap-3">
              <span className="text-white/55 text-xs font-semibold flex-shrink-0">{obs.icon}</span>
              <div>
                <p className="text-white text-xs font-semibold mb-1">{obs.title}</p>
                <p className="text-white/55 text-xs leading-relaxed">{obs.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Section title="Features">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {property.features.map((feature: string) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-muted">
              <svg className="w-4 h-4 text-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

const priceHistory = [
  { year: '2013', price: 675 },
  { year: '2015', price: 820 },
  { year: '2019', price: 1000 },
  { year: '2022', price: 1150 },
  { year: '2025', price: 1250 },
]

function HistoryTab() {
  return (
    <div>
      <Section title="Price History">
        <Card className="mb-4">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v: number) => [`$${v}K`, 'Price']} contentStyle={{ fontSize: 12, borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="price" stroke="#22C55E" strokeWidth={2.5} fill="url(#g)" dot={{ fill: '#22C55E', r: 4, strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtle">
                {['Date', 'Type', 'Price', 'Change', 'Agent'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Mar 2025', type: 'For Sale', price: '$1,250,000', change: '+8.7%', agent: 'Ray White', pos: true },
                { date: 'Nov 2022', type: 'Sold', price: '$1,150,000', change: '+15.0%', agent: 'LJ Hooker', pos: true },
                { date: 'Jun 2019', type: 'Sold', price: '$1,000,000', change: '+21.9%', agent: 'McGrath', pos: true },
                { date: 'Feb 2015', type: 'Sold', price: '$820,000', change: '+21.5%', agent: 'Ray White', pos: true },
                { date: 'Aug 2013', type: 'Sold', price: '$675,000', change: '-', agent: 'LJ Hooker', pos: false },
              ].map((r, i) => (
                <tr key={i} className="border-b border-subtle/50 hover:bg-bg transition-colors">
                  <td className="py-3 px-3 text-ink">{r.date}</td>
                  <td className="py-3 px-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.type === 'Sold' ? 'bg-green-light text-green' : 'bg-blue-light text-blue'}`}>{r.type}</span></td>
                  <td className="py-3 px-3 font-semibold text-ink">{r.price}</td>
                  <td className={`py-3 px-3 font-medium ${r.pos ? 'text-green' : 'text-muted'}`}>{r.change}</td>
                  <td className="py-3 px-3 text-muted">{r.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Rental History">
        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtle">
                {['Period', 'Weekly Rent', 'Duration'].map(h => (
                  <th key={h} className="text-left py-2.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { period: 'Mar 2016 - Jun 2019', rent: '$950/wk', dur: '39 months' },
                { period: 'Jul 2019 - Jan 2021', rent: '$1,100/wk', dur: '18 months' },
                { period: 'Feb 2021 - Oct 2022', rent: '$1,250/wk', dur: '21 months' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-subtle/50 last:border-0">
                  <td className="py-3 px-2 text-ink">{r.period}</td>
                  <td className="py-3 px-2 font-semibold text-ink">{r.rent}</td>
                  <td className="py-3 px-2 text-muted">{r.dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-3 pt-3 border-t border-subtle">Estimated current rental value: <strong className="text-ink">$1,400-$1,500/wk</strong></p>
        </Card>
      </Section>
    </div>
  )
}

function SuburbProfileTab() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { val: '8.4', label: 'Safety Score', color: 'text-green' },
          { val: '9.0', label: 'Lifestyle', color: 'text-blue' },
          { val: '9.1', label: 'Expat Friendly', color: 'text-purple' },
          { val: '9.1', label: 'Schools', color: 'text-green' },
        ].map(s => (
          <Card key={s.label} className="text-center !py-5">
            <p className={`text-3xl font-black ${s.color} mb-1`}>{s.val}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </Card>
        ))}
      </div>
      <Section title="About Mosman">
        <p className="text-sm text-muted leading-relaxed mb-5">Mosman is an affluent harbourside suburb on Sydney's Lower North Shore, approximately 8km from the CBD. Known for its stunning harbour views, premium real estate, and excellent schools, it consistently ranks as one of Sydney's most desirable addresses.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Median Household Income', value: '$165,000 / year', bar: 88, color: 'bg-green' },
            { label: 'Owner Occupied', value: '58% of dwellings', bar: 58, color: 'bg-blue' },
            { label: 'Walkability', value: '74 / 100 - Very Walkable', bar: 74, color: 'bg-purple' },
            { label: 'Public Transport', value: 'Good (Ferry, Bus)', bar: 71, color: 'bg-green' },
            { label: 'Crime Rate vs State', value: '31% below average', bar: 0, color: '' },
            { label: 'Distance to CBD', value: '8.1 km', bar: 0, color: '' },
          ].map(m => (
            <Card key={m.label}>
              <p className="text-xs text-muted mb-1">{m.label}</p>
              <p className="text-sm font-semibold text-ink">{m.value}</p>
              {m.bar > 0 && (
                <div className="h-1 bg-subtle rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.bar}%` }} />
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}

function SchoolsTab() {
  return (
    <div>
      <Section title="Public School Catchment">
        {[
          { label: 'Primary', name: 'Mosman Public School In Catchment', meta: 'K-6 · 0.7km · State', score: 91, color: 'bg-blue-light text-blue' },
          { label: 'High School', name: 'Mosman High School In Catchment', meta: 'Year 7-12 · 1.2km · State', score: 82, color: 'bg-blue-light text-blue' },
        ].map(s => (
          <Card key={s.name} className="flex items-center gap-4 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${s.color}`}>{s.label.slice(0, 1)}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-ink">{s.name}</p>
              <p className="text-xs text-muted mt-0.5">{s.meta}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-blue">{s.score}</p>
              <p className="text-[10px] text-muted">NAPLAN</p>
            </div>
          </Card>
        ))}
      </Section>
      <Section title="Private Schools Nearby">
        {[
          { rank: '#1', name: 'Cranbrook School', meta: 'Yr 5-12 · 3.2km · Anglican · Boys', score: 97 },
          { rank: '#2', name: 'Queenwood School', meta: 'K-12 · 1.5km · Independent · Girls', score: 96 },
          { rank: '#3', name: 'SCEGGS Redlands', meta: 'K-12 · 2.1km · Anglican · Co-ed', score: 94 },
        ].map(s => (
          <Card key={s.name} className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center text-xs font-bold text-orange flex-shrink-0">{s.rank}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-ink">{s.name}</p>
              <p className="text-xs text-muted mt-0.5">{s.meta}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-orange">{s.score}</p>
              <p className="text-[10px] text-muted">NAPLAN</p>
            </div>
          </Card>
        ))}
      </Section>
    </div>
  )
}

function ShopsTab() {
  return (
    <div>
      <Section title="Cafes and Dining">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'Cafe', name: 'The Boathouse Mosman', type: 'Cafe · 0.5km', rating: '4.8 · 1,100+ reviews' },
            { icon: 'Dining', name: 'Aqua Dining', type: 'Japanese · 1.1km', rating: '4.7 · 820+ reviews' },
            { icon: 'Pavilion', name: 'Bathers Pavilion', type: 'Fine Dining · 0.8km', rating: '4.9 · 2,200+ reviews' },
            { icon: 'Bakery', name: 'Mosman Patisserie', type: 'Bakery · 0.3km', rating: '4.6 · 540+ reviews' },
          ].map(s => (
            <Card key={s.name} className="flex items-center gap-3 !p-4">
              <span className="text-xs font-semibold text-muted">{s.icon}</span>
              <div>
                <p className="font-semibold text-sm text-ink">{s.name}</p>
                <p className="text-xs text-muted">{s.type}</p>
                <p className="text-xs font-medium text-orange mt-0.5">{s.rating}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Shopping and Retail">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: 'Retail', name: 'Military Road Strip', desc: '150+ shops · 0.4km · Fashion, food, services' },
            { icon: 'Grocer', name: 'Woolworths Mosman', desc: 'Supermarket · 0.5km · Open 7am-10pm' },
            { icon: 'Precinct', name: 'Spit Junction', desc: 'Retail precinct · 2.1km · Major anchors' },
            { icon: 'Market', name: 'Mosman Farmers Market', desc: 'Monthly · 0.3km · Sundays 8am-1pm' },
          ].map(s => (
            <Card key={s.name} className="flex items-center gap-3 !p-4">
              <span className="text-xs font-semibold text-muted">{s.icon}</span>
              <div>
                <p className="font-semibold text-sm text-ink">{s.name}</p>
                <p className="text-xs text-muted">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}

function HealthTab() {
  return (
    <div>
      <Section title="Hospitals and Medical">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { type: 'Public Hospital', name: 'Royal North Shore Hospital', dist: '4.2km · 24hr Emergency' },
            { type: 'Private Hospital', name: 'Mater Hospital North Sydney', dist: '3.8km · Private · 24hr' },
            { type: 'Medical Centre', name: 'Mosman Medical Centre', dist: '0.4km · Bulk Billing' },
            { type: 'Pharmacy', name: 'TerryWhite Chemmart Mosman', dist: '0.3km · Open 9am-7pm' },
          ].map(h => (
            <Card key={h.name} className="!p-4">
              <p className="text-[10px] uppercase tracking-wide text-muted mb-1">{h.type}</p>
              <p className="font-semibold text-sm text-ink">{h.name}</p>
              <p className="text-xs text-muted mt-0.5">{h.dist}</p>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="Gyms and Wellness">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { type: 'Gym', name: 'F45 Mosman', dist: '0.6km · 4.8' },
            { type: 'Pool + Gym', name: 'Mosman Swim Centre', dist: '0.9km · 50m pool' },
            { type: 'Yoga', name: 'Stretch Republic Mosman', dist: '0.5km · 4.9' },
            { type: '24hr Gym', name: 'Anytime Fitness Neutral Bay', dist: '1.4km · 24/7 access' },
          ].map(h => (
            <Card key={h.name} className="!p-4">
              <p className="text-[10px] uppercase tracking-wide text-muted mb-1">{h.type}</p>
              <p className="font-semibold text-sm text-ink">{h.name}</p>
              <p className="text-xs text-muted mt-0.5">{h.dist}</p>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  )
}

const growthData = [
  { year: '2015', v: 35, f: false },
  { year: '2016', v: 52, f: false },
  { year: '2017', v: 44, f: false },
  { year: '2018', v: 28, f: false },
  { year: '2019', v: 18, f: false },
  { year: '2020', v: 22, f: false },
  { year: '2021', v: 65, f: false },
  { year: '2022', v: 55, f: false },
  { year: '2023', v: 60, f: false },
  { year: '2024', v: 72, f: false },
  { year: '2025F', v: 65, f: true },
  { year: '2026F', v: 70, f: true },
]

function InvestmentTab() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { val: '+12.5%', label: '12-Month Growth', color: 'text-green' },
          { val: '2.2%', label: 'Gross Rental Yield', color: 'text-blue' },
          { val: '+85%', label: '10-Year Growth', color: 'text-purple' },
        ].map(m => (
          <Card key={m.label} className="text-center">
            <p className={`text-2xl font-black ${m.color} mb-1`}>{m.val}</p>
            <p className="text-xs text-muted">{m.label}</p>
          </Card>
        ))}
      </div>
      <Section title="Annual Capital Growth">
        <Card>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={growthData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fontSize: 9, fill: '#6B7280' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {growthData.map((e, i) => <Cell key={i} fill={e.f ? 'rgba(34,197,94,0.3)' : '#22C55E'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-muted mt-2">F = AI forecast. Past performance is not indicative of future returns.</p>
        </Card>
      </Section>
      <Section title="AI Investment Outlook">
        <Card className="bg-bg border-0">
          <p className="text-sm text-muted leading-relaxed">Mosman continues to benefit from its harbourside location and proximity to Sydney's top private schools. With a rental vacancy rate of just 0.8%, demand consistently outstrips supply. AI modelling suggests 8-12% annualised capital growth over the next 3 years, driven by infrastructure investment and population demand on the Lower North Shore.</p>
        </Card>
      </Section>
    </div>
  )
}

function FinancingTab() {
  const [price, setPrice] = useState(1250000)
  const [deposit, setDeposit] = useState(250000)
  const [rate, setRate] = useState(6.19)
  const [term, setTerm] = useState(30)

  const loan = price - deposit
  const mr = rate / 100 / 12
  const n = term * 12
  const monthly = loan > 0 && mr > 0 ? (loan * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 0
  const totalInterest = monthly * n - loan
  const lvr = price > 0 ? ((loan / price) * 100).toFixed(1) : '0'
  const fmt = (v: number) => '$' + Math.round(v).toLocaleString()

  return (
    <div>
      <Section title="Mortgage Calculator">
        <Card>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { label: 'Property Price', value: price, set: setPrice, step: 5000 },
              { label: 'Deposit', value: deposit, set: setDeposit, step: 5000 },
              { label: 'Interest Rate (%)', value: rate, set: setRate, step: 0.01 },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">{f.label}</label>
                <input type="number" value={f.value} step={f.step} onChange={e => f.set(parseFloat(e.target.value) || 0)} className="w-full px-3.5 py-2.5 border border-subtle rounded-xl text-sm text-ink bg-bg outline-none focus:border-ink/30 transition-colors" />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">Loan Term</label>
              <select value={term} onChange={e => setTerm(parseInt(e.target.value, 10))} className="w-full px-3.5 py-2.5 border border-subtle rounded-xl text-sm bg-bg text-ink outline-none">
                {[15, 20, 25, 30].map(t => <option key={t} value={t}>{t} years</option>)}
              </select>
            </div>
          </div>
          <div className="bg-bg rounded-xl p-4 grid grid-cols-2 gap-4">
            {[
              { label: 'Monthly Repayment', val: fmt(monthly) },
              { label: 'Loan Amount', val: fmt(loan) },
              { label: 'Total Interest', val: fmt(totalInterest) },
              { label: 'LVR', val: `${lvr}%` },
            ].map(r => (
              <div key={r.label}>
                <p className="text-2xl font-black text-ink">{r.val}</p>
                <p className="text-xs text-muted mt-0.5">{r.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      <Section title="Current Lender Rates">
        {[
          { abbr: 'CBA', name: 'Commonwealth Bank', meta: 'Variable · P&I · No annual fee', rate: '5.99%' },
          { abbr: 'ANZ', name: 'ANZ', meta: 'Variable · P&I · Offset account', rate: '6.04%' },
          { abbr: 'NAB', name: 'NAB', meta: 'Fixed 2yr · P&I · Cashback $2,000', rate: '5.89%' },
          { abbr: 'ATH', name: 'Athena Home Loans', meta: 'Variable · Auto rate match', rate: '5.74%' },
        ].map(l => (
          <Card key={l.name} className="flex items-center gap-4 mb-3 !p-4">
            <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center text-xs font-bold text-ink flex-shrink-0">{l.abbr}</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-ink">{l.name}</p>
              <p className="text-xs text-muted">{l.meta}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-green">{l.rate}</p>
              <p className="text-[10px] text-muted">p.a.</p>
            </div>
          </Card>
        ))}
      </Section>
    </div>
  )
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'history', label: 'History' },
  { id: 'suburb', label: 'Suburb Profile' },
  { id: 'schools', label: 'Schools' },
  { id: 'shops', label: 'Shops' },
  { id: 'health', label: 'Health' },
  { id: 'investment', label: 'Investment' },
  { id: 'financing', label: 'Financing' },
]

const GALLERY_LABELS = ['Street view', 'Interiors', 'Kitchen', 'Outdoor', 'Details', 'Surrounds']

export default function PropertyDetailClient({ property }: { property: AnyProperty }) {
  const [tab, setTab] = useState('overview')
  const listingPageType = property.listingType === 'sale' ? 'buy' : 'rent'
  const saleProperty = property.listingType === 'sale' ? property as SaleProperty : null
  const rentProperty = property.listingType === 'rent' ? property as RentProperty : null
  const displayPrice = property.priceDisplay || (property.listingType === 'sale' ? property.salePrice : property.weeklyRent)
  const priceLabel = property.listingType === 'sale' ? 'Guide Price' : 'Weekly Rent'
  const heroImages = property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80']
  const primaryImage = heroImages[0]
  const collageImages = [heroImages[1] ?? primaryImage, heroImages[2] ?? primaryImage, heroImages[3] ?? primaryImage]
  const galleryImages = heroImages.slice(0, 6).map((src, index) => ({
    src,
    alt: `${property.title} image ${index + 1}`,
    aspect_ratio: index === 0 ? 1.72 : index === 1 ? 0.92 : index === 2 ? 0.92 : index === 3 ? 1.08 : 1.18,
    nextImageProps: {
      unoptimized: true,
      priority: index < 3,
    },
  }))
  const extraImageCount = Math.max(0, heroImages.length - galleryImages.length)
  const breadcrumbs = [
    { label: listingPageType === 'buy' ? 'Buy' : 'Rent', href: `/${listingPageType}` },
    { label: property.country, href: `/${listingPageType}?country=${encodeURIComponent(property.country)}` },
    { label: property.state, href: `/${listingPageType}?country=${encodeURIComponent(property.country)}` },
    { label: property.suburb, href: `/${listingPageType}?country=${encodeURIComponent(property.country)}` },
    { label: property.propertyType },
    { label: property.address },
  ]

  return (
    <div className="min-h-screen bg-bg">
      <ListingsNavbar listingType={listingPageType} />

      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3">
          <Link href={`/${listingPageType}`} className="inline-flex items-center gap-1.5 text-xs text-blue hover:text-ink transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to results
          </Link>
          <div className="min-w-0 flex-1">
            <Breadcrumb items={breadcrumbs} />
          </div>
        </div>
      </div>

      <PropertyHeroGallery property={property} />

      <section className="hidden border-y border-black/5 bg-[#eceae6]">
        <div className="mx-auto max-w-[1400px] lg:grid lg:min-h-[560px] lg:grid-cols-12">
          <div className="flex flex-col justify-between px-6 py-8 lg:col-span-3 lg:px-10 lg:py-10">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${BADGE_STYLES[property.badge.color as BadgeColor]}`}>{property.badge.label}</span>
                <span className="rounded-full border border-black/5 bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink">{property.aiMatch}% AI Match</span>
              </div>
              <div className="hidden lg:flex items-center gap-4 text-xs text-ink/70">
                <button className="hover:text-ink transition-colors">Share</button>
                <button className="hover:text-ink transition-colors">Save</button>
              </div>
            </div>

            <div className="pt-8 lg:pt-14">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/45">{property.suburb}, {property.state}</p>
              <h1 className="max-w-[12ch] text-3xl sm:text-4xl lg:text-[3.05rem] font-black tracking-[-0.04em] leading-[1.04] text-ink">{property.address}</h1>
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/40">{priceLabel}</p>
                <p className="text-2xl sm:text-3xl font-black tracking-[-0.04em] text-ink">{displayPrice}</p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/70">
                <span className="inline-flex items-center gap-1.5"><strong className="text-ink">{property.beds}</strong> beds</span>
                <span className="inline-flex items-center gap-1.5"><strong className="text-ink">{property.baths}</strong> baths</span>
                <span className="inline-flex items-center gap-1.5"><strong className="text-ink">{property.cars}</strong> cars</span>
                <span className="text-ink/30">|</span>
                <span>{property.propertyType}</span>
              </div>
            </div>

            <div className="mt-8 lg:mt-16">
              <button className="text-sm font-semibold text-ink hover:text-ink/70 transition-colors">Contact Agent</button>
            </div>
          </div>

          <div className="relative h-[340px] overflow-hidden bg-[#d9d4cb] lg:col-span-7 lg:h-auto">
            <HeroMedia src={primaryImage} alt={property.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
              <div className="max-w-md rounded-2xl border border-white/15 bg-black/35 px-4 py-3 text-white backdrop-blur-md">
                <p className="mb-1 text-[10px] uppercase tracking-[0.24em] text-white/60">AI Insight</p>
                <p className="text-sm leading-relaxed">{property.aiInsight}</p>
              </div>
            </div>
          </div>

          <div className="grid h-[150px] grid-cols-3 gap-px bg-black/5 lg:col-span-2 lg:h-auto lg:grid-cols-1 lg:grid-rows-3">
            <div className="group relative min-h-[150px] overflow-hidden bg-[#d9d4cb] lg:min-h-0">
              <HeroMedia src={collageImages[0]} alt="Preview one" className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Layout</p>
                <p className="text-sm font-semibold">Spatial overview</p>
              </div>
            </div>
            <div className="group relative min-h-[150px] overflow-hidden bg-[#d9d4cb] lg:min-h-0">
              <HeroMedia src={collageImages[1]} alt="Preview two" className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/92 backdrop-blur flex items-center justify-center shadow-lg">
                  <div className="ml-1 w-0 h-0 border-y-[9px] border-y-transparent border-l-[14px] border-l-ink" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Story reel</p>
              </div>
            </div>
            <div className="group relative min-h-[150px] overflow-hidden bg-[#d9d4cb] lg:min-h-0">
              <HeroMedia src={collageImages[2]} alt="Preview three" className="transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#20D3B3]/35 via-transparent to-black/65" />
              <div className="absolute inset-0 flex items-end justify-between p-3 text-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Gallery</p>
                    <p className="text-sm font-semibold">{heroImages.length} photos</p>
                  </div>
                  <p className="text-4xl font-black tracking-[-0.06em]">
                    {extraImageCount > 0 ? `+${extraImageCount}` : '🖼'}
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink mb-1">{property.title}</h2>
            <p className="text-sm text-muted flex items-center gap-1.5 mb-4">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {property.address}
            </p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
              {[
                { label: 'Beds', val: property.beds },
                { label: 'Baths', val: property.baths },
                { label: 'Cars', val: property.cars },
                { label: null, val: property.land },
                { label: `Built ${property.built}`, val: null },
              ].map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 font-medium text-ink">
                  {f.val !== null && <strong>{f.val}</strong>}
                  {f.label && <span className="font-normal text-muted">{f.label}</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="flex overflow-x-auto no-scrollbar border-b border-subtle mb-6 -mx-1">
            {TABS.map(t => (
              <TabBtn key={t.id} label={t.label} active={tab === t.id} onClick={() => setTab(t.id)} />
            ))}
          </div>

          {tab === 'overview' && <OverviewTab property={property} />}
          {tab === 'history' && <HistoryTab />}
          {tab === 'suburb' && <SuburbProfileTab />}
          {tab === 'schools' && <SchoolsTab />}
          {tab === 'shops' && <ShopsTab />}
          {tab === 'health' && <HealthTab />}
          {tab === 'investment' && <InvestmentTab />}
          {tab === 'financing' && <FinancingTab />}
        </div>

        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="bg-ink rounded-2xl p-5 text-white">
            <p className="text-xs text-white/50 mb-1">{priceLabel}</p>
            <p className="text-3xl font-black mb-5">{displayPrice}</p>
            <button className="w-full bg-white text-ink font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors text-sm mb-2.5">Enquire Now</button>
            <button className="w-full bg-white/10 text-white font-medium py-3 rounded-xl hover:bg-white/15 transition-colors text-sm">Save Property</button>
          </div>

          <Card>
            <p className="text-xs text-muted mb-3">Listed by</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-bg flex items-center justify-center font-bold text-ink text-sm flex-shrink-0">
                {property.agent.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-sm text-ink">{property.agent.name}</p>
                <p className="text-xs text-muted">{property.agent.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl border border-subtle hover:bg-bg transition-colors text-sm text-ink">{property.agent.phone}</button>
              <button className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl border border-subtle hover:bg-bg transition-colors text-sm text-ink">Email Agent</button>
              <button className="w-full flex items-center gap-3 py-2.5 px-3 rounded-xl border border-subtle hover:bg-bg transition-colors text-sm text-ink">Request Callback</button>
            </div>
          </Card>

          <Card className="!bg-bg border-0">
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">Next Open Home</p>
            <p className="font-bold text-ink">{saleProperty?.openHome ?? rentProperty?.availableFrom ?? 'Available by appointment'}</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">AI Scores</p>
            <div className="space-y-2.5">
              {[
                { label: 'Schools', val: property.scores.schools, color: 'bg-green' },
                { label: 'Safety', val: property.scores.safety, color: 'bg-blue' },
                { label: 'Lifestyle', val: property.scores.lifestyle, color: 'bg-purple' },
              ].map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{s.label}</span>
                    <span className="font-semibold text-ink">{s.val}/10</span>
                  </div>
                  <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.val * 10}%` }} />
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-subtle flex justify-between items-center">
                <span className="text-xs text-muted">{property.listingType === 'sale' ? 'Capital Growth' : 'Value for Money'}</span>
                <span className="text-sm font-black text-green">{property.listingType === 'sale' ? saleProperty?.scores.growth : `${rentProperty?.scores.valueForMoney ?? 0}/10`}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
