'use client'

import { SectionDivider } from '../_components/SectionDivider'
import { SimpleHeader } from '../_components/SimpleHeader'
import { Container } from '../../wrappers/Container'
import { useTranslations } from 'next-intl'

export default function ChangelogPage() {
  const t = useTranslations('Changelog')

  // Version keys matching messages JSON files
  const versions = ['v120', 'v110', 'v100']

  return (
    <main className="min-h-screen">
      <SimpleHeader title={t('header.title')} accentColor="text-foreground/60" />
      <SectionDivider />

      <section className="border-foreground/10 border-b">
        <Container className="py-10 lg:py-16">
          <div className="flex flex-col items-start lg:flex-row">
            {/* STICKY SIDEBAR */}
            <aside className="border-foreground/10 bg-foreground/2 border-l0 sticky top-14 hidden w-64 shrink-0 flex-col border border-l-0 lg:flex lg:border-r-0">
              <div className="border-foreground/10 bg-foreground/5 border-b px-6 py-5">
                <span className="font-sans text-[11px] font-bold tracking-widest uppercase opacity-50">
                  Indeks Wersji
                </span>
              </div>

              <nav className="flex flex-col">
                {versions.map((v, index) => (
                  <a
                    key={`nav-${v}`}
                    href={`#${v}`}
                    className={`group hover:bg-background relative flex items-center justify-between border border-transparent px-6 py-5 opacity-60 transition-all duration-300 ease-out hover:z-20 hover:translate-x-1 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:opacity-100 hover:shadow-[0_10px_20px_-10px_rgba(0,0,0,0.08)] ${
                      index !== versions.length - 1
                        ? 'border-b-foreground/10 hover:border-b-foreground/30'
                        : ''
                    }`}
                  >
                    <span className="text-foreground font-serif text-sm font-bold transition-colors group-hover:text-foreground/60">
                      {t(`${v}.version`)}
                    </span>
                    <span className="font-sans text-[10px] uppercase opacity-40 transition-opacity group-hover:opacity-60">
                      {t(`${v}.date`)}
                    </span>
                  </a>
                ))}
              </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="bg-foreground/10 border-foreground/10 flex w-full flex-1 flex-col gap-px border lg:border-r-0">
              {versions.map((v) => (
                <div
                  key={v}
                  id={v}
                  className="bg-background group relative scroll-mt-32 border border-transparent p-4 transition-all duration-300 ease-out hover:z-20 hover:-translate-y-1 hover:rounded-md hover:border-foreground/20 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] md:p-6 md:hover:translate-x-2 md:hover:-translate-y-2 md:hover:shadow-[-20px_25px_50px_-15px_rgba(0,0,0,0.12)] lg:p-8"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                    <div className="flex items-center gap-5">
                      {/* ZMIENIONO SPAN NA H2 */}
                      <h2 className="font-serif text-xl font-bold text-foreground/50 transition-colors group-hover:text-zinc-300">
                        {t(`${v}.version`)}
                      </h2>
                      <span className="bg-foreground/5 px-3 py-1 font-sans text-[10px] font-bold tracking-widest uppercase opacity-50">
                        {t(`${v}.tag`)}
                      </span>
                    </div>
                    <span className="font-sans text-[11px] uppercase opacity-40">
                      {t(`${v}.date`)}
                    </span>
                  </div>
                  <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed opacity-60">
                    {t(`${v}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}
