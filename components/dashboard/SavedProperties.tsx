'use client'
import { useState } from 'react'
import Link from 'next/link'

type Filter = 'all' | 'sale' | 'rent'

const SAVED = [
  { id:'1', type:'sale', price:'$875,000', address:'12 Wattle Grove, McKinnon VIC', beds:3, baths:2, match:98, icon:'🏡', matchColor:'text-teal', pillClass:'bg-[#E0FAF6] text-teal', label:'Buy' },
  { id:'2', type:'sale', price:'$695,000', address:'4/22 Centre Rd, Bentleigh East VIC', beds:2, baths:1, match:94, icon:'🏢', matchColor:'text-teal', pillClass:'bg-[#E0FAF6] text-teal', label:'Buy' },
  { id:'3', type:'sale', price:'$1,150,000', address:'7 Jasper St, Highett VIC', beds:4, baths:2, match:89, icon:'🏘', matchColor:'text-teal', pillClass:'bg-[#E0FAF6] text-teal', label:'Buy' },
  { id:'4', type:'rent', price:'$580 /wk', address:'8 Jasmine St, Ormond VIC', beds:3, baths:2, match:91, icon:'🏠', matchColor:'text-blue', pillClass:'bg-blue-light text-blue', label:'Rent' },
  { id:'5', type:'rent', price:'$420 /wk', address:'12/4 Bay Rd, Sandringham VIC', beds:1, baths:1, match:86, icon:'🏢', matchColor:'text-blue', pillClass:'bg-blue-light text-blue', label:'Rent' },
]

export default function SavedProperties() {
  const [filter, setFilter] = useState<Filter>('all')
  const filtered = SAVED.filter(p => filter === 'all' || p.type === filter)

  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-ink tracking-tight">Saved Properties</h2>
        <div className="flex gap-1.5">
          {(['all','sale','rent'] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all capitalize ${
                filter === f ? 'bg-ink text-white' : 'bg-bg text-muted hover:text-ink'
              }`}>
              {f === 'sale' ? 'Buy' : f === 'rent' ? 'Rent' : 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(p => (
          <div key={p.id} className="flex items-center gap-3 p-3 bg-bg rounded-xl hover:bg-subtle/50 transition-colors cursor-pointer group">
            <div className="w-12 h-10 rounded-lg bg-subtle flex items-center justify-center text-xl flex-shrink-0">{p.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-ink leading-none">{p.price}</p>
              <p className="text-xs text-muted mt-0.5 truncate">{p.address}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.pillClass}`}>{p.label}</span>
                <span className="text-[10px] text-muted">{p.beds} bed · {p.baths} bath</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-xs font-bold ${p.matchColor}`}>✦ {p.match}%</p>
              <p className="text-[9px] text-muted mt-0.5">AI match</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 text-muted hover:text-red-500 transition-all ml-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <Link href="/dashboard/saved" className="block text-center text-xs text-teal font-semibold mt-4 hover:underline">
        View all saved properties →
      </Link>
    </div>
  )
}
