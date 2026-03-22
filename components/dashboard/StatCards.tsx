'use client'

interface StatProps {
  label: string
  value: string
  delta: string
  deltaPos?: boolean
  accent: string
  children?: React.ReactNode
}

function StatCard({ label, value, delta, deltaPos = true, accent, children }: StatProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl" style={{ background: accent }}/>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className="text-2xl font-black text-ink tracking-tight">{value}</p>
      <p className={`text-xs font-medium mt-1 ${deltaPos ? 'text-teal' : 'text-red-500'}`}>{delta}</p>
      {children}
    </div>
  )
}

function Sparkline({ bars, color }: { bars: number[]; color: string }) {
  const max = Math.max(...bars)
  return (
    <div className="flex items-end gap-1 h-6 mt-3">
      {bars.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm opacity-60 hover:opacity-100 transition-opacity"
          style={{ height: `${(v / max) * 100}%`, background: color }}/>
      ))}
    </div>
  )
}

export default function StatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard label="Saved Properties" value="7" delta="↑ 2 added this week" accent="#20D3B3">
        <Sparkline bars={[3, 4, 3, 5, 5, 7]} color="#20D3B3"/>
      </StatCard>

      <StatCard label="My Properties Value" value="$1.24M" delta="↑ $18,400 this month" accent="#3B82F6">
        <Sparkline bars={[80, 83, 86, 88, 90, 100]} color="#3B82F6"/>
      </StatCard>

      <StatCard label="Total Equity" value="$384K" delta="31% LVR — healthy" accent="#F97316">
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted mb-1">
            <span>Equity 31%</span><span>Loan 69%</span>
          </div>
          <div className="h-1.5 bg-subtle rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-orange" style={{ width: '31%' }}/>
          </div>
        </div>
      </StatCard>

      <StatCard label="Upcoming Inspections" value="2" delta="Next: Tomorrow 10:00 AM" accent="#8B5CF6">
        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted">12 Wattle Grove, McKinnon</p>
          <p className="text-xs text-muted">14 Park Road, Bentleigh East</p>
        </div>
      </StatCard>
    </div>
  )
}
