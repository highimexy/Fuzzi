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

// ── ODWRÓCONY MOTYW (Zeszyt ma odwrócone kolory względem reszty aplikacji) ──
const PAPER_BG = 'var(--foreground)' // Tło kartki pobiera kolor tekstu aplikacji
const PAPER_FG = 'var(--background)' // Tekst kartki pobiera kolor tła aplikacji

const TEXT_PRIMARY = PAPER_FG
const TEXT_MUTED = `color-mix(in srgb, ${PAPER_FG} 60%, transparent)`
const TEXT_MUTED_DARK = `color-mix(in srgb, ${PAPER_FG} 80%, transparent)`

// Dynamiczne gradienty symulujące załamania światła na grzbiecie
const GRADIENT_LEFT_PAGE = `linear-gradient(to right, ${PAPER_BG} 0%, color-mix(in srgb, ${PAPER_BG} 96%, ${PAPER_FG}) 80%, color-mix(in srgb, ${PAPER_BG} 88%, ${PAPER_FG}) 94%, color-mix(in srgb, ${PAPER_BG} 75%, ${PAPER_FG}) 99%, color-mix(in srgb, ${PAPER_BG} 65%, ${PAPER_FG}) 100%)`
const GRADIENT_RIGHT_PAGE = `linear-gradient(to left, ${PAPER_BG} 0%, color-mix(in srgb, ${PAPER_BG} 96%, ${PAPER_FG}) 80%, color-mix(in srgb, ${PAPER_BG} 88%, ${PAPER_FG}) 94%, color-mix(in srgb, ${PAPER_BG} 75%, ${PAPER_FG}) 99%, color-mix(in srgb, ${PAPER_BG} 65%, ${PAPER_FG}) 100%)`
const GRADIENT_FLIP_FACE = `linear-gradient(to right, color-mix(in srgb, ${PAPER_BG} 65%, ${PAPER_FG}) 0%, color-mix(in srgb, ${PAPER_BG} 75%, ${PAPER_FG}) 1%, color-mix(in srgb, ${PAPER_BG} 88%, ${PAPER_FG}) 6%, color-mix(in srgb, ${PAPER_BG} 96%, ${PAPER_FG}) 20%, ${PAPER_BG} 100%)`
const GRADIENT_BUTTON = `linear-gradient(180deg, ${PAPER_BG} 0%, color-mix(in srgb, ${PAPER_BG} 92%, ${PAPER_FG}) 100%)`

// Delikatne linie zeszytu wygenerowane z odwróconego tekstu
const LINES_BG = `repeating-linear-gradient(transparent 0 27px, color-mix(in srgb, ${PAPER_FG} 10%, transparent) 27px 28px)`

// ── Page-turn animation (port of mockup's runFlip) ─────────────────────────

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

// ── Page content renderers ────────────────────────────────────────────────

function TocLeft({ track, t }: { track: TrackData; t: ReturnType<typeof useTranslations> }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}
    >
      <div
        style={{
          fontFamily: 'sans-serif',
          fontSize: 20,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
          marginBottom: 18,
        }}
      >
        {track.bottom.toUpperCase()}
      </div>
      <div
        style={{
          fontFamily: 'font-sans',
          fontStyle: 'italic',
          fontSize: 40,
          lineHeight: 1.55,
          color: TEXT_PRIMARY,
          fontWeight: 700,
        }}
      >
        {track.quote}
      </div>
      <div style={{ fontFamily: 'font-sans', fontSize: 18, color: TEXT_MUTED, marginTop: 16 }}>
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
          fontFamily: 'font-sans',
          fontWeight: 700,
          color: TEXT_PRIMARY,
          fontSize: 40,
          textTransform: 'uppercase',
          borderBottom: `2px solid ${TEXT_PRIMARY}`,
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {track.title}
      </div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 18,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
          marginBottom: 8,
        }}
      >
        {t('toc')}
      </div>
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
                gap: 6,
                fontFamily: 'sans-serif',
                color: TEXT_PRIMARY,
                fontSize: 18,
                lineHeight: 2.05,
                cursor: 'pointer',
              }}
            >
              <span style={{ color: TEXT_MUTED, fontSize: 11, minWidth: 22 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="fz-toc-name" style={{ flex: '0 1 auto' }}>
                {title}
              </span>
              <span
                style={{
                  flex: 1,
                  borderBottom: `2px dotted color-mix(in srgb, ${PAPER_FG} 30%, transparent)`,
                  transform: 'translateY(-4px)',
                }}
              />
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>{lesson.order}</span>
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
  const story =
    'Pamiętam projekt, w którym ten temat kosztował zespół dwa tygodnie obsuwy. Nikt nie rozumiał, dlaczego liczby się nie zgadzają — aż ktoś wrócił do podstaw. Ta lekcja to skrót do tego, czego ja uczyłem się boleśnie, w biegu.'

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}
    >
      <div
        style={{
          fontFamily: 'sans-serif',
          fontSize: 18,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
          marginBottom: 10,
        }}
      >
        {track.bottom.toUpperCase()} · {t('lesson')} {String(lessonIdx + 1).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: 'font-sans',
          fontWeight: 700,
          color: TEXT_PRIMARY,
          fontSize: 48,
          lineHeight: 1.05,
          marginBottom: 14,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </div>
      <div
        style={{ fontFamily: 'font-sans', fontSize: 18, lineHeight: 1.6, color: TEXT_MUTED_DARK }}
      >
        {story}
      </div>
      <button
        data-start
        style={{
          marginTop: 22,
          alignSelf: 'flex-start',
          background: TEXT_PRIMARY,
          color: PAPER_BG, // Tekst buttona ma kolor kartki dla maksymalnego kontrastu
          border: `1px solid ${TEXT_PRIMARY}`,
          fontFamily: 'font-sans',
          fontSize: 18,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '12px 22px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
        }}
      >
        {t('startLesson')} <span>→</span>
      </button>
    </div>
  )
}

function LessonRight({ t }: { lesson?: LessonItem; t: ReturnType<typeof useTranslations> }) {
  const subs = [
    { title: 'Wprowadzenie', minutes: 4 },
    { title: 'Teoria w praktyce', minutes: 9 },
    { title: 'Częste pułapki', minutes: 7 },
    { title: 'Mini-quiz', minutes: 5 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          fontFamily: 'font-sans',
          fontSize: 18,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: TEXT_MUTED,
          marginBottom: 12,
        }}
      >
        {t('sublessons')}
      </div>
      <div style={{ overflow: 'auto', flex: 1, paddingRight: 6 }}>
        {subs.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'font-sans',
              color: TEXT_PRIMARY,
              fontSize: 18,
              lineHeight: 1.7,
              padding: '7px 0',
              borderBottom: `1px solid color-mix(in srgb, ${PAPER_FG} 15%, transparent)`,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                flex: 'none',
                border: `1px solid color-mix(in srgb, ${PAPER_FG} 40%, transparent)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontSize: 10,
                color: TEXT_MUTED,
              }}
            >
              {i + 1}
            </span>
            <span style={{ flex: 1 }}>{s.title}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: TEXT_MUTED }}>
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

  const spreadRef = useRef<HTMLDivElement>(null)
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

  return (
    <>
      <style>{`
        .fz-toc-row:hover .fz-toc-name { color: ${TEXT_PRIMARY}; text-decoration: underline; }
        .fz-spread-busy .fz-toc-row { pointer-events: none; }
        .fz-spread-busy [data-start], .fz-spread-busy [data-back] { pointer-events: none; }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(4px)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s',
          zIndex: 10,
        }}
      >
        <div
          ref={spreadRef}
          className={animating ? 'fz-spread-busy' : ''}
          onClick={handleSpreadClick}
          style={{
            position: 'relative',
            width: 'min(92%, 1440px)',
            height: 'min(86%, 1024px)',
            borderRadius: 4,
            boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
            transform: visible ? 'scale(1)' : 'scale(0.96)',
            transition: 'transform 0.35s',
            perspective: 2000,
          }}
        >
          {/* Close button */}
          <button
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
              border: `1px solid color-mix(in srgb, ${PAPER_FG} 30%, transparent)`,
              background: GRADIENT_BUTTON,
              color: TEXT_PRIMARY,
              fontFamily: 'monospace',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
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
              borderRadius: '4px 0 0 4px',
              padding: '32px 44px 26px 30px',
              background: GRADIENT_LEFT_PAGE,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: LINES_BG,
                pointerEvents: 'none',
              }}
            />
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
              borderRadius: '0 4px 4px 0',
              padding: '32px 30px 26px 44px',
              background: GRADIENT_RIGHT_PAGE,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: LINES_BG,
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'relative', height: '100%' }}>
              {halfRContent === 'tocRight' && <TocRight track={track} locale={locale} t={t} />}
              {halfRContent === 'lessonRight' && curLesson && (
                <LessonRight lesson={curLesson} t={t} />
              )}
            </div>
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
              borderRadius: '4px 0 0 4px',
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
              borderRadius: '0 4px 4px 0',
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
            {/* Front face */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                overflow: 'hidden',
                borderRadius: '0 4px 4px 0',
                padding: '32px 30px 26px 44px',
                background: GRADIENT_FLIP_FACE,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: LINES_BG,
                  pointerEvents: 'none',
                }}
              />
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
              <div style={{ position: 'relative', height: '100%' }}>
                {renderFaceContent(flipFrontContent)}
              </div>
            </div>

            {/* Back face */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                overflow: 'hidden',
                borderRadius: '4px 0 0 4px',
                padding: '32px 30px 26px 44px',
                background: GRADIENT_FLIP_FACE,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: LINES_BG,
                  pointerEvents: 'none',
                }}
              />
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
              <div style={{ position: 'relative', height: '100%' }}>
                {view !== 'toc' && (
                  <button
                    data-back
                    style={{
                      position: 'absolute',
                      top: 14,
                      left: 16,
                      zIndex: 5,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 7,
                      padding: '7px 12px',
                      border: `1px solid color-mix(in srgb, ${PAPER_FG} 30%, transparent)`,
                      background: GRADIENT_BUTTON,
                      color: TEXT_PRIMARY,
                      fontFamily: 'monospace',
                      fontSize: 10,
                      letterSpacing: '0.13em',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span>‹</span> {t('backToToc')}
                  </button>
                )}
                <div style={{ height: '100%' }}>{renderFaceContent(flipBackContent)}</div>
              </div>
            </div>
          </div>

          {/* Back chip on left half */}
          {view === 'lesson' && !flipVisible && (
            <button
              data-back
              style={{
                position: 'absolute',
                top: 14,
                left: 16,
                zIndex: 25,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '7px 12px',
                border: `1px solid color-mix(in srgb, ${PAPER_FG} 30%, transparent)`,
                background: GRADIENT_BUTTON,
                color: TEXT_PRIMARY,
                fontFamily: 'monospace',
                fontSize: 10,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              }}
            >
              <span>‹</span> {t('backToToc')}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
