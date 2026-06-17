'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { DailyQuestCard } from './_components/DailyQuestCard'
import { MorphRing } from '../_components/MorphRing'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { fetchDailyQuest, fetchQuestResult } from '@/lib/questApi'
import { useUserStore } from '@/store/userStore'
import type { Quest, QuestResult } from '@/types/quest'

export default function QuestPage() {
  const t = useTranslations('Quest')
  const tAcademy = useTranslations('Academy.quest')
  const params = useParams()
  const locale = (params?.locale as string) ?? 'en'

  const isLoggedIn = useUserStore((s) => s.isLoggedIn)

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
    <div className="relative flex w-full min-h-full flex-col overflow-hidden">
      <AcademyBackgroundGrid />
      <div className="relative z-10 shrink-0 px-4 py-8 lg:px-8 lg:py-10">
        <h1 className="font-serif text-3xl font-black uppercase tracking-tight lg:text-4xl">
          {t('dailyChallenge')}
        </h1>
        <p className="text-foreground/45 mt-2 font-sans text-sm">
          {tAcademy('subtitle')}
          {!isLoggedIn && ` · ${tAcademy('loginHint')}`}
        </p>
      </div>

      <div className="relative z-10 flex flex-1 items-center px-4 py-8 lg:px-8">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
