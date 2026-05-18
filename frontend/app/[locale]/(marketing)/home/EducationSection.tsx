'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { Container } from '../../wrappers/Container'
import { useTranslations } from 'next-intl'

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
      hoverBorder: 'hover:border-primary/50',
      ctaColor: 'text-primary',
    },
    {
      label: t('vector2.label'),
      title: t('vector2.title'),
      desc: t('vector2.desc'),
      cta: t('vector2.cta'),
      href: '/reality-check',
      labelColor: 'text-secondary',
      hoverBorder: 'hover:border-secondary/50',
      ctaColor: 'text-secondary',
    },
  ]

  return (
    <section className="w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-fluid-small text-secondary font-sans font-bold tracking-[0.4em] uppercase">
            {t('label')}
          </span>
          <h2 className="text-fluid-h3 mt-6 font-serif leading-[0.85] tracking-tighter uppercase">
            {t.rich('title', {
              dim: (chunks) => (
                <span className="text-foreground/60 italic opacity-60">{chunks}</span>
              ),
              br: () => <br />,
            })}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          {vectors.map((vec, idx) => (
            <div
              key={idx}
              className={`border-foreground/20 group flex flex-col border p-8 transition-colors ${vec.hoverBorder}`}
            >
              <span
                className={`font-mono text-[10px] font-bold tracking-widest uppercase opacity-60 ${vec.labelColor}`}
              >
                {vec.label}
              </span>
              <h3 className="mt-4 font-serif text-2xl uppercase">{vec.title}</h3>
              <p className="mt-4 font-sans text-sm opacity-60">{vec.desc}</p>
              <Link
                href={vec.href}
                className={`mt-8 inline-flex items-center gap-3 font-sans text-xs font-bold tracking-widest uppercase ${vec.ctaColor}`}
              >
                <span>{vec.cta}</span>
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
