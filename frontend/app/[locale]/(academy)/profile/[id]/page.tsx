'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Link } from 'next-view-transitions'
import {
  FiArrowLeft,
  FiUser,
  FiArrowUp,
  FiEye,
  FiMessageSquare,
  FiMapPin,
  FiLink,
  FiTwitter,
  FiLinkedin,
  FiGithub,
} from 'react-icons/fi'
import { useTranslations, useLocale } from 'next-intl'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { MorphRing } from '../../_components/MorphRing'
import { fetchPublicProfileFull, fetchUserPosts, type PublicProfileFull } from '@/lib/profileApi'
import { getCategoryLabel, type DiscussPost } from '@/lib/discussApi'
import { levelFromXP } from '@/store/userStore'
import { formatUserId } from '@/lib/formatUserId'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export default function PublicProfilePage() {
  const t = useTranslations('Profile')
  const locale = useLocale()
  const params = useParams()
  const id = params.id as string

  const [profile, setProfile] = useState<PublicProfileFull | null>(null)
  const [posts, setPosts] = useState<DiscussPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchPublicProfileFull(id)
      .then(setProfile)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!profile) return
    fetchUserPosts(id)
      .then((data) => setPosts(data.posts))
      .catch(() => {})
  }, [profile, id])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <MorphRing size="lg" label={t('loading')} />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-foreground/40 text-sm">{t('notFound')}</p>
      </div>
    )
  }

  if (!profile) return null

  const levelInfo = levelFromXP(profile.total_xp)
  const avatarSrc = profile.avatar_url ? `${API}${profile.avatar_url}` : null

  const dateFormatter = new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const socials = [
    { icon: <FiMapPin />, value: profile.location, placeholder: t('socials.location') },
    { icon: <FiLink />,   value: profile.website,  placeholder: t('socials.website')  },
    { icon: <FiTwitter />, value: profile.twitter, placeholder: t('socials.twitter')  },
    { icon: <FiLinkedin />, value: profile.linkedin, placeholder: t('socials.linkedin') },
    { icon: <FiGithub />, value: profile.github,   placeholder: t('socials.github')   },
  ]

  return (
    <div className="relative flex h-full items-center overflow-hidden py-10">
      <AcademyBackgroundGrid />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/discuss"
            className="text-foreground/40 hover:text-foreground flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest transition-colors"
          >
            <FiArrowLeft /> {t('backToDiscuss')}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* LEWA KOLUMNA */}
          <div className="space-y-4 md:col-span-3">
            <div className="border-foreground/10 bg-background flex flex-col items-center border p-6 text-center">
              <div className="mb-4 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-accent/50">
                {avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarSrc} alt={t('avatar.alt')} className="h-full w-full object-cover" />
                ) : (
                  <FiUser className="text-6xl" />
                )}
              </div>

              <h2 className="font-serif text-2xl font-bold tracking-tighter uppercase">
                {profile.name || t('anon')}
              </h2>
              <p className="text-foreground/60 mb-4 font-sans text-sm">
                {formatUserId(profile.id)}
              </p>

              <div className="border-foreground/5 w-full border-t pt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-serif text-lg font-bold uppercase">
                    {t('level')} {levelInfo.level}
                  </span>
                  <span className="font-sans text-sm font-bold text-primary uppercase">
                    {profile.total_xp} {t('xp')}
                  </span>
                </div>
                <p className="text-foreground/40 mt-1 font-sans text-xs">{levelInfo.title}</p>
              </div>
            </div>

            <div className="border-foreground/10 bg-background border p-6">
              <h3 className="mb-4 font-serif text-xs font-bold tracking-widest uppercase">
                {t('aboutMe')}
              </h3>
              <p className="break-words text-foreground/70 font-sans text-sm italic">
                {profile.bio || t('noBio')}
              </p>
            </div>
          </div>

          {/* PRAWA KOLUMNA */}
          <div className="min-w-0 space-y-4 md:col-span-9">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* SOCIAL LINKS */}
              <div className="border-foreground/10 bg-background min-w-0 space-y-3 border p-6">
                {socials.map((item, i) => (
                  <div key={i} className="flex h-7 items-center gap-3">
                    <span className="text-foreground shrink-0 text-sm">{item.icon}</span>
                    <span className={`min-w-0 flex-1 truncate font-sans text-sm ${!item.value ? 'text-foreground/30' : ''}`}>
                      {item.value || item.placeholder}
                    </span>
                  </div>
                ))}
              </div>

              {/* STATS 1 */}
              <div className="border-foreground/10 bg-background min-w-0 flex flex-col justify-center border p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold leading-none tracking-widest uppercase">
                      {t('stats.lessonsSolved')}
                    </p>
                    <p className="font-serif text-2xl font-bold">{profile.total_correct}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.discussPosts')}
                    </p>
                    <p className="font-serif text-lg font-bold">{profile.post_count}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.joined')}
                    </p>
                    <p className="font-serif text-lg font-bold">
                      {dateFormatter.format(new Date(profile.created_at))}
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
                    <p className="font-serif text-2xl font-bold">{profile.karma}</p>
                  </div>
                  <div>
                    <p className="text-foreground/40 font-sans text-[10px] font-bold tracking-widest uppercase">
                      {t('stats.currentStreak')}
                    </p>
                    <p className="font-serif text-lg font-bold">
                      {profile.current_streak} {t('stats.days')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* POSTS */}
            <div className="border-foreground/10 bg-background border p-6">
              <h3 className="text-foreground/50 mb-4 font-sans text-xs font-bold uppercase tracking-widest">
                {t('posts')}
              </h3>

              {posts.length === 0 ? (
                <p className="text-foreground/30 font-sans text-sm">{t('noPosts')}</p>
              ) : (
                <div className="flex flex-col">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border-foreground/10 flex flex-col gap-1.5 border-b py-4 last:border-b-0"
                    >
                      <div className="text-foreground/40 flex items-center gap-2 text-xs">
                        <span className="bg-foreground/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                          {getCategoryLabel(post.category)}
                        </span>
                        <span>{dateFormatter.format(new Date(post.created_at))}</span>
                      </div>
                      <Link
                        href={`/discuss/${post.id}`}
                        className="font-serif font-bold underline-offset-2 hover:underline"
                      >
                        {post.title}
                      </Link>
                      <div className="text-foreground/30 flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1"><FiArrowUp /> {post.upvotes}</span>
                        <span className="flex items-center gap-1"><FiEye /> {formatViews(post.views)}</span>
                        <span className="flex items-center gap-1"><FiMessageSquare /> {post.comment_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
