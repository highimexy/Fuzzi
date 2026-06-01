'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { UserQuestStats } from '@/types/quest'

interface Props {
  stats: UserQuestStats | null
}

export function StatsBar({ stats }: Props) {
  const t = useTranslations('Quest')

  if (!stats) {
    return (
      <div className="flex items-center gap-4">
        <span className="font-sans text-sm text-foreground/40">{t('loginPrompt')}</span>
        <Link
          href="/login"
          className="border border-foreground/20 px-3 py-1.5 font-sans text-[10px] font-bold tracking-widest uppercase transition-colors hover:border-foreground/50 hover:bg-foreground/5"
        >
          {t('loginButton')}
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-6 font-mono text-sm">
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
