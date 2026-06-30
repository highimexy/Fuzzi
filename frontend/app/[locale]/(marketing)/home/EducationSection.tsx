'use client'

import { Link } from 'next-view-transitions'
import { FiArrowRight } from 'react-icons/fi'
import { Container } from '../../wrappers/Container'
import { useTranslations } from 'next-intl'
import RoughBackground from '../../wrappers/RoughBackground'

export function EducationSection() {
  const t = useTranslations('EducationSection')

  const vectors = [
    {
      label: t('vector1.label'),
      title: t('vector1.title'),
      desc: t('vector1.desc'),
      cta: t('vector1.cta'),
      href: '/qa',
      labelColor: 'text-primary',
      hoverBorder: 'hover:border-primary/50 hover:bg-primary/[0.02]',
      ctaColor: 'text-primary',
      lineColor: 'bg-primary/40 group-hover:bg-primary',
    },
    {
      label: t('vector2.label'),
      title: t('vector2.title'),
      desc: t('vector2.desc'),
      cta: t('vector2.cta'),
      href: '/reality-check',
      labelColor: 'text-secondary',
      hoverBorder: 'hover:border-secondary/50 hover:bg-secondary/[0.02]',
      ctaColor: 'text-secondary',
      lineColor: 'bg-secondary/40 group-hover:bg-secondary',
    },
  ]

  return (
    <RoughBackground
      className="relative w-full overflow-hidden"
      padding="0"
      color="var(--background)"
    >
      <Container className="py-16 md:py-24">
        {/* NAGŁÓWEK SEKCJI */}
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="border-secondary/40 text-secondary inline-block border px-4 py-1.5 font-sans text-[10px] font-bold tracking-[0.4em] uppercase">
            {t('label')}
          </span>

          <h2 className="text-fluid-h3 mt-4 font-serif leading-[0.85] tracking-tighter text-pretty uppercase sm:text-balance">
            {t.rich('title', {
              dim: (chunks) => (
                <span className="text-foreground/60 italic opacity-60">{chunks}</span>
              ),
              br: () => <br className="hidden sm:block" />,
            })}
          </h2>

          <p className="mx-auto mt-2 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
            {t('description')}
          </p>
        </div>

        {/* KARTY WEKTORÓW */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          {vectors.map((vec, idx) => (
            <div
              key={idx}
              className={`border-foreground/10 group flex flex-col justify-between border p-8 transition-all duration-300 ${vec.hoverBorder}`}
            >
              <div>
                <span
                  className={`font-sans text-[10px] font-bold tracking-widest uppercase opacity-80 ${vec.labelColor}`}
                >
                  {vec.label}
                </span>
                <h3 className="text-foreground mt-4 font-serif text-2xl uppercase">{vec.title}</h3>
                <p className="mt-4 font-sans text-sm leading-relaxed opacity-60">{vec.desc}</p>
              </div>

              <div className="mt-12 flex flex-col items-start gap-8">
                <Link
                  href={vec.href}
                  className={`inline-flex items-center gap-3 font-sans text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80 ${vec.ctaColor}`}
                >
                  <span>{vec.cta}</span>
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>

                {/* Taktyczny Footer Karty */}
                <div className="border-foreground/10 flex w-full items-center gap-2 border-t pt-6">
                  <div className={`h-1 w-8 transition-colors duration-300 ${vec.lineColor}`} />
                  <span className="font-sans text-[8px] tracking-widest uppercase opacity-20">
                    {t('systemPath', { n: idx + 1 })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </RoughBackground>
  )
}
