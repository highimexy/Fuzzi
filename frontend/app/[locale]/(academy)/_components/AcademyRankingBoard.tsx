'use client'

import { useState, useEffect } from 'react'
import { FaCrown } from 'react-icons/fa'
import { FiUser } from 'react-icons/fi'
import { useTranslations } from 'next-intl'
import { AcademyBackgroundGrid } from './AcademyBackgroundGrid'
import { fetchRanking, type RankingRow } from '@/lib/profileApi'
import { MorphRing } from './MorphRing'

const MEDAL_COLORS = {
  1: {
    crown: 'text-accent',
    avatar: 'border-accent text-accent shadow-[0_0_15px_rgba(0,0,0,0.08)]',
    platform: 'h-32 sm:h-40 bg-accent/10 border-accent border-t-2 border-l-2 border-r-2',
    name: 'text-accent',
  },
  2: {
    crown: 'text-foreground/60',
    avatar: 'border-foreground/30 text-foreground/60',
    platform: 'h-24 sm:h-28 bg-foreground/10 border-foreground/30 border-t-2 border-l-2 border-r-2',
    name: 'text-foreground/60',
  },
  3: {
    crown: 'text-accent',
    avatar: 'border-accent text-accent',
    platform: 'h-16 sm:h-20 bg-accent/10 border-accent border-t-2 border-l-2 border-r-2',
    name: 'text-accent',
  },
}

function PodiumCard({ user, rank }: { user: RankingRow; rank: 1 | 2 | 3 }) {
  const t = useTranslations('Ranking')
  const colors = MEDAL_COLORS[rank]
  const isFirst = rank === 1

  return (
    <div className="flex flex-col items-center justify-end">
      <div className="flex flex-col items-center">
        <FaCrown
          className={`mb-2 ${colors.crown} transition-transform hover:-translate-y-1 ${isFirst ? 'text-3xl' : 'text-xl'}`}
        />
        <div
          className={`bg-background flex items-center justify-center rounded-full border-2 ${colors.avatar} ${isFirst ? 'h-20 w-20' : 'h-16 w-16'}`}
        >
          <FiUser className={isFirst ? 'text-3xl' : 'text-2xl'} />
        </div>
      </div>

      <div className="mt-4 mb-4 flex flex-col items-center">
        <span
          className={`max-w-25 truncate text-center font-serif font-bold tracking-tight sm:max-w-35 ${isFirst ? 'text-lg' : 'text-base'} ${colors.name}`}
        >
          {user.name || t('anon')}
        </span>
        <span className="text-foreground/60 mt-1 font-sans text-xs font-bold tracking-widest uppercase">
          {user.total_xp} XP
        </span>
      </div>

      <div className={`flex w-28 flex-col items-center justify-start pt-2 sm:w-40 ${colors.platform}`}>
        <span className="text-foreground/80 font-serif text-lg font-black opacity-50">#{rank}</span>
      </div>
    </div>
  )
}

export function AcademyRankingBoard() {
  const t = useTranslations('Ranking')
  const [rows, setRows] = useState<RankingRow[]>([])
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchRanking(limit)
      .then(setRows)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [limit])

  const [first, second, third, ...rest] = rows

  return (
    <div className="bg-background text-foreground flex w-full flex-1 items-stretch justify-center font-sans">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-12 sm:px-8 xl:max-w-5xl">
        <div className="mb-12 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl font-black tracking-tighter uppercase sm:text-5xl">
            {t('title')}
          </h1>
          <p className="text-foreground/50 mt-2 font-sans text-xs font-bold tracking-[0.2em] uppercase">
            {t('subtitle')}
          </p>
        </div>

        {loading && <MorphRing size="lg" label={t('loading')} className="mb-8" />}

        {!loading && rows.length === 0 && (
          <p className="text-foreground/30 mb-8 text-sm">{t('empty')}</p>
        )}

        {!loading && rows.length > 0 && (
          <div className="flex w-full flex-col items-center gap-16">
            <div className="border-foreground/10 flex w-full max-w-2xl items-end justify-center gap-2 border-b pb-0 sm:gap-4">
              {second && <PodiumCard user={second} rank={2} />}
              {first  && <PodiumCard user={first}  rank={1} />}
              {third  && <PodiumCard user={third}  rank={3} />}
            </div>

            {rest.length > 0 && (
              <div className="flex w-full max-w-2xl flex-col gap-3">
                {rest.map((user, i) => (
                  <div
                    key={user.auth0_id}
                    className="border-foreground/10 bg-background hover:border-foreground/30 hover:bg-foreground/5 group flex items-center gap-4 border p-4 transition-all"
                  >
                    <div className="text-foreground/40 group-hover:text-foreground w-8 text-center font-serif text-xl font-black transition-colors">
                      {i + 4}
                    </div>
                    <div className="border-foreground/20 bg-foreground/5 group-hover:border-foreground/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors">
                      <FiUser className="text-foreground/50 text-base" />
                    </div>
                    <span className="flex-1 truncate font-serif text-lg font-bold">
                      {user.name || t('anon')}
                    </span>
                    <div className="flex flex-col items-end text-right">
                      <span className="font-sans text-sm font-bold tracking-widest text-accent">
                        {user.total_xp} XP
                      </span>
                      <span className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                        {user.lessons_solved} {t('lessons')}
                      </span>
                    </div>
                  </div>
                ))}

                {rest.length >= 7 && (
                  <button
                    onClick={() => setLimit((l) => l + 10)}
                    className="text-foreground/80 hover:text-foreground border border-transparent font-sans text-xs font-bold uppercase transition-all"
                  >
                    {t('loadMore')}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>
    </div>
  )
}
