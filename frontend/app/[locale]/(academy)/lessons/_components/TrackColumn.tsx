'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { FiArrowRight } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { QaDodgeGame } from './QaDodgeGame'
import { RealityTeamOrbit } from './RealityTeamOrbit'

type Track = {
  id: 'qa' | 'reality'
  index: string
  href: string
}

export function TrackColumn({ track, isFirst }: { track: Track; isFirst: boolean }) {
  const [hovered, setHovered] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('Lessons.tracks')

  const highlights = t.raw(`${track.id}.highlights`) as string[]
  const isQa = track.id === 'qa'

  return (
    <Link
      href={track.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative flex min-h-[50vh] flex-1 flex-col justify-between overflow-hidden p-10 transition-colors duration-500 lg:min-h-0 lg:p-16 ${isFirst ? 'border-foreground/10 border-b lg:border-r lg:border-b-0' : ''}`}
    >
      {/* Track accent line at top */}
      <div
        className={`absolute top-0 right-0 left-0 h-px transition-opacity duration-500 ${isQa ? 'bg-primary opacity-25 group-hover:opacity-90' : 'bg-secondary opacity-25 group-hover:opacity-90'}`}
      />

      {/* Radial glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 90% 35% at 50% 0%, color-mix(in srgb, var(${isQa ? '--primary' : '--secondary'}) 9%, transparent), transparent)`,
        }}
      />

      {/* Background animation */}
      {isQa ? (
        <QaDodgeGame active={hovered} headerRef={headerRef} />
      ) : (
        <RealityTeamOrbit active={hovered} />
      )}

      {/* Top row */}
      <div ref={headerRef} className="relative z-10 flex items-center justify-between">
        <span
          className={`text-fluid-small font-sans tracking-[0.25em] uppercase transition-colors duration-300 ${isQa ? 'text-primary/50 group-hover:text-primary/90' : 'text-secondary/50 group-hover:text-secondary/90'}`}
        >
          {t(`${track.id}.label`)}
        </span>
        <span className="text-foreground/15 text-fluid-small font-sans tabular-nums tracking-widest">
          {track.index} {t('index')}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 my-auto py-14">
        <p
          className={`text-fluid-small mb-3 font-sans tracking-[0.3em] uppercase ${isQa ? 'text-primary' : 'text-secondary'}`}
        >
          {t(`${track.id}.subtitle`)}
        </p>
        <h2 className="text-fluid-h2 mb-5 font-serif font-bold uppercase leading-[0.99]">
          {t(`${track.id}.title`)}
        </h2>
        <p className="text-foreground/45 text-fluid-p mb-8 max-w-md font-sans leading-relaxed">
          {t(`${track.id}.desc`)}
        </p>

        <div className="flex flex-wrap gap-2">
          {highlights.map((label, i) => (
            <span
              key={i}
              className={`border px-3 py-1 text-xs font-sans font-medium uppercase tracking-wide transition-all duration-300 ${
                isQa
                  ? 'border-primary/20 text-primary/50 group-hover:border-primary/45 group-hover:text-primary/80'
                  : 'border-secondary/20 text-secondary/50 group-hover:border-secondary/45 group-hover:text-secondary/80'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          className={`h-px w-8 transition-all duration-500 group-hover:w-16 ${isQa ? 'bg-primary/40' : 'bg-secondary/40'}`}
        />

        <div
          className={`flex items-center gap-2 border px-5 py-2 text-fluid-small font-sans font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
            isQa
              ? 'border-primary/15 text-primary/30 group-hover:border-primary/50 group-hover:bg-primary/5 group-hover:text-primary'
              : 'border-secondary/15 text-secondary/30 group-hover:border-secondary/50 group-hover:bg-secondary/5 group-hover:text-secondary'
          }`}
        >
          {t('cta')}
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
