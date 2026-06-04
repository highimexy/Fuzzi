'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  FiEdit3,
  FiArrowUp,
  FiEye,
  FiMessageSquare,
  FiUser,
  FiStar,
} from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../_components/AcademyBackgroundGrid'
import {
  fetchPosts,
  votePost,
  getCategoryLabel,
  DISCUSS_CATEGORIES,
  type DiscussPost,
} from '@/lib/discussApi'
import { AcademyDiscussCreateModal } from './AcademyDiscussCreateModal'
import { AuthorLink } from './AuthorLink'
import { useUserStore } from '@/store/userStore'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import { useTranslations, useLocale } from 'next-intl'

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return String(n)
}

export function AcademyDiscussBoard() {
  const t = useTranslations('Discuss')
  const locale = useLocale()
  const token = useUserStore((s) => s.token)
  const { toast } = useToast()

  const ALL_TABS = [
    { slug: 'for-you', label: t('forYou') },
    ...DISCUSS_CATEGORIES,
  ]

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }
  const [posts, setPosts] = useState<DiscussPost[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<'newest' | 'votes'>('newest')
  const [activeCategory, setActiveCategory] = useState('for-you')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadPosts = useCallback(
    async (p: number, append: boolean) => {
      setLoading(true)
      try {
        const data = await fetchPosts(sort, p, activeCategory, token ?? undefined)
        setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts))
        setTotal(data.total)
      } catch {
        toast({ variant: 'error', title: t('loadFailed') })
      } finally {
        setLoading(false)
      }
    },
    [sort, activeCategory, token, toast],
  )

  useEffect(() => {
    setPage(1)
    loadPosts(1, false)
  }, [sort, activeCategory]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = () => {
    const next = page + 1
    setPage(next)
    loadPosts(next, true)
  }

  const handleVote = async (postId: string) => {
    if (!token) {
      toast({ variant: 'error', title: t('mustLoginVote') })
      return
    }
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, upvotes: p.has_voted ? p.upvotes - 1 : p.upvotes + 1, has_voted: !p.has_voted }
          : p,
      ),
    )
    try {
      const result = await votePost(token, postId)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, upvotes: result.upvotes, has_voted: result.has_voted } : p,
        ),
      )
    } catch {
      // Roll back on error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, upvotes: p.has_voted ? p.upvotes - 1 : p.upvotes + 1, has_voted: !p.has_voted }
            : p,
        ),
      )
      toast({ variant: 'error', title: t('voteFailed') })
    }
  }

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      {/* === LEWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      {/* === ŚRODKOWY KONTENT === */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col p-8 xl:max-w-5xl">
        {/* === TABS === */}
        <div className="border-foreground/10 flex items-center border-b py-2">
          <div className="flex flex-1 flex-wrap items-center">
            {ALL_TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveCategory(tab.slug)}
                className={`-mb-px border-b-2 px-3 py-2 text-xs tracking-widest uppercase transition-colors ${
                  activeCategory === tab.slug
                    ? 'border-foreground text-foreground font-bold'
                    : 'border-transparent text-foreground/40 hover:text-foreground/70'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            className="flex cursor-pointer items-center gap-2 border border-accent/30 bg-accent/10 px-3 py-1.5 font-bold text-accent hover:bg-accent/20"
            onClick={() => setIsModalOpen(true)}
          >
            <FiEdit3 className="text-base" />
            <span className="text-xs">{t('create')}</span>
          </button>
        </div>

        {/* === SORTING BAR === */}
        <div className="text-foreground/50 border-foreground/10 mt-2 flex items-center gap-4 border-b pb-2">
          <button
            onClick={() => setSort('votes')}
            className={`flex cursor-pointer items-center gap-1.5 border-r border-foreground/10 pr-4 text-xs transition-colors hover:text-foreground ${sort === 'votes' ? 'text-foreground font-bold' : ''}`}
          >
            <FiArrowUp className="text-base" /> {t('mostVotes')}
          </button>
          <button
            onClick={() => setSort('newest')}
            className={`flex cursor-pointer items-center gap-1.5 text-xs transition-colors hover:text-foreground ${sort === 'newest' ? 'text-foreground font-bold' : ''}`}
          >
            <FiStar className="text-base" /> {t('newest')}
          </button>
        </div>

        {/* === POST LIST === */}
        <div className="flex flex-col">
          {posts.length === 0 && !loading && (
            <p className="text-foreground/30 py-12 text-center text-sm">{t('noPosts')}</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="border-foreground/10 flex flex-col gap-2 border-b py-4">
              {/* Author + date + category badge */}
              <div className="text-foreground/50 flex items-center gap-1.5 text-xs">
                <FiUser className="shrink-0" />
                {post.author && <AuthorLink author={post.author} className="text-foreground/80 font-bold" />}
                <span>•</span>
                <span>{formatDate(post.created_at)}</span>
                <span className="bg-foreground/5 text-foreground/50 ml-1 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                  {getCategoryLabel(post.category)}
                </span>
              </div>

              {/* Title */}
              <Link href={`/discuss/${post.id}`} className="hover:text-foreground/80 group">
                <h2 className="font-serif text-base font-bold sm:text-lg group-hover:underline underline-offset-2">
                  {post.title}
                </h2>
              </Link>

              {/* Body preview */}
              <p className="line-clamp-2 text-sm text-foreground/60">
                {post.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
              </p>

              {/* Stats row */}
              <div className="text-foreground/40 mt-1 flex items-center gap-4 sm:gap-6 text-xs">
                <button
                  onClick={() => handleVote(post.id)}
                  className={`flex cursor-pointer items-center gap-1 transition-colors hover:text-accent ${post.has_voted ? 'text-accent' : ''}`}
                >
                  <FiArrowUp className="text-sm" /> {post.upvotes}
                </button>
                <span className="flex items-center gap-1">
                  <FiEye className="text-sm" /> {formatViews(post.views)}
                </span>
                <Link href={`/discuss/${post.id}`} className="flex items-center gap-1 hover:text-foreground/70 transition-colors">
                  <FiMessageSquare className="text-sm" /> {post.comment_count}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts.length < total && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-foreground/60 hover:text-foreground cursor-pointer text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-40"
            >
              {loading ? t('loading') : t('loadMore')}
            </button>
          </div>
        )}
      </div>

      {/* === PRAWA SIATKA === */}
      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>

      {isModalOpen && (
        <AcademyDiscussCreateModal
          onClose={() => setIsModalOpen(false)}
          onCreated={(post) => setPosts((prev) => [post, ...prev])}
        />
      )}
    </div>
  )
}
