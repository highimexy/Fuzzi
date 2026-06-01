'use client'

import { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { feature } = require('topojson-client') as typeof import('topojson-client')
import { useTranslations } from 'next-intl'
import { FiX } from 'react-icons/fi'
import { FuzziMark } from '../../global-components/logo/page'
import { Container } from '../../wrappers/Container'
import { BackgroundGrid } from '../_components/BackgroundGrid'

// ─── Constants ────────────────────────────────────────────────────────────────

const R = 1.4

const COLORS = {
  bg: '#1a202c',
  secondary: '#576966',
  primary: '#89937e',
  accent: '#fde047',
}

interface Region {
  id: string
  lat: number
  lon: number
}

const REGIONS: Region[] = [
  { id: 'usa', lat: 37, lon: -95 },
  { id: 'canada', lat: 60, lon: -96 },
  { id: 'uk', lat: 51.5, lon: -0.1 },
  { id: 'europe', lat: 50, lon: 10 },
  { id: 'poland', lat: 52, lon: 21 },
  { id: 'india', lat: 22, lon: 79 },
  { id: 'china', lat: 35, lon: 115 },
  { id: 'japan', lat: 35, lon: 139 },
  { id: 'australia', lat: -25, lon: 133 },
  { id: 'brazil', lat: -10, lon: -55 },
  { id: 'uae', lat: 24, lon: 54 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ll2xyz(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

function ll2v(lat: number, lon: number, r: number): THREE.Vector3 {
  const [x, y, z] = ll2xyz(lat, lon, r)
  return new THREE.Vector3(x, y, z)
}

// ─── World border lines ───────────────────────────────────────────────────────

function WorldLines() {
  const [obj, setObj] = useState<THREE.LineSegments | null>(null)

  useEffect(() => {
    let mounted = true
    fetch('/world-110m.json')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = feature(data as any, (data as any).objects.countries) as unknown as {
          features: Array<{
            geometry: { type: string; coordinates: number[][][][] | number[][][] }
          }>
        }
        const positions: number[] = []
        for (const f of countries.features) {
          const geom = f.geometry
          if (!geom) continue
          const polys =
            geom.type === 'Polygon'
              ? [geom.coordinates as number[][][]]
              : (geom.coordinates as number[][][][])
          for (const poly of polys) {
            for (const ring of poly) {
              for (let i = 0; i < ring.length - 1; i++) {
                const [lon1, lat1] = ring[i] as [number, number]
                const [lon2, lat2] = ring[i + 1] as [number, number]
                const v1 = ll2v(lat1, lon1, R * 1.001)
                const v2 = ll2v(lat2, lon2, R * 1.001)
                positions.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z)
              }
            }
          }
        }
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
        const mat = new THREE.LineBasicMaterial({
          color: COLORS.primary,
          transparent: true,
          opacity: 0.55,
        })
        setObj(new THREE.LineSegments(geo, mat))
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(
    () => () => {
      obj?.geometry.dispose()
      ;(obj?.material as THREE.Material | undefined)?.dispose()
    },
    [obj]
  )

  return obj ? <primitive object={obj} /> : null
}

// ─── Dot cloud ────────────────────────────────────────────────────────────────

function DotCloud() {
  const geo = useMemo(() => {
    const n = 2700
    const positions = new Float32Array(n * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const rr = Math.sqrt(1 - y * y)
      const theta = golden * i
      positions[i * 3] = rr * Math.cos(theta) * R
      positions[i * 3 + 1] = y * R
      positions[i * 3 + 2] = rr * Math.sin(theta) * R
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])
  return (
    <points geometry={geo}>
      <pointsMaterial
        color={COLORS.primary}
        size={0.007}
        sizeAttenuation
        transparent
        opacity={0.5}
      />
    </points>
  )
}

// ─── Pulsing marker ──────────────────────────────────────────────────────────

interface MarkerProps {
  region: Region
  index: number
  active: boolean
  onHover: () => void
  onHoverOut: () => void
}

function PulsingMarker({ region, index, active, onHover, onHoverOut }: MarkerProps) {
  const ringRef = useRef<THREE.Mesh>(null)
  const lastClick = useRef(0)
  const { camera } = useThree()
  const pos = ll2xyz(region.lat, region.lon, R * 1.018) as [number, number, number]

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    ringRef.current.lookAt(camera.position)
    const t = clock.elapsedTime * 1.4 + index * 0.55
    const pulse = (Math.sin(t) + 1) / 2
    ringRef.current.scale.setScalar(1 + pulse * 0.8)
    ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(
      0.05,
      0.7 - pulse * 0.55
    )
  })

  const { gl } = useThree()

  const handleOver = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    gl.domElement.style.cursor = 'pointer'
    onHover()
  }
  const handleOut = () => {
    if (Date.now() - lastClick.current < 150) return
    gl.domElement.style.cursor = 'auto'
    onHoverOut()
  }
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    lastClick.current = Date.now()
    gl.domElement.style.cursor = 'pointer'
    onHover()
  }

  return (
    <group position={pos}>
      {/* Large transparent hit area — easy to target */}
      <mesh onPointerOver={handleOver} onPointerOut={handleOut} onClick={handleClick}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Visible dot */}
      <mesh>
        <sphereGeometry args={[active ? 0.022 : 0.013, 8, 8]} />
        <meshBasicMaterial color={COLORS.accent} />
      </mesh>
      {/* Pulse ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.022, 0.036, 16]} />
        <meshBasicMaterial
          color={COLORS.accent}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

// ─── Scene ───────────────────────────────────────────────────────────────────

function Scene({
  activeId,
  onHover,
  autoRotate,
}: {
  activeId: string | null
  onHover: (id: string | null) => void
  autoRotate: boolean
}) {
  const { gl } = useThree()
  useEffect(
    () => () => {
      gl.domElement.style.cursor = 'auto'
    },
    [gl]
  )

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enableDamping
        dampingFactor={0.05}
      />
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 48]} />
        <meshBasicMaterial color={COLORS.bg} />
      </mesh>
      <mesh>
        <sphereGeometry args={[R, 28, 16]} />
        <meshBasicMaterial color={COLORS.secondary} wireframe transparent opacity={0.12} />
      </mesh>
      <WorldLines />
      <DotCloud />
      {REGIONS.map((region, i) => (
        <PulsingMarker
          key={region.id}
          region={region}
          index={i}
          active={activeId === region.id}
          onHover={() => onHover(region.id)}
          onHoverOut={() => onHover(null)}
        />
      ))}
    </>
  )
}

// ─── Tooltip (desktop) ───────────────────────────────────────────────────────

function RegionTooltip({
  regionId,
  t,
}: {
  regionId: string | null
  t: ReturnType<typeof useTranslations>
}) {
  const isActive = !!regionId
  const borderColor = isActive
    ? 'color-mix(in srgb, var(--accent) 45%, transparent)'
    : 'color-mix(in srgb, var(--foreground) 18%, transparent)'

  return (
    <div className="w-full px-3" style={{ pointerEvents: 'none' }}>
      {/* Bubble box */}
      <div
        className="relative overflow-hidden border px-4 py-4"
        style={{
          borderColor,
          background: 'var(--background)',
          transition: 'border-color 0.22s ease',
        }}
      >
        {/* Label */}
        <p
          className="mb-2 font-sans font-bold uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--accent)', opacity: 0.7 }}
        >
          {t('fuzziSays')}
        </p>

        {/* Fixed-height content — minHeight fits region info; hint just has extra space below */}
        <div style={{ position: 'relative', minHeight: 96 }}>
          {/* Hint */}
          <p
            className="font-sans text-sm leading-relaxed"
            style={{ opacity: isActive ? 0 : 0.55, transition: 'opacity 0.2s ease' }}
          >
            {t('hint')}
          </p>

          {/* Region info — overlaid, no height impact */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            {regionId && (
              <>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-sans text-xs font-bold tracking-wide uppercase opacity-80">
                    {t(`regions.${regionId}.name`)}
                  </p>
                  <p
                    className="shrink-0 font-serif text-2xl leading-none font-bold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {t(`regions.${regionId}.value`)}
                  </p>
                </div>
                <p className="mt-0.5 font-sans opacity-40" style={{ fontSize: '10px' }}>
                  {t(`regions.${regionId}.sub`)}
                </p>
                <p className="mt-2.5 font-sans text-xs leading-relaxed opacity-60">
                  {t(`regions.${regionId}.insight`)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Speech bubble tail — two triangles: border layer + fill layer */}
      <div style={{ position: 'relative', height: 16, overflow: 'visible' }}>
        {/* Border triangle (outer, slightly larger) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '13px solid transparent',
            borderRight: '13px solid transparent',
            borderTop: `14px solid ${borderColor}`,
            transition: 'border-top-color 0.22s ease',
          }}
        />
        {/* Fill triangle (inner, slightly smaller — cuts out to show background) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '11px solid transparent',
            borderRight: '11px solid transparent',
            borderTop: '12px solid var(--background)',
          }}
        />
      </div>
    </div>
  )
}

// ─── Mobile modal ─────────────────────────────────────────────────────────────

function MobileModal({
  regionId,
  onClose,
  t,
}: {
  regionId: string
  onClose: () => void
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs border px-6 py-5"
        style={{
          background: 'var(--background)',
          borderColor: 'color-mix(in srgb, var(--accent) 40%, transparent)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer opacity-40 transition-opacity hover:opacity-80"
          style={{ color: 'var(--foreground)' }}
        >
          <FiX />
        </button>

        <p
          className="mb-2 font-sans font-bold uppercase"
          style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'var(--accent)', opacity: 0.7 }}
        >
          {t('fuzziSays')}
        </p>
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-sans text-xs font-bold tracking-wide uppercase opacity-80">
            {t(`regions.${regionId}.name`)}
          </p>
          <p
            className="shrink-0 font-serif text-3xl leading-none font-bold"
            style={{ color: 'var(--accent)' }}
          >
            {t(`regions.${regionId}.value`)}
          </p>
        </div>
        <p className="mt-0.5 font-sans opacity-40" style={{ fontSize: '10px' }}>
          {t(`regions.${regionId}.sub`)}
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed opacity-65">
          {t(`regions.${regionId}.insight`)}
        </p>
      </div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function GlobeSection() {
  const t = useTranslations('Globe')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [screenWidth, setScreenWidth] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    setScreenWidth(window.innerWidth)

    let debounce: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(debounce)
      debounce = setTimeout(() => setScreenWidth(window.innerWidth), 150)
    }
    window.addEventListener('resize', onResize)

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionMq.matches) setAutoRotate(false)
    const onMotion = (e: MediaQueryListEvent) => { if (e.matches) setAutoRotate(false) }
    motionMq.addEventListener('change', onMotion)

    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(debounce)
      motionMq.removeEventListener('change', onMotion)
    }
  }, [])

  // screenWidth=0 = not yet mounted → safe default (no panel)
  const showPanel   = screenWidth >= 1440
  const isMobile    = screenWidth === 0 || screenWidth < 768
  const canvasHeight = isMobile ? 280 : showPanel ? 480 : 420

  const handleHover = (id: string | null) => {
    setActiveId(id)
    setAutoRotate(!id)
  }

  return (
    <section className="relative w-full overflow-hidden">
      <Container>
        <div className="relative">
          <BackgroundGrid />

          {/* Header */}
          <div className="relative z-10 px-4 py-8 text-center sm:px-6 sm:py-10 lg:py-12">
            <span
              className="mb-4 inline-block border font-sans font-bold uppercase"
              style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                padding: '4px 12px',
                borderColor: 'color-mix(in srgb, var(--foreground) 20%, transparent)',
                color: 'color-mix(in srgb, var(--foreground) 60%, transparent)',
              }}
            >
              {t('badge')}
            </span>
            <h2 className="text-fluid-h3 font-serif tracking-tighter uppercase">
              {t('heading')} <span className="text-accent italic">{t('headingAccent')}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-sans text-sm opacity-50">{t('sub')}</p>
          </div>

          {/* Canvas + Fuzzi panel */}
          <div
            className="relative z-10 mx-2 mb-4 grid sm:mx-4 sm:mb-5 lg:mx-6 lg:mb-6"
            style={{
              border: '1px solid color-mix(in srgb, var(--foreground) 10%, transparent)',
              gridTemplateColumns: showPanel ? '1.6fr 1fr' : '1fr',
              background: 'color-mix(in srgb, var(--secondary) 10%, var(--background))',
            }}
          >
            {/* Canvas */}
            <div
              style={{
                height: canvasHeight,
                borderRight: showPanel
                  ? '1px solid color-mix(in srgb, var(--foreground) 10%, transparent)'
                  : 'none',
              }}
            >
              <Canvas
                camera={{ position: [0, 0, 3.6], fov: 48 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
              >
                <Suspense fallback={null}>
                  <Scene activeId={activeId} onHover={handleHover} autoRotate={autoRotate} />
                </Suspense>
              </Canvas>
            </div>

            {/* Fuzzi Mark panel — only on ≥1440px */}
            {showPanel && (
              <div
                className="relative flex flex-col items-center justify-end"
                style={{ height: 480 }}
              >
                {/* Tooltip sits directly above Fuzzi */}
                <div className="w-full">
                  <RegionTooltip regionId={activeId} t={t} />
                </div>

                <FuzziMark size={300} />
              </div>
            )}
          </div>

          {/* Sources */}
          <p
            className="relative z-10 pb-4 text-center font-sans opacity-25 sm:pb-6"
            style={{ fontSize: '10px', letterSpacing: '0.05em' }}
          >
            {t('sources')}
          </p>
        </div>
      </Container>

      {/* Modal — shown on all screens without the Fuzzi panel */}
      {!showPanel && activeId && (
        <MobileModal regionId={activeId} onClose={() => handleHover(null)} t={t} />
      )}
    </section>
  )
}
