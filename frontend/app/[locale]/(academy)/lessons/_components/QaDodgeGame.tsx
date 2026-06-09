'use client'

import { useEffect, useRef } from 'react'
import { FuzziMark } from '../../../global-components/logo/page'

const ERROR_COLOR = 'var(--error)'
const ERRORS = [
  '404',
  'BUG',
  'TypeError',
  'null',
  'NaN',
  'undefined',
  '500',
  'race-cond',
  'flaky',
  'timeout',
]
const LANES = [0.22, 0.5, 0.78]
const FW = 100

type Err = { el: HTMLDivElement; lane: number; x: number; y: number; vy: number }

export function QaDodgeGame({
  active,
  headerRef,
}: {
  active: boolean
  headerRef?: React.RefObject<HTMLDivElement | null>
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!stageRef.current || !playerRef.current) return
    const stage = stageRef.current as HTMLDivElement
    const player = playerRef.current as HTMLDivElement

    const laneX = (i: number) => (stage.clientWidth || 300) * (LANES[i] ?? 0.5)
    let curLane = 1
    let px = laneX(1)
    let targetX = px
    const errors: Err[] = []
    let lastLane = -1

    if (reduce) {
      player.style.transform = `translateX(${laneX(1)}px)`
      return
    }

    const headerBottom = () => {
      const h = headerRef?.current?.getBoundingClientRect()
      const s = stage.getBoundingClientRect()
      return h ? h.bottom - s.top + 14 : 80
    }

    function spawn() {
      let lane
      do {
        lane = Math.floor(Math.random() * 3)
      } while (lane === lastLane)
      lastLane = lane

      const el = document.createElement('div')
      el.textContent = ERRORS[Math.floor(Math.random() * ERRORS.length)] ?? ''
      el.style.cssText = [
        'position:absolute;left:0;top:0;font-family:var(--font-mono,monospace);font-size:11px;font-weight:500',
        'padding:2px 6px;border-radius:4px;white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .25s',
        `color:${ERROR_COLOR}`,
        `background:color-mix(in srgb, ${ERROR_COLOR} 12%, transparent)`,
        `border:1px solid color-mix(in srgb, ${ERROR_COLOR} 40%, transparent)`,
        'transform:translate(-50%,0)',
      ].join(';')
      const x = laneX(lane)
      const startY = headerBottom()
      el.style.transform = `translate(${x}px,${startY}px) translateX(-50%)`
      stage.appendChild(el)
      requestAnimationFrame(() => (el.style.opacity = '1'))
      errors.push({ el, lane, x, y: startY, vy: activeRef.current ? 1.5 : 1.0 })
    }

    function chooseLane() {
      const sh = stage.clientHeight || 440
      const floor = sh - 14 - FW
      const danger: number[] = [Infinity, Infinity, Infinity]
      for (const o of errors) {
        const gap = floor - o.y
        if (gap > -40) danger[o.lane] = Math.min(danger[o.lane] ?? Infinity, gap)
      }
      const TH = 260
      if ((danger[curLane] ?? Infinity) > TH) return
      const safe = [0, 1, 2].filter((l) => (danger[l] ?? 0) > TH)
      if (safe.length) {
        safe.sort((a, b) => Math.abs(a - curLane) - Math.abs(b - curLane))
        curLane = safe[0] ?? 1
      } else {
        curLane = danger.indexOf(Math.max(...danger))
      }
    }

    let raf = 0
    let spawnTimer = 0
    function scheduleSpawn() {
      spawnTimer = window.setTimeout(
        () => {
          spawn()
          scheduleSpawn()
        },
        activeRef.current ? 620 : 1050
      )
    }

    function loop() {
      chooseLane()
      targetX = laneX(curLane)
      px += (targetX - px) * 0.22
      player.style.transform = `translateX(${px}px)`
      const sh = stage.clientHeight || 440
      for (let i = errors.length - 1; i >= 0; i--) {
        const o = errors[i]
        if (!o) continue
        o.vy = activeRef.current ? 1.5 : 1.0
        o.y += o.vy
        o.el.style.transform = `translate(${o.x}px,${o.y}px) translateX(-50%)`
        if (o.y > sh + 10) {
          o.el.remove()
          errors.splice(i, 1)
        }
      }
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(() => {
      targetX = laneX(curLane)
    })
    ro.observe(stage)

    player.style.transform = `translateX(${px}px)`
    scheduleSpawn()
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(spawnTimer)
      ro.disconnect()
      errors.forEach((o) => o.el.remove())
    }
  }, [])

  return (
    <div ref={stageRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={playerRef}
        style={{ position: 'absolute', bottom: 14, width: FW, height: FW, marginLeft: -FW / 2 }}
      >
        <FuzziMark size={FW} />
      </div>
    </div>
  )
}
