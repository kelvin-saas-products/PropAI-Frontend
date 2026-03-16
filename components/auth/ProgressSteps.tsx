interface Props {
  steps: string[]
  current: number   // 0-indexed
}

export default function ProgressSteps({ steps, current }: Props) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((label, i) => {
        const done    = i < current
        const active  = i === current
        const last    = i === steps.length - 1
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? 'bg-green text-white' :
                active ? 'bg-ink text-white' :
                         'bg-subtle text-muted'
              }`}>
                {done ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                ) : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? 'text-ink' : 'text-muted'}`}>
                {label}
              </span>
            </div>
            {!last && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${done ? 'bg-green' : 'bg-subtle'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
