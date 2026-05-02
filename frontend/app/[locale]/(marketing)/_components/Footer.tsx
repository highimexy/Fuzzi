'use client'

import { Container } from '../../wrappers/Container'
import Link from 'next/link'
import { FiCoffee } from 'react-icons/fi'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-foreground/10 sticky bottom-0 z-0 w-full border-t">
      <Container className="pt-24">
        <div className="flex flex-col gap-12 px-6 lg:flex-row lg:justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-fluid-h1 font-serif leading-[0.8] tracking-tighter uppercase transition-opacity hover:opacity-80"
            >
              Frontline
            </Link>
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
                className="flex w-fit items-center gap-2 border-b border-yellow-500/40 font-sans text-[11px] font-bold tracking-[0.15em] whitespace-nowrap text-yellow-500 uppercase transition-colors hover:border-yellow-500 md:tracking-[0.2em]"
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
            © {currentYear} Frontline
          </p>
          <span className="mt-4 font-sans text-[10px] tracking-[0.3em] uppercase italic md:mt-0 md:text-xs">
            {t('madeIn')}
          </span>
        </div>
      </Container>
    </footer>
  )
}
