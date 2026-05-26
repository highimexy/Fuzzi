'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiCheck, FiX } from 'react-icons/fi'
import { submitQuestAnswer } from '@/lib/questApi'
import { fireConfetti } from '@/lib/confetti'
import { useUserStore } from '@/store/userStore'
import type { Quest, QuestSubmitResult, QuestResult } from '@/types/quest'

interface Props {
  quest: Quest
  locale: string
  initialResult?: QuestResult | null
}

const XP_LABEL: Record<number, string> = { 10: 'Beginner', 15: 'Intermediate', 25: 'Advanced' }

export function DailyQuestCard({ quest, locale, initialResult }: Props) {
  const t = useTranslations('Quest')
  const isLoggedIn = useUserStore((s) => s.isLoggedIn)
  const setStats = useUserStore((s) => s.setStats)

  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<QuestSubmitResult | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  const title = locale === 'pl' ? quest.title_pl : quest.title_en
  const body = locale === 'pl' ? quest.body_pl : quest.body_en

  useEffect(() => {
    if (initialResult?.attempted && initialResult.correct_key) {
      setResult({
        is_correct: initialResult.attempt?.is_correct ?? false,
        correct_key: initialResult.correct_key,
        xp_earned: initialResult.attempt?.xp_earned ?? 0,
        explanation_en: initialResult.explanation_en ?? '',
        explanation_pl: initialResult.explanation_pl ?? '',
        stats: { total_xp: 0, current_streak: 0 },
      })
      setSelected(initialResult.attempt?.answer_key ?? null)
    }
  }, [initialResult])

  async function handleSelect(key: string) {
    if (result || loading) return
    setSelected(key)
    setLoading(key)

    try {
      const res = await submitQuestAnswer(quest.id, key)
      setResult(res)
      if (res.is_correct) fireConfetti()
      if (isLoggedIn) {
        setStats(res.stats)
      }
    } catch {
      setResult({ is_correct: false, correct_key: key, xp_earned: 0, explanation_en: '', explanation_pl: '', stats: { total_xp: 0, current_streak: 0 } })
    } finally {
      setLoading(null)
    }
  }

  function optionClass(key: string): string {
    const base = 'flex items-center gap-3 border p-3 text-left text-sm font-mono transition-colors duration-150 w-full'
    if (!result) {
      return `${base} border-foreground/20 bg-foreground/5 hover:border-foreground/40 hover:bg-foreground/10 cursor-pointer`
    }
    if (key === result.correct_key) {
      return `${base} border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`
    }
    if (key === selected && key !== result.correct_key) {
      return `${base} border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300`
    }
    return `${base} border-foreground/10 bg-foreground/5 text-foreground/40`
  }

  function optionIcon(key: string) {
    if (!result) return null
    if (key === result.correct_key) return <FiCheck className="shrink-0 text-emerald-500" />
    if (key === selected && key !== result.correct_key) return <FiX className="shrink-0 text-red-500" />
    return null
  }

  const explanation = locale === 'pl' ? result?.explanation_pl : result?.explanation_en
  const diffLabel = XP_LABEL[quest.xp] ?? ''

  return (
    <div className="border border-foreground/10 bg-background flex flex-col">
      <div className="border-b border-foreground/10 px-4 py-3 flex items-center justify-between">
        <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">{diffLabel}</span>
        <span className="font-mono text-xs font-bold text-accent">+{quest.xp} {t('xpLabel')}</span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif font-bold mb-1">{title}</h3>
        <p className="text-sm text-foreground/60 mb-4">{body}</p>

        <div className="flex flex-col gap-2">
          {quest.options.map((opt) => {
            const text = locale === 'pl' ? opt.text_pl : opt.text_en
            return (
              <button
                key={opt.key}
                onClick={() => handleSelect(opt.key)}
                disabled={!!result}
                className={optionClass(opt.key)}
              >
                <span className="shrink-0 font-bold uppercase text-foreground/40 w-4">{opt.key}</span>
                <span className="flex-1 text-left">{text}</span>
                {loading === opt.key && (
                  <span className="shrink-0 h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                )}
                {optionIcon(opt.key)}
              </button>
            )
          })}
        </div>

        {result && (
          <div className="mt-4 border-t border-foreground/10 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-bold ${result.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.is_correct ? t('correctAnswer') : t('wrongAnswer')}
              </span>
              {result.xp_earned > 0 && (
                <span className="font-mono text-xs font-bold text-accent">
                  +{result.xp_earned} {t('xpLabel')}
                </span>
              )}
            </div>
            {explanation && (
              <p className="text-xs text-foreground/60 leading-relaxed">{explanation}</p>
            )}
            {result.stats.current_streak > 1 && (
              <p className="font-mono text-xs text-foreground/40">
                🔥 {result.stats.current_streak} {t('streakLabel')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
