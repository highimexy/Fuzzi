'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { Container } from '../../wrappers/Container'
import { useTranslations } from 'next-intl'

export function EducationSection() {
  const t = useTranslations('Home')

  return (
    <section className="w-full overflow-hidden">
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <span className="text-fluid-small text-secondary font-sans font-bold tracking-[0.4em] uppercase">
            {t('education.label')}
          </span>
          <h2 className="text-fluid-h3 mt-6 font-serif leading-[0.85] tracking-tighter uppercase">
            {t.rich('education.title', {
              dim: (chunks) => (
                <span className="text-foreground/60 italic opacity-60">{chunks}</span>
              ),
              br: () => <br />,
            })}
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-sans text-sm leading-relaxed opacity-60">
            {t('education.description')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          {/* QA Path */}
          <div className="border-foreground/20 hover:border-primary/50 group flex flex-col border p-8 transition-colors">
            <span className="text-primary font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('education.vector1.label')}
            </span>
            <h3 className="mt-4 font-serif text-2xl uppercase">{t('education.vector1.title')}</h3>
            <p className="mt-4 font-sans text-sm opacity-60">{t('education.vector1.desc')}</p>
            <Link
              href="/qa"
              className="text-primary mt-8 inline-flex items-center gap-3 font-sans text-xs font-bold tracking-widest uppercase"
            >
              <span>{t('education.vector1.cta')}</span>
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* Reality Check Path */}
          <div className="border-foreground/20 hover:border-secondary/50 group flex flex-col border p-8 transition-colors">
            <span className="text-secondary font-mono text-[10px] font-bold tracking-widest uppercase opacity-60">
              {t('education.vector2.label')}
            </span>
            <h3 className="mt-4 font-serif text-2xl uppercase">{t('education.vector2.title')}</h3>
            <p className="mt-4 font-sans text-sm opacity-60">{t('education.vector2.desc')}</p>
            <Link
              href="/reality-check"
              className="text-secondary mt-8 inline-flex items-center gap-3 font-sans text-xs font-bold tracking-widest uppercase"
            >
              <span>{t('education.vector2.cta')}</span>
              <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
