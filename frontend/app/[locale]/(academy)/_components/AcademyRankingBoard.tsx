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

const MEDAL_COLORS = {
  1: {
    crown: 'text-yellow-500',
    avatar: 'ring-yellow-500 text-yellow-500',
    platform: 'h-20 bg-yellow-500/10 border-yellow-500/30',
    name: 'text-yellow-500',
  },
  2: {
    crown: 'text-zinc-400',
    avatar: 'ring-zinc-400 text-zinc-400',
    platform: 'h-14 bg-zinc-400/10 border-zinc-400/30',
    name: 'text-zinc-400',
  },
  3: {
    crown: 'text-amber-700',
    avatar: 'ring-amber-700 text-amber-700',
    platform: 'h-10 bg-amber-700/10 border-amber-700/30',
    name: 'text-amber-700',
  },
}

function PodiumCard({ user, rank }: { user: (typeof RANKING_DATA)[0]; rank: 1 | 2 | 3 }) {
  const colors = MEDAL_COLORS[rank]
  const isFirst = rank === 1

  return (
    <div className="flex flex-col items-center">
      {/* Crown + Avatar */}
      <div className={`flex flex-col items-center ${isFirst ? 'mb-0' : 'mt-8'}`}>
        <FaCrown className={`mb-2 ${colors.crown} ${isFirst ? 'text-3xl' : 'text-xl'}`} />
        <div
          className={`flex items-center justify-center rounded-full ring-2 ${colors.avatar} ${
            isFirst ? 'h-16 w-16' : 'h-12 w-12'
          }`}
        >
          <FiUser className={isFirst ? 'text-2xl' : 'text-xl'} />
        </div>
      </div>

      {/* Name + Score */}
      <div className="mt-3 flex flex-col items-center">
        <span
          className={`max-w-20 truncate text-center font-bold sm:max-w-25 ${
            isFirst ? 'text-sm' : 'text-xs'
          } ${colors.name}`}
        >
          {user.name}
        </span>
        <span className="text-foreground/50 text-xs">{user.score}</span>
      </div>

      {/* Platform step */}
      <div
        className={`mt-3 flex w-20 items-center justify-center border-t sm:w-24 ${colors.platform}`}
      >
        <span className="text-foreground/30 text-xs font-bold"># {rank}</span>
      </div>
    </div>
  )
}

export function AcademyRankingBoard() {
  const [first, second, third, ...rest] = RANKING_DATA

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-4 py-12 sm:px-8 xl:max-w-5xl">
        {/* UKRYTY NAGŁÓWEK I OPIS DLA SEO / CZYTNIKÓW EKRANOWYCH */}
        <h1 className="sr-only">Leaderboard</h1>
        <p className="sr-only">Top rated players this season</p>

        {/* PODIUM + LIST — side by side on md+ */}
        <div className="flex w-full flex-col gap-10 md:flex-row md:items-start md:gap-12">
          {/* PODIUM (TOP 3) */}
          <div className="flex flex-col items-center md:w-72 md:shrink-0">
            <div className="border-foreground/10 flex w-full items-end justify-center gap-2 border-b pb-0 sm:gap-4">
              {/* 2nd */}
              <PodiumCard user={second} rank={2} />
              {/* 1st */}
              <PodiumCard user={first} rank={1} />
              {/* 3rd */}
              <PodiumCard user={third} rank={3} />
            </div>
          </div>

          {/* LIST (4–10) */}
          <div className="flex flex-1 flex-col gap-2">
            {rest.map((user) => (
              <div
                key={user.id}
                className="border-foreground/10 hover:bg-foreground/5 flex items-center gap-3 border p-3 px-4 transition-colors"
              >
                {/* Rank badge */}
                <div className="text-foreground/30 w-5 text-center font-bold tabular-nums">
                  {user.id}
                </div>

                {/* Avatar */}
                <div className="border-foreground/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                  <FiUser className="text-foreground/40 text-sm" />
                </div>

                {/* Name */}
                <span className="flex-1 truncate font-bold">{user.name}</span>

                {/* Stats */}
                <div className="flex flex-col items-end text-right">
                  <span className="font-bold tabular-nums">{user.score}</span>
                  <span className="text-foreground/40 text-xs tabular-nums">
                    {user.attended} contests
                  </span>
                </div>
              </div>
            ))}

            {rest.length >= 7 && (
              <button className="text-foreground/50 hover:text-foreground mt-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80">
                Show More
              </button>
            )}
          </div>
        </div>
      </div>

      {/* PRAWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
