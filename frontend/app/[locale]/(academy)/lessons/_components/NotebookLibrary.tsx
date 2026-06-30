'use client'

import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useTransitionRouter } from 'next-view-transitions'
import { useTranslations } from 'next-intl'
import { OpenBook } from './OpenBook3d'

// ── Types ──────────────────────────────────────────────────────────────────

export type TrackId = 'qa' | 'reality'

export interface LessonItem {
  id: string
  order: number
  title_en: string
  title_pl: string
  sub_lesson_count?: number
}

export interface TrackData {
  id: TrackId
  title: string
  desc: string
  bottom: string
  quote: string
  by: string
  lessons: LessonItem[]
}

// ── Theme hook ─────────────────────────────────────────────────────────────

interface ThemeColors {
  background: string
  foreground: string
  primary: string
  secondary: string
  accent: string
  error: string
}

function useCSSColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>({
    background: '#1a202c',
    foreground: '#e2e8f0',
    primary: '#89937e',
    secondary: '#576966',
    accent: '#fde047',
    error: '#ef4444',
  })

  useEffect(() => {
    const read = () => {
      const el = document.documentElement
      const g = (name: string) => getComputedStyle(el).getPropertyValue(name).trim()
      setColors({
        background: g('--background'),
        foreground: g('--foreground'),
        primary: g('--primary'),
        secondary: g('--secondary'),
        accent: g('--accent'),
        error: g('--error'),
      })
    }
    read()
    const obs = new MutationObserver(read)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return colors
}

// ── Constants & Configuration ──────────────────────────────────────────────

const BW = 2.0,
  BH = 2.75,
  BD = 0.55
const FLOOR = -BH / 2 - 0.05
const ORDER: TrackId[] = ['qa', 'reality']
const HOME: Record<TrackId, { x: number; ry: number }> = {
  qa: { x: -2.25, ry: 0.34 },
  reality: { x: 2.25, ry: -0.34 },
}
type Pt = [number, number]
const LEGS: { r: Pt; c1: Pt; k: Pt; c2: Pt; t: Pt }[] = [
  { r: [24, 44], c1: [6, 32], k: [-4, 38], c2: [-16, 42], t: [-20, 58] },
  { r: [22, 57], c1: [2, 50], k: [-8, 54], c2: [-20, 58], t: [-22, 74] },
  { r: [22, 68], c1: [0, 70], k: [-6, 78], c2: [-14, 84], t: [-8, 100] },
  { r: [26, 78], c1: [6, 84], k: [4, 92], c2: [2, 100], t: [6, 112] },
  { r: [76, 44], c1: [94, 32], k: [104, 38], c2: [116, 42], t: [120, 58] },
  { r: [78, 57], c1: [98, 50], k: [108, 54], c2: [120, 58], t: [122, 74] },
  { r: [78, 68], c1: [100, 70], k: [106, 78], c2: [114, 84], t: [108, 100] },
  { r: [74, 78], c1: [94, 84], k: [96, 92], c2: [98, 100], t: [94, 112] },
]

const NOISE_BASE = '#20271f'

interface CoverPalette {
  cover: string
  coverDark: string
  titleInk: string
  descInk: string
  sceneAccent: string
}

const TRACK_COVER: Record<TrackId, CoverPalette> = {
  qa: {
    cover: '#89937E',
    coverDark: '#192218',
    titleInk: '#F4F1EA',
    descInk: 'rgba(244, 241, 234, 0.65)',
    sceneAccent: '#FF4A4A', // Neonowy, laserowy czerwony do błędów
  },
  reality: {
    cover: '#576966',
    coverDark: '#12191D',
    titleInk: '#F1EDE2',
    descInk: 'rgba(241, 237, 226, 0.6)',
    sceneAccent: '#FDE047', // Sygnałowy żółty do wykrzyknika
  },
}

// ── Canvas texture helpers ─────────────────────────────────────────────────

const FM = {
  armor: '#7a8a6e',
  armorDark: '#5a6654',
  armorLight: '#9aaa8e',
  visor: '#f5e642',
  outline: '#3a4235',
  accent: '#b8ff4e',
}

function drawFuzzi(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
  mirror: boolean
) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(mirror ? -s : s, s)
  ctx.translate(-50, -59)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  LEGS.forEach((L) => {
    const p1 = new Path2D(`M ${L.r[0]} ${L.r[1]} Q ${L.c1[0]} ${L.c1[1]} ${L.k[0]} ${L.k[1]}`)
    const p2 = new Path2D(`M ${L.k[0]} ${L.k[1]} Q ${L.c2[0]} ${L.c2[1]} ${L.t[0]} ${L.t[1]}`)
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 5.5
    ctx.stroke(p1)
    ctx.strokeStyle = FM.armorDark
    ctx.lineWidth = 2.6
    ctx.stroke(p1)
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 4
    ctx.stroke(p2)
    ctx.strokeStyle = FM.armor
    ctx.lineWidth = 1.8
    ctx.stroke(p2)
    ctx.beginPath()
    ctx.arc(L.k[0], L.k[1], 2.6, 0, 7)
    ctx.fillStyle = FM.armorLight
    ctx.fill()
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 1.4
    ctx.stroke()
  })

  const P_CHEL_R = new Path2D(
    'M 56 76 C 62 76, 70 78, 74 86 C 78 94, 74 103, 70 106 C 72 99, 70 93, 66 90 C 62 96, 64 104, 66 108 C 60 102, 58 93, 60 86 C 56 84, 54 80, 56 76 Z'
  )
  const P_CHEL_L = new Path2D(
    'M 44 76 C 38 76, 30 78, 26 86 C 22 94, 26 103, 30 106 C 28 99, 30 93, 34 90 C 38 96, 36 104, 34 108 C 40 102, 42 93, 40 86 C 44 84, 46 80, 44 76 Z'
  )
  ;[P_CHEL_L, P_CHEL_R].forEach((p) => {
    ctx.fillStyle = FM.armor
    ctx.fill(p)
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 2
    ctx.stroke(p)
  })

  const P_ARMOR = new Path2D(
    'M 28 12 Q 50 5 72 12 L 90 28 L 97 50 L 90 72 L 76 82 L 50 86 L 24 82 L 10 72 L 3 50 L 10 28 Z'
  )
  const ag = ctx.createRadialGradient(36.8, 26, 4, 36.8, 26, 68)
  ag.addColorStop(0, FM.armorLight)
  ag.addColorStop(1, FM.armorDark)
  ctx.fillStyle = ag
  ctx.fill(P_ARMOR)
  ctx.strokeStyle = FM.outline
  ctx.lineWidth = 3.5
  ctx.stroke(P_ARMOR)

  const P_TOP = new Path2D('M 30 12 Q 50 21 70 12')
  const P_CL = new Path2D('M 10 72 L 22 70 L 28 80')
  const P_CR = new Path2D('M 90 72 L 78 70 L 72 80')
  const P_PORT = new Path2D('M 42 82 L 42 75 L 58 75 L 58 82')
  ctx.strokeStyle = FM.armorDark
  ctx.lineWidth = 1.8
  ctx.stroke(P_TOP)
  ctx.lineWidth = 1.6
  ctx.stroke(P_CL)
  ctx.stroke(P_CR)
  ctx.stroke(P_PORT)
  ;(
    [
      [34, 52],
      [66, 52],
    ] as Pt[]
  ).forEach(([vx, vy]) => {
    const g = ctx.createRadialGradient(vx, vy, 2, vx, vy, 15)
    g.addColorStop(0, 'rgba(255,225,0,0.28)')
    g.addColorStop(1, 'rgba(255,225,0,0)')
    ctx.beginPath()
    ctx.arc(vx, vy, 15, 0, 7)
    ctx.fillStyle = g
    ctx.fill()
  })
  ;(
    [
      [34, 52],
      [66, 52],
    ] as Pt[]
  ).forEach(([vx, vy]) => {
    const g = ctx.createRadialGradient(vx - 2.8, vy - 4.1, 1, vx - 2.8, vy - 4.1, 15)
    g.addColorStop(0, '#fffaaa')
    g.addColorStop(1, FM.visor)
    ctx.beginPath()
    ctx.arc(vx, vy, 11.5, 0, 7)
    ctx.fillStyle = g
    ctx.fill()
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 3
    ctx.stroke()
  })
  ;(
    [
      [30, 47.5],
      [62, 47.5],
    ] as Pt[]
  ).forEach(([vx, vy]) => {
    ctx.beginPath()
    ctx.arc(vx, vy, 3.2, 0, 7)
    ctx.fillStyle = 'rgba(255,255,255,0.52)'
    ctx.fill()
  })
  ;(
    [
      [23, 36, 3.5],
      [38, 31, 4.5],
      [62, 31, 4.5],
      [77, 36, 3.5],
    ] as [number, number, number][]
  ).forEach(([sx, sy, sr]) => {
    ctx.beginPath()
    ctx.arc(sx, sy, sr, 0, 7)
    ctx.fillStyle = FM.visor
    ctx.fill()
    ctx.strokeStyle = FM.outline
    ctx.lineWidth = 2.2
    ctx.stroke()
  })
  ctx.beginPath()
  ctx.arc(17, 50, 2.2, 0, 7)
  ctx.fillStyle = FM.accent
  ctx.fill()
  ctx.restore()
}

function drawQAScene(ctx: CanvasRenderingContext2D, col: CoverPalette) {
  drawFuzzi(ctx, 290, 330, 1.55, false)
  const ex = 290 + (34 - 50) * 1.55,
    ey = 330 + (52 - 59) * 1.55
  const bx = 140,
    by = 545

  const bg = ctx.createLinearGradient(ex, ey, bx, by)
  bg.addColorStop(0, 'rgba(255, 74, 74, 0.25)')
  bg.addColorStop(1, 'rgba(255, 74, 74, 0.01)')
  ctx.beginPath()
  ctx.moveTo(ex - 4, ey + 4)
  ctx.lineTo(bx - 30, by)
  ctx.lineTo(bx + 30, by)
  ctx.lineTo(ex + 10, ey + 8)
  ctx.closePath()
  ctx.fillStyle = bg
  ctx.fill()

  ctx.save()
  ctx.translate(bx, by)
  ctx.strokeStyle = col.coverDark
  ctx.lineWidth = 2
  ;(
    [
      [-14, -8, -22, -14],
      [-15, 0, -24, 0],
      [-14, 8, -22, 14],
      [14, -8, 22, -14],
      [15, 0, 24, 0],
      [14, 8, 22, 14],
    ] as [number, number, number, number][]
  ).forEach(([ax, ay, bx2, by2]) => {
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx2, by2)
    ctx.stroke()
  })
  ctx.beginPath()
  ctx.ellipse(0, 0, 13, 9, 0, 0, 7)
  ctx.fillStyle = '#262e26'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, -11, 5, 0, 7)
  ctx.fillStyle = '#262e26'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(0, -9)
  ctx.lineTo(0, 8)
  ctx.strokeStyle = 'rgba(230,233,220,0.35)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.restore()

  ctx.strokeStyle = col.sceneAccent
  ctx.lineWidth = 2
  ctx.setLineDash([6, 5])
  ctx.beginPath()
  ctx.arc(bx, by, 30, 0, 7)
  ctx.stroke()
  ctx.setLineDash([])
  ;(
    [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ] as Pt[]
  ).forEach(([dx, dy]) => {
    ctx.beginPath()
    ctx.moveTo(bx + dx * 30, by + dy * 30)
    ctx.lineTo(bx + dx * 40, by + dy * 40)
    ctx.stroke()
  })
  ctx.fillStyle = col.sceneAccent
  ctx.font = '700 16px monospace'
  ctx.textAlign = 'left'
  ctx.fillText('ERR_', bx + 42, by - 30)
}

function drawRealityScene(ctx: CanvasRenderingContext2D, col: CoverPalette) {
  drawFuzzi(ctx, 150, 430, 1.15, false)
  drawFuzzi(ctx, 362, 430, 1.15, true)

  const bubble = (
    bx: number,
    by: number,
    bw: number,
    bh: number,
    tailX: number,
    txt: string,
    isAccent: boolean
  ) => {
    const r = 10
    ctx.beginPath()
    ctx.moveTo(bx + r, by)
    ctx.lineTo(bx + bw - r, by)
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r)
    ctx.lineTo(bx + bw, by + bh - r)
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh)
    ctx.lineTo(tailX + 12, by + bh)
    ctx.lineTo(tailX, by + bh + 16)
    ctx.lineTo(tailX - 2, by + bh)
    ctx.lineTo(bx + r, by + bh)
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r)
    ctx.lineTo(bx, by + r)
    ctx.quadraticCurveTo(bx, by, bx + r, by)
    ctx.closePath()

    ctx.fillStyle = isAccent ? col.sceneAccent : '#EAE5D9'
    ctx.fill()
    ctx.strokeStyle = col.coverDark
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.fillStyle = col.coverDark
    ctx.font = '800 24px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(txt, bx + bw / 2, by + bh / 2 + 8)
  }

  bubble(86, 268, 120, 52, 160, '...', false)
  bubble(306, 240, 120, 52, 352, '!', true)
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const wd of words) {
    const test = line ? line + ' ' + wd : wd
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line)
      line = wd
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

function buildCoverTexture(
  title: string,
  desc: string,
  bottom: string,
  scene: (ctx: CanvasRenderingContext2D, col: CoverPalette) => void,
  col: CoverPalette
): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 512
  cn.height = 704
  const ctx = cn.getContext('2d')!
  ctx.fillStyle = col.cover
  ctx.fillRect(0, 0, 512, 704)
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.02})`
    ctx.fillRect(Math.random() * 512, Math.random() * 704, 1, 1)
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`
    ctx.fillRect(Math.random() * 512, Math.random() * 704, 1, 1)
  }
  ctx.textAlign = 'center'
  ctx.font = '800 60px bold sans-sans'
  ctx.fillStyle = col.titleInk
  const lines = wrapText(ctx, title.toUpperCase(), 420)
  lines.forEach((ln, i) => ctx.fillText(ln, 256, 100 + i * 56))
  const dy = 100 + lines.length * 56 - 16
  ctx.font = 'italic 400 22px Georgia, serif'
  ctx.fillStyle = col.descInk
  ctx.fillText(desc, 256, dy + 26)
  scene(ctx, col)
  ctx.font = '700 18px monospace'
  ctx.fillStyle = 'rgba(230,233,220,0.45)'
  ctx.textAlign = 'center'
  ctx.fillText(bottom.toUpperCase(), 256, 664)
  const tex = new THREE.CanvasTexture(cn)
  tex.anisotropy = 8
  return tex
}

function buildSheetTexture(): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 128
  cn.height = 128
  const ctx = cn.getContext('2d')!
  ctx.fillStyle = '#c9cdb9'
  ctx.fillRect(0, 0, 128, 128)
  ctx.strokeStyle = '#a8ad97'
  ctx.lineWidth = 1
  for (let p = 2; p < 128; p += 4) {
    ctx.beginPath()
    ctx.moveTo(0, p)
    ctx.lineTo(128, p)
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(cn)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(1, 2)
  return t
}

function buildNoiseTex(base: string, strength: number): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 128
  cn.height = 128
  const ctx = cn.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 5200; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * strength})`
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1)
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * strength * 1.6})`
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1)
  }
  const t = new THREE.CanvasTexture(cn)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 4)
  return t
}

function buildBumpTex(): THREE.CanvasTexture {
  const cn = document.createElement('canvas')
  cn.width = 128
  cn.height = 128
  const ctx = cn.getContext('2d')!
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 128, 128)
  for (let i = 0; i < 6500; i++) {
    const v = Math.floor(Math.random() * 255)
    ctx.fillStyle = `rgba(${v},${v},${v},0.5)`
    ctx.fillRect(Math.random() * 128, Math.random() * 128, 1, 1)
  }
  const t = new THREE.CanvasTexture(cn)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 4)
  return t
}

function buildCoverShape(cw: number, ch: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(-cw / 2, -ch / 2)
  s.lineTo(cw / 2 - r, -ch / 2)
  s.quadraticCurveTo(cw / 2, -ch / 2, cw / 2, -ch / 2 + r)
  s.lineTo(cw / 2, ch / 2 - r)
  s.quadraticCurveTo(cw / 2, ch / 2, cw / 2 - r, ch / 2)
  s.lineTo(-cw / 2, ch / 2)
  s.closePath()
  return s
}

function bookWorldPos(b: THREE.Object3D, camera: THREE.Camera): { x: number; y: number } {
  const tmp = new THREE.Vector3()
  b.getWorldPosition(tmp)
  tmp.project(camera)
  return { x: tmp.x, y: tmp.y }
}

// ── Book mesh component ────────────────────────────────────────────────────

interface BookMeshProps {
  id: TrackId
  groupRef: React.RefObject<THREE.Group>
  coverTex: THREE.CanvasTexture
  sheetTex: THREE.CanvasTexture
  roughMat: THREE.MeshPhongMaterial
  coverDark: string
  onPointerOver: () => void
  onPointerOut: () => void
  onClick: () => void
}

function BookMesh({
  id,
  groupRef,
  coverTex,
  sheetTex,
  roughMat,
  coverDark,
  onPointerOver,
  onPointerOut,
  onClick,
}: BookMeshProps) {
  const lam = (c: string) => new THREE.MeshLambertMaterial({ color: c })

  const { pGeo, pageMats, cGeo, frontMats, backMats } = useMemo(() => {
    const pGeo = new THREE.ExtrudeGeometry(buildCoverShape(BW - 0.08, BH - 0.07, 0.14), {
      depth: 0.4,
      bevelEnabled: false,
    })
    const pageMats = [lam('#c9cdb9'), new THREE.MeshLambertMaterial({ map: sheetTex })]
    const cGeo = new THREE.ExtrudeGeometry(buildCoverShape(BW, BH, 0.16), {
      depth: 0.06,
      bevelEnabled: false,
    })
    coverTex.wrapS = coverTex.wrapT = THREE.ClampToEdgeWrapping
    coverTex.repeat.set(1 / BW, 1 / BH)
    coverTex.offset.set(0.5, 0.5)
    const frontMats = [new THREE.MeshLambertMaterial({ map: coverTex }), lam(coverDark)]
    const backMats = [lam(coverDark), lam(coverDark)]
    return { pGeo, pageMats, cGeo, frontMats, backMats }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverDark, coverTex, sheetTex])

  return (
    <group ref={groupRef} position={[HOME[id].x, 0, 0]} rotation-y={HOME[id].ry}>
      {/* Page block */}
      <mesh geometry={pGeo} material={pageMats} position={[0, 0, -0.2]} />
      {/* Front cover */}
      <mesh geometry={cGeo} material={frontMats} position={[0, 0, BD / 2 - 0.06]} />
      {/* Back cover */}
      <mesh geometry={cGeo} material={backMats} position={[0, 0, -BD / 2]} />
      {/* Spine */}
      <mesh material={roughMat} position={[-BW / 2 - 0.015, 0, 0]}>
        <boxGeometry args={[0.1, BH + 0.012, BD + 0.04]} />
      </mesh>
      {/* Elastic band */}
      <mesh material={roughMat} position={[BW / 2 - 0.32, 0, 0]}>
        <boxGeometry args={[0.07, BH + 0.03, BD + 0.06]} />
      </mesh>
      {/* Ribbon bookmark */}
      <mesh position={[0.25, -BH / 2 - 0.18, 0.05]} rotation-z={0.18}>
        <boxGeometry args={[0.12, 0.5, 0.015]} />
        <meshLambertMaterial color="#566249" />
      </mesh>
      {/* Invisible hit box */}
      <mesh onPointerOver={onPointerOver} onPointerOut={onPointerOut} onClick={onClick}>
        <boxGeometry args={[BW + 0.1, BH + 0.1, BD + 0.1]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}

// ── Floor shadow ───────────────────────────────────────────────────────────

function FloorShadow({
  shadowRef,
  x,
  ry,
}: {
  shadowRef: React.RefObject<THREE.Mesh>
  x: number
  ry: number
}) {
  return (
    <mesh
      ref={shadowRef}
      rotation={[-Math.PI / 2, 0, ry]}
      scale={[1.25, 0.5, 1]}
      position={[x, FLOOR + 0.01, 0]}
    >
      <circleGeometry args={[1.0, 28]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.4} depthWrite={false} />
    </mesh>
  )
}

// ── Camera rig ─────────────────────────────────────────────────────────────

function CameraRig({
  openProgressRef,
  reducedMotion,
  hasOpen,
}: {
  openProgressRef: React.MutableRefObject<number>
  reducedMotion: boolean
  hasOpen: boolean
}) {
  const { camera } = useThree()
  const camPos = useRef(new THREE.Vector3(0, 2.0, 6.3))
  const lookTgt = useRef(new THREE.Vector3(0, -0.3, 0))

  const closedPos = useMemo(() => new THREE.Vector3(0, 2.0, 6.3), [])
  const openPos = useMemo(() => new THREE.Vector3(0, 0.4, 6.6), [])
  const closedLook = useMemo(() => new THREE.Vector3(0, -0.3, 0), [])
  const openLook = useMemo(() => new THREE.Vector3(0, -0.2, 0.5), [])

  useFrame(() => {
    const zp = reducedMotion ? (hasOpen ? 1 : 0) : openProgressRef.current
    camPos.current.lerpVectors(closedPos, openPos, zp)
    lookTgt.current.lerpVectors(closedLook, openLook, zp)
    camera.position.copy(camPos.current)
    camera.lookAt(lookTgt.current)
  })

  return null
}

// ── Main scene component ───────────────────────────────────────────────────

interface BooksSceneProps {
  openId: TrackId | null
  reducedMotion: boolean
  onBookClick: (id: TrackId) => void
  onOpenBookVisibilityChange: (show: boolean) => void
  colors: ThemeColors
  openProgressRef: React.MutableRefObject<number>
  coverTexes: Record<TrackId, THREE.CanvasTexture>
  sheetTex: THREE.CanvasTexture
  roughMat: THREE.MeshPhongMaterial
}

function BooksScene({
  openId,
  reducedMotion,
  onBookClick,
  onOpenBookVisibilityChange,
  colors,
  openProgressRef,
  coverTexes,
  sheetTex,
  roughMat,
}: BooksSceneProps) {
  const qaGroupRef = useRef<THREE.Group>(null!)
  const realityGroupRef = useRef<THREE.Group>(null!)
  const qaShadowRef = useRef<THREE.Mesh>(null!)
  const realityShadowRef = useRef<THREE.Mesh>(null!)

  const groupRefs: Record<TrackId, React.RefObject<THREE.Group>> = {
    qa: qaGroupRef,
    reality: realityGroupRef,
  }
  const shadowRefs: Record<TrackId, React.RefObject<THREE.Mesh>> = {
    qa: qaShadowRef,
    reality: realityShadowRef,
  }

  const hoveredRef = useRef<TrackId | null>(null)
  const openIdRef = useRef<TrackId | null>(openId)
  const zoomProgRef = useRef(0)
  const prevShowOpenBookRef = useRef(false)
  const lastOpenedIdRef = useRef<TrackId | null>(null)
  const timerRef = useRef(new THREE.Timer())

  useEffect(() => {
    openIdRef.current = openId
  }, [openId])

  useEffect(() => {
    const timer = timerRef.current
    return () => void timer.dispose()
  }, [])

  useFrame((state) => {
    timerRef.current.update()
    const t = timerRef.current.getElapsed()
    const oid = openIdRef.current
    const zp_target = oid ? 1 : 0

    if (reducedMotion) {
      zoomProgRef.current = zp_target
    } else {
      zoomProgRef.current += (zp_target - zoomProgRef.current) * 0.09
    }
    const zp = zoomProgRef.current
    openProgressRef.current = zp

    if (oid) lastOpenedIdRef.current = oid
    if (!oid && zp < 0.02) lastOpenedIdRef.current = null

    const shouldShowOpenBook = zp > 0.88 && !!oid
    if (shouldShowOpenBook !== prevShowOpenBookRef.current) {
      prevShowOpenBookRef.current = shouldShowOpenBook
      onOpenBookVisibilityChange(shouldShowOpenBook)
    }

    const transId = lastOpenedIdRef.current

    ORDER.forEach((id, i) => {
      const b = groupRefs[id].current
      const sh = shadowRefs[id].current
      if (!b || !sh) return

      const isOpening = id === oid
      const hiddenAsOpening = id === transId && zp > 0.88
      const hiddenAsOther = transId !== null && id !== transId && zp > 0.3
      b.visible = !hiddenAsOpening && !hiddenAsOther

      const sway = !reducedMotion && zp < 0.05 ? Math.sin(t * 0.55 + i) * 0.025 : 0
      const hov = hoveredRef.current === id && !oid

      let px = 0,
        py = 0
      if (!reducedMotion && hov && state.pointer.x > -1.5) {
        const bNDC = bookWorldPos(b, state.camera)
        const dx = Math.max(-1, Math.min(1, (state.pointer.x - bNDC.x) * 1.6))
        const dy = Math.max(-1, Math.min(1, (state.pointer.y - bNDC.y) * 1.6))
        px = dx * 0.14
        py = dy * 0.08
      }

      let tx = HOME[id].x,
        tz = 0,
        trY = HOME[id].ry + px,
        trX = -py
      if (isOpening) {
        tx = 0
        tz = 3.3 * zp
        trY = 0
        trX = 0
      } else if (oid) {
        tx = HOME[id].x
        tz = 0
        trY = HOME[id].ry
        trX = 0
      }

      const lerp = reducedMotion ? 1 : 0.09
      b.position.x += (tx - b.position.x) * lerp
      b.position.z += (tz - b.position.z) * lerp
      b.position.y += ((hov ? 0.14 : 0) - b.position.y) * (reducedMotion ? 1 : 0.1)
      b.rotation.y += (trY + sway - b.rotation.y) * (reducedMotion ? 1 : 0.1)
      b.rotation.x += (trX - b.rotation.x) * (reducedMotion ? 1 : 0.1)

      b.updateMatrixWorld()
      sh.rotation.z += (HOME[id].ry + (hov ? px : 0) - sh.rotation.z) * (reducedMotion ? 1 : 0.1)
      sh.scale.x += ((hov ? 1.5 : 1.25) - sh.scale.x) * (reducedMotion ? 1 : 0.1)
      sh.scale.y += ((hov ? 0.6 : 0.5) - sh.scale.y) * (reducedMotion ? 1 : 0.1)
      const tOp = isOpening ? Math.max(0, 0.4 - zp * 1.4) : oid ? 0 : hov ? 0.28 : 0.4
      const mat = sh.material as THREE.MeshBasicMaterial
      mat.opacity += (tOp - mat.opacity) * (reducedMotion ? 1 : 0.1)
    })
  })

  const makeHandlers = (id: TrackId) => ({
    onPointerOver: () => {
      hoveredRef.current = id
    },
    onPointerOut: () => {
      if (hoveredRef.current === id) hoveredRef.current = null
    },
    onClick: () => {
      if (!openIdRef.current) onBookClick(id)
    },
  })

  return (
    <>
      {ORDER.map((id) => (
        <BookMesh
          key={id}
          id={id}
          groupRef={groupRefs[id]}
          coverTex={coverTexes[id]}
          sheetTex={sheetTex}
          roughMat={roughMat}
          coverDark={TRACK_COVER[id].coverDark}
          {...makeHandlers(id)}
        />
      ))}
      {ORDER.map((id) => (
        <FloorShadow key={id} shadowRef={shadowRefs[id]} x={HOME[id].x} ry={HOME[id].ry} />
      ))}
      <Grid
        position={[0, FLOOR, 0]}
        args={[50, 50]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={colors.secondary}
        sectionSize={2.5}
        sectionThickness={1}
        sectionColor={colors.primary}
        fadeDistance={25}
        fadeStrength={1.5}
      />
    </>
  )
}

// ── NotebookLibrary main export ────────────────────────────────────────────

interface Props {
  tracks: TrackData[]
  locale: string
}

export default function NotebookLibrary({ tracks, locale }: Props) {
  const t = useTranslations('Lessons.Library.notebook')
  const router = useTransitionRouter()
  const colors = useCSSColors()
  const [openId, setOpenId] = useState<TrackId | null>(null)
  const [showOpenBook, setShowOpenBook] = useState(false)
  const [displayTrack, setDisplayTrack] = useState<TrackData | null>(null)
  const openProgressRef = useRef(0)

  const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { sheetTex, noiseTex, bumpTex, roughMat, coverTexes } = useMemo(() => {
    const sheetTex = buildSheetTexture()
    const noiseTex = buildNoiseTex(NOISE_BASE, 0.07)
    const bumpTex = buildBumpTex()

    const coverTexes: Record<TrackId, THREE.CanvasTexture> = {
      qa: buildCoverTexture(
        'Quality Assurance',
        'From bits to UI',
        'Fuzzi | QA TRACK',
        drawQAScene,
        TRACK_COVER.qa
      ),
      reality: buildCoverTexture(
        'Reality Check',
        "What they won't tell you",
        'Fuzzi | Reality Track',
        drawRealityScene,
        TRACK_COVER.reality
      ),
    }

    const roughMat = new THREE.MeshPhongMaterial({
      map: noiseTex,
      bumpMap: bumpTex,
      bumpScale: 0.012,
      shininess: 5,
    })

    return { sheetTex, noiseTex, bumpTex, roughMat, coverTexes }
  }, [])

  useEffect(() => {
    return () => {
      sheetTex.dispose()
      noiseTex.dispose()
      bumpTex.dispose()
      Object.values(coverTexes).forEach((tex) => tex.dispose())
      roughMat.dispose()
    }
  }, [sheetTex, noiseTex, bumpTex, coverTexes, roughMat])

  useEffect(() => {
    if (openId) setDisplayTrack(tracks.find((tr) => tr.id === openId) ?? null)
  }, [openId, tracks])

  const handleBookClick = (id: TrackId) => setOpenId(id)
  const handleClose = () => setOpenId(null)
  const handleStartLesson = (lessonId: string) => router.push(`/lesson/${lessonId}`)

  return (
    <div className="bg-background absolute inset-0 flex flex-col">
      <div className="absolute inset-0">
        <Canvas
          camera={{ fov: 44, position: [0, 2.0, 6.3] }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <CameraRig
            openProgressRef={openProgressRef}
            reducedMotion={reducedMotion}
            hasOpen={!!openId}
          />
          <color attach="background" args={[colors.background]} />
          <fog attach="fog" args={[colors.background, 3, 12]} />
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight position={[3, 6, 5]} intensity={0.85} color="#ffffff" />
          <directionalLight position={[-4, 2, -3]} intensity={0.35} color={colors.primary} />

          <BooksScene
            openId={openId}
            reducedMotion={reducedMotion}
            onBookClick={handleBookClick}
            onOpenBookVisibilityChange={setShowOpenBook}
            colors={colors}
            openProgressRef={openProgressRef}
            coverTexes={coverTexes}
            sheetTex={sheetTex}
            roughMat={roughMat}
          />

          {showOpenBook && displayTrack && (
            <group position={[0, 0, 0.5]}>
              <OpenBook
                key={displayTrack.id}
                track={displayTrack}
                locale={locale}
                onStartLesson={handleStartLesson}
                coverTex={coverTexes[displayTrack.id]}
                reducedMotion={reducedMotion}
                onClose={handleClose}
              />
            </group>
          )}
        </Canvas>
      </div>

      {/* Hint text */}
      <div
        className="pointer-events-none absolute right-0 bottom-4 left-0 text-center font-mono text-[11px] tracking-[0.22em] uppercase"
        style={{
          color: colors.secondary,
          opacity: openId ? 0 : 1,
          transition: 'opacity 0.25s',
        }}
      >
        {t('hint')}
      </div>

      {/* Close button */}
      {openId && (
        <button
          onClick={handleClose}
          aria-label={t('close')}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 20,
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(20,32,26,0.72)',
            color: '#ece9df',
            border: '1px solid rgba(255,255,255,0.14)',
            cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            fontSize: 16,
            borderRadius: 4,
            backdropFilter: 'blur(4px)',
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
