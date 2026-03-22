'use client'

const INSPECTIONS = [
  { day:'TUE 18 MAR', time:'10:00 AM', address:'12 Wattle Grove, McKinnon VIC 3204', agency:'Ray White McKinnon', duration:'30 min', accentClass:'border-l-teal', textClass:'text-teal', match:98 },
  { day:'SAT 22 MAR', time:'11:30 AM', address:'14 Park Road, Bentleigh East VIC 3165', agency:'Harcourts Bentleigh', duration:'20 min', accentClass:'border-l-purple', textClass:'text-purple', match:94 },
]

export default function UpcomingInspections() {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-black text-ink tracking-tight">Upcoming Inspections</h2>
        <button className="text-xs text-teal font-semibold hover:underline">Add to calendar →</button>
      </div>
      <div className="space-y-3">
        {INSPECTIONS.map((insp, i) => (
          <div key={i} className={`flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card border-l-4 ${insp.accentClass}`}>
            <div className="flex-shrink-0 min-w-[64px]">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${insp.textClass}`}>{insp.day}</p>
              <p className={`text-base font-black mt-1 ${insp.textClass}`}>{insp.time}</p>
            </div>
            <div className="w-px h-10 bg-subtle flex-shrink-0"/>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">{insp.address}</p>
              <p className="text-xs text-muted mt-0.5">Open for inspection · {insp.duration} · {insp.agency}</p>
            </div>
            <div className="hidden sm:block flex-shrink-0 text-right">
              <p className={`text-xs font-bold ${insp.textClass}`}>✦ {insp.match}%</p>
              <p className="text-[10px] text-muted">AI match</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                insp.textClass === 'text-teal' ? 'border-teal/20 text-green bg-purple-light hover:opacity-90' : 'border-purple/20 text-purple bg-purple-light hover:bg-purple hover:text-white'
              }`}>Directions</button>
              <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-subtle text-muted hover:text-ink hover:border-muted/40 transition-colors">Notes</button>
            </div>
          </div>
        ))}
        <button className="w-full border border-dashed border-subtle hover:border-muted/40 rounded-2xl py-3 text-xs text-muted hover:text-ink transition-colors">
          + Add inspection reminder
        </button>
      </div>
    </div>
  )
}
