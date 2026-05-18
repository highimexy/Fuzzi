'use client'

import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'
import Link from 'next/link'

export function LastSection() {
  const t = useTranslations('LastSection')

  return (
    <section className="relative w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          {/* Main CTA */}
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-fluid-h2 font-serif leading-[0.9] tracking-tighter uppercase">
              {t('headline')}
            </h2>

            <Link
              href="/lessons"
              className="border-accent hover:bg-accent mt-4 inline-block border px-12 py-5 font-sans text-sm font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:text-white"
            >
              {t('cta')}
            </Link>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-8">
              <Link
                href="/qa"
                className="font-sans text-xs tracking-widest uppercase opacity-40 transition-opacity hover:opacity-80"
              >
                {t('secondary1')}
              </Link>
              <span className="opacity-20">·</span>
              <Link
                href="/reality-check"
                className="font-sans text-xs tracking-widest uppercase opacity-40 transition-opacity hover:opacity-80"
              >
                {t('secondary2')}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
