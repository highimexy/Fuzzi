'use client'

import { FiUsers, FiCopy, FiGift, FiShare2 } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

export default function RecruitPage() {
  const referralLink = 'https://fuzzi.academy/r/user_74583428'

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Coordinates copied to clipboard!')
  }

  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEWA KOLUMNA - LINK */}
          <div className="border-foreground/10 bg-background flex flex-col justify-between border p-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center border border-accent/30 bg-accent/10 text-accent">
                <FiShare2 className="text-xl" />
              </div>
              <h2 className="mb-4 font-serif text-2xl font-bold uppercase">
                Share your deployment code
              </h2>
              <p className="text-foreground/60 mb-8 font-sans text-sm leading-relaxed">
                Send this link to a friend. When they enlist and complete their first 3 lessons, you
                both receive 14 days of Premium access and an exclusive badge.
              </p>
            </div>

            <div>
              <p className="text-foreground/50 mb-2 font-sans text-[10px] font-bold tracking-widest uppercase">
                Your unique link
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="border-foreground/20 bg-foreground/5 flex-1 border px-4 py-3 font-mono text-sm outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 border border-accent bg-accent px-6 py-3 font-sans font-bold text-black uppercase transition-colors hover:bg-accent"
                >
                  <FiCopy /> Copy
                </button>
              </div>
            </div>
          </div>

          {/* PRAWA KOLUMNA - STATSY */}
          <div className="flex flex-col gap-6">
            <div className="border-foreground/10 bg-background flex flex-1 flex-col justify-center border p-8">
              <div className="flex items-center gap-4">
                <FiUsers className="text-foreground/20 text-4xl" />
                <div>
                  <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                    Recruits Enlisted
                  </p>
                  <p className="font-serif text-4xl font-bold">
                    0 <span className="text-foreground/40 text-lg">/ 5</span>
                  </p>
                </div>
              </div>
              <div className="bg-foreground/10 mt-6 h-2 w-full">
                <div className="h-full w-[0%] bg-accent transition-all"></div>
              </div>
              <p className="text-foreground/50 mt-4 font-sans text-xs">
                Recruit 5 more to unlock the 'Commander' medal.
              </p>
            </div>

            <div className="border-foreground/10 bg-background flex flex-1 flex-col justify-center border p-8">
              <div className="flex items-center gap-4">
                <FiGift className="text-4xl text-accent/50" />
                <div>
                  <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                    Premium Earned
                  </p>
                  <p className="font-serif text-4xl font-bold">
                    0 <span className="text-foreground/40 text-lg">Days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
