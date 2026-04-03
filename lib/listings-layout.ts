'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

const BREAKPOINTS = {
  desktop: 1024,
  tablet: 768,
} as const

export const LISTINGS_LAYOUT_SETTINGS = {
  gapPx: 10,
  imageHeightPercent: {
    mobile: 46,
    tablet: 42,
  },
  imageWidthPercent: {
    desktop: 42,
  },
  minHeightsPx: {
    mobile: 360,
    tablet: 220,
    desktop: 180,
  },
  viewportOffsetsPx: {
    mobile: 220,
    tablet: 250,
    desktop: 280,
  },
  visibleCards: {
    mobile: 1,
    tabletMin: 2,
    tabletMax: 3,
    desktop: 4,
  },
} as const

export interface ListingViewportLayout {
  mode: 'mobile' | 'tablet' | 'desktop'
  isDesktop: boolean
  usesVirtualScroll: boolean
  visibleCards: number
  cardHeightPx: number
  gapPx: number
  imageHeightPercent: number
  imageWidthPercent: number
}

export const DEFAULT_LISTING_VIEWPORT_LAYOUT: ListingViewportLayout = {
  mode: 'desktop',
  isDesktop: true,
  usesVirtualScroll: false,
  visibleCards: LISTINGS_LAYOUT_SETTINGS.visibleCards.desktop,
  cardHeightPx: 220,
  gapPx: LISTINGS_LAYOUT_SETTINGS.gapPx,
  imageHeightPercent: LISTINGS_LAYOUT_SETTINGS.imageHeightPercent.tablet,
  imageWidthPercent: LISTINGS_LAYOUT_SETTINGS.imageWidthPercent.desktop,
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

export function getListingViewportLayout(
  viewportWidth: number,
  viewportHeight: number
): ListingViewportLayout {
  if (viewportWidth < BREAKPOINTS.tablet) {
    const visibleCards = LISTINGS_LAYOUT_SETTINGS.visibleCards.mobile
    const availableHeight = Math.max(
      LISTINGS_LAYOUT_SETTINGS.minHeightsPx.mobile,
      viewportHeight - LISTINGS_LAYOUT_SETTINGS.viewportOffsetsPx.mobile
    )

    return {
      mode: 'mobile',
      isDesktop: false,
      usesVirtualScroll: true,
      visibleCards,
      cardHeightPx: Math.round(availableHeight / visibleCards),
      gapPx: LISTINGS_LAYOUT_SETTINGS.gapPx,
      imageHeightPercent: LISTINGS_LAYOUT_SETTINGS.imageHeightPercent.mobile,
      imageWidthPercent: LISTINGS_LAYOUT_SETTINGS.imageWidthPercent.desktop,
    }
  }

  if (viewportWidth < BREAKPOINTS.desktop) {
    const availableHeight = Math.max(
      0,
      viewportHeight - LISTINGS_LAYOUT_SETTINGS.viewportOffsetsPx.tablet
    )
    const computedCards = clamp(
      Math.floor(availableHeight / 280),
      LISTINGS_LAYOUT_SETTINGS.visibleCards.tabletMin,
      LISTINGS_LAYOUT_SETTINGS.visibleCards.tabletMax
    )
    const visibleCards = computedCards || LISTINGS_LAYOUT_SETTINGS.visibleCards.tabletMin
    const totalGap = LISTINGS_LAYOUT_SETTINGS.gapPx * Math.max(visibleCards - 1, 0)
    const rawHeight = (availableHeight - totalGap) / visibleCards

    return {
      mode: 'tablet',
      isDesktop: false,
      usesVirtualScroll: true,
      visibleCards,
      cardHeightPx: Math.round(Math.max(LISTINGS_LAYOUT_SETTINGS.minHeightsPx.tablet, rawHeight)),
      gapPx: LISTINGS_LAYOUT_SETTINGS.gapPx,
      imageHeightPercent: LISTINGS_LAYOUT_SETTINGS.imageHeightPercent.tablet,
      imageWidthPercent: LISTINGS_LAYOUT_SETTINGS.imageWidthPercent.desktop,
    }
  }

  const visibleCards = LISTINGS_LAYOUT_SETTINGS.visibleCards.desktop
  const availableHeight = Math.max(
    0,
    viewportHeight - LISTINGS_LAYOUT_SETTINGS.viewportOffsetsPx.desktop
  )
  const totalGap = LISTINGS_LAYOUT_SETTINGS.gapPx * Math.max(visibleCards - 1, 0)
  const rawHeight = (availableHeight - totalGap) / visibleCards

  return {
    mode: 'desktop',
    isDesktop: true,
    usesVirtualScroll: false,
    visibleCards,
    cardHeightPx: Math.round(Math.max(LISTINGS_LAYOUT_SETTINGS.minHeightsPx.desktop, rawHeight)),
    gapPx: LISTINGS_LAYOUT_SETTINGS.gapPx,
    imageHeightPercent: LISTINGS_LAYOUT_SETTINGS.imageHeightPercent.tablet,
    imageWidthPercent: LISTINGS_LAYOUT_SETTINGS.imageWidthPercent.desktop,
  }
}

export function useListingViewportLayout() {
  const [layout, setLayout] = useState<ListingViewportLayout>(DEFAULT_LISTING_VIEWPORT_LAYOUT)

  useEffect(() => {
    const updateLayout = () => {
      setLayout(getListingViewportLayout(window.innerWidth, window.innerHeight))
    }

    updateLayout()
    window.addEventListener('resize', updateLayout, { passive: true })
    window.addEventListener('orientationchange', updateLayout)

    return () => {
      window.removeEventListener('resize', updateLayout)
      window.removeEventListener('orientationchange', updateLayout)
    }
  }, [])

  return layout
}

export function getListingCardStyleVars(layout: ListingViewportLayout): CSSProperties {
  return {
    ['--listing-card-height' as string]: `${layout.cardHeightPx}px`,
    ['--listing-card-gap' as string]: `${layout.gapPx}px`,
    ['--listing-card-image-height' as string]: `${layout.imageHeightPercent}%`,
    ['--listing-card-image-width' as string]: `${layout.imageWidthPercent}%`,
  } as CSSProperties
}
