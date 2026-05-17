'use client'
import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'

const STATS = [
  {
    number: '92%',
    unit: 'kursów QA',
    headline: 'uczy teorii, nie rzeczywistości.',
    body: 'Uczą cię klikać przyciski, nie myśleć jak inżynier. To nie twoja wina - system nauki QA jest zepsuty od podstaw.',
    tag: '01',
    color: 'text-primary',
  },
  {
    number: '7/10',
    unit: 'juniorów QA',
    headline: 'oblewa screen po\xa0„ukończeniu kursu".',
    body: 'Certyfikat nie zastąpi instynktu. Rekruterzy to widzą w 5 minut. Twoje CV mówi jedno - rozmowa drugie.',
    tag: '02',
    color: 'text-secondary',
  },
  {
    number: '~ 6 mies.',
    unit: 'w pierwszej pracy',
    headline: 'zanim ogarniesz jak działa frontend.',
    body: 'Nikt ci tego nie powiedział wcześniej. A powinien. My mówimy wprost - i skracamy ten czas do tygodni.',
    tag: '03',
    color: 'text-accent',
  },
]

export function ProblemSection() {
  const t = useTranslations('Home')

  return (
    <section className="w-full overflow-hidden">
      <Container className="">
        <div className="px-6">
          <div className="flex flex-col gap-0 lg:flex-row">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="border-foreground/10 flex flex-1 flex-col gap-8 border-t py-10 lg:border-t-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <div>
                  <div
                    className={`text-fluid-h3 font-serif leading-none font-bold tracking-tighter ${stat.color}`}
                  >
                    {stat.number}
                  </div>
                  <div className="mt-1 font-mono text-[10px] font-bold tracking-widest text-white/30 uppercase">
                    {stat.unit}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-fluid-h4 font-serif leading-[0.9] tracking-tighter uppercase">
                    {stat.headline}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed opacity-40">{stat.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
