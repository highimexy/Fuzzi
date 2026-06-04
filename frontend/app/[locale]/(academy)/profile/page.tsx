'use client'

import { useState, useEffect, useRef } from 'react'
import {
  FiEdit2,
  FiMapPin,
  FiLink,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiUser,
  FiLock,
  FiCheck,
  FiX,
  FiCamera,
} from 'react-icons/fi'
import { useTranslations, useLocale } from 'next-intl'
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import { MorphRing } from '../_components/MorphRing'
import { useUserStore, levelFromXP } from '@/store/userStore'
import {
  fetchMyProfile,
  updateMyProfile,
  uploadAvatar,
  type MyProfile,
  type ProfilePatch,
} from '@/lib/profileApi'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import { formatUserId } from '@/lib/formatUserId'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const MAX_AVATAR_BYTES = 2 * 1024 * 1024

const generateMockData = () => {
  const data = []
  const today = new Date()
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0
    const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 8 ? 3 : 4
    data.push({ date: date.toISOString().split('T')[0] ?? '', count, level })
  }
  return data
}

const activityData = generateMockData()

const calendarTheme: ThemeInput = {
  light: ['#1f1f1f', '#89937e', '#89937e', '#576966', '#fde047'],
  dark: [
    'rgba(255,255,255,0.05)',
    'rgba(253, 224, 71, 0.3)',
    'rgba(253, 224, 71, 0.6)',
    'rgba(253, 224, 71, 0.8)',
    '#fde047',
  ],
}

// ── InlineEdit ───────────────────────────────────────────────────────────────

interface InlineEditProps {
  fieldKey: string
  editingField: string | null
  setEditingField: (key: string | null) => void
  value: string
  placeholder: string
  onSave: (val: string) => Promise<void>
  icon: React.ReactNode
  displayText: string
}

function InlineEdit({
  fieldKey,
  editingField,
  setEditingField,
  value,
  placeholder,
  onSave,
  icon,
  displayText,
}: InlineEditProps) {
  const editing = editingField === fieldKey
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) setDraft(value)
  }, [editing, value])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draft)
      setEditingField(null)
    } finally {
      setSaving(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') setEditingField(null)
  }

  return (
    <div className="flex h-7 w-full items-center gap-3">
      <span className="text-foreground shrink-0 text-sm">{icon}</span>

      {editing ? (
        <>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-0 min-w-0 flex-1 border-b border-foreground/30 bg-transparent font-sans text-sm leading-none outline-none"
          />
          {saving ? (
            <MorphRing size="sm" />
          ) : (
            <>
              <button onClick={handleSave} className="text-accent hover:text-accent/70 shrink-0 text-sm">
                <FiCheck />
              </button>
              <button onClick={() => setEditingField(null)} className="text-foreground/40 hover:text-foreground/60 shrink-0 text-sm">
                <FiX />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate font-sans text-sm">{displayText}</span>
          <button
            onClick={() => setEditingField(fieldKey)}
            className="text-foreground/20 hover:text-foreground/50 shrink-0 text-sm transition-colors"
          >
            <FiEdit2 />
          </button>
        </>
      )}
    </div>
  )
}

// ── BioEdit ──────────────────────────────────────────────────────────────────

interface BioEditProps {
  fieldKey: string
  editingField: string | null
  setEditingField: (key: string | null) => void
  value: string
  onSave: (val: string) => Promise<void>
}

function BioEdit({ fieldKey, editingField, setEditingField, value, onSave }: BioEditProps) {
  const t = useTranslations('Profile')
  const editing = editingField === fieldKey
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (editing) setDraft(value)
  }, [editing, value])

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(draft)
      setEditingField(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xs font-bold tracking-widest uppercase">{t('aboutMe')}</h3>
        {!editing && (
          <button
            onClick={() => setEditingField(fieldKey)}
            className="text-foreground/20 hover:text-foreground/50 text-sm transition-colors"
          >
            <FiEdit2 />
          </button>
        )}
      </div>

      {editing ? (
        <div className="flex flex-col gap-2">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full resize-none border border-foreground/20 bg-transparent p-2 font-sans text-sm outline-none focus:border-foreground/40"
          />
          <div className="flex items-center justify-between">
            <span className="text-foreground/30 font-sans text-xs">{draft.length}/500</span>
            {saving ? (
              <MorphRing size="sm" />
            ) : (
              <div className="flex gap-2">
                <button onClick={handleSave} className="text-accent hover:text-accent/70 flex items-center gap-1 font-sans text-sm">
                  <FiCheck /> {t('save')}
                </button>
                <button onClick={() => setEditingField(null)} className="text-foreground/40 hover:text-foreground/60 flex items-center gap-1 font-sans text-sm">
                  <FiX /> {t('cancel')}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="break-words text-foreground/70 font-sans text-sm italic">
          {value || t('bioPlaceholder')}
        </p>
      )}
    </div>
  )
}

// ── ProfilePage ──────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const t = useTranslations('Profile')
  const locale = useLocale()
  const token = useUserStore((s) => s.token)
  const [profile, setProfile] = useState<MyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetchMyProfile(token)
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  async function saveField(patch: ProfilePatch) {
    if (!token) return
    try {
      const res = await updateMyProfile(token, patch)
      setProfile((prev) => (prev ? { ...prev, user: res.user } : prev))
      toast({ title: t('field.saved'), variant: 'success' })
    } catch (e: unknown) {
      toast({
        title: t('field.saveFailed'),
        description: e instanceof Error ? e.message : undefined,
        variant: 'error',
      })
    }
  }

  function handleAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !token) return

    if (file.size > MAX_AVATAR_BYTES) {
      toast({ title: t('avatar.tooLarge'), description: t('avatar.tooLargeDesc'), variant: 'error' })
      e.target.value = ''
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      toast({ title: t('avatar.invalidType'), description: t('avatar.invalidTypeDesc'), variant: 'error' })
      e.target.value = ''
      return
    }

    setAvatarUploading(true)
    uploadAvatar(token, file)
      .then((res) => {
        setProfile((prev) =>
          prev ? { ...prev, user: { ...prev.user, avatar_url: res.avatar_url } } : prev,
        )
        useUserStore.setState((s) => ({
          user: s.user ? { ...s.user, avatar_url: res.avatar_url } : s.user,
        }))
        toast({ title: t('avatar.updated'), variant: 'success' })
      })
      .catch((err: unknown) => {
        toast({
          title: t('avatar.uploadFailed'),
          description: err instanceof Error ? err.message : undefined,
          variant: 'error',
        })
      })
      .finally(() => {
        setAvatarUploading(false)
        e.target.value = ''
      })
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MorphRing size="lg" label={t('loading')} />
      </div>
    )
  }

  const user = profile?.user
  const stats = profile?.stats
  const levelInfo = levelFromXP(stats?.total_xp ?? 0)
  const isPrivate = levelInfo.level < 10
  const avatarSrc = user?.avatar_url ? `${API}${user.avatar_url}` : null

  const dateFormatter = new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const socials = [
    { key: 'location', icon: <FiMapPin />, value: user?.location ?? '', placeholder: t('socials.location') },
    { key: 'website',  icon: <FiLink />,   value: user?.website  ?? '', placeholder: t('socials.website')  },
    { key: 'twitter',  icon: <FiTwitter />, value: user?.twitter ?? '', placeholder: t('socials.twitter')  },
    { key: 'linkedin', icon: <FiLinkedin />, value: user?.linkedin ?? '', placeholder: t('socials.linkedin') },
    { key: 'github',   icon: <FiGithub />, value: user?.github   ?? '', placeholder: t('socials.github')   },
  ]

  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-end">
          {isPrivate && (
            <p className="text-foreground/40 flex items-center gap-2 font-sans text-xs tracking-widest uppercase">
              <span className="text-sm"><FiLock /></span>
              {t('privateUntilLevel')}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* LEWA KOLUMNA */}
          <div className="space-y-4 md:col-span-3">
            <div className="border-foreground/10 bg-background flex flex-col items-center border p-6 text-center">
              <div className="group relative mb-4">
                <button
                  onClick={() => !avatarUploading && fileInputRef.current?.click()}
                  className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-accent/50"
                >
                  {avatarUploading ? (
                    <MorphRing size="md" variant="accent" />
                  ) : avatarSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarSrc} alt={t('avatar.alt')} className="h-full w-full object-cover" />
                  ) : (
                    <FiUser className="text-6xl" />
                  )}
                  {!avatarUploading && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <FiCamera className="text-2xl text-white" />
                    </span>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>

              <h2 className="font-serif text-2xl font-bold tracking-tighter uppercase">
                {user?.name || '—'}
              </h2>
              <p className="text-foreground/60 mb-4 font-sans text-sm">
                {formatUserId(user?.id ?? 0)}
              </p>

              <div className="border-foreground/5 w-full border-t pt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-serif text-lg font-bold uppercase">
                    {t('level')} {levelInfo.level}
                  </span>
                  <span className="font-sans text-sm font-bold text-primary uppercase">
                    {stats?.total_xp ?? 0} {t('xp')}
                  </span>
                </div>
                <p className="text-foreground/40 mt-1 font-sans text-xs">{levelInfo.title}</p>
              </div>
            </div>

            <div className="border-foreground/10 bg-background border p-6">
              <BioEdit
                fieldKey="bio"
                editingField={editingField}
                setEditingField={setEditingField}
                value={user?.bio ?? ''}
                onSave={(val) => saveField({ bio: val })}
              />
            </div>
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="min-w-0 space-y-4 md:col-span-9">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* SOCIAL LINKS */}
              <div className="border-foreground/10 bg-background min-w-0 space-y-3 border p-6">
                {socials.map((item) => (
                  <InlineEdit
                    key={item.key}
                    fieldKey={item.key}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    value={item.value}
                    placeholder={item.placeholder}
                    onSave={(val) => saveField({ [item.key]: val } as ProfilePatch)}
                    icon={item.icon}
                    displayText={item.value || item.placeholder}
                  />
                ))}
              </div>

              {/* STATS 1 */}
              <div className="border-foreground/10 bg-background min-w-0 flex flex-col justify-center border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold leading-none tracking-widest uppercase">
                      {t('stats.lessonsSolved')}
                    </p>
                    <p className="font-serif text-2xl font-bold">{stats?.total_correct ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.leaderboardRank')}
                    </p>
                    <p className="font-serif text-lg font-bold">#{profile?.rank ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.joined')}
                    </p>
                    <p className="font-serif text-lg font-bold">
                      {user?.created_at ? dateFormatter.format(new Date(user.created_at)) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATS 2 */}
              <div className="border-foreground/10 bg-background min-w-0 flex flex-col justify-center border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold leading-none tracking-widest uppercase">
                      {t('stats.karma')}
                    </p>
                    <p className="font-serif text-2xl font-bold">{user?.karma ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.discussPosts')}
                    </p>
                    <p className="font-serif text-lg font-bold">{profile?.post_count ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.currentStreak')}
                    </p>
                    <p className="font-serif text-lg font-bold">
                      {stats?.current_streak ?? 0} {t('stats.days')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* HEATMAP */}
            <div className="border-foreground/10 bg-background border p-8">
              <div className="custom-scrollbar flex w-full justify-center overflow-x-auto">
                <ActivityCalendar
                  data={activityData}
                  theme={calendarTheme}
                  colorScheme="dark"
                  blockSize={11}
                  blockRadius={2}
                  blockMargin={4}
                  fontSize={10}
                  labels={{
                    legend: { less: 'Less', more: 'More' },
                    months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
