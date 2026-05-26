'use client'

import { useTranslations } from 'next-intl'
import type { UserQuestStats } from '@/types/quest'

interface Props {
  stats: UserQuestStats | null
}

export function StatsBar({ stats }: Props) {
  const t = useTranslations('Quest')

  if (!stats) {
    return (
      <div className="flex gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-28 rounded bg-foreground/10" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-6 text-sm font-mono">
      <span className="flex items-center gap-1.5">
        <span>🔥</span>
        <span className="font-bold">{stats.current_streak}</span>
        <span className="text-foreground/60">{t('streakLabel')}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span>⚡</span>
        <span className="font-bold">{stats.total_xp}</span>
        <span className="text-foreground/60">{t('xpLabel')}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <span>✓</span>
        <span className="font-bold">{stats.total_correct}/{stats.total_attempts}</span>
        <span className="text-foreground/60">{t('correctLabel')}</span>
      </span>
    </div>
  )
}
