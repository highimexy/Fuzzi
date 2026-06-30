'use client'

import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'
import { Link } from 'next-view-transitions'
import { FiArrowRight } from 'react-icons/fi'

const solutionLinks = ['/qa', '/reality-check', '/lessons'] as const

export function SolutionSection() {
  const t = useTranslations('SolutionSection')

  const items = [
    {
      num: t('item1.num'),
      title: t('item1.title'),
      quote: t('item1.quote'),
      link: t('item1.link'),
      href: solutionLinks[0],
      color: 'text-primary',
      border: 'border-primary/30',
    },
    {
      num: t('item2.num'),
      title: t('item2.title'),
      quote: t('item2.quote'),
      link: t('item2.link'),
      href: solutionLinks[1],
      color: 'text-secondary',
      border: 'border-secondary/30',
    },
    {
      num: t('item3.num'),
      title: t('item3.title'),
      quote: t('item3.quote'),
      link: t('item3.link'),
      href: solutionLinks[2],
      color: 'text-accent',
      border: 'border-accent/30',
    },
  ]

  return (
    <section className="w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="px-6">
          <span className="text-fluid-small font-sans font-bold tracking-[0.4em] text-white/40 uppercase">
            {t('label')}
          </span>

          <div className="mt-12 flex flex-col gap-0 lg:flex-row">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="border-foreground/10 flex flex-1 flex-col gap-6 border-t py-10 lg:border-t-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span
                  className={`font-sans text-[11px] font-bold tracking-widest uppercase ${item.color}`}
                >
                  {item.num}
                </span>

                <h3 className="text-fluid-h4 font-serif leading-[0.9] tracking-tighter uppercase">
                  {item.title}
                </h3>

                <p className="font-serif leading-snug italic opacity-50">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <Link
                  href={item.href}
                  className={`group mt-auto inline-flex items-center gap-2 border-b pb-1 font-sans text-[11px] font-bold tracking-widest uppercase transition-all ${item.border}`}
                >
                  <span>{item.link}</span>
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
