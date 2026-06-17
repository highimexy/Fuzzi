'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiCheck, FiX } from 'react-icons/fi'
import { submitQuestAnswer } from '@/lib/questApi'
import { fireConfetti } from '@/lib/confetti'
import { useUserStore } from '@/store/userStore'
import { MorphRing } from '../../_components/MorphRing'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import type { Quest, QuestSubmitResult, QuestResult } from '@/types/quest'

interface Props {
  quest: Quest
  locale: string
  initialResult?: QuestResult | null
}

const XP_LABEL: Record<number, string> = { 10: 'Beginner', 15: 'Intermediate', 25: 'Advanced' }

export function DailyQuestCard({ quest, locale, initialResult }: Props) {
  const t = useTranslations('Quest')
  const { toast } = useToast()
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
      if (res.is_correct) {
        fireConfetti()
        toast({
          variant: 'success',
          title: t('correctAnswer'),
          description: res.xp_earned > 0 ? `+${res.xp_earned} XP` : undefined,
        })
      }
      if (isLoggedIn) setStats(res.stats)
    } catch {
      setSelected(null)
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
      return `${base} border-correct/30 bg-correct/10 text-correct`
    }
    if (key === selected && key !== result.correct_key) {
      return `${base} border-wrong/30 bg-wrong/10 text-wrong`
    }
    return `${base} border-foreground/10 bg-foreground/5 text-foreground/40`
  }

  function optionIcon(key: string) {
    if (!result) return null
    if (key === result.correct_key) return <FiCheck className="shrink-0 text-correct" />
    if (key === selected && key !== result.correct_key) return <FiX className="shrink-0 text-wrong" />
    return null
  }

  const explanation = locale === 'pl' ? result?.explanation_pl : result?.explanation_en
  const diffLabel = XP_LABEL[quest.xp] ?? ''

  return (
    <div className="border-foreground/10 bg-background flex flex-col border">
      <div className="border-foreground/10 flex items-center justify-between border-b px-5 py-3">
        <span className="font-sans text-[9px] font-bold tracking-widest uppercase text-foreground/40">{diffLabel}</span>
        <span className="font-mono text-xs font-bold text-accent">+{quest.xp} {t('xpLabel')}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg font-bold leading-tight tracking-tight mb-2">{title}</h3>
        <p className="font-sans text-sm leading-relaxed text-foreground/55 mb-5">{body}</p>

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
                {loading === opt.key && <MorphRing size="sm" />}
                {optionIcon(opt.key)}
              </button>
            )
          })}
        </div>

        {result && (
          <div className="mt-4 border-t border-foreground/10 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className={`font-mono text-xs font-bold ${result.is_correct ? 'text-correct' : 'text-wrong'}`}>
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
