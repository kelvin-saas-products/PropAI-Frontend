'use client'

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
    <section className="border-y border-black/5 bg-[#eceae6]">
      <div className="mx-auto max-w-[1400px] px-5 py-5 lg:px-8 lg:py-6">
        <div className="overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_260px]">
            <CollageImage
              src={leadImage}
              alt={property.title}
              priority
              className="h-[280px] md:h-[566px]"
            />

            <div className="hidden md:grid md:grid-rows-3 md:gap-1">
              <CollageImage src={sideTop} alt={`${property.title} preview one`} className="h-[185px]" />
              <CollageImage src={sideMiddle} alt={`${property.title} preview two`} className="h-[185px]" />
              <div className="relative h-[186px] overflow-hidden bg-[#d9d4cb]">
                <Image
                  src={sideBottom}
                  alt={`${property.title} preview three`}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                  sizes="260px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70">Gallery</p>
                    <p className="text-sm font-semibold">{heroImages.length} photos</p>
                  </div>
                  <p className="text-4xl font-black tracking-[-0.06em]">
                    {extraImageCount > 0 ? `+${extraImageCount}` : '+0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
