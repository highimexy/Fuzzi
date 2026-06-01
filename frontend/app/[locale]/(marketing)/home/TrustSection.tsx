'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { Container } from '../../wrappers/Container'
import { FuzziMark } from '../../global-components/logo/page'
import { useTranslations } from 'next-intl'
import {
  SiNextdotjs,
  SiGo,
  SiThreedotjs,
  SiGreensock,
  SiTailwindcss,
  SiTypescript,
  SiPostgresql,
  SiDocker,
} from 'react-icons/si'
import { BackgroundGrid } from '../_components/BackgroundGrid'

// ─────────────────────────────────────────────
// Typy
// ─────────────────────────────────────────────
type SlotItem = {
  icon: React.ReactNode
  label: string
}

type LogEntry = {
  id: string
  role: string
  status: string
  text: string
  featured: boolean
  avatar: string | React.ReactNode
}

// ─────────────────────────────────────────────
// Dane slotów
// ─────────────────────────────────────────────
const SLOT_PAIRS: [SlotItem, SlotItem][] = [
  [
    { icon: <SiNextdotjs />, label: 'Next.js' },
    { icon: <SiTailwindcss />, label: 'Tailwind' },
  ],
  [
    { icon: <SiGo />, label: 'Golang' },
    { icon: <SiTypescript />, label: 'TypeScript' },
  ],
  [
    { icon: <SiThreedotjs />, label: 'Three.js' },
    { icon: <SiPostgresql />, label: 'PostgreSQL' },
  ],
  [
    { icon: <SiGreensock />, label: 'GSAP' },
    { icon: <SiDocker />, label: 'Docker' },
  ],
]

// ─────────────────────────────────────────────
// 1. Pojedynczy slot — własny stan + animacja
// ─────────────────────────────────────────────
function Slot({ pair, delay }: { pair: [SlotItem, SlotItem]; delay: number }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const el = ref.current

    const tl = gsap.timeline({ repeat: -1, delay, repeatDelay: 4 })

    tl.to(el, {
      rotateX: -90,
      filter: 'blur(3px)',
      duration: 0.18,
      ease: 'power2.in',
      transformOrigin: '50% 100%',
    })
      .call(() => {
        setCurrentIdx((prev) => (prev === 0 ? 1 : 0))
        gsap.set(el, { rotateX: 90 })
      })
      .to(el, {
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.18,
        ease: 'power2.out',
        transformOrigin: '50% 0%',
      })

    return () => {
      tl.kill()
    }
  }, [delay])

  const item = pair[currentIdx]!

  return (
    <div
      ref={ref}
      className="flex max-w-40 min-w-40 items-center gap-2 px-4 py-1.5"
      style={{ perspective: '600px', backfaceVisibility: 'hidden' }}
    >
      <span className="text-foreground/50 text-base">{item.icon}</span>
      <span className="text-foreground/70 font-sans font-bold tracking-widest uppercase">
        {item.label}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// 2. Pasek ze slotami
// ─────────────────────────────────────────────
function PoweredBySlotMachine() {
  return (
    <div className="mt-10 w-full select-none">
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 lg:flex lg:flex-wrap lg:items-center lg:justify-center">
        {SLOT_PAIRS.map((pair, i) => (
          <div key={i} className="flex items-center">
            <Slot pair={pair} delay={1.5 + i * 0.22} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// 3. Komponent główny
// ─────────────────────────────────────────────
export function TrustSection() {
  const t = useTranslations('TrustSection')

  const betaLogs: LogEntry[] = [
    {
      id: t('log1.id'),
      role: t('log1.role'),
      status: t('log1.status'),
      text: t('log1.text'),
      featured: false,
      avatar: '/1.jpg',
    },
    {
      id: t('log2.id'),
      role: t('log2.role'),
      status: t('log2.status'),
      text: t('log2.text'),
      featured: false,
      avatar: '/2.jpg',
    },
    {
      id: t('log3.id'),
      role: t('log3.role'),
      status: t('log3.status'),
      text: t('log3.text'),
      featured: true,
      avatar: <FuzziMark size={90} />,
    },
    {
      id: t('log4.id'),
      role: t('log4.role'),
      status: t('log4.status'),
      text: t('log4.text'),
      featured: false,
      avatar: '/3.jpg',
    },
    {
      id: t('log5.id'),
      role: t('log5.role'),
      status: t('log5.status'),
      text: t('log5.text'),
      featured: false,
      avatar: '/4.jpg',
    },
  ]

  return (
    <section className="relative w-full overflow-hidden">
      <Container className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center text-center">
            <span className="text-accent flex items-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase opacity-80">
              <span className="bg-accent h-2 w-2 animate-pulse rounded-full" />
              {t('badge')}
            </span>
            <h2 className="text-fluid-h3 mt-4 max-w-2xl font-serif leading-[0.9] tracking-tighter uppercase">
              {t('title')} <br />
              <span className="text-foreground/60 italic opacity-60">{t('titleHighlight')}</span>
            </h2>
          </div>

          <PoweredBySlotMachine />

          <div className="border-foreground/10 mt-8 grid grid-cols-1 border lg:grid-cols-3">
            <div className="border-foreground/10 flex flex-col border-b lg:border-r lg:border-b-0">
              <div className="border-foreground/10 flex-1 border-b">
                <LogCard log={betaLogs[0]!} />
              </div>
              <div className="flex-1">
                <LogCard log={betaLogs[1]!} />
              </div>
            </div>

            <div className="border-foreground/10 border-b lg:border-r lg:border-b-0">
              <LogCard log={betaLogs[2]!} />
            </div>

            <div className="flex flex-col">
              <div className="border-foreground/10 flex-1 border-b">
                <LogCard log={betaLogs[3]!} />
              </div>
              <div className="flex-1">
                <LogCard log={betaLogs[4]!} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// ─────────────────────────────────────────────
// 4. Karta logu
// ─────────────────────────────────────────────
function LogCard({ log }: { log: LogEntry }) {
  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden p-8 text-left transition-all duration-300 ${
        log.featured
          ? 'border-accent shadow-accent/20 bg-background ring-accent/30 hover:bg-accent/2 cursor-pointer justify-center border shadow-2xl ring-1'
          : 'hover:bg-foreground/2 justify-between'
      }`}
    >
      {log.featured && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <BackgroundGrid color="rgba(255, 255, 255, 0.15)" />
        </div>
      )}

      {/* ZAWARTOSC KARTY */}
      <div
        className={`relative z-10 ${log.featured ? 'flex flex-col items-center text-center' : ''}`}
      >
        {/* NAGŁÓWEK */}
        <div
          className={`border-foreground/10 mb-6 flex flex-wrap items-center gap-4 ${
            log.featured
              ? 'flex-col justify-center border-none pb-0'
              : 'justify-between border-b pb-4'
          }`}
        >
          <div className={`flex items-center gap-4 ${log.featured ? 'flex-col' : ''}`}>
            {/* AVATAR */}
            <div
              className={`relative flex shrink-0 items-center justify-center overflow-hidden border ${
                log.featured
                  ? 'border-accent/40 bg-accent/10 h-16 w-16'
                  : 'border-foreground/20 bg-foreground/5 h-10 w-10'
              }`}
            >
              {typeof log.avatar === 'string' ? (
                <Image
                  src={log.avatar}
                  alt={log.id}
                  fill
                  className="object-cover opacity-70 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />
              ) : (
                <div className="featured:p-0 flex h-full w-full items-center justify-center p-1.5">
                  {log.avatar}
                </div>
              )}
            </div>

            {/* ID + rola */}
            <div className={`flex flex-col gap-0.5 ${log.featured ? 'mt-2 items-center' : ''}`}>
              <span
                className={`font-sans text-[10px] font-bold tracking-widest uppercase ${
                  log.featured ? 'text-accent text-xs' : 'text-foreground/80'
                }`}
              >
                {log.id}
              </span>
              <span
                className={`font-sans text-[8px] tracking-widest uppercase ${
                  log.featured ? 'text-accent/80' : 'text-foreground/40'
                }`}
              >
                {log.role}
              </span>
            </div>
          </div>

          {/* Status badge */}
          {!log.featured && (
            <span className="text-foreground/30 font-sans text-[8px] font-bold tracking-widest uppercase">
              {log.status}
            </span>
          )}
        </div>

        {/* TREŚĆ */}
        <p
          className={`font-sans text-sm leading-relaxed whitespace-pre-wrap ${
            log.featured
              ? 'text-foreground mt-6 font-bold opacity-100'
              : 'text-foreground opacity-70'
          }`}
        >
          {!log.featured && <>&ldquo;</>}
          {log.text}
          {!log.featured && <>&rdquo;</>}
        </p>
      </div>
    </div>
  )
}
