'use client'
import { useMemo } from 'react'

// ── Page-size options ─────────────────────────────────────────────
export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

export interface PaginationBarProps {
  page: number
  totalPages: number
  total: number
  pageSize: PageSize
  onPageChange: (p: number) => void
  onPageSizeChange: (s: PageSize) => void
}

export default function PaginationBar({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationBarProps) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const result: (number | '…')[] = []
    const seen = new Set<number | '…'>()
    const push = (v: number | '…') => {
      if (!seen.has(v)) { seen.add(v); result.push(v) }
    }
    push(1)
    if (page > 3) push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) push(i)
    if (page < totalPages - 2) push('…')
    push(totalPages)
    return result
  }, [page, totalPages])

  const btn = 'h-9 min-w-[36px] px-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center'

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 pt-5 border-t border-subtle mt-2" style={{ padding: '20px 0 0', marginTop: '20px' }}>
      {/* Left: result count + page size */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted">
          Showing {page} - {page * pageSize > total ? total : page * pageSize} of {total} properties
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted">Show</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value) as PageSize)}
            className="text-sm bg-bg border border-subtle rounded-xl px-2 py-1.5 text-ink outline-none font-medium"
          >
            {PAGE_SIZE_OPTIONS.map(s => (
              <option key={s} value={s}>{s} per page</option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: page buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={`${btn} gap-1 ${page === 1 ? 'text-muted/40 cursor-not-allowed' : 'text-ink hover:bg-surface'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Prev
        </button>

        {pages.map((p, i) =>
          p === '…'
            ? (
              <span
                key={`e${i}`}
                className="h-9 w-6 flex items-center justify-center text-sm text-muted select-none"
              >
                …
              </span>
            )
            : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`${btn} ${p === page ? 'bg-ink text-white' : 'text-ink hover:bg-surface'}`}
              >
                {p}
              </button>
            )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={`${btn} gap-1 ${page === totalPages ? 'text-muted/40 cursor-not-allowed' : 'text-ink hover:bg-surface'}`}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
