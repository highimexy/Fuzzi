'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'
import RoughBackground from '../../wrappers/RoughBackground'

// ─── Types ────────────────────────────────────────────────────────────────────

type BugId = 'paint' | 'pump' | 'paywall' | 'catapult'

interface BugMeta {
  id: BugId
  tag: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

const BUGS: BugMeta[] = [
  { id: 'paint', tag: 'BUG-001', severity: 'HIGH' },
  { id: 'pump', tag: 'BUG-002', severity: 'CRITICAL' },
  { id: 'paywall', tag: 'BUG-003', severity: 'CRITICAL' },
  { id: 'catapult', tag: 'BUG-004', severity: 'MEDIUM' },
]

const SEVERITY_STYLES: Record<string, string> = {
  CRITICAL: 'text-error border-error/40 bg-error/5',
  HIGH: 'text-accent border-accent/40 bg-accent/5',
  MEDIUM: 'text-secondary border-secondary/40 bg-secondary/5',
  LOW: 'text-foreground/40 border-foreground/20 bg-foreground/5',
}

// ─── 1. Paint slider ──────────────────────────────────────────────────────────

function PaintSlider({
  onInteract,
  volumeLabel,
  clearLabel,
}: {
  onInteract: () => void
  volumeLabel: string
  clearLabel: string
}) {
  const COLS = 40
  const ROWS = 6
  const TOTAL = COLS * ROWS
  const [painted, setPainted] = useState<Set<number>>(new Set())
  const [isPainting, setIsPainting] = useState(false)

  const volume = Math.round((painted.size / TOTAL) * 100)

  const paintCell = useCallback(
    (idx: number) => {
      setPainted((prev) => {
        if (prev.has(idx)) return prev
        const next = new Set(prev)
        next.add(idx)
        return next
      })
      onInteract()
    },
    [onInteract]
  )

  const handlePointer = useCallback(
    (e: React.PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const idx = el?.dataset?.cell
      if (idx !== undefined) paintCell(Number(idx))
    },
    [paintCell]
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">
          {volumeLabel}
        </span>
        <span className="font-mono text-xs opacity-60">{volume}%</span>
      </div>
      <div
        onPointerDown={(e) => {
          setIsPainting(true)
          handlePointer(e)
        }}
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
      <div className="flex justify-end">
        <button
          onClick={() => setPainted(new Set())}
          className="font-sans text-[9px] tracking-wider uppercase opacity-30 hover:opacity-70"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  )
}

// ─── 2. Pump slider ───────────────────────────────────────────────────────────

function PumpSlider({
  onInteract,
  volumeLabel,
  pumpLabel,
}: {
  onInteract: () => void
  volumeLabel: string
  pumpLabel: string
}) {
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
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">
          {volumeLabel}
        </span>
        <span
          className={`font-mono text-xs transition-colors ${Math.round(volume) < 15 ? 'text-error' : 'opacity-60'}`}
        >
          {Math.round(volume)}%
        </span>
      </div>
      <div className="border-foreground/15 bg-foreground/5 relative h-3 w-full overflow-hidden border">
        <div
          className="from-secondary to-primary h-full bg-gradient-to-r transition-all duration-75"
          style={{ width: `${volume}%` }}
        />
        <div className="bg-error/40 absolute top-0 h-full w-px" style={{ left: '15%' }} />
      </div>
      <button
        onPointerDown={pump}
        className={`border-foreground/20 bg-foreground/5 relative flex items-center justify-center gap-2 border py-3 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-100 select-none active:scale-[0.97] ${pumping ? 'bg-primary/10 translate-y-0.5' : ''}`}
      >
        <span
          className="inline-block transition-transform duration-100"
          style={{ transform: pumping ? 'translateY(2px)' : 'translateY(-1px)' }}
        >
          ⬇
        </span>
        {pumpLabel}
      </button>
    </div>
  )
}

// ─── 3. Paywall slider ────────────────────────────────────────────────────────

function PaywallSlider({
  onInteract,
  volumeLabel,
  modal,
}: {
  onInteract: () => void
  volumeLabel: string
  modal: { title: string; body: string; cta: string; dismiss: string }
}) {
  const [volume, setVolume] = useState(20)
  const [showModal, setShowModal] = useState(false)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    if (showModal && isMobile) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const handleChange = (raw: number) => {
    onInteract()
    if (raw > 50 && !subscribed) {
      setVolume(50)
      setShowModal(true)
    } else setVolume(raw)
  }

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">
          {volumeLabel}
        </span>
        <span className="font-mono text-xs opacity-60">
          {volume}%{!subscribed && volume >= 50 && <span className="text-accent ml-1">🔒</span>}
        </span>
      </div>
      <div className="relative">
        <div className="bg-accent/10 absolute inset-y-0 right-0 w-1/2" />
        <div className="absolute inset-y-0 left-1/2 flex items-center">
          <span className="text-accent ml-1 font-sans text-[8px] font-bold tracking-wider uppercase">
            Premium
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="accent-primary relative h-1 w-full cursor-pointer"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm md:absolute md:z-30 md:bg-background/95">
          <div className="border-accent/30 bg-background w-full max-w-[260px] border p-5 text-center">
            <div className="mb-2 text-2xl">🔒</div>
            <h4 className="font-serif text-sm tracking-tight uppercase">{modal.title}</h4>
            <p className="mt-2 font-sans text-[10px] leading-relaxed opacity-50">{modal.body}</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSubscribed(true)
                  setShowModal(false)
                }}
                className="bg-accent text-background py-2 font-sans text-[10px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
              >
                {modal.cta}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="py-1 font-sans text-[9px] tracking-wider uppercase opacity-30 hover:opacity-60"
              >
                {modal.dismiss}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── 4. Catapult slider ───────────────────────────────────────────────────────

function CatapultSlider({
  onInteract,
  volumeLabel,
  chargeLabel,
  chargingLabel,
}: {
  onInteract: () => void
  volumeLabel: string
  chargeLabel: string
  chargingLabel: string
}) {
  const [volume, setVolume] = useState(0)
  const [charging, setCharging] = useState(false)
  const [power, setPower] = useState(0)
  const [ball, setBall] = useState<{ x: number; flying: boolean } | null>(null)

  const chargingRef = useRef(false)
  const chargeStart = useRef(0)
  const rafRef = useRef<number | null>(null)
  const flightRafRef = useRef<number | null>(null)
  const powerRef = useRef(0)

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

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

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

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (flightRafRef.current) cancelAnimationFrame(flightRafRef.current)
    },
    []
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[10px] tracking-widest uppercase opacity-40">
          {volumeLabel}
        </span>
        <span className="font-mono text-xs opacity-60">{volume}%</span>
      </div>

      <div className="border-foreground/15 bg-foreground/5 relative h-8 w-full overflow-hidden border">
        <div
          className="bg-primary/20 absolute inset-y-0 left-0 transition-all duration-300"
          style={{ width: `${volume}%` }}
        />
        <div
          className="bg-primary absolute inset-y-0 w-0.5 transition-all duration-300"
          style={{ left: `${volume}%` }}
        />
        {ball && (
          <div
            className="bg-accent absolute top-1/2 h-3 w-3 rounded-full"
            style={{
              left: `${ball.x}%`,
              transform: `translateY(-50%) ${ball.flying ? 'scale(1.15)' : 'scale(1)'}`,
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
        )}
      </div>

      <div className="bg-foreground/10 h-1.5 w-full overflow-hidden">
        <div
          className={`h-full transition-[width] duration-75 ${power > 80 ? 'bg-error' : 'bg-accent'}`}
          style={{ width: `${power}%` }}
        />
      </div>

      <button
        onPointerDown={startCharge}
        onPointerUp={release}
        onPointerLeave={release}
        className={`border-foreground/20 flex items-center justify-center gap-2 border py-3 font-sans text-xs font-bold tracking-widest uppercase transition-all duration-75 select-none ${charging ? 'bg-accent/10 scale-[0.98]' : 'bg-foreground/5'}`}
      >
        {charging ? `⚡ ${chargingLabel}` : `🎯 ${chargeLabel}`}
      </button>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export function BrokenUISection() {
  const t = useTranslations('BrokenUiSection')
  const [found, setFound] = useState<Set<BugId>>(new Set())

  const markFound = useCallback((id: BugId) => {
    setFound((prev) => (prev.has(id) ? prev : new Set([...prev, id])))
  }, [])

  const volumeLabel = t('volumeLabel')

  const renderControl = (id: BugId) => {
    const onInteract = () => markFound(id)
    switch (id) {
      case 'paint':
        return (
          <PaintSlider
            onInteract={onInteract}
            volumeLabel={volumeLabel}
            clearLabel={t('paint.clear')}
          />
        )
      case 'pump':
        return (
          <PumpSlider
            onInteract={onInteract}
            volumeLabel={volumeLabel}
            pumpLabel={t('pump.button')}
          />
        )
      case 'paywall':
        return (
          <PaywallSlider
            onInteract={onInteract}
            volumeLabel={volumeLabel}
            modal={{
              title: t('paywall.modalTitle'),
              body: t('paywall.modalBody'),
              cta: t('paywall.modalCTA'),
              dismiss: t('paywall.modalDismiss'),
            }}
          />
        )
      case 'catapult':
        return (
          <CatapultSlider
            onInteract={onInteract}
            volumeLabel={volumeLabel}
            chargeLabel={t('catapult.charge')}
            chargingLabel={t('catapult.charging')}
          />
        )
    }
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Container>
        <div className="relative">
          <BackgroundGrid />

          {/* Header */}
          <div className="relative z-10 px-4 py-8 text-center sm:px-6 sm:py-12">
            <span className="text-error mb-4 inline-flex items-center gap-2 font-sans text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">
              <span className="bg-error inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
              {t('badge')}
            </span>

            <h2 className="text-fluid-h3 mt-6 font-serif leading-[0.85] tracking-tighter text-pretty uppercase sm:text-balance">
              {t('heading')} <span className="text-accent italic">{t('headingAccent')}</span>
              <br />
              <span className="opacity-30">{t('headingDim')}</span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg font-sans text-sm leading-relaxed opacity-40">
              {t('sub')}
            </p>
          </div>

          {/* Cards */}
          <div className="relative z-10 mx-2 mb-4 sm:mx-4 sm:mb-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {BUGS.map((bug) => {
                const isFound = found.has(bug.id)

                return (
                  <RoughBackground
                    key={bug.id}
                    color="var(--rough-card)"
                    padding="1.5rem"
                    className="ring-foreground/10 ring-1 ring-inset"
                  >
                    <div className="flex flex-col items-center gap-6 text-center">
                      {/* Card header */}
                      <div>
                        <div className="flex items-center justify-center gap-2">
                          <span className="font-mono text-[9px] opacity-30">{bug.tag}</span>
                          {isFound && (
                            <span className="text-primary font-sans text-[8px] font-bold tracking-wider uppercase">
                              ✓ {t('testedBadge')}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-3">
                          <h3 className="font-serif text-base tracking-tight uppercase">
                            {t(`bugs.${bug.id}.title`)}
                          </h3>
                          <span
                            className={`shrink-0 border px-2 py-0.5 font-sans text-[8px] font-bold tracking-widest uppercase ${SEVERITY_STYLES[bug.severity]}`}
                          >
                            {bug.severity}
                          </span>
                        </div>
                      </div>

                      {/* Interactive control */}
                      <div className="w-full text-left">{renderControl(bug.id)}</div>
                    </div>
                  </RoughBackground>
                )
              })}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="relative z-10 pt-4 pb-8 text-center sm:pt-6 sm:pb-12">
            <p className="font-sans text-sm leading-relaxed opacity-50">
              {t('ctaSub')} <span className="text-foreground opacity-100">{t('ctaStrong')}</span>
            </p>
            <a
              href="/qa"
              className="border-primary text-primary hover:bg-primary hover:text-background mt-6 inline-block border px-10 py-4 font-sans text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300"
            >
              {t('ctaButton')}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
