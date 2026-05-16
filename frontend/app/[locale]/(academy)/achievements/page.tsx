'use client'

import { FiAward, FiLock, FiStar, FiZap, FiTarget, FiShield } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'

const achievements = [
  {
    id: 1,
    title: 'First Blood',
    desc: 'Complete your first lesson.',
    icon: <FiStar />,
    unlocked: true,
  },
  {
    id: 2,
    title: 'Speed Demon',
    desc: 'Finish 5 tasks in under an hour.',
    icon: <FiZap />,
    unlocked: true,
  },
  {
    id: 3,
    title: 'Sharpshooter',
    desc: 'Pass a quiz with 100% accuracy.',
    icon: <FiTarget />,
    unlocked: true,
  },
  {
    id: 4,
    title: 'Iron Wall',
    desc: 'Report 10 valid bugs in QA.',
    icon: <FiShield />,
    unlocked: false,
  },
  { id: 5, title: 'Veteran', desc: 'Reach Level 10.', icon: <FiAward />, unlocked: false },
  {
    id: 6,
    title: 'Commander',
    desc: 'Recruit 5 friends to the Frontier.',
    icon: <FiStar />,
    unlocked: false,
  },
]

export default function AchievementsPage() {
  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex flex-col items-center border p-8 text-center transition-all ${
                ach.unlocked
                  ? 'bg-background border-accent/30 hover:border-accent/60'
                  : 'border-foreground/5 bg-foreground/5 opacity-60 grayscale'
              }`}
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 ${
                  ach.unlocked
                    ? 'border-accent text-accent'
                    : 'border-foreground/20 text-foreground/40'
                }`}
              >
                <span className="text-2xl">{ach.unlocked ? ach.icon : <FiLock />}</span>
              </div>
              <h3 className="mb-2 font-serif text-lg font-bold tracking-wider uppercase">
                {ach.title}
              </h3>
              <p className="text-foreground/60 font-sans text-sm">{ach.desc}</p>

              <div className="border-foreground/10 mt-6 w-full border-t pt-4">
                <span
                  className={`font-sans text-[10px] font-bold tracking-widest uppercase ${
                    ach.unlocked ? 'text-accent' : 'text-foreground/40'
                  }`}
                >
                  {ach.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
