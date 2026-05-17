'use client'

import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'
import { useTranslations } from 'next-intl'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export function HomeHeader() {
  const t = useTranslations('Home')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-item', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.1,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <header className="w-full">
      <Container className="relative overflow-hidden">
        <BackgroundGrid />

        <div ref={containerRef} className="flex flex-col items-center px-6 py-14 text-center">
          {/* Badge */}
          <div className="gsap-item border-accent/40 text-accent mb-8 inline-block border px-4 py-1.5 font-sans text-[10px] font-bold tracking-[0.3em] uppercase">
            {t('hero.badge')}
          </div>

          <h1
            className="gsap-item max-w-3xl font-serif leading-[0.9] tracking-tighter text-balance uppercase"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}
          >
            {t.rich('hero.headline', {
              accent: (chunks) => <span className="text-accent italic">{chunks}</span>,
              primary: (chunks) => <span className="text-primary italic">{chunks}</span>,
              dim: (chunks) => <span className="text-secondary italic">{chunks}</span>,
            })}
          </h1>

          {/* Subheadline */}
          <p className="gsap-item mt-5 max-w-sm font-sans text-sm leading-relaxed tracking-[0.12em] uppercase opacity-40">
            {t('hero.subheadline')}
          </p>

          {/* CTAs */}
          <div className="gsap-item mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/lessons"
              className="bg-accent text-background inline-block px-10 py-4 font-sans text-sm font-bold tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-80"
            >
              {t('hero.cta')}
            </Link>
            <Link
              href="/qa"
              className="group border-foreground/20 hover:border-foreground/50 inline-flex items-center gap-2 border px-10 py-4 font-sans text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              {t('hero.ctaSecondary')}
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Social proof */}
          <p className="gsap-item mt-4 font-sans text-xs tracking-[0.12em] uppercase opacity-25">
            {t('hero.socialProof')}
          </p>
        </div>
      </Container>
    </header>
  )
}
