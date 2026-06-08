'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { FiArrowRight, FiTerminal, FiTarget } from 'react-icons/fi'
import { QaDodgeGame } from './QaDodgeGame'
import { RealityTeamOrbit } from './RealityTeamOrbit'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  qa: FiTerminal,
  reality: FiTarget,
}

type Track = {
  id: string
  title: string
  subtitle: string
  desc: string
  label: string
  index: string
  href: string
  stat: string
}

export function TrackColumn({ track, isFirst }: { track: Track; isFirst: boolean }) {
  const [hovered, setHovered] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const Icon = ICONS[track.id] ?? FiTerminal

  return (
    <Link
      href={track.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group hover:bg-foreground/2.5 relative flex min-h-[50vh] flex-1 flex-col justify-between overflow-hidden p-10 transition-colors duration-500 lg:min-h-0 lg:p-16 ${isFirst ? 'border-foreground/10 border-b lg:border-r lg:border-b-0' : ''}`}
    >
      {track.id === 'qa' ? (
        <QaDodgeGame active={hovered} headerRef={headerRef} />
      ) : (
        <RealityTeamOrbit active={hovered} />
      )}

      <Icon className="text-foreground pointer-events-none absolute right-4 bottom-4 text-[240px] opacity-[0.025] transition-all duration-700 group-hover:scale-105 group-hover:-rotate-3 group-hover:opacity-[0.06]" />

      {/* Górny row — headerRef dla QaDodgeGame (granica spawnu errorów) */}
      <div ref={headerRef} className="relative z-10 flex items-center justify-between">
        <span className="text-foreground/30 text-fluid-small font-sans tracking-[0.25em] uppercase">
          {track.label}
        </span>
        <span className="text-foreground/15 text-fluid-small font-sans tracking-widest">
          {track.index} / 02
        </span>
      </div>

      {/* Środek */}
      <div className="relative z-10 my-auto py-14">
        <p className="text-primary text-fluid-small mb-4 font-sans tracking-[0.3em] uppercase">
          {track.subtitle}
        </p>
        <h2 className="text-fluid-h2 mb-6 font-serif leading-[0.99] font-bold uppercase">
          {track.title}
        </h2>
        <p className="text-foreground/45 text-fluid-p max-w-md font-sans leading-relaxed">
          {track.desc}
        </p>
      </div>

      {/* Dolny row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/50 h-px w-6 transition-all duration-500 group-hover:w-12" />
          <span className="text-foreground/25 text-fluid-small font-sans tracking-widest uppercase">
            {track.stat}
          </span>
        </div>
        <div className="text-foreground/25 group-hover:text-foreground/60 text-fluid-small flex items-center gap-2 font-sans font-bold tracking-[0.2em] uppercase transition-all duration-300 group-hover:gap-3">
          <span>Wejdź</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
