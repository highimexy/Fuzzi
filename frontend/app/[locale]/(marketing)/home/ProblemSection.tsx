'use client'
import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'

export function ProblemSection() {
  const t = useTranslations('ProblemSection')

  const items = [
    {
      number: t('item1.number'),
      unit: t('item1.unit'),
      headline: t('item1.headline'),
      body: t('item1.body'),
      color: 'text-primary',
    },
    {
      number: t('item2.number'),
      unit: t('item2.unit'),
      headline: t('item2.headline'),
      body: t('item2.body'),
      color: 'text-secondary',
    },
    {
      number: t('item3.number'),
      unit: t('item3.unit'),
      headline: t('item3.headline'),
      body: t('item3.body'),
      color: 'text-accent',
    },
  ]

  return (
    <section className="w-full overflow-hidden">
      <Container className="">
        <div className="px-6">
          <div className="flex flex-col gap-0 lg:flex-row">
            {items.map((item, i) => (
              <div
                key={i}
                className="border-foreground/10 flex flex-1 flex-col gap-8 border-t py-10 lg:border-t-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <div>
                  <div
                    className={`text-fluid-h3 font-serif leading-none font-bold tracking-tighter ${item.color}`}
                  >
                    {item.number}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-bold tracking-widest text-white/30 uppercase">
                    {item.unit}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-fluid-h4 font-serif leading-[0.9] tracking-tighter uppercase">
                    {item.headline}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-40">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
