'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { DailyQuestCard } from './_components/DailyQuestCard'
import { StatsBar } from './_components/StatsBar'
import { MorphRing } from '../_components/MorphRing'
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
      <div className="flex h-64 items-center justify-center font-mono text-sm text-foreground/50">
        {t('errorLabel')}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">{t('dailyChallenge')}</h1>
          <p className="font-mono text-xs text-foreground/40 mt-0.5">{today}</p>
        </div>
        <StatsBar stats={stats} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
  )
}
