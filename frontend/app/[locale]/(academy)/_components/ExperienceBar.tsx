'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useUserStore, levelFromXP } from '@/store/userStore'

export function ExperienceBar() {
  const totalXP = useUserStore((s) => s.totalXP)
  const user = useUserStore((s) => s.user)
  const [showPopover, setShowPopover] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const { level, xpInLevel, xpToNext, title, progress } = levelFromXP(totalXP)
  const displayName = user?.name || user?.email?.split('@')[0] || title

  useGSAP(() => {
    if (barRef.current) {
      gsap.to(barRef.current, {
        width: `${progress * 100}%`,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }, [progress])

  useGSAP(() => {
    if (showPopover) {
      gsap.fromTo(
        popoverRef.current,
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      )
    }
  }, [showPopover])

  return (
    <div className="flex items-center" ref={containerRef}>
      <div className="hidden flex-col pl-2 lg:flex">
        <p className="font-serif leading-none">{displayName}</p>
        <p className="text-foreground/80 font-sans text-[10px] tracking-widest uppercase">
          Level {level} · {title}
        </p>
      </div>

      <div
        className="relative ml-3 hidden h-5 w-32 cursor-help items-center lg:flex"
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        <div className="border-foreground/20 h-full w-full rounded-md border p-1">
          <div className="bg-foreground/10 h-full w-full overflow-hidden rounded-xs">
            <div
              ref={barRef}
              className="h-full rounded-xs bg-primary shadow-[0_0_10px_rgba(0,0,0,0.12)]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
        {showPopover && (
          <div
            ref={popoverRef}
            className="bg-background border-foreground/10 absolute top-full left-0 z-9999 mt-2 w-36 border p-2"
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-sans font-bold tracking-tighter uppercase">
                <span className="text-right text-primary">
                  {xpInLevel} <span className="text-foreground">/</span> {xpToNext}
                </span>
                <span>XP</span>
              </div>
              <p className="text-foreground/50 font-sans text-[9px] tracking-widest uppercase">
                {totalXP} total xp
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
