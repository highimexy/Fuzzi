'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'

// ─── Types ────────────────────────────────────────────────────────────────────

type BugId = 'paint' | 'pump' | 'paywall' | 'catapult'

interface BugMeta {
  id: BugId
  tag: string
  title: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  bugType: string
  hint: string
}

const BUGS: BugMeta[] = [
  {
    id: 'paint',
    tag: 'BUG-001',
    title: 'Malowanie Głośności',
    severity: 'HIGH',
    bugType: 'Interaction Anti-Pattern',
    hint: 'Trzeba "zamalować" pasek. Im więcej powierzchni pokryjesz, tym głośniej. Precyzja? Nie znamy.',
  },
  {
    id: 'pump',
    tag: 'BUG-002',
    title: 'Pompka Ciśnieniowa',
    severity: 'CRITICAL',
    bugType: 'State Decay',
    hint: 'Głośność to ciśnienie. Przestaniesz pompować — zacznie uciekać. Witaj w aktywnym słuchaniu.',
  },
  {
    id: 'paywall',
    tag: 'BUG-003',
    title: 'Głośność Premium',
    severity: 'CRITICAL',
    bugType: 'Dark Pattern',
    hint: 'Pierwsze 50% za darmo. Reszta wymaga subskrypcji. Monetyzacja decybeli.',
  },
  {
    id: 'catapult',
    tag: 'BUG-004',
    title: 'Katapulta Audio',
    severity: 'MEDIUM',
    bugType: 'Physics Engine Abuse',
    hint: 'Naładuj, zwolnij, módl się. Siła zależy od czasu ładowania. Lądowanie kuli = nowa głośność.',
  },
]

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'text-error border-error/40 bg-error/5',
  HIGH:     'text-accent border-accent/40 bg-accent/5',
  MEDIUM:   'text-secondary border-secondary/40 bg-secondary/5',
  LOW:      'text-foreground/40 border-foreground/20 bg-foreground/5',
}

// ─── 1. Paint slider ──────────────────────────────────────────────────────────

function PaintSlider({ onInteract }: { onInteract: () => void }) {
  const COLS = 40
  const ROWS = 6
  const TOTAL = COLS * ROWS
  const [painted, setPainted] = useState<Set<number>>(new Set())
  const [isPainting, setIsPainting] = useState(false)

  const volume = Math.round((painted.size / TOTAL) * 100)

  const paintCell = useCallback((idx: number) => {
    setPainted((prev) => {
      if (prev.has(idx)) return prev
      const next = new Set(prev)
      next.add(idx)
      return next
    })
    onInteract()
  }, [onInteract])

  const handlePointer = useCallback((e: React.PointerEvent) => {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
    const idx = el?.dataset?.cell
    if (idx !== undefined) paintCell(Number(idx))
  }, [paintCell])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">Głośność</span>
        <span className="font-mono text-xs opacity-60">{volume}%</span>
      </div>
      <div
        onPointerDown={(e) => { setIsPainting(true); handlePointer(e) }}
        onPointerMove={(e) => isPainting && handlePointer(e)}
        onPointerUp={() => setIsPainting(false)}
        onPointerLeave={() => setIsPainting(false)}
        className="border-foreground/15 bg-foreground/5 grid cursor-crosshair touch-none gap-px overflow-hidden border"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {Array.from({ length: TOTAL }).map((_, i) => (
          <div
            key={i}
            data-cell={i}
            className={`aspect-square transition-colors duration-75 ${painted.has(i) ? 'bg-primary' : 'bg-transparent'}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="font-sans text-[9px] italic opacity-20">
          Przeciągnij, by zamalować. {TOTAL - painted.size} pól do pełnej głośności.
        </p>
        <button onClick={() => setPainted(new Set())} className="font-sans text-[9px] tracking-wider uppercase opacity-30 hover:opacity-70">
          Wyczyść
        </button>
      </div>
    </div>
  )
}

// ─── 2. Pump slider ───────────────────────────────────────────────────────────

function PumpSlider({ onInteract }: { onInteract: () => void }) {
  const [volume, setVolume] = useState(0)
  const [pumping, setPumping] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setVolume((v) => Math.max(0, v - 1.2)), 80)
    return () => clearInterval(interval)
  }, [])

  const pump = useCallback(() => {
    setVolume((v) => Math.min(100, v + 9))
    setPumping(true)
    onInteract()
    setTimeout(() => setPumping(false), 120)
  }, [onInteract])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">Głośność</span>
        <span className={`font-mono text-xs transition-colors ${Math.round(volume) < 15 ? 'text-error' : 'opacity-60'}`}>
          {Math.round(volume)}%
        </span>
      </div>
      <div className="border-foreground/15 bg-foreground/5 relative h-3 w-full overflow-hidden border">
        <div className="from-secondary to-primary h-full bg-gradient-to-r transition-all duration-75" style={{ width: `${volume}%` }} />
        <div className="bg-error/40 absolute top-0 h-full w-px" style={{ left: '15%' }} />
      </div>
      <button
        onPointerDown={pump}
        className={`border-foreground/20 bg-foreground/5 relative flex items-center justify-center gap-2 border py-3 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-100 select-none active:scale-[0.97] ${pumping ? 'bg-primary/10 translate-y-0.5' : ''}`}
      >
        <span className="inline-block transition-transform duration-100" style={{ transform: pumping ? 'translateY(2px)' : 'translateY(-1px)' }}>⬇</span>
        Pompuj
      </button>
      <p className="font-sans text-[9px] italic opacity-20">Ciśnienie ucieka ~15%/s. Przestaniesz pompować — ucichnie.</p>
    </div>
  )
}

// ─── 3. Paywall slider ────────────────────────────────────────────────────────

function PaywallSlider({ onInteract }: { onInteract: () => void }) {
  const [volume, setVolume] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  const handleChange = (raw: number) => {
    onInteract()
    if (raw > 50 && !subscribed) { setVolume(50); setShowModal(true) }
    else setVolume(raw)
  }

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">Głośność</span>
        <span className="font-mono text-xs opacity-60">
          {volume}%{!subscribed && volume >= 50 && <span className="text-accent ml-1">🔒</span>}
        </span>
      </div>
      <div className="relative">
        <div className="bg-accent/10 absolute inset-y-0 right-0 w-1/2" />
        <div className="absolute inset-y-0 left-1/2 flex items-center">
          <span className="text-accent ml-1 font-sans text-[8px] font-bold tracking-wider uppercase">Premium</span>
        </div>
        <input type="range" min={0} max={100} value={volume} onChange={(e) => handleChange(Number(e.target.value))} className="accent-primary relative h-1 w-full cursor-pointer" />
      </div>
      <p className="font-sans text-[9px] italic opacity-20">Głośność 0–50% w planie darmowym. Pełen zakres w PRO.</p>

      {showModal && (
        <div className="bg-background/95 absolute inset-0 z-30 flex items-center justify-center backdrop-blur-sm">
          <div className="border-accent/30 bg-background w-full max-w-[260px] border p-5 text-center">
            <div className="mb-2 text-2xl">🔒</div>
            <h4 className="font-serif text-sm tracking-tight uppercase">Odblokuj Pełną Głośność</h4>
            <p className="mt-2 font-sans text-[10px] leading-relaxed opacity-50">
              Głośność powyżej 50% to funkcja premium. Słuchaj bez ograniczeń za jedyne 19,99 zł/mc.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => { setSubscribed(true); setShowModal(false) }} className="bg-accent text-background py-2 font-sans text-[10px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80">
                Odblokuj za 19,99 zł
              </button>
              <button onClick={() => setShowModal(false)} className="py-1 font-sans text-[9px] tracking-wider uppercase opacity-30 hover:opacity-60">
                Wytrzymam w ciszy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 4. Catapult slider ───────────────────────────────────────────────────────

function CatapultSlider({ onInteract }: { onInteract: () => void }) {
  const [volume, setVolume] = useState(0)
  const [charging, setCharging] = useState(false)
  const [power, setPower] = useState(0)
  const [ball, setBall] = useState<{ x: number; flying: boolean } | null>(null)

  // Refs avoid stale-closure & StrictMode double-invocation issues in state updaters
  const chargingRef  = useRef(false)
  const chargeStart  = useRef(0)
  const rafRef       = useRef<number | null>(null)
  const flightRafRef = useRef<number | null>(null)
  const powerRef     = useRef(0)

  const startCharge = useCallback(() => {
    if (chargingRef.current) return
    chargingRef.current = true
    setCharging(true)
    chargeStart.current = Date.now()

    const tick = () => {
      const p = Math.min(100, ((Date.now() - chargeStart.current) / 1500) * 100)
      powerRef.current = p
      setPower(p)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const release = useCallback(() => {
    if (!chargingRef.current) return
    chargingRef.current = false
    setCharging(false)

    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }

    onInteract()

    const p = powerRef.current
    const landing = Math.max(0, Math.min(100, p + (Math.random() - 0.5) * 12))
    powerRef.current = 0
    setPower(0)

    const flightStart = Date.now()
    const flightDur = 600

    const animateFlight = () => {
      const t = Math.min(1, (Date.now() - flightStart) / flightDur)
      const eased = 1 - Math.pow(1 - t, 2)
      setBall({ x: landing * eased, flying: t < 1 })
      if (t < 1) {
        flightRafRef.current = requestAnimationFrame(animateFlight)
      } else {
        setVolume(Math.round(landing))
        setTimeout(() => setBall(null), 400)
      }
    }

    setBall({ x: 0, flying: true })
    flightRafRef.current = requestAnimationFrame(animateFlight)
  }, [onInteract])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (flightRafRef.current) cancelAnimationFrame(flightRafRef.current)
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">Głośność</span>
        <span className="font-mono text-xs opacity-60">{volume}%</span>
      </div>

      <div className="border-foreground/15 bg-foreground/5 relative h-8 w-full overflow-hidden border">
        <div className="bg-primary/20 absolute inset-y-0 left-0 transition-all duration-300" style={{ width: `${volume}%` }} />
        <div className="bg-primary absolute inset-y-0 w-0.5 transition-all duration-300" style={{ left: `${volume}%` }} />
        {ball && (
          <div
            className="bg-accent absolute top-1/2 h-3 w-3 rounded-full"
            style={{ left: `${ball.x}%`, transform: `translateY(-50%) ${ball.flying ? 'scale(1.15)' : 'scale(1)'}`, boxShadow: '0 0 8px var(--accent)' }}
          />
        )}
      </div>

      {/* Power charge bar */}
      <div className="bg-foreground/10 h-1.5 w-full overflow-hidden">
        <div className={`h-full transition-[width] duration-75 ${power > 80 ? 'bg-error' : 'bg-accent'}`} style={{ width: `${power}%` }} />
      </div>

      <button
        onPointerDown={startCharge}
        onPointerUp={release}
        onPointerLeave={release}
        className={`border-foreground/20 flex items-center justify-center gap-2 border py-3 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-75 select-none ${charging ? 'bg-accent/10 scale-[0.98]' : 'bg-foreground/5'}`}
      >
        {charging ? '⚡ Ładowanie...' : '🎯 Przytrzymaj, by naładować'}
      </button>

      <p className="font-sans text-[9px] italic opacity-20">Im dłużej trzymasz, tym dalej leci kulka. Rozrzut wliczony w cenę.</p>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function BrokenUISection() {
  const [found, setFound]       = useState<Set<BugId>>(new Set())
  const [revealed, setRevealed] = useState<Set<BugId>>(new Set())

  const markFound = useCallback((id: BugId) => {
    setFound((prev) => prev.has(id) ? prev : new Set([...prev, id]))
  }, [])

  const toggleReveal = (id: BugId) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const renderControl = (id: BugId) => {
    const onInteract = () => markFound(id)
    switch (id) {
      case 'paint':    return <PaintSlider onInteract={onInteract} />
      case 'pump':     return <PumpSlider onInteract={onInteract} />
      case 'paywall':  return <PaywallSlider onInteract={onInteract} />
      case 'catapult': return <CatapultSlider onInteract={onInteract} />
    }
  }

  const foundCount = found.size

  return (
    <section className="relative w-full overflow-hidden">
      <Container>
        <div className="relative">
          <BackgroundGrid />

          {/* Header */}
          <div className="relative z-10 px-6 py-12 text-center">
            <span className="text-error mb-4 inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">
              <span className="bg-error inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
              Środowisko Testowe
            </span>

            <h2 className="font-serif text-fluid-h2 uppercase tracking-tighter">
              Spróbuj zmienić <span className="text-accent italic">głośność.</span>
              <br />
              <span className="opacity-30">To prostsze niż myślisz.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed opacity-40">
              Cztery kontrolki. Każda działa. Żadna nie powinna istnieć.
              Twoje zadanie: dotknij każdej i poczuj ból użytkownika.
            </p>

            {foundCount > 0 && (
              <div className="border-foreground/10 mt-6 inline-flex items-center gap-3 border px-5 py-2">
                <span className="font-mono text-xs opacity-40">Przetestowane:</span>
                <div className="flex gap-1.5">
                  {BUGS.map((b) => (
                    <div key={b.id} className={`h-2 w-2 rounded-full transition-all duration-300 ${found.has(b.id) ? 'bg-primary' : 'bg-foreground/10'}`} />
                  ))}
                </div>
                <span className="text-primary font-mono text-xs font-bold">{foundCount}/4</span>
              </div>
            )}
          </div>

          {/* Cards */}
          <div className="relative z-10 mx-6 mb-6">
            <div className="bg-foreground/10 grid gap-px sm:grid-cols-2">
              {BUGS.map((bug) => {
                const isFound    = found.has(bug.id)
                const isRevealed = revealed.has(bug.id)

                return (
                  <div
                    key={bug.id}
                    className={`bg-background relative flex flex-col gap-6 p-7 transition-all duration-300 ${isFound ? 'ring-primary/20 ring-1 ring-inset' : ''}`}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] opacity-30">{bug.tag}</span>
                          {isFound && (
                            <span className="text-primary font-sans text-[8px] font-bold tracking-wider uppercase">✓ Testowany</span>
                          )}
                        </div>
                        <h3 className="mt-1 font-serif text-base tracking-tight uppercase">{bug.title}</h3>
                      </div>
                      <span className={`shrink-0 border px-2 py-0.5 font-sans text-[8px] font-bold tracking-widest uppercase ${SEVERITY_STYLES[bug.severity]}`}>
                        {bug.severity}
                      </span>
                    </div>

                    {/* Interactive control */}
                    <div className="flex-1">{renderControl(bug.id)}</div>

                    {/* Footer */}
                    <div className="border-foreground/10 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[9px] tracking-widest uppercase opacity-30">{bug.bugType}</span>
                        <button onClick={() => toggleReveal(bug.id)} className="font-sans text-[9px] tracking-widest uppercase opacity-30 transition-opacity hover:opacity-80">
                          {isRevealed ? 'Ukryj' : 'Co tu nie gra?'}
                        </button>
                      </div>
                      {isRevealed && (
                        <p className="text-secondary mt-3 font-sans text-[10px] leading-relaxed">{bug.hint}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="relative z-10 pb-12 text-center">
            <p className="font-sans text-sm leading-relaxed opacity-50">
              Każdy z tych wzorców istnieje w prawdziwych aplikacjach.{' '}
              <span className="text-foreground opacity-100">QA wyłapuje je zanim zrobi to użytkownik.</span>
            </p>
            <a
              href="/qa"
              className="border-primary text-primary hover:bg-primary hover:text-background mt-6 inline-block border px-10 py-4 font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              Naucz się je wykrywać →
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
