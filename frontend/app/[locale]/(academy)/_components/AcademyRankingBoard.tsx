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

// Zmienione wysokości i dodane twardsze bordery, żeby platformy wyglądały solidnie
const MEDAL_COLORS = {
  1: {
    crown: 'text-yellow-500',
    avatar: 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    platform: 'h-32 sm:h-40 bg-yellow-500/10 border-yellow-500 border-t-2 border-l-2 border-r-2',
    name: 'text-yellow-500',
  },
  2: {
    crown: 'text-zinc-400',
    avatar: 'border-zinc-400 text-zinc-400',
    platform: 'h-24 sm:h-28 bg-zinc-400/10 border-zinc-400 border-t-2 border-l-2 border-r-2',
    name: 'text-zinc-400',
  },
  3: {
    crown: 'text-amber-700',
    avatar: 'border-amber-700 text-amber-700',
    platform: 'h-16 sm:h-20 bg-amber-700/10 border-amber-700 border-t-2 border-l-2 border-r-2',
    name: 'text-amber-700',
  },
}

function PodiumCard({ user, rank }: { user: (typeof RANKING_DATA)[0]; rank: 1 | 2 | 3 }) {
  const colors = MEDAL_COLORS[rank]
  const isFirst = rank === 1

  return (
    <div className="flex flex-col items-center justify-end">
      {/* Crown + Avatar */}
      <div className="flex flex-col items-center">
        <FaCrown
          className={`mb-2 ${colors.crown} transition-transform hover:-translate-y-1 ${
            isFirst ? 'text-3xl' : 'text-xl'
          }`}
        />
        <div
          className={`bg-background flex items-center justify-center rounded-full border-2 ${colors.avatar} ${
            isFirst ? 'h-20 w-20' : 'h-16 w-16'
          }`}
        >
          <FiUser className={isFirst ? 'text-3xl' : 'text-2xl'} />
        </div>
      </div>

      {/* Name + Score */}
      <div className="mt-4 mb-4 flex flex-col items-center">
        {/* Zwiększone max-w dla szerszych kolumn */}
        <span
          className={`max-w-25 truncate text-center font-serif font-bold tracking-tight sm:max-w-35 ${
            isFirst ? 'text-lg' : 'text-base'
          } ${colors.name}`}
        >
          {user.name}
        </span>
        <span className="text-foreground/60 mt-1 font-sans text-xs font-bold tracking-widest uppercase">
          {user.score} XP
        </span>
      </div>

      {/* Platform step */}
      <div
        className={`flex w-28 flex-col items-center justify-start pt-2 sm:w-40 ${colors.platform}`}
      >
        <span className="text-foreground/80 font-serif text-lg font-black opacity-50">#{rank}</span>
      </div>
    </div>
  )
}

export function AcademyRankingBoard() {
  const [first, second, third, ...rest] = RANKING_DATA

  return (
    <div className="bg-background text-foreground flex w-full flex-1 items-stretch justify-center font-sans">
      {/* LEWA SIATKA */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* ŚRODKOWY KONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-12 sm:px-8 xl:max-w-5xl">
        {/* WIDOCZNY NAGŁÓWEK */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl font-black tracking-tighter uppercase sm:text-5xl">
            Leaderboard
          </h1>
          <p className="text-foreground/50 mt-2 font-sans text-xs font-bold tracking-[0.2em] uppercase">
            Top rated players this season
          </p>
        </div>

        {/* UKŁAD PIONOWY: Najpierw Podium na całą szerokość, potem Lista */}
        <div className="flex w-full flex-col items-center gap-16">
          {/* PODIUM (TOP 3) - Wycentrowane */}
          <div className="border-foreground/10 flex w-full max-w-2xl items-end justify-center gap-2 border-b pb-0 sm:gap-4">
            {/* 2nd */}
            <PodiumCard user={second} rank={2} />
            {/* 1st */}
            <PodiumCard user={first} rank={1} />
            {/* 3rd */}
            <PodiumCard user={third} rank={3} />
          </div>

          {/* LISTA (4–10) - Wycentrowana pod podium */}
          <div className="flex w-full max-w-2xl flex-col gap-3">
            {rest.map((user) => (
              <div
                key={user.id}
                className="border-foreground/10 bg-background hover:border-foreground/30 hover:bg-foreground/5 group flex items-center gap-4 border p-4 transition-all"
              >
                {/* Rank badge */}
                <div className="text-foreground/40 group-hover:text-foreground w-8 text-center font-serif text-xl font-black transition-colors">
                  {user.id}
                </div>

                {/* Avatar */}
                <div className="border-foreground/20 bg-foreground/5 group-hover:border-foreground/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors">
                  <FiUser className="text-foreground/50 text-base" />
                </div>

                {/* Name */}
                <span className="flex-1 truncate font-serif text-lg font-bold">{user.name}</span>

                {/* Stats */}
                <div className="flex flex-col items-end text-right">
                  <span className="font-sans text-sm font-bold tracking-widest text-yellow-500">
                    {user.score} XP
                  </span>
                  <span className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                    {user.attended} lessons
                  </span>
                </div>
              </div>
            ))}

            {rest.length >= 7 && (
              <button className="text-foreground/80 hover:text-foreground border border-transparent font-sans text-xs font-bold uppercase transition-all">
                Load More Recruits
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
