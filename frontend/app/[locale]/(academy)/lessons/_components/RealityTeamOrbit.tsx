'use client'

import { useEffect, useRef } from 'react'
import { FuzziMark } from '../../../global-components/logo/page'

const CX = 130
const CY = 130
const TEAM = [
  { rad: 90, speed: 0.0021, size: 34, ang: 0 },
  { rad: 90, speed: 0.0021, size: 34, ang: (Math.PI * 2) / 3 },
  { rad: 90, speed: 0.0021, size: 34, ang: (Math.PI * 4) / 3 },
  { rad: 114, speed: 0.0015, size: 28, ang: Math.PI / 2 },
  { rad: 114, speed: 0.0015, size: 28, ang: Math.PI * 1.5 },
]

export function RealityTeamOrbit({ active }: { active: boolean }) {
  const fieldRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const orbRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const angs = TEAM.map((m) => m.ang)

    const paint = () => {
      TEAM.forEach((m, i) => {
        const ang = angs[i] ?? 0
        const x = CX + Math.cos(ang) * m.rad
        const y = CY + Math.sin(ang) * m.rad
        const orb = orbRefs.current[i] ?? null
        const ln = lineRefs.current[i] ?? null
        if (orb) orb.style.transform = `translate(${x - m.size / 2}px,${y - m.size / 2}px)`
        if (ln) {
          ln.setAttribute('x2', String(x))
          ln.setAttribute('y2', String(y))
        }
      })
    }

    if (reduce) {
      paint()
      return
    }

    let raf = 0
    let mul = 1
    function loop() {
      const target = activeRef.current ? 1.5 : 1
      mul += (target - mul) * 0.06
      TEAM.forEach((m, i) => {
        angs[i] = (angs[i] ?? 0) + m.speed * mul
      })
      paint()
      lineRefs.current.forEach((ln) => {
        if (!ln) return
        ln.style.opacity = activeRef.current ? '0.5' : '0.25'
        ln.style.strokeWidth = activeRef.current ? '1.4' : '1'
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div ref={fieldRef} style={{ position: 'relative', width: 260, height: 260 }}>
        <svg
          ref={svgRef}
          viewBox="0 0 260 260"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          {TEAM.map((_, i) => (
            <line
              key={i}
              ref={(el) => { lineRefs.current[i] = el }}
              x1={CX}
              y1={CY}
              stroke="var(--secondary)"
              strokeWidth={1}
              opacity={0.25}
            />
          ))}
        </svg>

        <div style={{ position: 'absolute', left: '50%', top: '50%', width: 72, height: 72, margin: -36, zIndex: 3 }}>
          <FuzziMark size={72} />
        </div>

        {TEAM.map((m, i) => (
          <div
            key={i}
            ref={(el) => { orbRefs.current[i] = el }}
            style={{ position: 'absolute', left: 0, top: 0, width: m.size, height: m.size, zIndex: 2 }}
          >
            <FuzziMark size={m.size} />
          </div>
        ))}
      </div>
    </div>
  )
}
