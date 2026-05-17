'use client'

import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function ExperienceBar() {
  const [showPopover, setShowPopover] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Animacja popovera przy hoverze
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
      {/* Tekst Levelu */}
      <div className="hidden flex-col pl-2 lg:flex">
        <p className="font-serif leading-none">No Role</p>
        <p className="text-foreground/80 font-sans text-[10px] tracking-widest uppercase">
          Level 1
        </p>
      </div>

      {/* Pasek Exp */}
      <div
        className="relative ml-3 hidden h-5 w-32 cursor-help items-center lg:flex"
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        <div className="border-foreground/20 h-full w-full rounded-md border p-1">
          <div className="bg-foreground/10 h-full w-full overflow-hidden rounded-xs">
            <div
              ref={barRef}
              className="h-full w-10 rounded-xs bg-primary shadow-[0_0_10px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>
        {showPopover && (
          <div
            ref={popoverRef}
            className="bg-background border-foreground/10 absolute top-full left-0 z-9999 mt-2 w-32 border p-2"
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between font-sans font-bold tracking-tighter uppercase">
                <span className="text-right text-primary">
                  350 <span className="text-foreground">/</span> 1000
                </span>
                <span>XP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
