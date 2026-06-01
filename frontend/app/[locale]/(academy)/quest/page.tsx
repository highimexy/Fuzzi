'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { DailyQuestCard } from './_components/DailyQuestCard'
import { StatsBar } from './_components/StatsBar'
import { MorphRing } from '../_components/MorphRing'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { fetchDailyQuest, fetchQuestResult } from '@/lib/questApi'
import { useUserStore } from '@/store/userStore'
import type { Quest, QuestResult } from '@/types/quest'

export default function QuestPage() {
  const t = useTranslations('Quest')
  const params = useParams()
  const locale = (params?.locale as string) ?? 'en'

  const isLoggedIn = useUserStore((s) => s.isLoggedIn)
  const totalXP = useUserStore((s) => s.totalXP)
  const currentStreak = useUserStore((s) => s.currentStreak)
  const totalCorrect = useUserStore((s) => s.totalCorrect)
  const totalAttempts = useUserStore((s) => s.totalAttempts)

  const [dailyQuests, setDailyQuests] = useState<Quest[]>([])
  const [dailyResults, setDailyResults] = useState<Record<string, QuestResult | null>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(false)
      try {
        const quests = await fetchDailyQuest()
        setDailyQuests(quests)

        if (isLoggedIn) {
          const resultData = await Promise.all(
            quests.map((q) => fetchQuestResult(q.id).catch(() => null))
          )
          const map: Record<string, QuestResult | null> = {}
          quests.forEach((q, i) => { map[q.id] = resultData[i] as QuestResult | null })
          setDailyResults(map)
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isLoggedIn])

  const stats = isLoggedIn
    ? {
        user_id: '',
        total_xp: totalXP,
        current_streak: currentStreak,
        longest_streak: 0,
        last_active_date: '',
        total_correct: totalCorrect,
        total_attempts: totalAttempts,
      }
    : null

  const today = new Date().toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  if (loading) return (
    <div className="flex h-full min-h-52 w-full flex-1 items-center justify-center">
      <MorphRing size="lg" />
    </div>
  )

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center font-sans text-sm text-foreground/40">
        {t('errorLabel')}
      </div>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Header */}
      <div className="border-foreground/10 border-b px-8 py-8 lg:px-16">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-primary mb-2 font-sans text-[9px] tracking-[0.3em] uppercase">{today}</p>
            <h1 className="font-serif text-4xl font-bold leading-[0.88] tracking-tighter uppercase lg:text-5xl">
              {t('dailyChallenge')}
            </h1>
          </div>
          <StatsBar stats={stats} />
        </div>
      </div>

      {/* Cards — vertically centered, grid only in content area */}
      <div className="relative flex flex-1 items-center px-8 py-8 lg:px-16">
        <AcademyBackgroundGrid />
        <div className="relative grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dailyQuests.map((quest) => (
            <DailyQuestCard
              key={quest.id}
              quest={quest}
              locale={locale}
              initialResult={dailyResults[quest.id]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
