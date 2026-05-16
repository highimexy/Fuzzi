'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { LuSparkles } from 'react-icons/lu'

const supporters = [
  'Pecet3',
  'Suchecky',
  'DoodieLo',
  'Cookie',
  'Lil_Jeff',
  'pat0gen',
  'CrisLeniwiec',
  'feetlicker42',
  'SAFFRON',
  'KvR4',
]

const infiniteSupporters = [...supporters, ...supporters, ...supporters]

export function SupportersTicker() {
  const t = useTranslations('SupportersTicker')
  const tickerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!wrapperRef.current) return

    tweenRef.current = gsap.to(wrapperRef.current, {
      xPercent: -(100 / 3),
      duration: 35,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [])

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0.15, duration: 0.6, overwrite: true })
    }
  }

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.6, overwrite: true })
    }
  }

  return (
    <div
      ref={tickerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="border-foreground/10 bg-background w-full overflow-hidden border-y py-5 select-none"
    >
      <div ref={wrapperRef} className="flex w-fit whitespace-nowrap will-change-transform">
        {infiniteSupporters.map((name, idx) => (
          <div key={idx} className="flex shrink-0 items-center gap-6 px-10">
            <span className="font-sans text-[9px] font-bold tracking-[0.4em] uppercase opacity-20">
              {t('label')} /
            </span>
            <span className="font-serif text-xl tracking-tighter uppercase italic opacity-70">
              {name}
            </span>
            <LuSparkles className="text-accent/80" />
          </div>
        ))}
      </div>
    </div>
  )
}
