'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiX, FiCheck } from 'react-icons/fi'
import { submitQuestAnswer } from '@/lib/questApi'
import { MorphRing } from '../../_components/MorphRing'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import type { Quest, QuestSubmitResult } from '@/types/quest'

interface Props {
  quest: Quest | null
  locale: string
  onClose: () => void
  onStatsUpdate?: (stats: QuestSubmitResult['stats']) => void
}

export function QuestModal({ quest, locale, onClose, onStatsUpdate }: Props) {
  const t = useTranslations('Quest')
  const { toast } = useToast()
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<QuestSubmitResult | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
    setSelected(null)
    setResult(null)
    setLoading(null)
  }, [quest?.id])

  if (!quest) return null

  const title = locale === 'pl' ? quest.title_pl : quest.title_en
  const body = locale === 'pl' ? quest.body_pl : quest.body_en

  async function handleSelect(key: string) {
    if (result || loading) return
    if (!isLoggedIn) {
      setResult({
        is_correct: false,
        correct_key: '?',
        xp_earned: 0,
        explanation_en: 'Login to see the correct answer.',
        explanation_pl: 'Zaloguj się, aby zobaczyć poprawną odpowiedź.',
        stats: { total_xp: 0, current_streak: 0 },
      })
      setSelected(key)
      return
    }
    setLoading(key)
    setSelected(key)
    try {
      const res = await submitQuestAnswer(quest!.id, key)
      setResult(res)
      onStatsUpdate?.(res.stats)
      if (res.is_correct) {
        toast({
          variant: 'achievement',
          title: t('correctAnswer'),
          description: res.xp_earned > 0 ? `+${res.xp_earned} XP` : undefined,
        })
      }
    } finally {
      setLoading(null)
    }
  }

  function optionClass(key: string) {
    const base = 'flex items-center gap-3 border p-3 text-left text-sm font-mono w-full transition-colors duration-150'
    if (!result) {
      return `${base} border-foreground/20 bg-foreground/5 hover:border-foreground/40 hover:bg-foreground/10 cursor-pointer`
    }
    if (key === result.correct_key) return `${base} border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300`
    if (key === selected && !result.is_correct) return `${base} border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300`
    return `${base} border-foreground/10 text-foreground/40`
  }

  const explanation = locale === 'pl' ? result?.explanation_pl : result?.explanation_en

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-foreground/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-foreground/10 p-4">
          <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">
            {t(`filter${quest.type === 'skill_check' ? 'SkillCheck' : quest.type === 'bug_hunt' ? 'BugHunt' : 'Daily'}` as any)}
          </span>
          <button onClick={onClose} className="text-foreground/50 hover:text-foreground p-1">
            <FiX />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="font-serif text-xl font-bold">{title}</h2>
            <span className="font-mono text-xs text-accent shrink-0">+{quest.xp} {t('xpLabel')}</span>
          </div>
          <p className="text-sm text-foreground/70 mb-5">{body}</p>

          <div className="flex flex-col gap-2 mb-4">
            {quest.options.map((opt) => {
              const text = locale === 'pl' ? opt.text_pl : opt.text_en
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  disabled={!!result}
                  className={optionClass(opt.key)}
                >
                  <span className="shrink-0 font-bold uppercase text-foreground/50 w-4">{opt.key}</span>
                  <span className="flex-1">{text}</span>
                  {loading === opt.key && <MorphRing size="sm" />}
                  {result && opt.key === result.correct_key && <FiCheck className="text-emerald-500" />}
                </button>
              )
            })}
          </div>

          {result && (
            <div className="border-t border-foreground/10 pt-4 space-y-2">
              <p className={`font-mono text-sm font-bold ${result.is_correct ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {result.is_correct ? t('correctAnswer') : t('wrongAnswer')}
                {result.xp_earned > 0 && <span className="ml-3 text-accent">+{result.xp_earned} {t('xpLabel')}</span>}
              </p>
              {explanation && (
                <p className="text-sm text-foreground/60">{explanation}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
