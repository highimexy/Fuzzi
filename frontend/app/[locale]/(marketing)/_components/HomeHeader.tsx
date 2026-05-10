'use client'

import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from './BackgroundGrid'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function HomeHeader() {
  const t = useTranslations('HomeHeader')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.1,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <header className="border-foreground/10 w-full border-b">
      <Container className="relative overflow-hidden">
        <BackgroundGrid />

        <div
          ref={containerRef}
          className="text-fluid-h1 flex flex-col px-6 py-18 text-center leading-[0.9]"
        >
          {/* NAGŁÓWEK */}
          <h1 className="gsap-item font-serif">
            {t.rich('title1', {
              green: (chunks) => <span className="text-green-500 italic opacity-90">{chunks}</span>,
            })}
            <br />

            {t.rich('title4', {
              purple: (chunks) => (
                <span className="text-purple-500 italic opacity-90">{chunks}</span>
              ),
            })}
          </h1>

          {/* PARAGRAF (Manifest) */}
          <div className="gsap-item mx-auto mt-12 max-w-3xl">
            <p className="text-fluid-small px-4 font-sans leading-relaxed tracking-[0.3em] uppercase opacity-70">
              {t.rich('description', {
                bold: (chunks) => <span className="text-foreground font-bold">{chunks}</span>,
                italic: (chunks) => <span className="italic">{chunks}</span>,
                block: (chunks) => (
                  <span className="text-foreground mt-4 block font-bold">{chunks}</span>
                ),
              })}
            </p>
          </div>

          {/* STOPKA SZEFA */}
          <p className="gsap-item mt-12 font-serif text-lg italic">{t('footer')}</p>
        </div>
      </Container>
    </header>
  )
}
