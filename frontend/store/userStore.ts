import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// 1000 XP per level
const XP_PER_LEVEL = 1000

const LEVEL_TITLES: Record<number, string> = {
  1: 'Junior QA',
  2: 'QA Engineer',
  3: 'Senior QA',
  4: 'QA Lead',
  5: 'Test Architect',
  6: 'QA Manager',
  7: 'Principal QA',
  8: 'VP of Quality',
  9: 'QA Guru',
}

export function levelFromXP(xp: number) {
  const level = Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, 9)
  const xpInLevel = xp % XP_PER_LEVEL
  const title = LEVEL_TITLES[level] ?? 'Testing Legend'
  const progress = xpInLevel / XP_PER_LEVEL
  return { level, xpInLevel, xpToNext: XP_PER_LEVEL, title, progress }
}

export interface UserProfile {
  id: number
  auth0_id: string
  email: string
  name: string
}

interface StatsUpdate {
  total_xp?: number
  current_streak?: number
  longest_streak?: number
  total_correct?: number
  total_attempts?: number
}

interface UserState {
  token: string | null
  isLoggedIn: boolean
  user: UserProfile | null
  totalXP: number
  currentStreak: number
  longestStreak: number
  totalCorrect: number
  totalAttempts: number

  login: (token: string) => Promise<void>
  logout: () => void
  setStats: (stats: StatsUpdate) => void
  addXP: (xp: number) => void
  refreshStats: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      isLoggedIn: false,
      user: null,
      totalXP: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalCorrect: 0,
      totalAttempts: 0,

      login: async (token: string) => {
        localStorage.setItem('token', token)
        set({ token, isLoggedIn: true })

        const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

        const [userRes, statsRes] = await Promise.allSettled([
          fetch(`${API}/api/v1/sync-user`, { headers }),
          fetch(`${API}/api/v1/quest/stats`, { headers }),
        ])

        const update: Partial<UserState> = {}

        if (userRes.status === 'fulfilled' && userRes.value.ok) {
          update.user = await userRes.value.json()
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
          const s = await statsRes.value.json()
          update.totalXP = s.total_xp ?? 0
          update.currentStreak = s.current_streak ?? 0
          update.longestStreak = s.longest_streak ?? 0
          update.totalCorrect = s.total_correct ?? 0
          update.totalAttempts = s.total_attempts ?? 0
        }

        set(update)
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          token: null,
          isLoggedIn: false,
          user: null,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalCorrect: 0,
          totalAttempts: 0,
        })
      },

      setStats: (stats) => {
        const update: Partial<UserState> = {}
        if (stats.total_xp !== undefined) update.totalXP = stats.total_xp
        if (stats.current_streak !== undefined) update.currentStreak = stats.current_streak
        if (stats.longest_streak !== undefined) update.longestStreak = stats.longest_streak
        if (stats.total_correct !== undefined) update.totalCorrect = stats.total_correct
        if (stats.total_attempts !== undefined) update.totalAttempts = stats.total_attempts
        set(update)
      },

      addXP: (xp) => set((s) => ({ totalXP: s.totalXP + xp })),

      refreshStats: async () => {
        const token = get().token
        if (!token) return
        const res = await fetch(`${API}/api/v1/quest/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const s = await res.json()
          set({
            totalXP: s.total_xp ?? 0,
            currentStreak: s.current_streak ?? 0,
            longestStreak: s.longest_streak ?? 0,
            totalCorrect: s.total_correct ?? 0,
            totalAttempts: s.total_attempts ?? 0,
          })
        }
      },
    }),
    {
      name: 'fuzzi-user',
      partialize: (s) => ({
        token: s.token,
        isLoggedIn: s.isLoggedIn,
        user: s.user,
        totalXP: s.totalXP,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
        totalCorrect: s.totalCorrect,
        totalAttempts: s.totalAttempts,
      }),
    }
  )
)
