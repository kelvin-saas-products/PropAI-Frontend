'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { AnyProperty } from '@/lib/types'

function CollageImage({
  src,
  alt,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <div className={`relative overflow-hidden bg-[#d9d4cb] ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        draggable={false}
        className="object-cover transition-transform duration-500 hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 75vw"
      />
    </div>
  )
}

export default function PropertyHeroGallery({ property }: { property: AnyProperty }) {
  const heroImages = property.images.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80']

  const leadImage = heroImages[0]
  const sideTop = heroImages[1] ?? leadImage
  const sideMiddle = heroImages[2] ?? leadImage
  const sideBottom = heroImages[3] ?? leadImage
  const extraImageCount = Math.max(0, heroImages.length - 4)

  return (
    <PropertyHeroCollage property={property} heroImages={heroImages} extraImageCount={extraImageCount} leadImage={leadImage} sideTop={sideTop} sideMiddle={sideMiddle} sideBottom={sideBottom} />
  )
}

function PropertyHeroCollage({
  property,
  heroImages,
  extraImageCount,
  leadImage,
  sideTop,
  sideMiddle,
  sideBottom,
}: {
  property: AnyProperty
  heroImages: string[]
  extraImageCount: number
  leadImage: string
  sideTop: string
  sideMiddle: string
  sideBottom: string
}) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerIndex, setViewerIndex] = useState(0)

  return (
    <>
      <section className="border-y border-subtle bg-bg">
        <div className="mx-auto max-w-[1400px] px-5 py-5 lg:px-8 lg:py-6">
          <div className="overflow-hidden rounded-[24px] border border-subtle bg-white shadow-card">
          <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_260px]">
            <button type="button" className="block text-left" onClick={() => { setViewerIndex(0); setViewerOpen(true) }}>
              <CollageImage
                src={leadImage}
                alt={property.title}
                priority
                className="h-[280px] md:h-[520px]"
              />
            </button>

            <div className="hidden md:grid md:grid-rows-3 md:gap-1">
              <button type="button" className="block text-left" onClick={() => { setViewerIndex(1); setViewerOpen(true) }}>
                <CollageImage src={sideTop} alt={`${property.title} preview one`} className="h-[171px]" />
              </button>
              <button type="button" className="block text-left" onClick={() => { setViewerIndex(2); setViewerOpen(true) }}>
                <CollageImage src={sideMiddle} alt={`${property.title} preview two`} className="h-[171px]" />
              </button>
              <button type="button" className="relative block h-[172px] overflow-hidden bg-[#d9d4cb] text-left" onClick={() => { setViewerIndex(3); setViewerOpen(true) }}>
                  <Image
                    src={sideBottom}
                    alt={`${property.title} preview three`}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    sizes="260px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Gallery</p>
                      <p className="text-sm font-semibold">{heroImages.length} photos</p>
                    </div>
                    {extraImageCount > 0 && (
                      <p className="text-4xl font-black tracking-[-0.06em]">
                        +{extraImageCount}
                      </p>
                    )}
                  </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </section>

      {viewerOpen && (
        <FullscreenGalleryDialog
          images={heroImages}
          address={property.address}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </>
  )
}

function FullscreenGalleryDialog({
  images,
  address,
  initialIndex,
  onClose,
}: {
  images: string[]
  address: string
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [isDesktop, setIsDesktop] = useState(false)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const deltaX = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const sync = () => setIsDesktop(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setIndex(current => (current - 1 + images.length) % images.length)
      if (e.key === 'ArrowRight') setIndex(current => (current + 1) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [images.length, onClose])

  const goPrev = () => setIndex(current => (current - 1 + images.length) % images.length)
  const goNext = () => setIndex(current => (current + 1) % images.length)

  const beginSwipe = (clientX: number) => {
    startX.current = clientX
    deltaX.current = 0
    setDragging(true)
  }

  const updateSwipe = (clientX: number) => {
    if (!dragging || startX.current === null) return
    deltaX.current = clientX - startX.current
  }

  const endSwipe = () => {
    if (!dragging || startX.current === null) return
    if (Math.abs(deltaX.current) > 48) {
      if (deltaX.current > 0) goPrev()
      else goNext()
    }
    startX.current = null
    deltaX.current = 0
    setDragging(false)
  }

  useEffect(() => {
    if (!dragging) return

    const onPointerMove = (e: PointerEvent) => updateSwipe(e.clientX)
    const onPointerUp = () => endSwipe()
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateSwipe(e.touches[0].clientX)
    }
    const onTouchEnd = () => endSwipe()

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [dragging])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    beginSwipe(e.clientX)
  }

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    beginSwipe(e.touches[0].clientX)
  }

  return (
    <div className="fixed inset-0 z-[250] bg-[#22292f] text-white">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-sm lg:px-6">
          <div className="font-medium text-white/80">
            {index + 1}/{images.length}
          </div>
          <div className="hidden items-center gap-3 text-xs text-white/45 lg:flex">
            <span className="rounded border border-white/10 px-2 py-1">Grid</span>
            <span className="rounded border border-white/10 px-2 py-1">Video</span>
            <span className="rounded border border-white/10 px-2 py-1">3D</span>
          </div>
          <button type="button" onClick={onClose} className="text-2xl leading-none text-white/70 hover:text-white">
            ×
          </button>
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-4 lg:px-8 lg:py-8">
            {isDesktop && images.length > 1 && (
              <>
                <button type="button" onClick={goPrev} className="absolute left-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-4xl text-white/80 backdrop-blur hover:bg-black/40 lg:flex">
                  ‹
                </button>
                <button type="button" onClick={goNext} className="absolute right-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-4xl text-white/80 backdrop-blur hover:bg-black/40 lg:flex">
                  ›
                </button>
              </>
            )}

            <div
              className="relative flex h-full w-full cursor-grab touch-none items-center justify-center active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onTouchStart={onTouchStart}
            >
              <div className="relative h-full max-h-[78vh] w-full max-w-[1250px]">
                <Image
                  src={images[index]}
                  alt={`${address} image ${index + 1}`}
                  fill
                  unoptimized
                  priority
                  draggable={false}
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>
            </div>

            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur">
                {images.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setIndex(dotIndex)}
                    className={`h-2.5 rounded-full transition-all ${dotIndex === index ? 'w-6 bg-white' : 'w-2.5 bg-white/45'}`}
                    aria-label={`Go to image ${dotIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="hidden w-[260px] flex-shrink-0 border-l border-white/8 bg-[#1b2227] p-4 lg:flex">
            <div className="flex h-full w-full flex-col rounded-2xl border border-white/10 bg-[#f8d22f] p-4 text-[#10213b]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em]">Sponsored</p>
              <div className="mt-6 flex-1 rounded-xl bg-white/25 p-4">
                <p className="text-3xl font-black leading-none">Instant</p>
                <p className="mt-1 text-4xl font-black leading-none">Bingo</p>
                <p className="mt-3 text-sm font-semibold">Ad space</p>
                <p className="mt-2 text-sm leading-relaxed">Use this area for premium agent placements, lender offers, or relocation services.</p>
              </div>
              <button type="button" className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#10213b]">
                Learn More
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
