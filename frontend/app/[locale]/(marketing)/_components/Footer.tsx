'use client'

import { Container } from '../../wrappers/Container'
import Link from 'next/link'
import { FiCoffee } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { FuzziMark } from '../../global-components/logo/page'
import Dot from '../../global-components/dot/page'

export function Footer() {
  const t = useTranslations('Footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background sticky bottom-0 z-0 w-full">
      <Container className="lg:pt-24">
        <div className="flex flex-col gap-12 px-6 lg:flex-row lg:justify-between">
          <div className="flex items-end">
            <Link
              href="/"
              className="text-fluid-h1 font-serif leading-[0.8] uppercase transition-opacity hover:opacity-80"
            >
              <FuzziMark className="relative top-6 left-8 lg:top-8 lg:left-66.5" size={70} />
              Fuzzi
            </Link>
            <div className="relative top-1.5 ml-2 lg:top-1">
              <Dot size="clamp(15px, 0.55vw, 8px)" />
            </div>
          </div>

          <div className="space-y-8 lg:mb-4 lg:max-w-xs lg:text-right">
            <p className="font-sans text-[10px] leading-relaxed tracking-widest uppercase opacity-50 md:text-xs md:tracking-widest">
              {t.rich('description', {
                bold: (chunks) => (
                  <span className="text-foreground font-bold opacity-100">{chunks}</span>
                ),
                italic: (chunks) => (
                  <span className="text-foreground font-bold italic opacity-100">{chunks}</span>
                ),
              })}
            </p>

            <div className="flex flex-col items-start gap-5 lg:flex-row lg:justify-end lg:gap-x-8">
              <Link
                href="/about"
                className="border-foreground/20 hover:border-foreground w-fit border-b font-sans text-[11px] font-bold tracking-[0.15em] whitespace-nowrap uppercase transition-colors md:tracking-[0.2em]"
              >
                {t('about')}
              </Link>

              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="border-accent/40 text-accent hover:border-accent flex w-fit items-center gap-2 border-b font-sans text-[11px] font-bold tracking-[0.15em] whitespace-nowrap uppercase transition-colors md:tracking-[0.2em]"
              >
                {t('coffee')} <FiCoffee className="shrink-0 text-sm" />
              </a>

              <Link
                href="/changelog"
                className="border-foreground/20 hover:border-foreground w-fit border-b font-sans text-[11px] font-bold tracking-[0.15em] whitespace-nowrap uppercase transition-colors md:tracking-[0.2em]"
              >
                {t('changelog')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-foreground/10 mt-20 flex flex-col items-center justify-between border-t px-6 pt-8 pb-8 opacity-30 md:flex-row">
          <p className="font-sans text-[10px] tracking-[0.3em] uppercase md:text-xs">
            © {currentYear} Fuzzi
          </p>
          <span className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase italic md:mt-0 md:text-xs">
            {t('madeIn')}
          </span>
        </div>
      </Container>
    </footer>
  )
}
