'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { FaRegCommentDots } from 'react-icons/fa6'
import RoughBackground from '../../wrappers/RoughBackground'

export function SupportersTicker() {
  const t = useTranslations('SupportersTicker')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const phrases = [
    t('phrase0'),
    t('phrase1'),
    t('phrase2'),
    t('phrase3'),
    t('phrase4'),
    t('phrase5'),
  ]

  const infinitePhrases = [...phrases, ...phrases, ...phrases]

  useEffect(() => {
    if (!wrapperRef.current) return

    tweenRef.current = gsap.to(wrapperRef.current, {
      xPercent: -(100 / 3),
      duration: 40,
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
    <RoughBackground className="w-full select-none" padding="0" color="var(--background)">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full overflow-hidden py-4"
      >
        <div ref={wrapperRef} className="flex w-fit whitespace-nowrap will-change-transform">
          {infinitePhrases.map((phrase, idx) => (
            <div key={idx} className="flex shrink-0 items-center gap-3 px-8">
              <span className="font-sans text-xs tracking-wide opacity-60">{phrase}</span>
              <span className="text-accent font-serif text-base opacity-40">
                <FaRegCommentDots />
              </span>
            </div>
          ))}
        </div>
      </div>
    </RoughBackground>
  )
}
