const NEWS = [
  { emoji:'📈', bg:'bg-green-light',   tag:'Market Update',    tagColor:'text-green',  headline:'Melbourne median house prices stabilise after 3-month correction', date:'Today · 2 min read' },
  { emoji:'🏦', bg:'bg-blue-light',    tag:'Finance',          tagColor:'text-blue',   headline:'RBA holds rates steady — what it means for your borrowing power', date:'Today · 3 min read' },
  { emoji:'🏘', bg:'bg-orange-light',  tag:'Suburb Spotlight', tagColor:'text-orange', headline:"McKinnon named one of Melbourne's top family suburbs for 2025", date:'Yesterday · 4 min read' },
  { emoji:'🔑', bg:'bg-bg',            tag:'Renting',          tagColor:'text-teal',   headline:'Rental vacancy rates rise in inner suburbs — tenants gaining leverage', date:'Yesterday · 3 min read' },
  { emoji:'🏗', bg:'bg-purple-light',  tag:'Development',      tagColor:'text-purple', headline:'New infrastructure corridor to boost values along Frankston line', date:'2 days ago · 5 min read' },
  { emoji:'💰', bg:'bg-blue-light',    tag:'Investment',       tagColor:'text-blue',   headline:'Gross rental yields climbing in bayside suburbs as prices soften', date:'2 days ago · 3 min read' },
]

export default function PropertyNews() {
  return (
    <div className="mb-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-black text-ink tracking-tight">Latest Property News</h2>
        <button className="text-xs text-green font-semibold hover:underline">View all →</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {NEWS.map((n, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer">
            <div className={`h-16 ${n.bg} flex items-center justify-center text-3xl`}>{n.emoji}</div>
            <div className="p-4">
              <p className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${n.tagColor}`}>{n.tag}</p>
              <p className="text-sm font-semibold text-ink leading-snug">{n.headline}</p>
              <p className="text-xs text-muted mt-2">{n.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
