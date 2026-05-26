export type QuestType = 'daily' | 'skill_check' | 'bug_hunt'
export type QuestTrack = 'qa' | 'reality' | 'general'
export type QuestDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface QuestOption {
  key: string
  text_en: string
  text_pl: string
}

export interface Quest {
  id: string
  type: QuestType
  track: QuestTrack
  difficulty: QuestDifficulty
  title_en: string
  title_pl: string
  body_en: string
  body_pl: string
  options: QuestOption[]
  xp: number
  active_date: string
  created_at: string
}

export interface QuestSubmitResult {
  is_correct: boolean
  correct_key: string
  xp_earned: number
  explanation_en: string
  explanation_pl: string
  stats: {
    total_xp: number
    current_streak: number
  }
}

export interface UserQuestStats {
  user_id: string
  total_xp: number
  current_streak: number
  longest_streak: number
  last_active_date: string
  total_correct: number
  total_attempts: number
}

export interface QuestResult {
  attempted: boolean
  attempt?: {
    id: string
    answer_key: string
    is_correct: boolean
    xp_earned: number
    attempted_at: string
  }
  correct_key?: string
  explanation_en?: string
  explanation_pl?: string
}
