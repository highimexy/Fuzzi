'use client'

import { useState, useEffect } from 'react'
import { Link } from 'next-view-transitions'
import { FiEdit3, FiTrash2, FiArrowUp, FiEye, FiMessageSquare } from 'react-icons/fi'
import { fetchMyPosts, deletePost, getCategoryLabel, type DiscussPost } from '@/lib/discussApi'
import { AcademyDiscussCreateModal } from '../../_components/AcademyDiscussCreateModal'
import { useUserStore } from '@/store/userStore'
import { useToast } from '@/app/[locale]/_components/toast/useToast'
import { useTranslations, useLocale } from 'next-intl'

export function MyDiscussPosts() {
  const t = useTranslations('Discuss')
  const locale = useLocale()
  const token = useUserStore((s) => s.token)
  const { toast } = useToast()

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric', month: 'short', year: 'numeric',
    })
  }
  const [posts, setPosts] = useState<DiscussPost[]>([])
  const [loading, setLoading] = useState(false)
  const [editPost, setEditPost] = useState<DiscussPost | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchMyPosts(token)
      .then((data) => setPosts(data.posts))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [token])

  const handleDelete = async (id: string) => {
    if (!token) return
    try {
      await deletePost(token, id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast({ variant: 'success', title: t('postDeleted') })
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : t('serverError') })
    } finally {
      setConfirmDeleteId(null)
    }
  }

  if (!token) return null

  return (
    <>
      <div className="space-y-4">
        {loading && <p className="text-foreground/40 text-sm">{t('myPosts.loading')}</p>}
        {!loading && posts.length === 0 && (
          <p className="text-foreground/40 text-sm">
            {t('myPosts.empty')}{' '}
            <Link href="/discuss" className="text-accent hover:underline">
              {t('myPosts.addFirst')}
            </Link>
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="border-foreground/10 border p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-foreground/40 mb-1 flex items-center gap-2 text-xs">
                  <span className="bg-foreground/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
                    {getCategoryLabel(post.category)}
                  </span>
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <Link
                  href={`/discuss/${post.id}`}
                  className="font-serif font-bold hover:underline underline-offset-2"
                >
                  {post.title}
                </Link>
                <div className="text-foreground/40 mt-2 flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1">
                    <FiArrowUp /> {post.upvotes}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye /> {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMessageSquare /> {post.comment_count}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setEditPost(post)}
                  className="text-foreground/40 hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                >
                  <FiEdit3 /> {t('myPosts.edit')}
                </button>
                {confirmDeleteId === post.id ? (
                  <span className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="font-bold text-red-400 hover:text-red-300"
                    >
                      {t('myPosts.confirmYes')}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-foreground/40 hover:text-foreground"
                    >
                      {t('myPosts.confirmNo')}
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(post.id)}
                    className="flex items-center gap-1 text-xs text-red-400/60 transition-colors hover:text-red-400"
                  >
                    <FiTrash2 /> {t('myPosts.delete')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editPost && (
        <AcademyDiscussCreateModal
          mode="edit"
          initialPost={editPost}
          onClose={() => setEditPost(null)}
          onUpdated={(updated) => {
            setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
            setEditPost(null)
          }}
        />
      )}
    </>
  )
}
