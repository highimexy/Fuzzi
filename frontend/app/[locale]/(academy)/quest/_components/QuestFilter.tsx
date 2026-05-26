'use client'

import { useTranslations } from 'next-intl'

export interface FilterState {
  type: string
  difficulty: string
}

interface Props {
  filter: FilterState
  onFilterChange: (f: FilterState) => void
}

const TYPES = [
  { value: '', labelKey: 'filterAll' },
  { value: 'daily', labelKey: 'filterDaily' },
  { value: 'skill_check', labelKey: 'filterSkillCheck' },
  { value: 'bug_hunt', labelKey: 'filterBugHunt' },
] as const

const DIFFICULTIES = [
  { value: '', labelKey: 'filterAll' },
  { value: 'beginner', labelKey: 'difficultyBeginner' },
  { value: 'intermediate', labelKey: 'difficultyIntermediate' },
  { value: 'advanced', labelKey: 'difficultyAdvanced' },
] as const

export function QuestFilter({ filter, onFilterChange }: Props) {
  const t = useTranslations('Quest')

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-wrap gap-1.5">
        {TYPES.map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() => onFilterChange({ ...filter, type: value })}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
              filter.type === value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DIFFICULTIES.map(({ value, labelKey }) => (
          <button
            key={value}
            onClick={() => onFilterChange({ ...filter, difficulty: value })}
            className={`rounded-full border px-3 py-1 text-xs font-mono transition-colors ${
              filter.difficulty === value
                ? 'border-secondary bg-secondary/10 text-foreground'
                : 'border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground'
            }`}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  )
}
