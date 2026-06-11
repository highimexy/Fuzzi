'use client'

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { TrackData, LessonItem } from './NotebookLibrary'

/* ════════════════════════════════════════════════════════════════════════
   OpenBook3D — samodzielna otwarta książka 3D z prawdziwym page-turn.

   Założenia (potwierdzone z Tobą):
   • Pełny 3D: okładki, grzbiet, blok stron jako geometria.
   • Treść (spis lekcji / story / sub-lekcje) jako Drei <Html transform>,
     przyklejona do prawej strony — ostry, dostępny, i18n-friendly DOM.
   • Page-turn = shaderowo wyginana kartka (PlaneGeometry z segmentami +
     vertex shader zginający wzdłuż łuku). Html chowa się na czas flipa,
     wraca gdy strona leży płasko.

   Integrację z NotebookLibrary (przejście zamknięta→otwarta, openId,
   sceneHidden) robimy w kroku 2. Tu komponent stoi sam.
   ════════════════════════════════════════════════════════════════════════ */

// ── Wymiary książki (świat 3D) ──────────────────────────────────────────────

const PAGE_W = 2.6   // szerokość jednej strony (połowy rozkładówki)
const PAGE_H = 3.4   // wysokość strony
const COVER_OVERHANG = 0.08  // okładka wystaje poza stronę po każdej stronie
const COVER_THICK = 0.05     // grubość deski okładki
const PAGE_DEPTH = 0.16      // grubość bloku kartek (stack widoczny na krawędzi)

// ── Paleta (spójna z OpenBookOverlay) ───────────────────────────────────────

const COVER = '#3a443c'
const SPINE = '#20271f'
const PAGE_EDGE = '#a8ad97'

// ── Vertex shader: wygięcie kartki podczas flipa ────────────────────────────
//
// uProgress 0→1 steruje obrotem kartki wokół grzbietu (lewa krawędź),
// uBend dodaje łuk: środek kartki unosi się, krawędzie zostają — realny
// efekt przewracanej kartki, nie płaski obrót.

const flipVertexShader = /* glsl */ `
  uniform float uProgress;   // 0 = leży po prawej, 1 = przewrócona na lewo
  uniform float uBend;       // siła wygięcia
  uniform float uWidth;      // PAGE_W, do normalizacji x
  varying vec2 vUv;
  varying float vShade;      // do cieniowania w fragmencie

  void main() {
    vUv = uv;
    vec3 p = position;

    // x w zakresie [0, uWidth] — 0 przy grzbiecie (oś obrotu)
    float nx = p.x / uWidth;            // 0..1 od grzbietu do krawędzi

    // kąt obrotu wokół grzbietu (oś Y na lewej krawędzi strony)
    float ang = uProgress * 3.14159265;

    // łuk: maksymalny w połowie ruchu, znika na końcach; sinus po szerokości
    float lift = sin(nx * 3.14159265) * sin(uProgress * 3.14159265) * uBend;

    // obrót wokół osi Y przy x=0
    float c = cos(ang);
    float s = sin(ang);
    float rx = p.x * c;                 // nowy x po obrocie
    float rz = -p.x * s;                // wychylenie w głąb (z)

    p.x = rx;
    p.z = p.z + rz + lift;              // łuk dokłada się do z

    vShade = lift;                      // im wyżej łuk, tym jaśniejsza krawędź

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const flipFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vec4 tex = texture2D(uMap, vUv);
    // delikatne rozjaśnienie na grzbiecie łuku + przyciemnienie u nasady
    float sh = clamp(vShade * 1.6, -0.15, 0.18);
    vec3 col = tex.rgb + sh;
    gl_FragColor = vec4(col, tex.a * uOpacity);
  }
`

// ── Tekstura kartki (linie zeszytu) ─────────────────────────────────────────

function buildLinedPageTexture(): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 512
  cn.height = 680
  const ctx = cn.getContext('2d')!
  ctx.fillStyle = '#f7f6f1'
  ctx.fillRect(0, 0, 512, 680)
  // delikatny papierowy szum
  for (let i = 0; i < 4000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.015})`
    ctx.fillRect(Math.random() * 512, Math.random() * 680, 1, 1)
  }
  ctx.strokeStyle = 'rgba(32,38,47,0.10)'
  ctx.lineWidth = 1
  for (let y = 70; y < 680; y += 34) {
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(472, y)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(cn)
  tex.anisotropy = 8
  return tex
}

// ── Wyginana kartka flipa (shader) ──────────────────────────────────────────

interface FlipSheetProps {
  progressRef: React.MutableRefObject<number>
  frontTex: THREE.Texture
  visible: boolean
}

function FlipSheet({ progressRef, frontTex, visible }: FlipSheetProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null!)

  const geo = useMemo(
    () => new THREE.PlaneGeometry(PAGE_W, PAGE_H, 24, 1),
    []
  )

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uBend: { value: 0.5 },
      uWidth: { value: PAGE_W },
      uMap: { value: frontTex },
      uOpacity: { value: 1 },
    }),
    [frontTex]
  )

  useFrame(() => {
    if (matRef.current) {
      const up = matRef.current.uniforms['uProgress']
      if (up) up.value = progressRef.current
    }
  })

  // PlaneGeometry jest wyśrodkowana na x=0; przesuwam tak, by lewa krawędź
  // (oś obrotu w shaderze, x=0) była przy grzbiecie.
  return (
    <mesh geometry={geo} position={[0, 0, 0.01]} visible={visible}>
      <shaderMaterial
        ref={matRef}
        vertexShader={flipVertexShader}
        fragmentShader={flipFragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  )
}

// ── Treść stron (DOM przez Html) ────────────────────────────────────────────

function TocContent({
  track,
  locale,
  onPick,
}: {
  track: TrackData
  locale: string
  onPick: (idx: number) => void
}) {
  return (
    <div
      style={{
        width: 300,
        height: 400,
        padding: '24px 22px',
        boxSizing: 'border-box',
        color: '#20262f',
        fontFamily: 'var(--font-serif, Georgia, serif)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(32,38,47,0.55)',
          marginBottom: 10,
        }}
      >
        {track.bottom?.toUpperCase()}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 22,
          textTransform: 'uppercase',
          borderBottom: '2px solid #20262f',
          paddingBottom: 6,
          marginBottom: 12,
        }}
      >
        {track.title}
      </div>
      <div style={{ overflow: 'auto', flex: 1, paddingRight: 4 }}>
        {track.lessons.map((lesson, i) => {
          const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
          return (
            <div
              key={lesson.id}
              onClick={() => onPick(i)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                fontSize: 14,
                lineHeight: 2,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget.querySelector('.nm') as HTMLElement).style.textDecoration =
                  'underline'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget.querySelector('.nm') as HTMLElement).style.textDecoration = 'none'
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

function LessonContent({
  track,
  lesson,
  lessonIdx,
  locale,
  onBack,
  onStart,
}: {
  track: TrackData
  lesson: LessonItem
  lessonIdx: number
  locale: string
  onBack: () => void
  onStart: () => void
}) {
  const title = locale === 'pl' ? lesson.title_pl : lesson.title_en
  const story =
    locale === 'pl'
      ? 'Pamiętam projekt, w którym ten temat kosztował zespół dwa tygodnie obsuwy. Nikt nie rozumiał, dlaczego liczby się nie zgadzają — aż ktoś wrócił do podstaw.'
      : 'I remember a project where this one topic cost the team two weeks. Nobody understood why the numbers refused to add up — until someone went back to basics.'

  return (
    <div
      style={{
        width: 300,
        height: 400,
        padding: '24px 22px',
        boxSizing: 'border-box',
        color: '#20262f',
        fontFamily: 'var(--font-serif, Georgia, serif)',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.13em',
          textTransform: 'uppercase',
          padding: '6px 10px',
          border: '1px solid rgba(32,38,47,0.28)',
          background: 'rgba(32,38,47,0.04)',
          cursor: 'pointer',
          marginBottom: 14,
        }}
      >
        ‹ spis
      </button>
      <div
        style={{
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.26em',
          textTransform: 'uppercase',
          color: 'rgba(32,38,47,0.55)',
          marginBottom: 8,
        }}
      >
        {track.bottom?.toUpperCase()} · {String(lessonIdx + 1).padStart(2, '0')}
      </div>
      <div
        style={{
          fontWeight: 700,
          fontSize: 26,
          lineHeight: 1.1,
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(32,38,47,0.82)', flex: 1 }}>
        {story}
      </div>
      <button
        onClick={onStart}
        style={{
          alignSelf: 'flex-start',
          marginTop: 16,
          background: '#20262f',
          color: '#f7f6f1',
          border: 'none',
          fontFamily: 'var(--font-sans, sans-serif)',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '12px 22px',
          cursor: 'pointer',
        }}
      >
        zacznij lekcję →
      </button>
    </div>
  )
}

// ── Otwarta książka (geometria + Html + flip) ───────────────────────────────

interface OpenBookProps {
  track: TrackData
  locale: string
  onStartLesson: (id: string) => void
  coverTex?: THREE.Texture
  reducedMotion?: boolean
}

export function OpenBook({ track, locale, onStartLesson, reducedMotion }: OpenBookProps) {
  const pageTex = useMemo(() => buildLinedPageTexture(), [])

  type View = 'toc' | 'lesson'
  const [view, setView] = useState<View>('toc')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [flipping, setFlipping] = useState(false)
  const [htmlVisible, setHtmlVisible] = useState(true)

  const progressRef = useRef(0) // 0 = strona po prawej, 1 = przewrócona
  const targetRef = useRef(0)
  const flipDirRef = useRef<'fwd' | 'back'>('fwd')

  useEffect(() => () => pageTex.dispose(), [pageTex])

  const startFlip = useCallback(
    (dir: 'fwd' | 'back', after: () => void) => {
      if (flipping) return
      if (reducedMotion) {
        progressRef.current = dir === 'fwd' ? 1 : 0
        after()
        return
      }
      setFlipping(true)
      setHtmlVisible(false) // chowamy DOM na czas wyginania
      flipDirRef.current = dir
      progressRef.current = dir === 'fwd' ? 0 : 1
      targetRef.current = dir === 'fwd' ? 1 : 0
      // domknięcie po animacji obsłuży useFrame
      flipDoneRef.current = after
    },
    [flipping, reducedMotion]
  )

  const flipDoneRef = useRef<() => void>(() => {})

  useFrame(() => {
    if (!flipping) return
    const t = targetRef.current
    progressRef.current += (t - progressRef.current) * 0.12
    if (Math.abs(t - progressRef.current) < 0.01) {
      progressRef.current = t
      setFlipping(false)
      setHtmlVisible(true)
      flipDoneRef.current()
    }
  })

  const pickLesson = (idx: number) => {
    setLessonIdx(idx)
    startFlip('fwd', () => setView('lesson'))
  }
  const goBack = () => {
    startFlip('back', () => setView('toc'))
  }
  const start = () => {
    const l = track.lessons[lessonIdx]
    if (l) onStartLesson(l.id)
  }

  const curLesson = track.lessons[lessonIdx]

  return (
    <group rotation-x={-0.32}>
      {/* ── LEWA POŁOWA ── */}
      <group position={[-PAGE_W / 2, 0, 0]}>
        {/* deska okładki — BoxGeometry, ściany boczne prostopadłe do kamery = niewidoczne */}
        <mesh position={[0, 0, -(PAGE_DEPTH + COVER_THICK / 2)]}>
          <boxGeometry args={[PAGE_W + COVER_OVERHANG * 2, PAGE_H + COVER_OVERHANG * 2, COVER_THICK]} />
          <meshStandardMaterial color={COVER} roughness={0.85} metalness={0.05} />
        </mesh>
        {/* krawędź bloku kartek — kremowy pasek na zewnętrznym boku */}
        <mesh position={[-(PAGE_W / 2 + COVER_OVERHANG / 2), 0, -PAGE_DEPTH / 2]}>
          <boxGeometry args={[COVER_OVERHANG, PAGE_H, PAGE_DEPTH]} />
          <meshStandardMaterial color={PAGE_EDGE} roughness={1} />
        </mesh>
        {/* wierzchnia strona */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          <meshStandardMaterial map={pageTex} roughness={0.95} />
        </mesh>
      </group>

      {/* ── PRAWA POŁOWA ── */}
      <group position={[PAGE_W / 2, 0, 0]}>
        <mesh position={[0, 0, -(PAGE_DEPTH + COVER_THICK / 2)]}>
          <boxGeometry args={[PAGE_W + COVER_OVERHANG * 2, PAGE_H + COVER_OVERHANG * 2, COVER_THICK]} />
          <meshStandardMaterial color={COVER} roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[PAGE_W / 2 + COVER_OVERHANG / 2, 0, -PAGE_DEPTH / 2]}>
          <boxGeometry args={[COVER_OVERHANG, PAGE_H, PAGE_DEPTH]} />
          <meshStandardMaterial color={PAGE_EDGE} roughness={1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[PAGE_W, PAGE_H]} />
          <meshStandardMaterial map={pageTex} roughness={0.95} />
        </mesh>
      </group>

      {/* ── GRZBIET — zakrywa papier przy oprawie, pełna głębokość ── */}
      <mesh position={[0, 0, -(PAGE_DEPTH / 2 + COVER_THICK / 2)]}>
        <boxGeometry args={[0.18, PAGE_H + COVER_OVERHANG * 2, PAGE_DEPTH + COVER_THICK]} />
        <meshStandardMaterial color={SPINE} roughness={0.88} />
      </mesh>

      {/* ── WYGINANA KARTKA FLIPA (oś obrotu = grzbiet, x=0) ── */}
      <group position={[0, 0, 0.02]}>
        <FlipSheet progressRef={progressRef} frontTex={pageTex} visible={flipping} />
      </group>

      {/* ── TREŚĆ: Html przyklejony do prawej strony ── */}
      <Html
        transform
        distanceFactor={2.4}
        position={[PAGE_W / 2, 0, 0.06]}
        style={{
          opacity: htmlVisible ? 1 : 0,
          transition: 'opacity 0.18s',
          pointerEvents: htmlVisible ? 'auto' : 'none',
        }}
      >
        {view === 'toc' ? (
          <TocContent track={track} locale={locale} onPick={pickLesson} />
        ) : curLesson ? (
          <LessonContent
            track={track}
            lesson={curLesson}
            lessonIdx={lessonIdx}
            locale={locale}
            onBack={goBack}
            onStart={start}
          />
        ) : null}
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
}

export default function OpenBook3D({ track, locale, onStartLesson }: Props) {
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
        />
      </Canvas>
    </div>
  )
}
