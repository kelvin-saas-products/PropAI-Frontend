'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface VirtualizedPropertyListProps<T> {
  items: T[]
  itemHeight: number
  gap: number
  overscan?: number
  hasMore?: boolean
  loadingMore?: boolean
  onEndReached?: () => void
  renderItem: (item: T, index: number) => ReactNode
}

export default function VirtualizedPropertyList<T>({
  items,
  itemHeight,
  gap,
  overscan = 2,
  hasMore = false,
  loadingMore = false,
  onEndReached,
  renderItem,
}: VirtualizedPropertyListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [range, setRange] = useState({ start: 0, end: Math.min(items.length, 6) })

  useEffect(() => {
    const updateRange = () => {
      const container = containerRef.current
      if (!container) return

      const containerTop = container.getBoundingClientRect().top + window.scrollY
      const stride = itemHeight + gap
      const viewportTop = window.scrollY
      const viewportBottom = viewportTop + window.innerHeight
      const start = Math.max(0, Math.floor((viewportTop - containerTop) / stride) - overscan)
      const end = Math.min(
        items.length,
        Math.ceil((viewportBottom - containerTop) / stride) + overscan
      )

      setRange(prev =>
        prev.start === start && prev.end === end ? prev : { start, end }
      )
    }

    updateRange()

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        updateRange()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [gap, itemHeight, items.length, overscan])

  useEffect(() => {
    if (!hasMore || loadingMore || !onEndReached) return
    if (range.end < items.length - Math.max(2, overscan)) return
    onEndReached()
  }, [hasMore, items.length, loadingMore, onEndReached, overscan, range.end])

  const stride = itemHeight + gap
  const totalHeight = useMemo(() => {
    if (items.length === 0) return 0
    return items.length * itemHeight + Math.max(0, items.length - 1) * gap
  }, [gap, itemHeight, items.length])

  const visibleItems = items.slice(range.start, range.end)

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full" style={{ height: totalHeight }}>
        {visibleItems.map((item, offset) => {
          const index = range.start + offset
          return (
            <div
              key={index}
              className="absolute left-0 right-0"
              style={{ top: index * stride, height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
