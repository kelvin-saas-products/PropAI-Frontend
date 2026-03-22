'use client'

type PropType = 'home' | 'investment'

const PROPERTIES = [
  {
    id: '1', type: 'home' as PropType,
    address: '34 Oak Street', suburb: 'Moorabbin VIC 3189',
    specs: '3 bed · 1 bath · 420m²',
    estValue: '$1,240,000', purchasePrice: '$855,000',
    growth: '+$385,000', growthPct: '+45.0%', growthPos: true,
    sparkData: [30,45,55,70,85,100], sparkColor: '#3B82F6',
  },
  {
    id: '2', type: 'investment' as PropType,
    address: '12/88 King Street', suburb: 'Melbourne CBD VIC 3000',
    specs: '1 bed · 1 bath · 62m² · Rented $420/wk',
    estValue: '$498,000', purchasePrice: '$350,000',
    growth: '+$148,000', growthPct: '+42.3%', growthPos: true,
    extra: { label: 'Yield', value: '4.38%', color: 'text-purple' },
    sparkData: [50,60,65,72,80,100], sparkColor: '#8B5CF6',
  },
]

const TYPE_STYLES: Record<PropType, { pill: string }> = {
  home:       { pill: 'bg-orange-light text-orange' },
  investment: { pill: 'bg-purple-light text-purple' },
}
const TYPE_LABELS: Record<PropType, string> = {
  home: 'My Home', investment: 'Investment',
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((v, i) => (
        <div key={i} className="w-1.5 rounded-sm"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.3 + (i / data.length) * 0.7 }}/>
      ))}
    </div>
  )
}

export default function MyProperties() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-ink tracking-tight">My Properties</h2>
        <button className="text-xs font-semibold text-green border border-teal/20 bg-[#E0FAF6] px-3 py-1 rounded-lg hover:bg-green hover:text-white transition-all">
          + Add property
        </button>
      </div>

      <div className="space-y-3">
        {PROPERTIES.map(p => (
          <div key={p.id} className="p-4 bg-bg rounded-xl border border-subtle hover:border-muted/30 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-ink">{p.address}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_STYLES[p.type].pill}`}>
                    {TYPE_LABELS[p.type]}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">{p.suburb}</p>
                <p className="text-xs text-muted">{p.specs}</p>

                <div className="flex gap-4 mt-3 flex-wrap">
                  <div>
                    <p className="text-[9px] text-muted uppercase tracking-wider">Est. Value</p>
                    <p className="text-sm font-black text-ink mt-0.5">{p.estValue}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase tracking-wider">Purchased</p>
                    <p className="text-sm font-semibold text-muted mt-0.5">{p.purchasePrice}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-muted uppercase tracking-wider">Growth</p>
                    <p className={`text-sm font-black mt-0.5 ${p.growthPos ? 'text-teal' : 'text-red-500'}`}>{p.growthPct}</p>
                  </div>
                  {p.extra && (
                    <div>
                      <p className="text-[9px] text-muted uppercase tracking-wider">{p.extra.label}</p>
                      <p className={`text-sm font-black mt-0.5 ${p.extra.color}`}>{p.extra.value}</p>
                    </div>
                  )}
                </div>

                <p className="text-xs font-medium text-green mt-2">↑ {p.growth} since purchase</p>
              </div>
              <div className="flex-shrink-0 pt-1">
                <Sparkline data={p.sparkData} color={p.sparkColor}/>
                <p className="text-[9px] text-muted text-right mt-1">6 mo</p>
              </div>
            </div>
          </div>
        ))}

        <button className="w-full border border-dashed border-subtle hover:border-muted/40 rounded-xl py-3 text-xs text-muted hover:text-ink transition-colors">
          + Add another property to track
        </button>
      </div>
    </div>
  )
}
