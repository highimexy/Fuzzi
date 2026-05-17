'use client'

import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'
import Link from 'next/link'

export function ConversionSection() {
  const t = useTranslations('Home')

  return (
    <section className="relative w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
            {/* MONTHLY CARD (Standard) */}
            <div className="bg-background border-foreground/10 relative flex flex-1 flex-col justify-between overflow-hidden border p-8 shadow-sm">
              <div>
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="font-serif text-2xl leading-none font-bold">
                    {t('conversion.monthly.period')}
                  </h2>
                  <span className="text-foreground/60 font-sans text-sm">
                    {t('conversion.monthly.billedLabel')}
                  </span>
                </div>
                <p className="text-foreground/60 font-sans text-sm leading-relaxed">
                  {t.rich('conversion.monthly.description', {
                    strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-foreground/40 font-sans text-2xl font-bold line-through">
                    $39
                  </span>
                  <span className="font-sans text-4xl font-bold">
                    {t('conversion.monthly.price')}
                  </span>
                  <span className="text-foreground/60 font-sans text-sm">
                    {t('conversion.monthly.unit')}
                  </span>
                </div>
                <p className="text-foreground/40 mb-6 font-sans text-[10px] tracking-widest uppercase">
                  {t('conversion.pricesNote')}
                </p>
                <Link
                  href="/premium"
                  className="bg-foreground text-background hover:bg-foreground/90 block w-full py-3 text-center font-sans font-bold transition-transform hover:scale-[1.02]"
                >
                  {t('conversion.monthly.cta')}
                </Link>
              </div>
            </div>

            {/* YEARLY CARD (POPULAR) */}
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden bg-linear-to-br from-[#F0B100] to-[#5a450c] p-8 text-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.08)]">
              <div>
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-baseline gap-2">
                    <h2 className="font-serif text-2xl leading-none font-bold">
                      {t('conversion.yearly.period')}
                    </h2>
                    <span className="font-sans text-sm text-zinc-900/70">
                      {t('conversion.yearly.billedLabel')}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 bg-white p-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                    {t('conversion.yearly.badge')}
                  </span>
                </div>
                <p className="font-sans text-sm leading-relaxed text-zinc-900/80">
                  {t.rich('conversion.yearly.description', {
                    strong: (chunks) => <strong className="text-zinc-900">{chunks}</strong>,
                  })}
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-sans text-4xl font-bold">
                    {t('conversion.yearly.price')}
                  </span>
                  <span className="font-sans text-sm text-zinc-900/70">
                    {t('conversion.yearly.unit')}
                  </span>
                </div>
                <p className="mb-6 font-sans text-[10px] tracking-widest text-zinc-900/50 uppercase">
                  {t('conversion.pricesNote')}
                </p>
                <Link
                  href="/premium"
                  className="block w-full bg-zinc-900 py-3 text-center font-sans font-bold text-white transition-transform hover:scale-[1.02] hover:bg-zinc-800"
                >
                  {t('conversion.yearly.cta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
