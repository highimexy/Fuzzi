'use client'

import { useTranslations } from 'next-intl'
import { FiSun, FiBook, FiAlertCircle } from 'react-icons/fi'
import type { Quest } from '@/types/quest'

interface Props {
  quest: Quest
  locale: string
  attempted?: boolean
  onClick: () => void
}

const TYPE_ICON = {
  daily: FiSun,
  skill_check: FiBook,
  bug_hunt: FiAlertCircle,
}

const DIFFICULTY_CLASS = {
  beginner: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  intermediate: 'text-accent border-accent/30',
  advanced: 'text-error border-error/30',
}

export function QuestListCard({ quest, locale, attempted, onClick }: Props) {
  const t = useTranslations('Quest')
  const Icon = TYPE_ICON[quest.type] ?? FiBook
  const title = locale === 'pl' ? quest.title_pl : quest.title_en
  const diffClass = DIFFICULTY_CLASS[quest.difficulty] ?? ''
  const diffLabel = t(`difficulty${quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}` as any)

  return (
    <button
      onClick={onClick}
      className={`border border-foreground/10 bg-background w-full p-4 text-left transition-all duration-200 hover:border-foreground/30 hover:-translate-y-0.5 ${
        attempted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 shrink-0 text-foreground/40" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif font-bold">{title}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className={`border rounded px-1.5 py-0.5 text-xs font-mono ${diffClass}`}>
              {diffLabel}
            </span>
            <span className="text-xs font-mono text-accent">+{quest.xp} {t('xpLabel')}</span>
            {attempted && (
              <span className="text-xs font-mono text-foreground/40">{t('completedLabel')}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
