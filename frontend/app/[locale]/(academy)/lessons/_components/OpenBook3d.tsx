'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { TrackData } from './NotebookLibrary'
import { useLessonContent } from './useLessonContent'
import type { Section as LessonSection } from './useLessonContent'
import { MarkdownRenderer } from '../../_components/MarkdownRenderer'

/* ════════════════════════════════════════════════════════════════════════
   OpenBook3D — otwarty notes 3D z page-turnem na ŻYWYM DOM-ie.

   Nowy model (po odrzuceniu hybrydy snapshot-na-canvas):

   • Książka = ROZKŁADÓWKA. Każdy widok to para stron:
       toc:    lewa = cytat,            prawa = spis sub-lekcji
       lesson: lewa = treść (scroll),   prawa = zadanie
   • Flip = sztywna grupa 3D obracana wokół grzbietu (x=0). W grupie:
       – plane WebGL (papier, dwustronny, oświetlany normalnie),
       – DWA <Html transform>: front (stara strona) i tył (nowa strona,
         obrócony o 180°). Drei Html śledzi pełną macierz rodzica, więc
         DOM obraca się razem z papierem — ostry, bez snapshotów.
       – Twarze podmieniamy dokładnie w 90°, gdy kartka jest widziana
         od krawędzi — podmiana jest fizycznie niewidoczna.
   • Stan docelowy commitujemy NA STARCIE flipa. Strony przychodzące
     renderują się "na żywo" (mogą jeszcze pokazywać loading — treść
     wskoczy w trakcie ruchu, jak w prawdziwym zeszycie z tuszem).
     Strony odchodzące dostają ZAMROŻONY snapshot danych (PageModel),
     żeby refetch nowej sub-lekcji nie wyczyścił odlatującej kartki.

   Mapowanie twarzy (kluczowa tabela — to było źródło zepsucia):

                    │ static LEWA   │ static PRAWA  │ kartka FRONT │ kartka TYŁ
     flip 'fwd'     │ from.left     │ live (nowa)   │ from.right   │ live (nowa lewa)
     flip 'back'    │ live (nowa)   │ from.right    │ live (nowa)  │ from.left
   ════════════════════════════════════════════════════════════════════════ */

// ── Wymiary książki (świat 3D) ──────────────────────────────────────────────

const PAGE_W = 2.6
const PAGE_H = 3.4
const COVER_OVERHANG = 0.08
const COVER_THICK = 0.05
const PAGE_DEPTH = 0.16
const SPIRAL_RINGS = 14

// DOM strony: w trybie transform drei mapuje rozmiar jako
//   świat = px · distanceFactor / 400
// więc liczymy px Z GEOMETRII, żeby DOM pokrywał stronę 3D co do piksela —
// inaczej nieprzezroczysta twarz kartki zakrywa tylko środek, a po bokach
// prześwituje strona pod spodem.
const DF = 2.4
const PX_W = (PAGE_W * 400) / DF // ≈ 433.3
const PX_H = (PAGE_H * 400) / DF // ≈ 566.7

// linie zeszytu: tekstura ma linie co 34px przy 680px wysokości → przelicz na DOM
const LINE_STEP = (34 * PX_H) / 680 // ≈ 28.3px
const LINE_OFFSET = ((70 * PX_H) / 680) % LINE_STEP // start linii ~58.3px → offset w kafelku

const FLIP_DURATION = 0.9 // s

// ── Paleta ──────────────────────────────────────────────────────────────────

const COVER = '#3a443c'
const PAGE_EDGE = '#a8ad97'
const PAPER_RGB = '#f7f6f1'
const INK = '#20262f'
const INK_MUTED = 'rgba(32,38,47,0.55)'
const INK_LINE = 'rgba(32,38,47,0.14)'

// ── Easing ──────────────────────────────────────────────────────────────────

function easeInOutCubic(p: number): number {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

// ── Tekstura papieru (linie zeszytu) ────────────────────────────────────────

function paintNotebookBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = PAPER_RGB
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.015})`
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1)
  }
  ctx.strokeStyle = 'rgba(32,38,47,0.10)'
  ctx.lineWidth = 1
  for (let y = 70; y < h; y += 34) {
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(w - 40, y)
    ctx.stroke()
  }
  // cień przy grzbiecie
  const g = ctx.createLinearGradient(0, 0, 60, 0)
  g.addColorStop(0, 'rgba(32,38,47,0.16)')
  g.addColorStop(1, 'rgba(32,38,47,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 60, h)
}

function buildLinedPageTexture(): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 512
  cn.height = 680
  paintNotebookBackground(cn.getContext('2d')!, 512, 680)
  const tex = new THREE.CanvasTexture(cn)
  tex.anisotropy = 8
  tex.colorSpace = THREE.SRGBColorSpace // kolory canvasu 1:1, bez konwersji
  return tex
}

/* ── PageModel: dane strony jako wartość, nie żywy hook ─────────────────────
   Strony odchodzące podczas flipa renderujemy z zamrożonego modelu —
   dzięki temu zmiana subIdx (i refetch w useLessonContent) nie ma prawa
   zmienić treści kartki, która właśnie odlatuje. */

type PageModel =
  | { kind: 'quote' }
  | { kind: 'toc' }
  | {
      kind: 'content'
      eyebrow: string
      title: string
      sections: LessonSection[]
      loading: boolean
    }
  | {
      kind: 'exercise'
      title: string
      lessonId: string | null
      lessonType?: string
      idx: number
      total: number
    }

interface PageCtx {
  track: TrackData
  locale: string
  interactive: boolean
  onPickGroup: (idx: number) => void
  onStartLesson: (id: string) => void
  onBackToToc: () => void
  onNextSub: () => void
  onPrevSub: () => void
  onClose?: () => void
}

// ── Wspólny szkielet strony (DOM) ───────────────────────────────────────────

const pageBase: React.CSSProperties = {
  position: 'relative',
  width: PX_W,
  height: PX_H,
  padding: '34px 32px',
  boxSizing: 'border-box',
  color: INK,
  fontFamily: 'var(--font-serif, Georgia, serif)',
  display: 'flex',
  flexDirection: 'column',
  userSelect: 'none',
  overflow: 'hidden',
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans, sans-serif)',
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.26em',
  textTransform: 'uppercase',
  color: INK_MUTED,
  marginBottom: 10,
}

/* Nieprzezroczyste tło CSS dla twarzy przewracanej kartki.
   DOM z <Html> renderuje się zawsze NAD canvasem, więc papier WebGL nie może
   zasłonić tekstu strony pod spodem — zasłonić musi sam DOM kartki.
   Rozstaw i offset linii wyliczone z tekstury WebGL (LINE_STEP/LINE_OFFSET),
   plus cień przy grzbiecie: front kartki ma grzbiet po LEWEJ, tył po PRAWEJ. */
function sheetPaperStyle(spine: 'left' | 'right'): React.CSSProperties {
  return {
    width: PX_W,
    height: PX_H,
    backgroundColor: PAPER_RGB,
    backgroundImage: `linear-gradient(to ${spine === 'left' ? 'right' : 'left'}, rgba(32,38,47,0.14) 0%, rgba(32,38,47,0) 13%), repeating-linear-gradient(to bottom, transparent 0px, transparent ${LINE_STEP - 1}px, rgba(32,38,47,0.10) ${LINE_STEP - 1}px, rgba(32,38,47,0.10) ${LINE_STEP}px)`,
    backgroundPosition: `0 0, 0 ${LINE_OFFSET}px`,
    boxShadow: '0 0 0 1px rgba(32,38,47,0.06)',
  }
}

const lessonTypeLabel: Record<string, string> = {
  quiz: 'Quiz',
  article: 'Artykuł',
  bug_hunt: 'Bug Hunt',
  doc_inspector: 'Doc Inspector',
  triage: 'Triage',
  diff_inspector: 'Diff Inspector',
  console_detective: 'Console Detective',
  scenario: 'Scenariusz',
  salary_decoder: 'Salary Decoder',
  bullshit_detector: 'Bullshit Detector',
  risk_map: 'Mapa ryzyka',
  cv_audit: 'CV Audit',
  audit: 'Audit',
}

// ── Strony ──────────────────────────────────────────────────────────────────

function QuotePage({ track, onClose }: { track: TrackData; onClose?: () => void }) {
  return (
    <div style={{ ...pageBase, justifyContent: 'center' }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            left: 22,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: INK_MUTED,
            padding: 0,
          }}
        >
          ← Biblioteka
        </button>
      )}
      <div
        style={{
          fontSize: 19,
          lineHeight: 1.65,
          fontStyle: 'italic',
          textAlign: 'left',
        }}
      >
        {track.quote}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 11,
          color: INK_MUTED,
        }}
      >
        {track.by}
      </div>
    </div>
  )
}

function TocPage({
  track,
  locale,
  onPick,
  interactive,
}: {
  track: TrackData
  locale: string
  onPick: (idx: number) => void
  interactive: boolean
}) {
  return (
    <div style={pageBase}>
      <div style={eyebrowStyle}>{track.bottom?.toUpperCase()}</div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 22,
          textTransform: 'uppercase',
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {track.title}
      </div>
      <div style={{ overflowY: 'auto', flex: 1, paddingRight: 4 }}>
        {track.lessons.map((lesson, i) => {
          const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
          return (
            <div
              key={lesson.id}
              onClick={interactive ? () => onPick(i) : undefined}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                fontSize: 14,
                lineHeight: 2,
                cursor: interactive ? 'pointer' : 'default',
              }}
              onMouseEnter={(e) => {
                const nm = e.currentTarget.querySelector('.nm') as HTMLElement | null
                if (nm) nm.style.textDecoration = 'underline'
              }}
              onMouseLeave={(e) => {
                const nm = e.currentTarget.querySelector('.nm') as HTMLElement | null
                if (nm) nm.style.textDecoration = 'none'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-sans, sans-serif)',
                  fontSize: 10,
                  color: 'rgba(32,38,47,0.5)',
                  minWidth: 20,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="nm" style={{ flex: '0 1 auto' }}>
                {title}
              </span>
              <span
                style={{
                  flex: 1,
                  borderBottom: '2px dotted rgba(32,38,47,0.28)',
                  transform: 'translateY(-4px)',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ContentPage({ model }: { model: Extract<PageModel, { kind: 'content' }> }) {
  return (
    <div style={pageBase}>
      <div style={eyebrowStyle}>{model.eyebrow}</div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 19,
          lineHeight: 1.25,
          marginBottom: 10,
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 6,
        }}
      >
        {model.title}
      </div>
      <div
        // żywy, scrollowalny DOM — to jest sedno: treść zostaje DOM-em zawsze
        style={{ overflowY: 'auto', flex: 1, paddingRight: 6, fontSize: 12, lineHeight: 1.6 }}
      >
        {model.loading ? (
          <div style={{ color: INK_MUTED, fontStyle: 'italic', paddingTop: 20 }}>Ładowanie…</div>
        ) : (
          model.sections.map((sec, i) => (
            <section key={i} style={{ marginBottom: 16 }}>
              {sec.heading && (
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px' }}>{sec.heading}</h3>
              )}
              <MarkdownRenderer className="notebook-md">{sec.body}</MarkdownRenderer>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function ExercisePage({
  model,
  ctx,
}: {
  model: Extract<PageModel, { kind: 'exercise' }>
  ctx: PageCtx
}) {
  const typeLabel = model.lessonType
    ? (lessonTypeLabel[model.lessonType] ?? model.lessonType)
    : null
  return (
    <div style={pageBase}>
      <div style={eyebrowStyle}>
        Zadanie · {model.idx + 1}/{Math.max(model.total, 1)}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 19,
          lineHeight: 1.25,
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 6,
          marginBottom: 14,
        }}
      >
        {model.title}
      </div>

      {typeLabel && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontFamily: 'var(--font-sans, sans-serif)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            border: `1px solid ${INK_LINE}`,
            padding: '3px 8px',
            marginBottom: 14,
            color: INK_MUTED,
          }}
        >
          {typeLabel}
        </span>
      )}

      <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0, color: 'rgba(32,38,47,0.8)' }}>
        Przeczytaj treść po lewej stronie, a kiedy będziesz w gotowości — otwórz zadanie i sprawdź
        się w praktyce.
      </p>

      <button
        onClick={
          ctx.interactive && model.lessonId ? () => ctx.onStartLesson(model.lessonId!) : undefined
        }
        style={{
          marginTop: 'auto',
          width: '100%',
          padding: '12px 0',
          background: INK,
          color: PAPER_RGB,
          border: 'none',
          cursor: ctx.interactive ? 'pointer' : 'default',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        Rozpocznij zadanie →
      </button>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 12,
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: INK_MUTED,
        }}
      >
        <button onClick={ctx.interactive ? ctx.onPrevSub : undefined} style={navBtn}>
          ← Wstecz
        </button>
        <button onClick={ctx.interactive ? ctx.onBackToToc : undefined} style={navBtn}>
          Spis
        </button>
        <button onClick={ctx.interactive ? ctx.onNextSub : undefined} style={navBtn}>
          Dalej →
        </button>
      </div>
    </div>
  )
}

const navBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  font: 'inherit',
  letterSpacing: 'inherit',
  textTransform: 'inherit',
  color: 'inherit',
  padding: 0,
}

// ── Renderer twarzy strony z PageModel ──────────────────────────────────────

function PageFace({ model, ctx }: { model: PageModel; ctx: PageCtx }) {
  switch (model.kind) {
    case 'quote':
      return <QuotePage track={ctx.track} onClose={ctx.interactive ? ctx.onClose : undefined} />
    case 'toc':
      return (
        <TocPage
          track={ctx.track}
          locale={ctx.locale}
          onPick={ctx.onPickGroup}
          interactive={ctx.interactive}
        />
      )
    case 'content':
      return <ContentPage model={model} />
    case 'exercise':
      return <ExercisePage model={model} ctx={ctx} />
  }
}

// ── Otwarta książka ─────────────────────────────────────────────────────────

interface FlipState {
  dir: 'fwd' | 'back'
  from: { left: PageModel; right: PageModel }
}

interface OpenBookProps {
  track: TrackData
  locale: string
  onStartLesson: (id: string) => void
  onClose?: () => void
  coverTex?: THREE.Texture
  reducedMotion?: boolean
}

export function OpenBook({ track, locale, onStartLesson, onClose, reducedMotion }: OpenBookProps) {
  const pageTex = useMemo(() => buildLinedPageTexture(), [])
  useEffect(() => () => pageTex.dispose(), [pageTex])

  // ── Stan logiczny widoku (commitowany NA STARCIE flipa) ──
  type View = 'toc' | 'lesson'
  const [view, setView] = useState<View>('toc')
  const [groupIdx, setGroupIdx] = useState<number | null>(null)
  const [subIdx, setSubIdx] = useState(0)

  // ── Stan flipa ──
  const [flip, setFlip] = useState<FlipState | null>(null)
  const [showBack, setShowBack] = useState(false) // która twarz kartki widoczna
  const [landed, setLanded] = useState(false) // kartka leży, statyczne strony już podmienione
  const flipAnimRef = useRef<{ dir: 'fwd' | 'back'; t: number; settle: number } | null>(null)
  const sheetGroupRef = useRef<THREE.Group>(null!)
  const sheetShadowRef = useRef<THREE.Mesh>(null!)

  const groupId = groupIdx != null ? (track.lessons[groupIdx]?.id ?? null) : null
  const { subLessons, subLesson, sections, lessonTitle, loading } = useLessonContent(
    groupId,
    subIdx,
    locale
  )

  // ── Żywe modele bieżącej rozkładówki ──
  const eyebrow = `${track.bottom ?? ''} · ${lessonTitle}`
  const liveLeft: PageModel =
    view === 'toc'
      ? { kind: 'quote' }
      : { kind: 'content', eyebrow, title: lessonTitle, sections, loading }
  const liveRight: PageModel =
    view === 'toc'
      ? { kind: 'toc' }
      : {
          kind: 'exercise',
          title: lessonTitle,
          lessonId: subLesson?.id ?? null,
          lessonType: (subLesson as { lesson_type?: string } | null)?.lesson_type,
          idx: subIdx,
          total: subLessons.length,
        }

  // refy na żywe modele — startFlip zamraża je BEZ stanięcia się stale closure
  const liveLeftRef = useRef(liveLeft)
  const liveRightRef = useRef(liveRight)
  liveLeftRef.current = liveLeft
  liveRightRef.current = liveRight

  // ── Start flipa: zamroź odchodzącą rozkładówkę, commitnij stan docelowy ──
  const startFlip = useCallback(
    (dir: 'fwd' | 'back', commit: () => void) => {
      if (flipAnimRef.current) return
      const from = { left: liveLeftRef.current, right: liveRightRef.current }
      commit() // hook zaczyna fetch nowej treści już teraz — incoming strony są żywe
      if (reducedMotion) return
      setFlip({ dir, from })
      setShowBack(dir === 'back') // kartka startuje leżąc po lewej przy 'back'
      setLanded(false)
      flipAnimRef.current = { dir, t: 0, settle: 0 }
      if (sheetGroupRef.current) {
        sheetGroupRef.current.rotation.y = dir === 'back' ? -Math.PI : 0
        sheetGroupRef.current.position.z = 0
      }
    },
    [reducedMotion]
  )

  // ── Pętla animacji: sztywny obrót + lift + wędrujący cień ──
  useFrame((_, delta) => {
    const anim = flipAnimRef.current
    if (!anim || !sheetGroupRef.current) return

    anim.t = Math.min(1, anim.t + delta / FLIP_DURATION)
    const e = easeInOutCubic(anim.t)
    const p = anim.dir === 'fwd' ? e : 1 - e // p: 0 = prawa, 1 = lewa

    // obrót wokół grzbietu + uniesienie ku kamerze w połowie ruchu
    const turning = Math.sin(p * Math.PI)
    sheetGroupRef.current.rotation.y = -p * Math.PI
    sheetGroupRef.current.position.z = turning * 0.22

    // podmiana twarzy dokładnie w 90° — kartka jest wtedy widziana od krawędzi
    const back = p > 0.5
    if (back !== showBack) setShowBack(back)

    // cień: rzut kartki na strony pod nią (pozycja = projekcja środka kartki)
    if (sheetShadowRef.current) {
      const proj = Math.cos(p * Math.PI) // 1 → -1
      sheetShadowRef.current.position.x = proj * (PAGE_W / 2)
      sheetShadowRef.current.scale.x = Math.max(Math.abs(proj), 0.06)
      const mat = sheetShadowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = turning * 0.26
    }

    if (anim.t >= 1) {
      /* Lądowanie dwufazowe — zapobiega mrygnięciu na końcu:
         FAZA 1: dosuń kartkę idealnie do płaszczyzny i podmień treść
                 statycznych stron POD nieprzezroczystą kartką (niewidocznie).
         FAZA 2: po kilku klatkach (commit Reacta + paint przeglądarki
                 zdążyły przejść) zdejmij kartkę — pod nią są już
                 identyczne piksele, więc odsłonięcie nic nie zmienia. */
      anim.settle += 1
      const endP = anim.dir === 'fwd' ? 1 : 0
      sheetGroupRef.current.rotation.y = -endP * Math.PI
      sheetGroupRef.current.position.z = 0
      if (sheetShadowRef.current) {
        ;(sheetShadowRef.current.material as THREE.MeshBasicMaterial).opacity = 0
      }
      if (anim.settle === 1) {
        setLanded(true) // statyczne strony przechodzą na żywe modele
        return
      }
      if (anim.settle < 4) return
      flipAnimRef.current = null
      setFlip(null)
      setShowBack(false)
      setLanded(false)
    }
  })

  // ── Nawigacja ──
  const resetToToc = () => {
    setView('toc')
    setGroupIdx(null)
    setSubIdx(0)
  }

  const pickGroup = (idx: number) =>
    startFlip('fwd', () => {
      setView('lesson')
      setGroupIdx(idx)
      setSubIdx(0)
    })

  const goToc = () => startFlip('back', resetToToc)

  const goNext = () => {
    if (view !== 'lesson') return
    if (subIdx < subLessons.length - 1) {
      startFlip('fwd', () => setSubIdx((i) => i + 1))
    } else {
      startFlip('fwd', resetToToc)
    }
  }

  const goPrev = () => {
    if (view !== 'lesson') return
    if (subIdx > 0) {
      startFlip('back', () => setSubIdx((i) => i - 1))
    } else {
      startFlip('back', resetToToc)
    }
  }

  const start = () => {
    if (subLesson) onStartLesson(subLesson.id)
  }

  const goNextRef = useRef(goNext)
  const goPrevRef = useRef(goPrev)
  goNextRef.current = goNext
  goPrevRef.current = goPrev
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        goNextRef.current()
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        goPrevRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Mapowanie twarzy (tabela z nagłówka pliku) ──
  // Po wylądowaniu (landed) statyczne strony już pokazują żywe modele,
  // choć kartka jeszcze leży na wierzchu — podmiana dzieje się pod nią.
  const flipping = flip != null
  const inFlight = flipping && !landed
  const staticLeftModel = inFlight ? (flip!.dir === 'fwd' ? flip!.from.left : liveLeft) : liveLeft
  const staticRightModel = inFlight
    ? flip!.dir === 'fwd'
      ? liveRight
      : flip!.from.right
    : liveRight
  const sheetFrontModel = flip ? (flip.dir === 'fwd' ? flip.from.right : liveRight) : null
  const sheetBackModel = flip ? (flip.dir === 'fwd' ? liveLeft : flip.from.left) : null

  const ctx: PageCtx = {
    track,
    locale,
    interactive: !flipping,
    onPickGroup: pickGroup,
    onStartLesson: () => start(),
    onBackToToc: goToc,
    onNextSub: goNext,
    onPrevSub: goPrev,
    onClose,
  }
  // twarze na kartce nigdy nie są klikalne
  const frozenCtx: PageCtx = { ...ctx, interactive: false }

  // geometria kartki: x ∈ [0, PAGE_W], oś obrotu = grzbiet
  const sheetGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(PAGE_W, PAGE_H)
    g.translate(PAGE_W / 2, 0, 0)
    return g
  }, [])

  const setCursor = (c: string) => {
    if (typeof document !== 'undefined') document.body.style.cursor = c
  }

  const htmlBase = (visible: boolean): React.CSSProperties => ({
    pointerEvents: visible && !flipping ? 'auto' : 'none',
  })

  return (
    <group rotation-x={-0.32}>
      {/* ── LEWA POŁOWA (okładka + blok + papier) ── */}
      <group position={[-PAGE_W / 2, 0, 0]}>
        <mesh position={[0, 0, -(PAGE_DEPTH + COVER_THICK / 2)]}>
          <boxGeometry
            args={[PAGE_W + COVER_OVERHANG * 2, PAGE_H + COVER_OVERHANG * 2, COVER_THICK]}
          />
          <meshStandardMaterial color={COVER} roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[-(PAGE_W / 2 + COVER_OVERHANG / 2), 0, -PAGE_DEPTH / 2]}>
          <boxGeometry args={[COVER_OVERHANG, PAGE_H, PAGE_DEPTH]} />
          <meshStandardMaterial color={PAGE_EDGE} roughness={1} />
        </mesh>
        <mesh>
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          {/* basic + toneMapped=false + fog=false: papier renderuje surowe
              kolory tekstury. fog z canvasu NotebookLibrary domieszał ciemne
              tło do WebGL — DOM (CSS) mgły nie widzi, stąd różnica jasności */}
          <meshBasicMaterial map={pageTex} toneMapped={false} fog={false} />
        </mesh>
      </group>

      {/* ── PRAWA POŁOWA ── */}
      <group position={[PAGE_W / 2, 0, 0]}>
        <mesh position={[0, 0, -(PAGE_DEPTH + COVER_THICK / 2)]}>
          <boxGeometry
            args={[PAGE_W + COVER_OVERHANG * 2, PAGE_H + COVER_OVERHANG * 2, COVER_THICK]}
          />
          <meshStandardMaterial color={COVER} roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[PAGE_W / 2 + COVER_OVERHANG / 2, 0, -PAGE_DEPTH / 2]}>
          <boxGeometry args={[COVER_OVERHANG, PAGE_H, PAGE_DEPTH]} />
          <meshStandardMaterial color={PAGE_EDGE} roughness={1} />
        </mesh>
        <mesh>
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          <meshBasicMaterial map={pageTex} toneMapped={false} fog={false} />
        </mesh>
      </group>

      {/* ── SPIRALA + DZIURKI ──
          Bez deski grzbietu — dwie połówki notesu łączy tylko spirala,
          jak w prawdziwym notesie na kółkach. */}
      {Array.from({ length: SPIRAL_RINGS }).map((_, i) => {
        const y = PAGE_H / 2 - 0.2 - i * ((PAGE_H - 0.4) / (SPIRAL_RINGS - 1))
        return (
          <group key={i}>
            <mesh position={[0, y, 0]} rotation-y={Math.PI / 2}>
              <torusGeometry args={[0.07, 0.018, 8, 20]} />
              <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.35} />
            </mesh>
            <mesh position={[-0.13, y, 0.011]}>
              <circleGeometry args={[0.026, 16]} />
              <meshBasicMaterial color="#20271f" />
            </mesh>
            <mesh position={[0.13, y, 0.011]}>
              <circleGeometry args={[0.026, 16]} />
              <meshBasicMaterial color="#20271f" />
            </mesh>
          </group>
        )
      })}

      {/* ── CIEŃ rzucany przez przewracaną kartkę ── */}
      <mesh ref={sheetShadowRef} position={[PAGE_W / 2, 0, 0.004]}>
        <planeGeometry args={[PAGE_W, PAGE_H * 0.97]} />
        <meshBasicMaterial color="#000000" transparent opacity={0} depthWrite={false} fog={false} />
      </mesh>

      {/* ── PRZEWRACANA KARTKA: papier WebGL + dwa żywe Html w jednej grupie ──
          Cała grupa obraca się wokół grzbietu (x=0). Html śledzi macierz
          rodzica, więc treść obraca się razem z papierem — bez snapshotów. */}
      <group ref={sheetGroupRef}>
        {/* meshBasicMaterial (nieoświetlany) — standardowy materiał rozjaśniał
            się gwałtownie, gdy normalna kartki mijała światło kierunkowe */}
        <mesh geometry={sheetGeo} position={[0, 0, 0.01]} visible={flipping}>
          <meshBasicMaterial map={pageTex} side={THREE.DoubleSide} toneMapped={false} fog={false} />
        </mesh>

        {flipping && sheetFrontModel && !showBack && (
          <Html
            transform
            distanceFactor={DF}
            position={[PAGE_W / 2, 0, 0.022]}
            zIndexRange={[1100, 600]}
            style={{ pointerEvents: 'none' }}
          >
            {/* nieprzezroczysty papier — zakrywa DOM strony odsłanianej pod kartką */}
            <div style={sheetPaperStyle('left')}>
              <PageFace model={sheetFrontModel} ctx={frozenCtx} />
            </div>
          </Html>
        )}

        {flipping && sheetBackModel && showBack && (
          <Html
            transform
            distanceFactor={DF}
            position={[PAGE_W / 2, 0, -0.022]}
            rotation-y={Math.PI}
            zIndexRange={[1100, 600]}
            style={{ pointerEvents: 'none' }}
          >
            {/* po obrocie o 180° grzbiet tej twarzy wypada po PRAWEJ stronie */}
            <div style={sheetPaperStyle('right')}>
              <PageFace model={sheetBackModel} ctx={frozenCtx} />
            </div>
          </Html>
        )}
      </group>

      {/* ── STREFY KLIKALNE krawędzi (tylko w lekcji, poza flipem) ── */}
      {view === 'lesson' && !flipping && (
        <>
          <mesh
            position={[-PAGE_W + 0.25, 0, 0.05]}
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            onPointerOver={() => setCursor('pointer')}
            onPointerOut={() => setCursor('')}
          >
            <planeGeometry args={[0.5, PAGE_H]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh
            position={[PAGE_W - 0.25, 0, 0.05]}
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            onPointerOver={() => setCursor('pointer')}
            onPointerOut={() => setCursor('')}
          >
            <planeGeometry args={[0.5, PAGE_H]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </>
      )}

      {/* ── STATYCZNE STRONY: żywy DOM przez cały czas, także podczas flipa ── */}
      <Html
        transform
        distanceFactor={DF}
        position={[-PAGE_W / 2, 0, 0.012]}
        zIndexRange={[550, 100]}
        style={htmlBase(true)}
      >
        <PageFace model={staticLeftModel} ctx={flip?.dir === 'fwd' ? frozenCtx : ctx} />
      </Html>

      <Html
        transform
        distanceFactor={DF}
        position={[PAGE_W / 2, 0, 0.012]}
        zIndexRange={[550, 100]}
        style={htmlBase(true)}
      >
        <PageFace model={staticRightModel} ctx={flip?.dir === 'back' ? frozenCtx : ctx} />
      </Html>
    </group>
  )
}

// ── Kamera ──────────────────────────────────────────────────────────────────

function CameraRig() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(0, 0.4, 6.6)
    camera.lookAt(0, -0.2, 0)
  }, [camera])
  return null
}

// ── Export ──────────────────────────────────────────────────────────────────

interface Props {
  track: TrackData
  locale: string
  onStartLesson?: (id: string) => void
  onClose?: () => void
}

export default function OpenBook3D({ track, locale, onStartLesson, onClose }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#1a202c' }}>
      <Canvas camera={{ fov: 42, position: [0, 0.4, 6.6] }} dpr={[1, 2]} gl={{ antialias: true }}>
        <CameraRig />
        <color attach="background" args={['#1a202c']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 6, 5]} intensity={0.9} />
        <directionalLight position={[-4, 2, 3]} intensity={0.3} color="#89937e" />
        <OpenBook
          track={track}
          locale={locale}
          onStartLesson={onStartLesson ?? (() => {})}
          onClose={onClose}
        />
      </Canvas>
    </div>
  )
}
