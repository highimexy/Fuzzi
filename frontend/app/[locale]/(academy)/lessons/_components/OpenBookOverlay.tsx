'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import type { TrackData, LessonItem } from './NotebookLibrary'

interface Props {
  track: TrackData
  locale: string
  visible: boolean
  onClose: () => void
  onStartLesson: (id: string) => void
}

/* ──────────────────────────────────────────────────────────────────────────
   PALETA KARTKI — kontrast niezależny od inwersji motywu interfejsu.
   DARK  -> jasna kartka (#f7f6f1) + ciemny atrament
   LIGHT -> ciemna kartka (#2a2f3a) + jasny atrament
   OPRAWA (twarda okładka + grzbiet) — spójna z NotebookLibrary:
   cover #3a443c, coverDark #2e372f, band/grzbiet #20271f.
   ────────────────────────────────────────────────────────────────────────── */

const PAPER = 'var(--fz-paper)'
const INK = 'var(--fz-ink)'
const INK_MUTED = 'color-mix(in srgb, var(--fz-ink) 58%, transparent)'
const INK_SOFT = 'color-mix(in srgb, var(--fz-ink) 78%, transparent)'
const INK_LINE = 'color-mix(in srgb, var(--fz-ink) 14%, transparent)'
const INK_DOT = 'color-mix(in srgb, var(--fz-ink) 28%, transparent)'

const COVER = '#3a443c'
const COVER_DARK = '#2e372f'
const SPINE = '#20271f'

const GRADIENT_LEFT_PAGE = `linear-gradient(to right, ${PAPER} 0%, color-mix(in srgb, ${PAPER} 97%, var(--fz-ink)) 82%, color-mix(in srgb, ${PAPER} 88%, var(--fz-ink)) 95%, color-mix(in srgb, ${PAPER} 70%, var(--fz-ink)) 100%)`
const GRADIENT_RIGHT_PAGE = `linear-gradient(to left, ${PAPER} 0%, color-mix(in srgb, ${PAPER} 97%, var(--fz-ink)) 82%, color-mix(in srgb, ${PAPER} 88%, var(--fz-ink)) 95%, color-mix(in srgb, ${PAPER} 70%, var(--fz-ink)) 100%)`
const GRADIENT_FLIP_FACE = `linear-gradient(to right, color-mix(in srgb, ${PAPER} 70%, var(--fz-ink)) 0%, color-mix(in srgb, ${PAPER} 88%, var(--fz-ink)) 6%, color-mix(in srgb, ${PAPER} 97%, var(--fz-ink)) 20%, ${PAPER} 100%)`
const GRADIENT_BUTTON = `linear-gradient(180deg, color-mix(in srgb, ${PAPER} 96%, var(--fz-ink)) 0%, color-mix(in srgb, ${PAPER} 88%, var(--fz-ink)) 100%)`

const LINES_BG = `repeating-linear-gradient(transparent 0 27px, ${INK_LINE} 27px 28px)`

// ── Page-turn animation ────────────────────────────────────────────────────

function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

function runFlip(
  flipEl: HTMLElement,
  castL: HTMLElement,
  castR: HTMLElement,
  fromA: number,
  toA: number,
  onDone: () => void
) {
  const sheens = flipEl.querySelectorAll<HTMLElement>('.fz-sheen')
  const dur = 780
  const t0 = performance.now()

  function frame(now: number) {
    const p = Math.min(1, (now - t0) / dur)
    const e = easeInOutCubic(p)
    const a = fromA + (toA - fromA) * e
    const lift = Math.sin((Math.abs(a) / 180) * Math.PI) * 24
    flipEl.style.transform = `rotateY(${a}deg) translateZ(${lift}px)`
    const k = Math.abs(a) / 180
    const peak = Math.sin(k * Math.PI)
    castR.style.opacity = String((k < 0.5 ? peak : peak * 0.25) * 0.6)
    castL.style.opacity = String((k > 0.5 ? peak : peak * 0.25) * 0.6)
    sheens.forEach((el) => {
      el.style.opacity = String(peak * 0.85)
    })
    if (p < 1) requestAnimationFrame(frame)
    else {
      flipEl.style.display = 'none'
      castL.style.opacity = '0'
      castR.style.opacity = '0'
      sheens.forEach((el) => {
        el.style.opacity = '0'
      })
      onDone()
    }
  }
  requestAnimationFrame(frame)
}

// ── Shared style fragments ─────────────────────────────────────────────────

const capStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: INK_MUTED,
}

const chipStyle: React.CSSProperties = {
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 7,
  padding: '7px 12px',
  border: `1px solid ${INK_DOT}`,
  background: GRADIENT_BUTTON,
  color: INK,
  fontFamily: 'var(--font-sans)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.13em',
  textTransform: 'uppercase',
  boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
}

// ── Page content renderers ────────────────────────────────────────────────

function TocLeft({ track, t }: { track: TrackData; t: ReturnType<typeof useTranslations> }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}
    >
      <div style={{ ...capStyle, marginBottom: 18 }}>{track.bottom.toUpperCase()}</div>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 26,
          lineHeight: 1.5,
          color: INK,
        }}
      >
        {track.quote}
      </div>
      <div
        style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: INK_MUTED, marginTop: 18 }}
      >
        {t('authorNote')}
      </div>
    </div>
  )
}

function TocRight({
  track,
  locale,
  t,
}: {
  track: TrackData
  locale: string
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          color: INK,
          fontSize: 26,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 8,
          marginBottom: 14,
        }}
      >
        {track.title}
      </div>
      <div style={{ ...capStyle, fontSize: 9, marginBottom: 10 }}>{t('toc')}</div>
      <div style={{ overflow: 'auto', flex: 1, paddingRight: 6 }}>
        {track.lessons.map((lesson, i) => {
          const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
          return (
            <div
              key={lesson.id}
              data-idx={i}
              className="fz-toc-row"
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                fontFamily: 'var(--font-serif)',
                color: INK,
                fontSize: 15,
                lineHeight: 2.1,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  color: INK_MUTED,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 11,
                  minWidth: 24,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="fz-toc-name" style={{ flex: '0 1 auto' }}>
                {title}
              </span>
              <span
                style={{
                  flex: 1,
                  borderBottom: `2px dotted ${INK_DOT}`,
                  transform: 'translateY(-4px)',
                }}
              />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: INK_MUTED }}>
                {lesson.order}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function LessonLeft({
  track,
  lesson,
  lessonIdx,
  locale,
  t,
}: {
  track: TrackData
  lesson: LessonItem
  lessonIdx: number
  locale: string
  t: ReturnType<typeof useTranslations>
}) {
  const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
  // TODO: pobierać z API (lesson.story_pl / lesson.story_en)
  const story =
    locale === 'pl'
      ? 'Pamiętam projekt, w którym ten temat kosztował zespół dwa tygodnie obsuwy. Nikt nie rozumiał, dlaczego liczby się nie zgadzają — aż ktoś wrócił do podstaw. Ta lekcja to skrót do tego, czego ja uczyłem się boleśnie, w biegu.'
      : 'I remember a project where this one topic cost the team two weeks. Nobody understood why the numbers refused to add up — until someone went back to basics. This lesson is the shortcut to what I learned the hard way, on the job.'

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}
    >
      <div style={{ ...capStyle, marginBottom: 12 }}>
        {track.bottom.toUpperCase()} · {t('lesson')} {String(lessonIdx + 1).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          color: INK,
          fontSize: 32,
          lineHeight: 1.05,
          marginBottom: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </div>
      <div
        style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.65, color: INK_SOFT }}
      >
        {story}
      </div>
      <button
        data-start
        className="fz-start"
        style={{
          marginTop: 24,
          alignSelf: 'flex-start',
          background: INK,
          color: PAPER,
          border: `1px solid ${INK}`,
          fontFamily: 'var(--font-sans)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '13px 24px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
        }}
      >
        {t('startLesson')} <span aria-hidden>→</span>
      </button>
    </div>
  )
}

function LessonRight({ t }: { lesson?: LessonItem; t: ReturnType<typeof useTranslations> }) {
  // TODO: pobierać z API (lesson.subLessons)
  const subs = [
    { title: 'Wprowadzenie', minutes: 4 },
    { title: 'Teoria w praktyce', minutes: 9 },
    { title: 'Częste pułapki', minutes: 7 },
    { title: 'Mini-quiz', minutes: 5 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ ...capStyle, fontSize: 9, marginBottom: 14 }}>{t('sublessons')}</div>
      <div style={{ overflow: 'auto', flex: 1, paddingRight: 6 }}>
        {subs.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: 'var(--font-serif)',
              color: INK,
              fontSize: 14,
              lineHeight: 1.7,
              padding: '9px 0',
              borderBottom: `1px solid ${INK_LINE}`,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                flex: 'none',
                border: `1px solid ${INK_DOT}`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-sans)',
                fontSize: 10,
                fontWeight: 700,
                color: INK_MUTED,
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1 }}>{s.title}</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: INK_MUTED }}>
              {s.minutes} min
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Overlay component ─────────────────────────────────────────────────────

export default function OpenBookOverlay({ track, locale, visible, onClose, onStartLesson }: Props) {
  const t = useTranslations('Lessons.Library.notebook')

  type View = 'toc' | 'lesson'
  const [view, setView] = useState<View>('toc')
  const [curLessonIdx, setCurLessonIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  type HalfContent = 'tocLeft' | 'lessonLeft'
  type RightContent = 'tocRight' | 'lessonRight'
  const [halfLContent, setHalfLContent] = useState<HalfContent>('tocLeft')
  const [halfRContent, setHalfRContent] = useState<RightContent>('tocRight')
  type FaceContent = 'tocRight' | 'lessonLeft'
  const [flipFrontContent, setFlipFrontContent] = useState<FaceContent>('tocRight')
  const [flipBackContent, setFlipBackContent] = useState<FaceContent>('lessonLeft')
  const [flipVisible, setFlipVisible] = useState(false)

  const flipRef = useRef<HTMLDivElement>(null)
  const castLRef = useRef<HTMLDivElement>(null)
  const castRRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setView('toc')
    setCurLessonIdx(0)
    setHalfLContent('tocLeft')
    setHalfRContent('tocRight')
    setFlipVisible(false)
    setAnimating(false)
  }, [track.id])

  const flipForward = useCallback(
    (lessonIdx: number) => {
      if (animating) return
      setCurLessonIdx(lessonIdx)
      setFlipFrontContent('tocRight')
      setFlipBackContent('lessonLeft')
      setHalfRContent('lessonRight')
      setFlipVisible(true)
      setAnimating(true)

      requestAnimationFrame(() => {
        const flipEl = flipRef.current
        const castL = castLRef.current
        const castR = castRRef.current
        if (!flipEl || !castL || !castR) return
        flipEl.style.display = 'block'
        flipEl.style.transform = 'rotateY(0deg) translateZ(0px)'
        runFlip(flipEl, castL, castR, 0, -180, () => {
          setHalfLContent('lessonLeft')
          setFlipVisible(false)
          setAnimating(false)
          setView('lesson')
        })
      })
    },
    [animating]
  )

  const flipBackward = useCallback(() => {
    if (animating) return
    setFlipFrontContent('tocRight')
    setFlipBackContent('lessonLeft')
    setHalfLContent('tocLeft')
    setFlipVisible(true)
    setAnimating(true)

    requestAnimationFrame(() => {
      const flipEl = flipRef.current
      const castL = castLRef.current
      const castR = castRRef.current
      if (!flipEl || !castL || !castR) return
      flipEl.style.display = 'block'
      flipEl.style.transform = 'rotateY(-180deg) translateZ(0px)'
      runFlip(flipEl, castL, castR, -180, 0, () => {
        setHalfRContent('tocRight')
        setFlipVisible(false)
        setAnimating(false)
        setView('toc')
      })
    })
  }, [animating])

  const handleSpreadClick = useCallback(
    (e: React.MouseEvent) => {
      if (animating) return
      const target = e.target as HTMLElement

      const row = target.closest<HTMLElement>('.fz-toc-row')
      if (row && view === 'toc') {
        const idx = parseInt(row.dataset.idx ?? '0', 10)
        flipForward(idx)
        return
      }
      if (target.closest('[data-back]') && view === 'lesson') {
        flipBackward()
        return
      }
      if (target.closest('[data-start]')) {
        const lesson = track.lessons[curLessonIdx]
        if (lesson) onStartLesson(lesson.id)
      }
    },
    [animating, view, curLessonIdx, flipForward, flipBackward, onStartLesson, track.lessons]
  )

  const curLesson = track.lessons[curLessonIdx]

  const renderFaceContent = (content: FaceContent) => {
    if (content === 'tocRight') return <TocRight track={track} locale={locale} t={t} />
    return curLesson ? (
      <LessonLeft track={track} lesson={curLesson} lessonIdx={curLessonIdx} locale={locale} t={t} />
    ) : null
  }

  const linesLayer = (
    <div style={{ position: 'absolute', inset: 0, background: LINES_BG, pointerEvents: 'none' }} />
  )
  const sheenLayer = (
    <div
      className="fz-sheen"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0,
        pointerEvents: 'none',
        background:
          'linear-gradient(105deg,rgba(0,0,0,0) 40%,rgba(0,0,0,0.15) 62%,rgba(0,0,0,0) 80%)',
      }}
    />
  )

  const gutterShadeLeft = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '14%',
        pointerEvents: 'none',
        background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.22))',
      }}
    />
  )
  const gutterShadeRight = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '14%',
        pointerEvents: 'none',
        background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.22))',
      }}
    />
  )

  return (
    <>
      <style>{`
        :root { --fz-paper: #2a2f3a; --fz-ink: #ece9df; }
        .dark { --fz-paper: #f7f6f1; --fz-ink: #20262f; }

        .fz-toc-row:hover .fz-toc-name { color: var(--accent); text-decoration: underline; }
        .fz-spread-busy .fz-toc-row,
        .fz-spread-busy [data-start],
        .fz-spread-busy [data-back] { pointer-events: none; }
        .fz-chip:hover { background: var(--fz-ink); color: var(--fz-paper); }
        .fz-start:hover { filter: brightness(1.12); }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'color-mix(in srgb, var(--background) 92%, #000)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s',
          zIndex: 10,
        }}
      >
        {/* ── KSIĄŻKA: twarda okładka (wystaje kantem) → strony → grzbiet ── */}
        <div
          style={{
            position: 'relative',
            width: 'min(94%, 920px)',
            transform: visible ? 'scale(1)' : 'scale(0.96)',
            transition: 'transform 0.35s',
            perspective: 2000,
          }}
        >
          {/* 3D page-stack layers — kremowe warstwy wystające spod hard cover */}
          {([
            { y: 3,  bg: '#cccfbc', op: 1.0 },
            { y: 6,  bg: '#c2c5b2', op: 0.9 },
            { y: 9,  bg: '#b8bba8', op: 0.8 },
            { y: 12, bg: '#adb09e', op: 0.65 },
            { y: 15, bg: '#a2a592', op: 0.5 },
          ] as { y: number; bg: string; op: number }[]).map((l, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                background: l.bg,
                transform: `translateY(${l.y}px)`,
                zIndex: -1 - i,
                opacity: l.op,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* HARD COVER */}
          <div
            style={{
              position: 'relative',
              padding: 14,
              borderRadius: 6,
              background: `linear-gradient(135deg, ${COVER} 0%, ${COVER_DARK} 100%)`,
              boxShadow:
                '0 40px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(0,0,0,0.4)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 6,
                pointerEvents: 'none',
                background:
                  'radial-gradient(120% 120% at 50% 0%, rgba(255,255,255,0.05), transparent 55%)',
              }}
            />

            {/* SPREAD */}
            <div
              className={animating ? 'fz-spread-busy' : ''}
              onClick={handleSpreadClick}
              style={{
                position: 'relative',
                height: 'min(82vh, 560px)',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.3)',
                perspective: 2000,
              }}
            >
              <button
                className="fz-chip"
                onClick={(e) => {
                  e.stopPropagation()
                  if (!animating) onClose()
                }}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  width: 34,
                  height: 34,
                  fontSize: 15,
                  padding: 0,
                  zIndex: 30,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${INK_DOT}`,
                  background: GRADIENT_BUTTON,
                  color: INK,
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
                  opacity: animating ? 0.65 : 1,
                  pointerEvents: animating ? 'none' : 'auto',
                }}
                aria-label={t('close')}
              >
                ✕
              </button>

              {/* Left half */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '50%',
                  overflow: 'hidden',
                  padding: '34px 44px 28px 40px',
                  background: GRADIENT_LEFT_PAGE,
                }}
              >
                {linesLayer}
                <div style={{ position: 'relative', height: '100%' }}>
                  {halfLContent === 'tocLeft' && <TocLeft track={track} t={t} />}
                  {halfLContent === 'lessonLeft' && curLesson && (
                    <LessonLeft
                      track={track}
                      lesson={curLesson}
                      lessonIdx={curLessonIdx}
                      locale={locale}
                      t={t}
                    />
                  )}
                </div>
                {gutterShadeLeft}
              </div>

              {/* Right half */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '50%',
                  overflow: 'hidden',
                  padding: '34px 40px 28px 44px',
                  background: GRADIENT_RIGHT_PAGE,
                }}
              >
                {linesLayer}
                <div style={{ position: 'relative', height: '100%' }}>
                  {halfRContent === 'tocRight' && <TocRight track={track} locale={locale} t={t} />}
                  {halfRContent === 'lessonRight' && curLesson && (
                    <LessonRight lesson={curLesson} t={t} />
                  )}
                </div>
                {gutterShadeRight}
              </div>

              {/* SPINE */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 18,
                  transform: 'translateX(-50%)',
                  zIndex: 12,
                  pointerEvents: 'none',
                  background: `linear-gradient(to right, rgba(0,0,0,0.35), ${SPINE} 45%, ${SPINE} 55%, rgba(0,0,0,0.35))`,
                  boxShadow: '0 0 14px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: '50%',
                    width: 2,
                    transform: 'translateX(-50%)',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                />
              </div>

              {/* Cast shadows */}
              <div
                ref={castLRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '50%',
                  opacity: 0,
                  zIndex: 15,
                  pointerEvents: 'none',
                  display: flipVisible ? 'block' : 'none',
                  background: 'linear-gradient(to right,rgba(0,0,0,0) 30%,rgba(0,0,0,0.30) 100%)',
                }}
              />
              <div
                ref={castRRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '50%',
                  opacity: 0,
                  zIndex: 15,
                  pointerEvents: 'none',
                  display: flipVisible ? 'block' : 'none',
                  background: 'linear-gradient(to left,rgba(0,0,0,0) 30%,rgba(0,0,0,0.30) 100%)',
                }}
              />

              {/* Flip sheet */}
              <div
                ref={flipRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '50%',
                  transformOrigin: 'left center',
                  display: flipVisible ? 'block' : 'none',
                  zIndex: 20,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    overflow: 'hidden',
                    padding: '34px 40px 28px 44px',
                    background: GRADIENT_FLIP_FACE,
                  }}
                >
                  {linesLayer}
                  {sheenLayer}
                  <div style={{ position: 'relative', height: '100%' }}>
                    {renderFaceContent(flipFrontContent)}
                  </div>
                </div>

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    overflow: 'hidden',
                    padding: '34px 40px 28px 44px',
                    background: GRADIENT_FLIP_FACE,
                  }}
                >
                  {linesLayer}
                  {sheenLayer}
                  <div style={{ position: 'relative', height: '100%' }}>
                    {view !== 'toc' && (
                      <button
                        data-back
                        className="fz-chip"
                        style={{ ...chipStyle, position: 'absolute', top: 14, left: 16, zIndex: 5 }}
                      >
                        <span aria-hidden>‹</span> {t('backToToc')}
                      </button>
                    )}
                    <div style={{ height: '100%' }}>{renderFaceContent(flipBackContent)}</div>
                  </div>
                </div>
              </div>

              {view === 'lesson' && !flipVisible && (
                <button
                  data-back
                  className="fz-chip"
                  style={{ ...chipStyle, position: 'absolute', top: 14, left: 16, zIndex: 25 }}
                >
                  <span aria-hidden>‹</span> {t('backToToc')}
                </button>
              )}
            </div>

            {/* Elastic band — widoczny pionowy pasek na prawej krawędzi */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 3,
                width: 11,
                borderRadius: 3,
                pointerEvents: 'none',
                zIndex: 2,
                background:
                  'linear-gradient(to right, #283520 0%, #3d4e34 35%, #4a5e40 50%, #3d4e34 65%, #283520 100%)',
                boxShadow:
                  'inset 1px 0 0 rgba(255,255,255,0.12), inset -1px 0 0 rgba(0,0,0,0.4), -2px 0 6px rgba(0,0,0,0.4)',
              }}
            />

            {/* Ribbon bookmark — wystaje poniżej okładki */}
            <div
              style={{
                position: 'absolute',
                bottom: -34,
                left: '53%',
                width: 20,
                height: 42,
                background: 'linear-gradient(180deg, #566249 0%, #3d4a32 90%)',
                borderRadius: '0 0 6px 6px',
                zIndex: 5,
                pointerEvents: 'none',
                transform: 'rotate(1.8deg)',
                boxShadow: '0 6px 14px rgba(0,0,0,0.55)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '0 0 6px 6px',
                  background:
                    'linear-gradient(to right, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.08) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
