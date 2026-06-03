'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowUp, FiArrowLeft, FiEye, FiUser, FiTrash2, FiEdit3 } from 'react-icons/fi'
import { AcademyBackgroundGrid } from '../../_components/AcademyBackgroundGrid'
import { AuthorLink } from '../../_components/AuthorLink'
import {
  fetchPost,
  votePost,
  createComment,
  deleteComment,
  deletePost,
  getCategoryLabel,
  type DiscussPost,
  type DiscussComment,
} from '@/lib/discussApi'
import { AcademyDiscussCreateModal } from '../../_components/AcademyDiscussCreateModal'
import { useUserStore } from '@/store/userStore'
import { useToast } from '@/app/[locale]/_components/toast/useToast'

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DiscussPostPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const token = useUserStore((s) => s.token)
  const user = useUserStore((s) => s.user)
  const { toast } = useToast()

  const [post, setPost] = useState<DiscussPost | null>(null)
  const [comments, setComments] = useState<DiscussComment[]>([])
  const [notFound, setNotFound] = useState(false)
  const [commentBody, setCommentBody] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchPost(id, token ?? undefined)
      .then((data) => {
        setPost(data.post)
        setComments(data.comments ?? [])
      })
      .catch(() => setNotFound(true))
  }, [id, token])

  const handleVote = async () => {
    if (!token || !post) {
      toast({ variant: 'error', title: 'Musisz być zalogowany, żeby głosować.' })
      return
    }
    setPost((p) =>
      p ? { ...p, upvotes: p.has_voted ? p.upvotes - 1 : p.upvotes + 1, has_voted: !p.has_voted } : p,
    )
    try {
      const result = await votePost(token, id)
      setPost((p) => (p ? { ...p, upvotes: result.upvotes, has_voted: result.has_voted } : p))
    } catch {
      setPost((p) =>
        p ? { ...p, upvotes: p.has_voted ? p.upvotes - 1 : p.upvotes + 1, has_voted: !p.has_voted } : p,
      )
      toast({ variant: 'error', title: 'Nie udało się zapisać głosu.' })
    }
  }

  const handleAddComment = async () => {
    if (!token) {
      toast({ variant: 'error', title: 'Musisz być zalogowany, żeby komentować.' })
      return
    }
    const body = commentBody.trim()
    if (!body) return
    setSubmittingComment(true)
    try {
      const comment = await createComment(token, id, body)
      setComments((prev) => [...prev, comment])
      setPost((p) => (p ? { ...p, comment_count: p.comment_count + 1 } : p))
      setCommentBody('')
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : 'Błąd serwera' })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return
    try {
      await deleteComment(token, commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      setPost((p) => (p ? { ...p, comment_count: Math.max(0, p.comment_count - 1) } : p))
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : 'Błąd serwera' })
    }
  }

  const handleDeletePost = async () => {
    if (!token || !post) return
    try {
      await deletePost(token, post.id)
      toast({ variant: 'success', title: 'Post usunięty.' })
      router.push('/discuss')
    } catch (err) {
      toast({ variant: 'error', title: err instanceof Error ? err.message : 'Błąd serwera' })
    }
  }

  if (notFound) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-foreground/40 text-sm">Post nie istnieje lub został usunięty.</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <p className="text-foreground/30 text-sm">Ładowanie...</p>
      </div>
    )
  }

  const isAuthor = user?.auth0_id === post.user_id

  return (
    <div className="flex w-full flex-1 items-stretch justify-center font-sans">
      <div className="border-foreground/10 relative hidden flex-1 border-r lg:block">
        <AcademyBackgroundGrid />
      </div>

      <div className="relative z-10 flex w-full max-w-4xl flex-col p-8 xl:max-w-5xl">
        {/* Back link */}
        <Link
          href="/discuss"
          className="text-foreground/40 hover:text-foreground mb-6 flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors"
        >
          <FiArrowLeft /> Discuss
        </Link>

        {/* Post header */}
        <div className="border-foreground/10 border-b pb-6">
          <div className="text-foreground/40 mb-2 flex items-center gap-1.5 text-xs">
            <FiUser className="shrink-0" />
            {post.author && <AuthorLink author={post.author} className="text-foreground/70 font-bold" />}
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
            <span className="bg-foreground/5 text-foreground/40 ml-1 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
              {getCategoryLabel(post.category)}
            </span>
          </div>

          <h1 className="font-serif text-2xl font-bold sm:text-3xl">{post.title}</h1>

          {/* Author actions */}
          {isAuthor && (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="text-foreground/40 hover:text-foreground flex items-center gap-1 text-xs transition-colors"
              >
                <FiEdit3 /> Edytuj
              </button>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 text-xs text-red-400 transition-colors hover:text-red-300"
                >
                  <FiTrash2 /> Usuń
                </button>
              ) : (
                <span className="flex items-center gap-2 text-xs">
                  <span className="text-foreground/50">Na pewno?</span>
                  <button onClick={handleDeletePost} className="font-bold text-red-400 hover:text-red-300">
                    Tak, usuń
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-foreground/40 hover:text-foreground"
                  >
                    Anuluj
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Post body */}
        <div className="border-foreground/10 whitespace-pre-wrap border-b py-6 text-sm leading-relaxed text-foreground/80">
          {post.body}
        </div>

        {/* Stats + vote */}
        <div className="border-foreground/10 flex items-center gap-6 border-b py-3 text-xs text-foreground/40">
          <button
            onClick={handleVote}
            className={`flex cursor-pointer items-center gap-1.5 transition-colors hover:text-accent ${post.has_voted ? 'text-accent' : ''}`}
          >
            <FiArrowUp className="text-sm" />
            <span>{post.upvotes} głosów</span>
          </button>
          <span className="flex items-center gap-1.5">
            <FiEye className="text-sm" /> {post.views} wyświetleń
          </span>
        </div>

        {/* Comments */}
        <div className="mt-6 flex flex-col gap-4">
          <h2 className="text-foreground/60 text-xs font-bold uppercase tracking-widest">
            Komentarze ({post.comment_count})
          </h2>

          {comments.length === 0 && (
            <p className="text-foreground/30 text-sm">Brak komentarzy. Bądź pierwszy!</p>
          )}

          {comments.map((comment) => {
            const isCommentAuthor = user?.auth0_id === comment.user_id
            return (
              <div key={comment.id} className="border-foreground/10 border-b pb-4">
                <div className="text-foreground/40 mb-1 flex items-center gap-1.5 text-xs">
                  <FiUser className="shrink-0" />
                  {comment.author && <AuthorLink author={comment.author} className="text-foreground/70 font-bold" />}
                  <span>•</span>
                  <span>{formatDate(comment.created_at)}</span>
                  {isCommentAuthor && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="ml-2 text-red-400/60 transition-colors hover:text-red-400"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm text-foreground/70">{comment.body}</p>
              </div>
            )
          })}

          {/* Add comment */}
          {token ? (
            <div className="mt-2 flex flex-col gap-2">
              <textarea
                className="border-foreground/20 bg-background focus:border-foreground/50 w-full resize-none border px-3 py-2 text-sm outline-none"
                rows={3}
                placeholder="Dodaj komentarz..."
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  disabled={submittingComment || commentBody.trim() === ''}
                  className="bg-foreground text-background cursor-pointer px-4 py-2 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {submittingComment ? 'Wysyłanie...' : 'Dodaj komentarz'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-foreground/30 text-sm">
              <Link href="/login" className="text-accent hover:underline">
                Zaloguj się
              </Link>{' '}
              aby dodać komentarz.
            </p>
          )}
        </div>
      </div>

      <div className="border-foreground/10 relative hidden flex-1 border-l lg:block">
        <AcademyBackgroundGrid />
      </div>

      {showEditModal && (
        <AcademyDiscussCreateModal
          mode="edit"
          initialPost={post}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => {
            setPost(updated)
            setShowEditModal(false)
          }}
        />
      )}
    </div>
  )
}
