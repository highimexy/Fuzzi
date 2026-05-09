'use client'

import { FaCrown } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'

import { AcademyBackgroundGrid } from './AcademyBackgroundGrid'

const RANKING_DATA = [
  { id: 1, name: 'Miruu', score: 3702, attended: 150 },
  { id: 2, name: 'Neal Wu', score: 3686, attended: 142 },
  { id: 3, name: 'Yawn_Sean', score: 3644, attended: 138 },
  { id: 4, name: '小羊肖恩', score: 3611, attended: 107 },
  { id: 5, name: '何逊', score: 3599, attended: 146 },
  { id: 6, name: 'Joshua Chen', score: 3589, attended: 100 },
  { id: 7, name: 'Rohin Garg', score: 3506, attended: 88 },
  { id: 8, name: 'SSerxhs', score: 3499, attended: 61 },
  { id: 9, name: '小咩肖恩', score: 3490, attended: 50 },
  { id: 10, name: 'fmota', score: 3453, attended: 65 },
]

export function AcademyRankingBoard() {
  const first = RANKING_DATA[0]
  const second = RANKING_DATA[1]
  const third = RANKING_DATA[2]
  const rest = RANKING_DATA.slice(3)

  return (
    // Używamy IDEALNIE tego samego głównego wrappera co w DiscussBoard
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* === LEWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* === ŚRODKOWY KONTENT === */}
      <div className="lg-py-8 relative z-10 flex w-full max-w-4xl flex-col items-center justify-center p-8 xl:max-w-5xl">
        <div className="flex w-full flex-col items-center gap-10 lg:gap-16">
          {/* LEWA KOLUMNA: PODIUM (TOP 3) */}
          <div className="flex w-full justify-center gap-3 sm:gap-6">
            {/* 2. MIEJSCE */}
            {second && (
              <div className="flex w-24 flex-col items-center sm:w-32">
                <FaCrown className="mb-2 text-2xl text-zinc-400 sm:text-3xl" />
                <div className="border-foreground/10 flex h-16 w-16 items-center justify-center">
                  <FiUser className="text-4xl text-zinc-400" />
                </div>
                <div className="border-foreground/10 mt-3 flex w-full flex-col items-center rounded-xl border p-3">
                  <span className="truncate font-bold">{second.name}</span>
                  <span className="text-zinc-400">{second.score}</span>
                </div>
              </div>
            )}

            {/* 1. MIEJSCE */}
            {first && (
              <div className="flex flex-col items-center">
                <FaCrown className="mb-2 text-4xl text-yellow-500" />
                <div className="border-foreground/10 flex h-20 w-20 items-center justify-center">
                  <FiUser className="text-4xl text-yellow-500" />
                </div>
                <div className="border-foreground/10 mt-3 flex w-full flex-col items-center rounded-xl border p-4">
                  <span className="truncate font-bold">{first.name}</span>
                  <span className="text-zinc-400">{first.score}</span>
                </div>
              </div>
            )}

            {/* 3. MIEJSCE */}
            {third && (
              <div className="flex w-24 flex-col items-center">
                <FaCrown className="mb-2 text-2xl text-amber-700" />
                <div className="border-foreground/10 flex h-16 w-16 items-center justify-center">
                  <FiUser className="text-3xl text-amber-700" />
                </div>
                <div className="border-foreground/10 mt-3 flex w-full flex-col items-center rounded-xl border p-3">
                  <span className="truncate font-bold">{third.name}</span>
                  <span className="text-zinc-400">{third.score}</span>
                </div>
              </div>
            )}
          </div>

          {/* PRAWA KOLUMNA: LISTA (4+) */}
          <div className="flex w-full max-w-md flex-col gap-2">
            {rest.map((user) => (
              <div
                key={user.id}
                className="border-foreground/10 flex items-center gap-3 rounded-xl border p-3 sm:p-3 sm:px-4"
              >
                <div className="bg-foreground/10 flex h-7 w-7 items-center justify-center rounded-full p-2 font-bold">
                  {user.id}
                </div>
                <div className="bg-foreground/10 flex h-7 w-7 items-center justify-center rounded-full">
                  <FiUser className="text-foreground/50 text-2xl" />
                </div>
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <span className="truncate font-bold">{user.name}</span>
                </div>
                <div className="flex flex-col text-right">
                  <div className="text-zinc-400">
                    Rating: <span className="font-bold">{user.score}</span>
                  </div>
                  <div className="text-zinc-400">Attended: {user.attended}</div>
                </div>
              </div>
            ))}
            {rest.length >= 7 && (
              <button className="mt-2 font-bold uppercase transition-opacity hover:opacity-80">
                Show More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* === PRAWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
