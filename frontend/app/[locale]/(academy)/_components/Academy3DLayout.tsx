'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Canvas } from '@react-three/fiber'
import { Html, Grid, ContactShadows, PresentationControls } from '@react-three/drei'
import { MorphRing } from './MorphRing'

const COLORS = {
  bg: '#1a202c',
  secondary: '#576966',
  primary: '#89937e',
  accent: '#fde047',
}

function DynamicBoard({ setPortalTarget }: { setPortalTarget: (el: HTMLElement | null) => void }) {
  const [dimensions, setDimensions] = useState({ w: 100, h: 600 })
  const portalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      const sidebarWidth = window.innerWidth >= 1024 ? 160 : 0
      const w = window.innerWidth - sidebarWidth - 48
      const h = window.innerHeight - 64 - 48
      setDimensions({ w, h })
    }

    handleResize()

    // Czekamy jedną ramkę, żeby drei Html zdążył zamontować swoje dzieci,
    // a React zakomitował zaktualizowane wymiary — wtedy dopiero pokazujemy treść.
    const raf = requestAnimationFrame(() => {
      if (portalRef.current) {
        setPortalTarget(portalRef.current)
      }
    })

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(raf)
      setPortalTarget(null)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const scale = 0.0038
  const width3D = dimensions.w * scale
  const height3D = dimensions.h * scale

  const portal = 0.15

  return (
    <group position={[0, 0, 0]} rotation={[-0.02, 0, 0]}>
      {/* PLECY */}
      <mesh castShadow position={[0, 0, -0.05]}>
        <boxGeometry args={[width3D + 0.1, height3D + 0.1, 0.05]} />
        <meshStandardMaterial color="#4a5568" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* RAMKA */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width3D + 0.12, height3D + 0.12, 0.02]} />
        <meshStandardMaterial color="#a0aec0" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* EKRAN HTML Z MIEJSCEM NA PORTAL */}
      <Html transform position={[0, 0, 0.01]} scale={portal} className="pointer-events-auto">
        <div
          style={{ width: `${dimensions.w}px`, height: `${dimensions.h}px` }}
          className="bg-background text-foreground border-foreground/20 flex flex-col overflow-hidden rounded-lg border shadow-[0_0_50px_rgba(0,0,0,0.6)]"
        >
          {/* Top Bar Ekranu */}
          <div className="bg-foreground/5 border-foreground/10 sticky top-0 z-50 flex h-8 shrink-0 items-center border-b px-4 backdrop-blur-md">
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.accent }} />
              <div
                className="h-2 w-2 rounded-full opacity-50"
                style={{ backgroundColor: COLORS.primary }}
              />
            </div>
            <span className="text-foreground/40 ml-4 font-mono text-[9px] tracking-[0.2em] uppercase">
              Sys.Node // Academy UI
            </span>
          </div>

          <div
            ref={portalRef}
            className="custom-scrollbar relative flex w-full flex-1 flex-col overflow-y-auto"
          />
        </div>
      </Html>
    </group>
  )
}

export default function Academy3DLayout({ children }: { children: React.ReactNode }) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

  return (
    <div className="absolute inset-0 h-full w-full" style={{ backgroundColor: COLORS.bg }}>
      {/* Loading — znika gdy DynamicBoard zamontuje div portalu */}
      {!portalTarget && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <MorphRing size="xl" variant="accent" label="Boot sequence..." />
        </div>
      )}

      {portalTarget &&
        createPortal(
          <div className="relative flex min-h-max w-full flex-1 flex-col p-6 md:p-10">
            {children}
          </div>,
          portalTarget
        )}

      {/* WARSTWA 2: SCENA 3D */}
      <Canvas shadows camera={{ position: [0, 0, 5.2], fov: 50 }}>
        <color attach="background" args={[COLORS.bg]} />
        <fog attach="fog" args={[COLORS.bg, 3, 12]} />

        <ambientLight intensity={1.5} color="#ffffff" />

        <directionalLight
          position={[5, 10, 5]}
          intensity={2.5}
          castShadow
          color="#ffffff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <pointLight position={[0, -2.5, 3]} intensity={3} color={COLORS.primary} />

        <spotLight
          position={[-5, 0, 4]}
          angle={0.5}
          penumbra={0.5}
          intensity={2}
          color={COLORS.accent}
        />

        <PresentationControls
          global
          config={{ mass: 1, tension: 120, friction: 20 }}
          polar={[-0.02, 0.02]}
          azimuth={[-0.05, 0.05]}
        >
          <DynamicBoard setPortalTarget={setPortalTarget} />
        </PresentationControls>

        <Grid
          position={[0, -2.5, 0]}
          args={[50, 50]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={COLORS.secondary}
          sectionSize={2.5}
          sectionThickness={1}
          sectionColor={COLORS.primary}
          fadeDistance={25}
          fadeStrength={1.5}
        />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.9}
          scale={15}
          blur={2}
          far={5}
          color="#000000"
        />
      </Canvas>
    </div>
  )
}
